// Hook for managing charging station data

import { useState, useMemo, useCallback } from 'react';
import type { ChargingStation, MapFilters } from '../types';
import { SAMPLE_STATIONS, calculateDistance } from '../data/sampleStations';

interface UseStationsOptions {
  userLocation?: [number, number] | null;
}

export function useStations(options: UseStationsOptions = {}) {
  const { userLocation } = options;
  const [filters, setFilters] = useState<MapFilters>({
    connectorTypes: [],
    minPowerKw: 0,
    operators: [],
    status: ['active'],
    amenities: [],
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);

  // Filter stations based on criteria
  const filteredStations = useMemo(() => {
    return SAMPLE_STATIONS.filter(station => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          station.name.toLowerCase().includes(query) ||
          station.address.toLowerCase().includes(query) ||
          station.city.toLowerCase().includes(query) ||
          station.operator.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Connector type filter
      if (filters.connectorTypes.length > 0) {
        const hasConnectorType = station.connectors.some(c => 
          filters.connectorTypes.includes(c.type)
        );
        if (!hasConnectorType) return false;
      }

      // Minimum power filter
      if (filters.minPowerKw > 0) {
        const hasEnoughPower = station.connectors.some(c => 
          c.powerKw >= filters.minPowerKw
        );
        if (!hasEnoughPower) return false;
      }

      // Operator filter
      if (filters.operators.length > 0) {
        if (!filters.operators.includes(station.operator)) return false;
      }

      // Status filter
      if (filters.status.length > 0) {
        if (!filters.status.includes(station.status)) return false;
      }

      // Amenities filter
      if (filters.amenities.length > 0) {
        const hasAmenities = filters.amenities.every(amenity => 
          station.amenities.some(a => a.type === amenity)
        );
        if (!hasAmenities) return false;
      }

      return true;
    });
  }, [filters, searchQuery]);

  // Get selected station details
  const selectedStation = useMemo(() => {
    if (!selectedStationId) return null;
    return SAMPLE_STATIONS.find(s => s.id === selectedStationId) || null;
  }, [selectedStationId]);

  // Calculate distances if user location is available
  const stationsWithDistance = useMemo(() => {
    if (!userLocation) return filteredStations;
    
    return filteredStations
      .map(station => ({
        ...station,
        distance: calculateDistance(
          userLocation[0], 
          userLocation[1], 
          station.latitude, 
          station.longitude
        ),
      }))
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }, [filteredStations, userLocation]);

  // Stats
  const stats = useMemo(() => {
    const total = filteredStations.length;
    const available = filteredStations.filter(s => 
      s.connectors.some(c => c.status === 'available')
    ).length;
    const fastCharging = filteredStations.filter(s => 
      s.connectors.some(c => c.powerKw >= 50)
    ).length;
    
    return { total, available, fastCharging };
  }, [filteredStations]);

  // Actions
  const updateFilters = useCallback((newFilters: Partial<MapFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
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

  const selectStation = useCallback((id: string | null) => {
    setSelectedStationId(id);
  }, []);

  return {
    stations: stationsWithDistance,
    selectedStation,
    filters,
    searchQuery,
    stats,
    setSearchQuery,
    updateFilters,
    clearFilters,
    selectStation,
  };
}
