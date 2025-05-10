import React, { useState, useEffect } from 'react';

const defaultValues = {
  productCost: 3,
  shipping: 40,
  conversionRate: 4,
  markupPercent: 60,
  ebayFeePercent: 13,
  adFeePercent: 0,
};

function calculatePricing({ productCost, shipping, conversionRate, markupPercent, ebayFeePercent, adFeePercent }) {
  const totalCostMYR = Number(productCost) + Number(shipping);
  const totalCostUSD = totalCostMYR / Number(conversionRate);
  const markup = (Number(markupPercent) / 100) * totalCostUSD;
  const suggestedPrice = totalCostUSD + markup;
  const ebayFee = (Number(ebayFeePercent) / 100) * suggestedPrice;
  const adFee = (Number(adFeePercent) / 100) * suggestedPrice;
  const netProfit = suggestedPrice - totalCostUSD - ebayFee - adFee;
  return {
    totalCostMYR,
    totalCostUSD: totalCostUSD.toFixed(2),
    markup: markup.toFixed(2),
    suggestedPrice: suggestedPrice.toFixed(2),
    ebayFee: ebayFee.toFixed(2),
    adFee: adFee.toFixed(2),
    netProfit: netProfit.toFixed(2),
  };
}

function ProfitBarChart({ results }) {
  const max = Math.max(
    Number(results.suggestedPrice),
    Number(results.totalCostUSD),
    Number(results.ebayFee),
    Number(results.adFee),
    Number(results.netProfit)
  );

  const bar = (val, color, label) => (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium">{label}</span>
        <span className="font-semibold">${val}</span>
      </div>
      <div className="h-3 rounded-full bg-gray-100">
        <div 
          style={{width: `${(val/max)*100}%`}} 
          className={`h-full rounded-full transition-all duration-500 ${color}`}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="mt-6 bg-gray-50 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Profit Breakdown</h3>
      {bar(results.suggestedPrice, 'bg-blue-500', 'Suggested Price')}
      {bar(results.totalCostUSD, 'bg-orange-500', 'Total Cost (USD)')}
      {bar(results.ebayFee, 'bg-red-500', 'eBay Fee')}
      {bar(results.adFee, 'bg-purple-500', 'Ad Fee')}
      {bar(results.netProfit, 'bg-green-500', 'Net Profit')}
    </div>
  );
}

export default function PricingCalculator() {
  const [inputs, setInputs] = useState(defaultValues);
  const [results, setResults] = useState(calculatePricing(defaultValues));
  const [scenarios, setScenarios] = useState([]);
  const [editIdx, setEditIdx] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('pricing_scenarios');
    if (saved) setScenarios(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('pricing_scenarios', JSON.stringify(scenarios));
  }, [scenarios]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => {
      const newInputs = { ...prev, [name]: value };
      setResults(calculatePricing(newInputs));
      return newInputs;
    });
  };

  const saveScenario = () => {
    if (editIdx !== null) {
      setScenarios(prev => {
        const newScenarios = [...prev];
        newScenarios[editIdx] = inputs;
        return newScenarios;
      });
      setEditIdx(null);
    } else {
      setScenarios(prev => [...prev, inputs]);
    }
  };

  const loadScenario = (index) => {
    setInputs(scenarios[index]);
    setResults(calculatePricing(scenarios[index]));
    setEditIdx(index);
  };

  const deleteScenario = (index) => {
    setScenarios(prev => prev.filter((_, i) => i !== index));
    if (editIdx === index) setEditIdx(null);
  };

  const clearForm = () => {
    setInputs(defaultValues);
    setResults(calculatePricing(defaultValues));
    setEditIdx(null);
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Cost Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Cost (MYR)</label>
                <input
                  type="number"
                  name="productCost"
                  value={inputs.productCost}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shipping (MYR)</label>
                <input
                  type="number"
                  name="shipping"
                  value={inputs.shipping}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exchange Rate (MYR/USD)</label>
              <input
                type="number"
                step="0.01"
                name="conversionRate"
                value={inputs.conversionRate}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Pricing Details</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Markup (%)</label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  name="markupPercent"
                  value={inputs.markupPercent}
                  onChange={handleChange}
                  className="w-1/3 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                />
                <input
                  type="range"
                  min="0"
                  max="200"
                  name="markupPercent"
                  value={inputs.markupPercent}
                  onChange={handleChange}
                  className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-gray-200"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">eBay Fee (%)</label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    name="ebayFeePercent"
                    value={inputs.ebayFeePercent}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ad Fee (%)</label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    name="adFeePercent"
                    value={inputs.adFeePercent}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Pricing Summary</h3>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Total Cost (MYR)</span>
                <span className="font-semibold">RM {results.totalCostMYR}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Total Cost (USD)</span>
                <span className="font-semibold">${results.totalCostUSD}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Markup</span>
                <span className="font-semibold">${results.markup}</span>
              </div>
              <div className="flex justify-between items-center py-2 text-lg text-blue-600">
                <span className="font-medium">Suggested Price</span>
                <span className="font-bold">${results.suggestedPrice}</span>
              </div>
              <div className="flex justify-between items-center py-2 text-red-600">
                <span className="font-medium">Total Fees</span>
                <span className="font-bold">${(Number(results.ebayFee) + Number(results.adFee)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-2 text-green-600">
                <span className="font-medium">Net Profit</span>
                <span className="font-bold">${results.netProfit}</span>
              </div>
            </div>
          </div>

          <ProfitBarChart results={results} />
        </div>
      </div>

      {/* Scenario Management */}
      <div className="mt-8 pt-6 border-t">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-3">
            <button 
              onClick={saveScenario}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              {editIdx !== null ? 'Update' : 'Save'} Scenario
            </button>
            <button 
              onClick={clearForm}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Clear
            </button>
          </div>
        </div>

        {scenarios.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold text-gray-800 mb-3">Saved Scenarios</h3>
            <div className="grid gap-3">
              {scenarios.map((s, i) => (
                <div 
                  key={i}
                  className={`p-4 rounded-lg border ${
                    editIdx === i ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-medium">RM{s.productCost}+RM{s.shipping}</span>
                      <span className="text-gray-500"> @ </span>
                      <span className="font-medium">{s.conversionRate} MYR/USD</span>
                      <span className="text-gray-500">, </span>
                      <span className="font-medium">{s.markupPercent}%</span>
                      <span className="text-gray-500"> markup</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => loadScenario(i)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => deleteScenario(i)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
