/**
 * Ingest PLN SPKLU chargerbox CSV into Supabase.
 *
 * Usage:
 *   node --env-file=.env.local --import tsx scripts/ingest-spklu.ts <csv-path>
 *
 * The script:
 *   1. Deletes existing scraped stations (source='scraped') to make re-runs idempotent.
 *      Crowdsourced + manual stations are preserved.
 *   2. Groups CSV rows by station_id (one PLN station has many chargerbox rows).
 *   3. Inserts stations in batches of 500.
 *   4. Inserts connectors keyed to the inserted station ids.
 */

import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { parse } from 'csv-parse/sync';

interface RawRow {
  station_id: string;
  station_name: string;
  province: string;
  city_district: string;
  address: string;
  latitude: string;
  longitude: string;
  station_status: string;
  chargerbox_id: string;
  chargerbox_name: string;
  charger_type: string;
  power_kw: string;
  num_chargers: string;
  num_connectors: string;
  operator: string;
  scraped_at: string;
}

const csvPath = process.argv[2];
if (!csvPath) {
  console.error('Usage: node --env-file=.env.local --import tsx scripts/ingest-spklu.ts <csv-path>');
  process.exit(1);
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;
if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SECRET_KEY in environment.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// ─── Helpers ─────────────────────────────────────────

function parsePowerKw(raw: string): number | null {
  const m = raw.match(/([\d.]+)/);
  return m ? Number(m[1]) : null;
}

function inferCurrentType(chargerType: string): 'AC' | 'DC' {
  // PLN's charger_type categorization: medium/standard → AC; fast/ultrafast → DC
  return chargerType === 'fast' || chargerType === 'ultrafast' ? 'DC' : 'AC';
}

function inferConnectorType(currentType: 'AC' | 'DC', chargerboxName: string): string {
  const name = chargerboxName.toLowerCase();
  if (name.includes('chademo')) return 'chademo';
  if (name.includes('gb/t') || name.includes('gbt')) return 'gb/t';
  // Default heuristics for Indonesian PLN network:
  return currentType === 'AC' ? 'type2' : 'ccs2';
}

function parseScrapedAt(raw: string): string | null {
  // Format: '2026-05-04 11:39'
  const d = new Date(raw.replace(' ', 'T') + ':00Z');
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

interface StationInsert {
  name: string;
  operator: string;
  location: string; // WKT: 'SRID=4326;POINT(lng lat)'
  address: string | null;
  city: string | null;
  province: string | null;
  status: string;
  source: string;
  external_ids: { pln_id: string };
  last_verified_at: string | null;
}

interface ConnectorInsert {
  station_id: string;
  type: string | null;
  power_kw: number;
  current_type: 'AC' | 'DC';
  count: number;
  status: string;
  meta: Record<string, unknown>;
}

interface ConnectorPending {
  pln_id: string;
  type: string | null;
  power_kw: number;
  current_type: 'AC' | 'DC';
  count: number;
  status: string;
  meta: Record<string, unknown>;
}

// ─── Main ─────────────────────────────────────────

async function main() {
  console.log(`Reading ${csvPath}`);
  const csvText = fs.readFileSync(csvPath as string, 'utf8');
  const rows = parse(csvText, { columns: true, skip_empty_lines: true, bom: true }) as RawRow[];
  console.log(`  ${rows.length} rows`);

  // Group by station_id
  const grouped = new Map<string, RawRow[]>();
  for (const row of rows) {
    if (!row.station_id) continue;
    const arr = grouped.get(row.station_id);
    if (arr) arr.push(row);
    else grouped.set(row.station_id, [row]);
  }
  console.log(`  ${grouped.size} unique stations`);

  // Build station + connector inserts
  const stations: StationInsert[] = [];
  const pendingConnectors: ConnectorPending[] = [];

  for (const [plnId, group] of grouped) {
    const first = group[0];
    const lat = Number(first.latitude);
    const lng = Number(first.longitude);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      console.warn(`  ⚠ skipping ${plnId} — invalid coords ${first.latitude}, ${first.longitude}`);
      continue;
    }
    if (lat < -11 || lat > 6 || lng < 95 || lng > 141) {
      console.warn(`  ⚠ skipping ${plnId} — coords outside Indonesia bbox (${lat}, ${lng})`);
      continue;
    }

    stations.push({
      name: first.station_name,
      operator: first.operator,
      location: `SRID=4326;POINT(${lng} ${lat})`,
      address: first.address || null,
      city: first.city_district || null,
      province: first.province || null,
      status: first.station_status?.toLowerCase() === 'active' ? 'active' : 'unknown',
      source: 'scraped',
      external_ids: { pln_id: plnId },
      last_verified_at: parseScrapedAt(first.scraped_at),
    });

    for (const row of group) {
      const power = parsePowerKw(row.power_kw);
      const count = Number(row.num_connectors);
      if (!power || !Number.isFinite(count) || count < 1) continue;

      const currentType = inferCurrentType(row.charger_type);
      pendingConnectors.push({
        pln_id: plnId,
        type: inferConnectorType(currentType, row.chargerbox_name),
        power_kw: power,
        current_type: currentType,
        count,
        status: 'unknown',
        meta: {
          chargerbox_id: row.chargerbox_id,
          chargerbox_name: row.chargerbox_name,
          charger_type: row.charger_type,
        },
      });
    }
  }

  console.log(`  ${stations.length} stations to insert, ${pendingConnectors.length} connectors`);

  // Wipe existing scraped rows for clean re-run
  console.log('Deleting existing scraped stations...');
  const { error: delErr } = await supabase.from('stations').delete().eq('source', 'scraped');
  if (delErr) {
    console.error('Delete failed:', delErr);
    process.exit(1);
  }

  // Insert stations in batches
  console.log('Inserting stations...');
  const BATCH = 500;
  const idByPlnId = new Map<string, string>();

  for (let i = 0; i < stations.length; i += BATCH) {
    const batch = stations.slice(i, i + BATCH);
    const { data, error } = await supabase
      .from('stations')
      .insert(batch)
      .select('id, external_ids');

    if (error) {
      console.error(`  ✗ batch ${i}-${i + batch.length} failed:`, error);
      process.exit(1);
    }

    for (const row of data ?? []) {
      const pln = (row.external_ids as { pln_id?: string }).pln_id;
      if (pln) idByPlnId.set(pln, row.id);
    }
    process.stdout.write(`  ${idByPlnId.size}/${stations.length}\r`);
  }
  console.log();

  // Insert connectors with mapped station_id
  console.log('Inserting connectors...');
  const connectors: ConnectorInsert[] = [];
  for (const c of pendingConnectors) {
    const stationId = idByPlnId.get(c.pln_id);
    if (!stationId) continue;
    connectors.push({
      station_id: stationId,
      type: c.type,
      power_kw: c.power_kw,
      current_type: c.current_type,
      count: c.count,
      status: c.status,
      meta: c.meta,
    });
  }

  let inserted = 0;
  for (let i = 0; i < connectors.length; i += BATCH) {
    const batch = connectors.slice(i, i + BATCH);
    const { error } = await supabase.from('connectors').insert(batch);
    if (error) {
      console.error(`  ✗ connector batch ${i}-${i + batch.length} failed:`, error);
      process.exit(1);
    }
    inserted += batch.length;
    process.stdout.write(`  ${inserted}/${connectors.length}\r`);
  }
  console.log();

  console.log(`✓ Done. ${stations.length} stations, ${connectors.length} connectors.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
