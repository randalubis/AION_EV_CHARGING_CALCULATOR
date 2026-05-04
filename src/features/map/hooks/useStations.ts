import { useEffect, useMemo, useState, useCallback } from 'react';
import { useDebounce } from '../../../hooks/useDebounce';
import { supabase } from '../../../lib/supabase';
import type { ChargingStation, MapFilters } from '../types';

export interface Bounds {
  minLng: number;
  minLat: number;
  maxLng: number;
  maxLat: number;
}

interface UseStationsOptions {
  userLocation?: [number, number] | null;
  bounds?: Bounds | null;
}

interface RpcRow {
  id: string;
  name: string;
  operator: string;
  latitude: number;
  longitude: number;
  address: string | null;
  city: string | null;
  province: string | null;
  status: string;
  amenities: string[] | null;
  operating_hours: string | null;
  pricing_rate_per_kwh: number | null;
  last_verified_at: string | null;
  connectors: Array<{
    id: string;
    type: string | null;
    power_kw: number;
    current_type: 'AC' | 'DC';
    count: number;
    status: string;
  }> | null;
}

function mapRpcRow(row: RpcRow): ChargingStation {
  return {
    id: row.id,
    name: row.name,
    operator: row.operator,
    latitude: row.latitude,
    longitude: row.longitude,
    address: row.address ?? '',
    city: row.city ?? '',
    province: row.province ?? '',
    status: (row.status as ChargingStation['status']) ?? 'unknown',
    amenities: (row.amenities ?? []) as ChargingStation['amenities'],
    operatingHours: row.operating_hours ?? '',
    pricing: row.pricing_rate_per_kwh != null
      ? { ratePerKwh: Number(row.pricing_rate_per_kwh), currency: 'IDR' }
      : undefined,
    lastUpdated: row.last_verified_at ?? '',
    connectors: (row.connectors ?? []).map((c) => ({
      id: c.id,
      type: (c.type ?? 'type2') as ChargingStation['connectors'][number]['type'],
      powerKw: Number(c.power_kw),
      currentType: c.current_type,
      status: (c.status as ChargingStation['connectors'][number]['status']) ?? 'unknown',
      count: c.count,
    })),
  };
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function useStations(options: UseStationsOptions = {}) {
  const { userLocation, bounds } = options;

  const [filters, setFilters] = useState<MapFilters>({
    connectorTypes: [],
    minPowerKw: 0,
    operators: [],
    status: ['active'],
    amenities: [],
  });
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 200);

  const [rawStations, setRawStations] = useState<ChargingStation[]>([]);
  const [searchResults, setSearchResults] = useState<ChargingStation[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(null);

  // Debounce bounds so we don't fetch on every pan tick
  const debouncedBounds = useDebounce(bounds, 300);

  useEffect(() => {
    if (!debouncedBounds) return;
    let cancelled = false;
    setLoading(true);

    supabase
      .rpc('stations_in_bbox', {
        min_lng: debouncedBounds.minLng,
        min_lat: debouncedBounds.minLat,
        max_lng: debouncedBounds.maxLng,
        max_lat: debouncedBounds.maxLat,
        result_limit: 1500,
      })
      .then(({ data, error: rpcError }) => {
        if (cancelled) return;
        setLoading(false);
        if (rpcError) {
          setError(rpcError.message);
          return;
        }
        setError(null);
        setRawStations((data ?? []).map(mapRpcRow));
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedBounds]);

  // Global search: when user types ≥2 chars, query the server. Independent
  // of the bounds-based fetch so users can find stations outside the viewport.
  useEffect(() => {
    const q = debouncedSearchQuery.trim();
    if (q.length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }
    let cancelled = false;
    setSearchLoading(true);
    supabase
      .rpc('search_stations', { q, result_limit: 30 })
      .then(({ data, error: rpcError }) => {
        if (cancelled) return;
        setSearchLoading(false);
        if (rpcError) {
          console.error('search_stations error:', rpcError.message);
          setSearchResults([]);
          return;
        }
        const mapped: ChargingStation[] = (data ?? []).map((row: RpcRow) => mapRpcRow(row));
        if (!userLocation) {
          setSearchResults(mapped);
          return;
        }
        setSearchResults(
          mapped
            .map((s: ChargingStation) => ({
              ...s,
              distance: calculateDistance(userLocation[0], userLocation[1], s.latitude, s.longitude),
            }))
            .sort((a: ChargingStation, b: ChargingStation) => (a.distance ?? 0) - (b.distance ?? 0)),
        );
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedSearchQuery, userLocation]);

  // Filters applied to the viewport set. Search is handled globally (above)
  // and surfaces in `searchResults`, not here.
  const filteredStations = useMemo(() => {
    return rawStations.filter((station) => {
      if (filters.connectorTypes.length > 0) {
        const has = station.connectors.some((c) => filters.connectorTypes.includes(c.type));
        if (!has) return false;
      }

      if (filters.minPowerKw > 0) {
        const has = station.connectors.some((c) => c.powerKw >= filters.minPowerKw);
        if (!has) return false;
      }

      if (filters.operators.length > 0 && !filters.operators.includes(station.operator)) {
        return false;
      }

      if (filters.status.length > 0 && !filters.status.includes(station.status as 'active' | 'maintenance')) {
        return false;
      }

      if (filters.amenities.length > 0) {
        const has = filters.amenities.some((a) => station.amenities.includes(a));
        if (!has) return false;
      }

      return true;
    });
  }, [rawStations, filters]);

  const stationsWithDistance = useMemo(() => {
    if (!userLocation) return filteredStations;
    return filteredStations
      .map((s) => ({
        ...s,
        distance: calculateDistance(userLocation[0], userLocation[1], s.latitude, s.longitude),
      }))
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }, [filteredStations, userLocation]);

  const availableOperators = useMemo(
    () => Array.from(new Set(rawStations.map((s) => s.operator))).sort(),
    [rawStations],
  );

  const stats = useMemo(() => {
    const total = filteredStations.length;
    const available = filteredStations.filter((s) =>
      s.connectors.some((c) => c.status === 'available'),
    ).length;
    const fastCharging = filteredStations.filter((s) =>
      s.connectors.some((c) => c.powerKw >= 50),
    ).length;
    return { total, available, fastCharging };
  }, [filteredStations]);

  const updateFilters = useCallback((next: Partial<MapFilters>) => {
    setFilters((prev) => ({ ...prev, ...next }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      connectorTypes: [],
      minPowerKw: 0,
      operators: [],
      status: ['active'],
      amenities: [],
    });
    setSearchQuery('');
  }, []);

  const selectStation = useCallback(
    (id: string | null) => {
      if (id === null) {
        setSelectedStation(null);
        return;
      }
      const found = rawStations.find((s) => s.id === id);
      if (found) {
        const withDistance = userLocation
          ? { ...found, distance: calculateDistance(userLocation[0], userLocation[1], found.latitude, found.longitude) }
          : found;
        setSelectedStation(withDistance);
      }
    },
    [rawStations, userLocation],
  );

  const loadStationById = useCallback(
    async (id: string): Promise<ChargingStation | null> => {
      const { data, error: rpcError } = await supabase.rpc('station_by_id', { p_id: id });
      if (rpcError || !data || data.length === 0) return null;
      const station = mapRpcRow(data[0] as RpcRow);
      const withDistance = userLocation
        ? {
            ...station,
            distance: calculateDistance(
              userLocation[0],
              userLocation[1],
              station.latitude,
              station.longitude,
            ),
          }
        : station;
      setSelectedStation(withDistance);
      return withDistance;
    },
    [userLocation],
  );

  const isSearching = debouncedSearchQuery.trim().length >= 2;

  return {
    stations: stationsWithDistance,
    searchResults,
    isSearching,
    searchLoading,
    selectedStation,
    filters,
    searchQuery,
    stats,
    availableOperators,
    loading,
    error,
    setSearchQuery,
    updateFilters,
    clearFilters,
    selectStation,
    loadStationById,
  };
}
