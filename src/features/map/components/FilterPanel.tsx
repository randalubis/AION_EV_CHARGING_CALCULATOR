import type { MapFilters, ConnectorType, AmenityType } from '../types';
import type { SortBy } from '../hooks/useStations';

interface FilterPanelProps {
  filters: MapFilters;
  operators: string[];
  amenities: string[];
  sortBy: SortBy;
  onUpdateFilters: (filters: Partial<MapFilters>) => void;
  onClearFilters: () => void;
  onSortChange: (sortBy: SortBy) => void;
}

const CONNECTOR_TYPES: { type: ConnectorType; label: string }[] = [
  { type: 'ccs2', label: 'CCS2' },
  { type: 'type2', label: 'Type 2' },
  { type: 'chademo', label: 'CHAdeMO' },
  { type: 'gb/t', label: 'GB/T' },
];

const POWER_RANGES = [
  { value: 0, label: 'Semua' },
  { value: 22, label: '22+ kW' },
  { value: 50, label: '50+ kW' },
  { value: 150, label: '150+ kW' },
];

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: 'distance', label: 'Terdekat' },
  { value: 'power', label: 'Daya tertinggi' },
  { value: 'name', label: 'Nama (A-Z)' },
];

const AMENITY_LABELS: Record<string, string> = {
  restroom: 'Toilet',
  cafe: 'Kafe',
  restaurant: 'Restoran',
  wifi: 'WiFi',
  parking: 'Parkir',
  mosque: 'Musholla',
  convenience_store: 'Minimarket',
  atm: 'ATM',
};

export function FilterPanel({
  filters,
  operators,
  amenities,
  sortBy,
  onUpdateFilters,
  onClearFilters,
  onSortChange,
}: FilterPanelProps) {
  const hasActiveFilters =
    filters.connectorTypes.length > 0 ||
    filters.minPowerKw > 0 ||
    filters.operators.length > 0 ||
    filters.amenities.length > 0;

  const toggleConnectorType = (type: ConnectorType) => {
    const next = filters.connectorTypes.includes(type)
      ? filters.connectorTypes.filter(t => t !== type)
      : [...filters.connectorTypes, type];
    onUpdateFilters({ connectorTypes: next });
  };

  const toggleOperator = (operator: string) => {
    const next = filters.operators.includes(operator)
      ? filters.operators.filter(o => o !== operator)
      : [...filters.operators, operator];
    onUpdateFilters({ operators: next });
  };

  const toggleAmenity = (amenity: AmenityType) => {
    const next = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    onUpdateFilters({ amenities: next });
  };

  return (
    <div className="space-y-3">
      {/* Sort */}
      <div>
        <label className="text-white/40 text-xs mb-1.5 block">Urutkan</label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortBy)}
          aria-label="Urutkan stasiun"
          className="w-full bg-carbon-900 border border-white/20 rounded-md px-2.5 py-1.5 text-xs text-white/80 focus:border-volt focus:outline-none"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value} className="bg-carbon-950">{o.label}</option>
          ))}
        </select>
      </div>

      {/* Connector Types */}
      <div>
        <label className="text-white/40 text-xs mb-1.5 block">Tipe Connector</label>
        <div className="flex flex-wrap gap-1.5">
          {CONNECTOR_TYPES.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => toggleConnectorType(type)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                filters.connectorTypes.includes(type)
                  ? 'bg-volt text-carbon-950'
                  : 'bg-carbon-900 text-white/60 hover:text-white border border-white/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Power Range */}
      <div>
        <label className="text-white/40 text-xs mb-1.5 block">Daya Minimum</label>
        <div className="flex flex-wrap gap-1.5">
          {POWER_RANGES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onUpdateFilters({ minPowerKw: value })}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                filters.minPowerKw === value
                  ? 'bg-volt text-carbon-950'
                  : 'bg-carbon-900 text-white/60 hover:text-white border border-white/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Operators */}
      {operators.length > 1 && (
        <div>
          <label className="text-white/40 text-xs mb-1.5 block">Operator</label>
          <div className="flex flex-wrap gap-1.5">
            {operators.map(operator => (
              <button
                key={operator}
                onClick={() => toggleOperator(operator)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  filters.operators.includes(operator)
                    ? 'bg-volt text-carbon-950'
                    : 'bg-carbon-900 text-white/60 hover:text-white border border-white/10'
                }`}
              >
                {operator}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Amenities */}
      {amenities.length > 0 && (
        <div>
          <label className="text-white/40 text-xs mb-1.5 block">Fasilitas</label>
          <div className="flex flex-wrap gap-1.5">
            {amenities.map(a => (
              <button
                key={a}
                onClick={() => toggleAmenity(a as AmenityType)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  filters.amenities.includes(a as AmenityType)
                    ? 'bg-volt text-carbon-950'
                    : 'bg-carbon-900 text-white/60 hover:text-white border border-white/10'
                }`}
              >
                {AMENITY_LABELS[a] ?? a}
              </button>
            ))}
          </div>
        </div>
      )}

      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="w-full py-2 text-xs text-white/50 hover:text-white border border-white/10 hover:border-white/30 rounded-md transition-colors"
        >
          Reset Filter
        </button>
      )}
    </div>
  );
}
