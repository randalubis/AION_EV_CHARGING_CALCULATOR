import React, { useState } from 'react';

// Sample data for car models
const carModels = {
  Aion: { V: [{ variant: 'Luxury' }, { variant: 'Exclusive' }], S: [{ variant: 'Standard' }] },
  Tesla: { ModelS: [{ variant: 'Long Range' }, { variant: 'Plaid' }] },
};

const EVCalculator = () => {
  const [selectedBrand, setSelectedBrand] = useState('');
  const [expandedSeries, setExpandedSeries] = useState({});

  const handleBrandChange = (event) => {
    setSelectedBrand(event.target.value);
  };

  const toggleSeries = (series) => {
    setExpandedSeries((prev) => ({ ...prev, [series]: !prev[series] }));
  };

  return (
    <div>
      <select onChange={handleBrandChange} value={selectedBrand}>
        {Object.keys(carModels).map((brand) => <option key={brand}>{brand}</option>)}
      </select>

      {selectedBrand && (
        <div>
          {Object.keys(carModels[selectedBrand]).map((series) => (
            <div key={series}>
              <h3 onClick={() => toggleSeries(series)} style={{ cursor: 'pointer' }}>
                {series}
              </h3>
              {expandedSeries[series] && (
                <ul>
                  {carModels[selectedBrand][series].map((model) => (
                    <li key={model.variant}>{model.variant}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EVCalculator;