import { useState, useMemo } from 'react';
import { ChevronDown, Zap, Fuel } from 'lucide-react';
import { EV_VEHICLES, getAllEVBrands } from '../data/evVehicles';
import { ICE_VEHICLES, getAllICEBrands } from '../data/iceVehicles';
import type { EVVehicle, ICEVehicle } from '../types';
import { formatCompactNumber } from '../utils/calculations';

interface VehicleSelectorProps {
  selectedEVId: string | null;
  selectedICEId: string | null;
  onSelectEV: (id: string | null) => void;
  onSelectICE: (id: string | null) => void;
}

export function VehicleSelector({
  selectedEVId,
  selectedICEId,
  onSelectEV,
  onSelectICE,
}: VehicleSelectorProps) {
  const [evBrandFilter, setEVBrandFilter] = useState<string>('all');
  const [iceBrandFilter, setICEBrandFilter] = useState<string>('all');
  
  const selectedEV = useMemo(() => 
    EV_VEHICLES.find(v => v.id === selectedEVId),
    [selectedEVId]
  );
  
  const selectedICE = useMemo(() => 
    ICE_VEHICLES.find(v => v.id === selectedICEId),
    [selectedICEId]
  );
  
  const evBrands = getAllEVBrands();
  const iceBrands = getAllICEBrands();
  
  const filteredEVs = useMemo(() => {
    if (evBrandFilter === 'all') return EV_VEHICLES;
    return EV_VEHICLES.filter(v => v.brand === evBrandFilter);
  }, [evBrandFilter]);
  
  const filteredICEs = useMemo(() => {
    if (iceBrandFilter === 'all') return ICE_VEHICLES;
    return ICE_VEHICLES.filter(v => v.brand === iceBrandFilter);
  }, [iceBrandFilter]);
  
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* EV Selection */}
      <div className="bg-forest-mid/50 rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-[#27AE60]/20 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-[#27AE60]" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Mobil Listrik (EV)</h3>
            <p className="text-white/50 text-sm">Pilih kendaraan listrik</p>
          </div>
        </div>
        
        {selectedEV ? (
          <SelectedVehicleCard 
            vehicle={selectedEV} 
            type="ev" 
            onClear={() => onSelectEV(null)} 
          />
        ) : (
          <>
            {/* Brand Filter */}
            <div className="mb-4">
              <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block">
                Filter Merek
              </label>
              <div className="relative">
                <select
                  value={evBrandFilter}
                  onChange={(e) => setEVBrandFilter(e.target.value)}
                  className="w-full bg-forest-dark border border-white/20 rounded-lg px-4 py-3 text-white appearance-none cursor-pointer focus:border-volt focus:outline-none"
                >
                  <option value="all">Semua Merek</option>
                  {evBrands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none" />
              </div>
            </div>
            
            {/* Vehicle List */}
            <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
              {filteredEVs.map(vehicle => (
                <button
                  key={vehicle.id}
                  onClick={() => onSelectEV(vehicle.id)}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-white/10 bg-forest-dark/50 hover:border-[#27AE60]/50 hover:bg-forest-dark transition-all text-left"
                >
                  <div>
                    <div className="text-white font-medium text-sm">{vehicle.brand} {vehicle.series}</div>
                    <div className="text-white/50 text-xs">{vehicle.variant} • {vehicle.consumptionKwhPer100km.toFixed(1)} kWh/100km</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#27AE60] font-semibold text-sm">
                      Rp {formatCompactNumber(vehicle.price)}
                    </div>
                    <div className="text-white/40 text-xs">{vehicle.battery} kWh • {vehicle.maxRange} km</div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* ICE Selection */}
      <div className="bg-forest-mid/50 rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-[#E67E22]/20 rounded-xl flex items-center justify-center">
            <Fuel className="w-6 h-6 text-[#E67E22]" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Mobil Bensin (ICE)</h3>
            <p className="text-white/50 text-sm">Pilih kendaraan konvensional</p>
          </div>
        </div>
        
        {selectedICE ? (
          <SelectedVehicleCard 
            vehicle={selectedICE} 
            type="ice" 
            onClear={() => onSelectICE(null)} 
          />
        ) : (
          <>
            {/* Brand Filter */}
            <div className="mb-4">
              <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block">
                Filter Merek
              </label>
              <div className="relative">
                <select
                  value={iceBrandFilter}
                  onChange={(e) => setICEBrandFilter(e.target.value)}
                  className="w-full bg-forest-dark border border-white/20 rounded-lg px-4 py-3 text-white appearance-none cursor-pointer focus:border-volt focus:outline-none"
                >
                  <option value="all">Semua Merek</option>
                  {iceBrands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none" />
              </div>
            </div>
            
            {/* Vehicle List */}
            <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
              {filteredICEs.map(vehicle => (
                <button
                  key={vehicle.id}
                  onClick={() => onSelectICE(vehicle.id)}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-white/10 bg-forest-dark/50 hover:border-[#E67E22]/50 hover:bg-forest-dark transition-all text-left"
                >
                  <div>
                    <div className="text-white font-medium text-sm">{vehicle.brand} {vehicle.model}</div>
                    <div className="text-white/50 text-xs">{vehicle.variant} • {vehicle.fuelConsumptionKmPerLiter.toFixed(1)} km/l</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#E67E22] font-semibold text-sm">
                      Rp {formatCompactNumber(vehicle.price)}
                    </div>
                    <div className="text-white/40 text-xs">{vehicle.engineCc} cc</div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Selected Vehicle Card Component
interface SelectedVehicleCardProps {
  vehicle: EVVehicle | ICEVehicle;
  type: 'ev' | 'ice';
  onClear: () => void;
}

function SelectedVehicleCard({ vehicle, type, onClear }: SelectedVehicleCardProps) {
  const isEV = type === 'ev';
  const evVehicle = isEV ? vehicle as EVVehicle : null;
  const iceVehicle = !isEV ? vehicle as ICEVehicle : null;
  
  return (
    <div className={`bg-forest-dark rounded-xl p-4 border ${isEV ? 'border-[#27AE60]/30' : 'border-[#E67E22]/30'}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-white font-semibold text-lg">
            {vehicle.brand} {isEV ? (vehicle as EVVehicle).series : (vehicle as ICEVehicle).model}
          </h4>
          <p className="text-white/50 text-sm">{vehicle.variant}</p>
        </div>
        <button
          onClick={onClear}
          className="text-white/30 hover:text-white/60 text-sm underline"
        >
          Ganti
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-white/40">Harga</span>
          <p className={`font-semibold ${isEV ? 'text-[#27AE60]' : 'text-[#E67E22]'}`}>
            Rp {formatCompactNumber(vehicle.price)}
          </p>
        </div>
        
        {evVehicle ? (
          <>
            <div>
              <span className="text-white/40">Baterai</span>
              <p className="text-white font-medium">{evVehicle.battery} kWh</p>
            </div>
            <div>
              <span className="text-white/40">Jarak Tempuh</span>
              <p className="text-white font-medium">{evVehicle.maxRange} km</p>
            </div>
            <div>
              <span className="text-white/40">Konsumsi</span>
              <p className="text-white font-medium">{evVehicle.consumptionKwhPer100km.toFixed(1)} kWh/100km</p>
            </div>
          </>
        ) : iceVehicle ? (
          <>
            <div>
              <span className="text-white/40">Mesin</span>
              <p className="text-white font-medium">{iceVehicle.engineCc} cc</p>
            </div>
            <div>
              <span className="text-white/40">Bahan Bakar</span>
              <p className="text-white font-medium capitalize">{iceVehicle.fuelType.replace('_', ' ')}</p>
            </div>
            <div>
              <span className="text-white/40">Konsumsi</span>
              <p className="text-white font-medium">{iceVehicle.fuelConsumptionKmPerLiter.toFixed(1)} km/l</p>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
