import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import type { TCOResult } from '../types';
import { formatCompactNumber, getCategoryTotals } from '../utils/calculations';

interface ComparisonChartProps {
  result: TCOResult;
}

const COLORS = {
  energy: '#27AE60',
  maintenance: '#3498DB',
  insurance: '#9B59B6',
  tax: '#E74C3C',
  depreciation: '#F39C12',
  ev: '#27AE60',
  ice: '#E67E22',
};

export function ComparisonChart({ result }: ComparisonChartProps) {
  // Prepare data for category comparison
  const evTotals = getCategoryTotals(result.ev.yearlyCosts);
  const iceTotals = getCategoryTotals(result.ice.yearlyCosts);
  
  const categoryData = [
    { name: 'Bahan Bakar/Energi', ev: evTotals.energy, ice: iceTotals.energy },
    { name: 'Perawatan', ev: evTotals.maintenance, ice: iceTotals.maintenance },
    { name: 'Asuransi', ev: evTotals.insurance, ice: iceTotals.insurance },
    { name: 'Pajak', ev: evTotals.tax, ice: iceTotals.tax },
    { name: 'Depresiasi', ev: evTotals.depreciation, ice: iceTotals.depreciation },
  ];
  
  // Prepare data for yearly trend
  const yearlyData = result.ev.yearlyCosts.map((ev, idx) => ({
    year: `Tahun ${ev.year}`,
    ev: ev.cumulative,
    ice: result.ice.yearlyCosts[idx].cumulative,
  }));
  
  // Prepare data for EV cost breakdown pie chart
  const evBreakdown = [
    { name: 'Energi', value: evTotals.energy, color: COLORS.energy },
    { name: 'Perawatan', value: evTotals.maintenance, color: COLORS.maintenance },
    { name: 'Asuransi', value: evTotals.insurance, color: COLORS.insurance },
    { name: 'Pajak', value: evTotals.tax, color: COLORS.tax },
    { name: 'Depresiasi', value: evTotals.depreciation, color: COLORS.depreciation },
  ].filter(item => item.value > 0);
  
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-forest-dark border border-white/20 rounded-lg p-3 shadow-xl">
          <p className="text-white font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: Rp {formatCompactNumber(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="space-y-6">
      {/* Total Cost Comparison */}
      <div className="bg-forest-mid/50 rounded-2xl p-6 border border-white/10">
        <h3 className="text-white font-semibold mb-6">Total Biaya 5 Tahun</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} layout="vertical" margin={{ left: 80, right: 30, top: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
              <XAxis 
                type="number" 
                tickFormatter={(value) => `Rp ${formatCompactNumber(value)}`}
                stroke="rgba(255,255,255,0.3)"
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="rgba(255,255,255,0.3)"
                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="ev" name={`${result.ev.vehicle.brand} ${result.ev.vehicle.series} (EV)`} fill={COLORS.ev} radius={[0, 4, 4, 0]} />
              <Bar dataKey="ice" name={`${result.ice.vehicle.brand} ${result.ice.vehicle.model} (ICE)`} fill={COLORS.ice} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Yearly Trend */}
        <div className="bg-forest-mid/50 rounded-2xl p-6 border border-white/10">
          <h3 className="text-white font-semibold mb-6">Akumulasi Biaya per Tahun</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yearlyData} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="year" 
                  stroke="rgba(255,255,255,0.3)"
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                />
                <YAxis 
                  tickFormatter={(value) => `Rp ${formatCompactNumber(value)}`}
                  stroke="rgba(255,255,255,0.3)"
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="ev" name="EV" stroke={COLORS.ev} strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="ice" name="ICE" stroke={COLORS.ice} strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* EV Cost Breakdown */}
        <div className="bg-forest-mid/50 rounded-2xl p-6 border border-white/10">
          <h3 className="text-white font-semibold mb-6">Komposisi Biaya EV</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={evBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {evBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `Rp ${formatCompactNumber(value)}`}
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-white/70 text-sm">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
