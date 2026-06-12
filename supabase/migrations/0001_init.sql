-- ════════════════════════════════════════════════════════════════════
--  evhub.id — Charging Stations schema
--  Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New).
--  Idempotent: safe to re-run.
-- ════════════════════════════════════════════════════════════════════

-- PostGIS for geospatial queries; pg_trgm for fast text search
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ──────────────────────────────────────────────────────────────────
--  stations
-- ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.stations (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  TEXT NOT NULL,
  operator              TEXT NOT NULL,
  location              GEOGRAPHY(POINT, 4326) NOT NULL,
  address               TEXT,
  city                  TEXT,
  province              TEXT,
  status                TEXT NOT NULL DEFAULT 'active'
                          CHECK (status IN ('active', 'inactive', 'maintenance', 'unknown')),
  amenities             TEXT[] NOT NULL DEFAULT '{}',
  operating_hours       TEXT,
  pricing_rate_per_kwh  NUMERIC,
  pricing_currency      TEXT DEFAULT 'IDR',
  pricing_notes         TEXT,
  phone                 TEXT,
  website               TEXT,
  source                TEXT NOT NULL DEFAULT 'manual'
                          CHECK (source IN ('scraped', 'crowdsourced', 'partner_api', 'manual')),
  source_url            TEXT,
  external_ids          JSONB NOT NULL DEFAULT '{}'::jsonb,
  meta                  JSONB NOT NULL DEFAULT '{}'::jsonb,
  canonical_id          UUID REFERENCES public.stations(id),
  last_verified_at      TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS stations_location_idx     ON public.stations USING GIST (location);
CREATE INDEX IF NOT EXISTS stations_external_ids_idx ON public.stations USING GIN  (external_ids);
CREATE INDEX IF NOT EXISTS stations_operator_idx     ON public.stations (operator);
CREATE INDEX IF NOT EXISTS stations_province_idx     ON public.stations (province);
CREATE INDEX IF NOT EXISTS stations_source_idx       ON public.stations (source);

-- Trigram indexes for fast ILIKE search across name/city/operator
CREATE INDEX IF NOT EXISTS stations_name_trgm_idx     ON public.stations USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS stations_city_trgm_idx     ON public.stations USING GIN (city gin_trgm_ops);
CREATE INDEX IF NOT EXISTS stations_operator_trgm_idx ON public.stations USING GIN (operator gin_trgm_ops);

-- Unique partial index lets ingestion upsert by source-specific external id
-- e.g. don't insert two stations with the same PLN station_id.
CREATE UNIQUE INDEX IF NOT EXISTS stations_pln_id_idx
  ON public.stations ((external_ids ->> 'pln_id'))
  WHERE external_ids ? 'pln_id';

-- ──────────────────────────────────────────────────────────────────
--  connectors  (1-to-many under stations)
-- ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.connectors (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id      UUID NOT NULL REFERENCES public.stations(id) ON DELETE CASCADE,
  type            TEXT CHECK (type IN (
                    'type2', 'ccs2', 'chademo', 'gb/t',
                    'tesla_supercharger', 'tesla_destination', 'unknown'
                  )),
  power_kw        NUMERIC NOT NULL CHECK (power_kw > 0),
  current_type    TEXT NOT NULL CHECK (current_type IN ('AC', 'DC')),
  count           INTEGER NOT NULL DEFAULT 1 CHECK (count > 0),
  status          TEXT NOT NULL DEFAULT 'unknown'
                    CHECK (status IN ('available', 'occupied', 'offline', 'maintenance', 'unknown')),
  price_per_kwh   NUMERIC,
  meta            JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS connectors_station_id_idx ON public.connectors (station_id);

-- ──────────────────────────────────────────────────────────────────
--  station_submissions  (crowdsourced, awaiting review)
-- ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.station_submissions (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status               TEXT NOT NULL DEFAULT 'pending'
                         CHECK (status IN ('pending', 'approved', 'rejected')),
  payload              JSONB NOT NULL,
  submitted_by_name    TEXT NOT NULL,
  submitted_by_email   TEXT NOT NULL,
  submitted_by_phone   TEXT,
  submitted_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at          TIMESTAMPTZ,
  reviewed_by          TEXT,
  rejection_reason     TEXT,
  approved_station_id  UUID REFERENCES public.stations(id)
);

CREATE INDEX IF NOT EXISTS station_submissions_status_idx ON public.station_submissions (status);

-- ──────────────────────────────────────────────────────────────────
--  RPC: viewport query
--  Called from the frontend on map move/zoom to fetch only what's visible.
-- ──────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.stations_in_bbox(
  min_lng FLOAT,
  min_lat FLOAT,
  max_lng FLOAT,
  max_lat FLOAT,
  result_limit INT DEFAULT 500
)
RETURNS TABLE (
  id                   UUID,
  name                 TEXT,
  operator             TEXT,
  latitude             FLOAT,
  longitude            FLOAT,
  address              TEXT,
  city                 TEXT,
  province             TEXT,
  status               TEXT,
  amenities            TEXT[],
  operating_hours      TEXT,
  pricing_rate_per_kwh NUMERIC,
  source               TEXT,
  last_verified_at     TIMESTAMPTZ,
  connectors           JSONB
)
LANGUAGE SQL STABLE
AS $$
  SELECT
    s.id,
    s.name,
    s.operator,
    ST_Y(s.location::geometry) AS latitude,
    ST_X(s.location::geometry) AS longitude,
    s.address,
    s.city,
    s.province,
    s.status,
    s.amenities,
    s.operating_hours,
    s.pricing_rate_per_kwh,
    s.source,
    s.last_verified_at,
    COALESCE(
      (SELECT jsonb_agg(jsonb_build_object(
         'id',           c.id,
         'type',         c.type,
         'power_kw',     c.power_kw,
         'current_type', c.current_type,
         'count',        c.count,
         'status',       c.status
       ))
       FROM public.connectors c
       WHERE c.station_id = s.id),
      '[]'::jsonb
    ) AS connectors
  FROM public.stations s
  WHERE s.location && ST_MakeEnvelope(min_lng, min_lat, max_lng, max_lat, 4326)
    AND s.canonical_id IS NULL  -- skip rows that have been merged into another
  LIMIT result_limit;
$$;

-- ──────────────────────────────────────────────────────────────────
--  RPC: fetch one station by id
--  Used for deep-linking from URL ?id= param when the station may not
--  be in the currently-loaded viewport.
-- ──────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.station_by_id(p_id UUID)
RETURNS TABLE (
  id                   UUID,
  name                 TEXT,
  operator             TEXT,
  latitude             FLOAT,
  longitude            FLOAT,
  address              TEXT,
  city                 TEXT,
  province             TEXT,
  status               TEXT,
  amenities            TEXT[],
  operating_hours      TEXT,
  pricing_rate_per_kwh NUMERIC,
  source               TEXT,
  last_verified_at     TIMESTAMPTZ,
  connectors           JSONB
)
LANGUAGE SQL STABLE
AS $$
  SELECT
    s.id,
    s.name,
    s.operator,
    ST_Y(s.location::geometry) AS latitude,
    ST_X(s.location::geometry) AS longitude,
    s.address,
    s.city,
    s.province,
    s.status,
    s.amenities,
    s.operating_hours,
    s.pricing_rate_per_kwh,
    s.source,
    s.last_verified_at,
    COALESCE(
      (SELECT jsonb_agg(jsonb_build_object(
         'id',           c.id,
         'type',         c.type,
         'power_kw',     c.power_kw,
         'current_type', c.current_type,
         'count',        c.count,
         'status',       c.status
       ))
       FROM public.connectors c
       WHERE c.station_id = s.id),
      '[]'::jsonb
    ) AS connectors
  FROM public.stations s
  WHERE s.id = p_id
  LIMIT 1;
$$;

-- ──────────────────────────────────────────────────────────────────
--  RPC: global text search across stations
--  Used by the sidebar search box. Returns matches even when they're
--  outside the current map viewport (with fly-to-on-click on the client).
-- ──────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.search_stations(
  q TEXT,
  result_limit INT DEFAULT 30
)
RETURNS TABLE (
  id                   UUID,
  name                 TEXT,
  operator             TEXT,
  latitude             FLOAT,
  longitude            FLOAT,
  address              TEXT,
  city                 TEXT,
  province             TEXT,
  status               TEXT,
  amenities            TEXT[],
  operating_hours      TEXT,
  pricing_rate_per_kwh NUMERIC,
  source               TEXT,
  last_verified_at     TIMESTAMPTZ,
  connectors           JSONB
)
LANGUAGE SQL STABLE
AS $$
  SELECT
    s.id,
    s.name,
    s.operator,
    ST_Y(s.location::geometry) AS latitude,
    ST_X(s.location::geometry) AS longitude,
    s.address,
    s.city,
    s.province,
    s.status,
    s.amenities,
    s.operating_hours,
    s.pricing_rate_per_kwh,
    s.source,
    s.last_verified_at,
    COALESCE(
      (SELECT jsonb_agg(jsonb_build_object(
         'id',           c.id,
         'type',         c.type,
         'power_kw',     c.power_kw,
         'current_type', c.current_type,
         'count',        c.count,
         'status',       c.status
       ))
       FROM public.connectors c
       WHERE c.station_id = s.id),
      '[]'::jsonb
    ) AS connectors
  FROM public.stations s
  WHERE
    s.canonical_id IS NULL
    AND length(trim(q)) >= 2
    AND (
      s.name     ILIKE '%' || q || '%'
      OR s.city  ILIKE '%' || q || '%'
      OR s.operator ILIKE '%' || q || '%'
      OR s.address  ILIKE '%' || q || '%'
    )
  ORDER BY
    -- Prefix match on name first
    CASE WHEN s.name ILIKE q || '%' THEN 0 ELSE 1 END,
    -- Then city match
    CASE WHEN s.city ILIKE q || '%' THEN 0 ELSE 1 END,
    s.name
  LIMIT LEAST(result_limit, 50);
$$;

-- ──────────────────────────────────────────────────────────────────
--  Row-level security
-- ──────────────────────────────────────────────────────────────────
ALTER TABLE public.stations            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connectors          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.station_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone (anon + authenticated) can read stations and connectors.
DROP POLICY IF EXISTS "stations: read all"   ON public.stations;
CREATE POLICY "stations: read all"   ON public.stations   FOR SELECT USING (true);

DROP POLICY IF EXISTS "connectors: read all" ON public.connectors;
CREATE POLICY "connectors: read all" ON public.connectors FOR SELECT USING (true);

-- Anyone can insert a submission (the form).
DROP POLICY IF EXISTS "submissions: insert anon" ON public.station_submissions;
CREATE POLICY "submissions: insert anon"
  ON public.station_submissions
  FOR INSERT
  WITH CHECK (true);

-- Nobody can SELECT submissions via anon. Admin reviews via service-role only.
-- (No SELECT policy defined → RLS denies by default.)

-- NOTE on PostGIS' public.spatial_ref_sys table:
-- Supabase's linter flags this with "RLS Disabled in Public". It cannot be
-- fixed from the SQL Editor — the table is owned by `postgres` and ALTER
-- TABLE requires ownership, which managed Supabase projects don't grant.
-- The warning is a false positive: spatial_ref_sys holds static, public
-- EPSG/SRID reference data installed by PostGIS itself. Dismiss it in the
-- dashboard linter (Database → Linter → "Ignore for this lint").

-- Allow anon to call the RPCs (RLS policies on stations/connectors still
-- apply since these functions are STABLE and run as caller).
GRANT EXECUTE ON FUNCTION public.stations_in_bbox(FLOAT, FLOAT, FLOAT, FLOAT, INT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.station_by_id(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.search_stations(TEXT, INT) TO anon, authenticated;
