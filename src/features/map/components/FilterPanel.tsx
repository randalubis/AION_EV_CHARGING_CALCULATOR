import { Filter, X } from 'lucide-react';
import type { MapFilters, ConnectorType } from '../types';
import { getAllOperators } from '../data/sampleStations';

interface FilterPanelProps {
  filters: MapFilters;
  onUpdateFilters: (filters: Partial<MapFilters>) => void;
  onClearFilters: () => void;
}

const CONNECTOR_TYPES: { type: ConnectorType; label: string; icon: string }[] = [
  { type: 'ccs2', label: 'CCS2 (DC Fast)', icon: '🔌' },
  { type: 'type2', label: 'Type 2 (AC)', icon: '🔌' },
  { type: 'chademo', label: 'CHAdeMO', icon: '🔌' },
  { type: 'gb/t', label: 'GB/T', icon: '🔌' },
];

const POWER_RANGES = [
  { value: 0, label: 'Semua' },
  { value: 22, label: '22+ kW' },
  { value: 50, label: '50+ kW (Fast)' },
  { value: 150, label: '150+ kW (Ultra)' },
];

export function FilterPanel({ filters, onUpdateFilters, onClearFilters }: FilterPanelProps) {
  const operators = getAllOperators();
  const hasActiveFilters = 
    filters.connectorTypes.length > 0 ||
    filters.minPowerKw > 0 ||
    filters.operators.length > 0 ||
    filters.amenities.length > 0;

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
    <div className="bg-forest-dark rounded-xl border border-white/10 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#FFC300]" />
          <span className="text-white font-medium text-sm">Filter</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 text-white/50 hover:text-white text-xs"
          >
            <X className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Connector Types */}
      <div className="mb-4">
        <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block">
          Tipe Connector
        </label>
        <div className="flex flex-wrap gap-2">
          {CONNECTOR_TYPES.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => toggleConnectorType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filters.connectorTypes.includes(type)
                  ? 'bg-[#FFC300] text-forest-dark'
                  : 'bg-forest-mid text-white/70 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Power Range */}
      <div className="mb-4">
        <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block">
          Daya Minimum
        </label>
        <div className="flex flex-wrap gap-2">
          {POWER_RANGES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onUpdateFilters({ minPowerKw: value })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filters.minPowerKw === value
                  ? 'bg-[#FFC300] text-forest-dark'
                  : 'bg-forest-mid text-white/70 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Operators */}
      <div className="mb-4">
        <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block">
          Operator
        </label>
        <div className="flex flex-wrap gap-2">
          {operators.map(operator => (
            <button
              key={operator}
              onClick={() => toggleOperator(operator)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filters.operators.includes(operator)
                  ? 'bg-[#FFC300] text-forest-dark'
                  : 'bg-forest-mid text-white/70 hover:text-white'
              }`}
            >
              {operator}
            </button>
          ))}
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block">
          Status
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => {
              const newStatus = filters.status.includes('active')
                ? filters.status.filter(s => s !== 'active')
                : [...filters.status, 'active'];
              onUpdateFilters({ status: newStatus as ('active' | 'maintenance')[] });
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filters.status.includes('active')
                ? 'bg-[#27AE60] text-white'
                : 'bg-forest-mid text-white/70 hover:text-white'
            }`}
          >
            Aktif
          </button>
        </div>
      </div>
    </div>
  );
}
