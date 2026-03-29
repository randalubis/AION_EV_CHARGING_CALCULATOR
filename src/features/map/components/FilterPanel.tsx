import type { MapFilters, ConnectorType } from '../types';
import { getAllOperators } from '../data/sampleStations';

interface FilterPanelProps {
  filters: MapFilters;
  onUpdateFilters: (filters: Partial<MapFilters>) => void;
  onClearFilters: () => void;
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

export function FilterPanel({ filters, onUpdateFilters, onClearFilters }: FilterPanelProps) {
  const operators = getAllOperators();
  const hasActiveFilters = 
    filters.connectorTypes.length > 0 ||
    filters.minPowerKw > 0 ||
    filters.operators.length > 0;

  const toggleConnectorType = (type: ConnectorType) => {
    const newTypes = filters.connectorTypes.includes(type)
      ? filters.connectorTypes.filter(t => t !== type)
      : [...filters.connectorTypes, type];
    onUpdateFilters({ connectorTypes: newTypes });
  };

  const toggleOperator = (operator: string) => {
    const newOperators = filters.operators.includes(operator)
      ? filters.operators.filter(o => o !== operator)
      : [...filters.operators, operator];
    onUpdateFilters({ operators: newOperators });
  };

  return (
    <div className="space-y-3">
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
                  ? 'bg-[#FFC300] text-forest-dark'
                  : 'bg-forest-mid text-white/60 hover:text-white border border-white/10'
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
                  ? 'bg-[#FFC300] text-forest-dark'
                  : 'bg-forest-mid text-white/60 hover:text-white border border-white/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Operators */}
      <div>
        <label className="text-white/40 text-xs mb-1.5 block">Operator</label>
        <div className="flex flex-wrap gap-1.5">
          {operators.map(operator => (
            <button
              key={operator}
              onClick={() => toggleOperator(operator)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                filters.operators.includes(operator)
                  ? 'bg-[#FFC300] text-forest-dark'
                  : 'bg-forest-mid text-white/60 hover:text-white border border-white/10'
              }`}
            >
              {operator}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Button */}
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
