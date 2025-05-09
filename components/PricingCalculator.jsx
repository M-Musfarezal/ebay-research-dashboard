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

// Add a simple bar chart for visualization
function ProfitBarChart({ results }) {
  const max = Math.max(
    Number(results.suggestedPrice),
    Number(results.totalCostUSD),
    Number(results.ebayFee),
    Number(results.adFee),
    Number(results.netProfit)
  );
  const bar = (val, color, label) => (
    <div className="mb-1">
      <div className="flex justify-between text-xs mb-0.5">
        <span>{label}</span>
        <span>${val}</span>
      </div>
      <div className="h-2 rounded bg-gray-200">
        <div style={{width: `${(val/max)*100}%`, background: color}} className="h-2 rounded"></div>
      </div>
    </div>
  );
  return (
    <div className="mt-4">
      <div className="font-semibold mb-1">Profit Breakdown</div>
      {bar(results.suggestedPrice, '#2563eb', 'Suggested Price')}
      {bar(results.totalCostUSD, '#f59e42', 'Total Cost (USD)')}
      {bar(results.ebayFee, '#f43f5e', 'eBay Fee')}
      {bar(results.adFee, '#a21caf', 'Ad Fee')}
      {bar(results.netProfit, '#22c55e', 'Net Profit')}
    </div>
  );
}

const LOCAL_KEY = 'pricing_scenarios';

const PricingCalculator = () => {
  const [inputs, setInputs] = useState(defaultValues);
  const [results, setResults] = useState(calculatePricing(defaultValues));
  const [scenarios, setScenarios] = useState([]);
  const [editIdx, setEditIdx] = useState(null);

  // Load scenarios from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) setScenarios(JSON.parse(saved));
  }, []);
  // Save scenarios to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(scenarios));
  }, [scenarios]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newInputs = { ...inputs, [name]: value };
    setInputs(newInputs);
    setResults(calculatePricing(newInputs));
  };

  const saveScenario = () => {
    if (editIdx !== null) {
      const updated = scenarios.map((s, i) => i === editIdx ? { ...inputs } : s);
      setScenarios(updated);
      setEditIdx(null);
    } else {
      setScenarios([...scenarios, { ...inputs }]);
    }
  };
  const loadScenario = (idx) => {
    setInputs(scenarios[idx]);
    setResults(calculatePricing(scenarios[idx]));
    setEditIdx(idx);
  };
  const deleteScenario = (idx) => {
    setScenarios(scenarios.filter((_, i) => i !== idx));
    if (editIdx === idx) setEditIdx(null);
  };
  const clearForm = () => {
    setInputs(defaultValues);
    setResults(calculatePricing(defaultValues));
    setEditIdx(null);
  };

  return (
    <div className="bg-white p-6 rounded shadow w-full max-w-3xl mx-auto mt-4 sm:mt-8">
      <h2 className="text-xl font-bold mb-4">eBay Pricing Calculator</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <label>
          Product Cost (MYR)
          <input type="number" name="productCost" value={inputs.productCost} onChange={handleChange} className="input" />
        </label>
        <label>
          Shipping (MYR)
          <input type="number" name="shipping" value={inputs.shipping} onChange={handleChange} className="input" />
        </label>
        <label>
          Conversion Rate (MYR/USD)
          <input type="number" step="0.01" name="conversionRate" value={inputs.conversionRate} onChange={handleChange} className="input" />
        </label>
        <label>
          Markup (%)
          <input type="number" name="markupPercent" value={inputs.markupPercent} onChange={handleChange} className="input" />
        </label>
        <label>
          eBay Fee (%)
          <input type="number" name="ebayFeePercent" value={inputs.ebayFeePercent} onChange={handleChange} className="input" />
        </label>
        <label>
          Ad Fee (%)
          <input type="number" name="adFeePercent" value={inputs.adFeePercent} onChange={handleChange} className="input" />
        </label>
      </div>
      <div className="bg-gray-50 p-4 rounded">
        <div>Total Cost (MYR): <b>{results.totalCostMYR}</b></div>
        <div>Total Cost (USD): <b>${results.totalCostUSD}</b></div>
        <div>Markup: <b>${results.markup}</b></div>
        <div>Suggested Price: <b>${results.suggestedPrice}</b></div>
        <div>eBay Fee: <b>${results.ebayFee}</b></div>
        <div>Ad Fee: <b>${results.adFee}</b></div>
        <div className="text-green-600 mt-2">Net Profit: <b>${results.netProfit}</b></div>
      </div>
      <ProfitBarChart results={results} />
      <div className="flex gap-2 mt-4">
        <button onClick={saveScenario} className="bg-blue-600 text-white px-3 py-1 rounded">{editIdx !== null ? 'Update' : 'Save'} Scenario</button>
        <button onClick={clearForm} className="bg-gray-200 px-3 py-1 rounded">Clear</button>
      </div>
      {scenarios.length > 0 && (
        <div className="mt-6">
          <div className="font-semibold mb-2">Saved Scenarios</div>
          <ul className="divide-y">
            {scenarios.map((s, i) => (
              <li key={i} className="py-2 flex items-center justify-between">
                <span>
                  Cost: RM{s.productCost}+RM{s.shipping}, Rate: {s.conversionRate}, Markup: {s.markupPercent}%, eBay: {s.ebayFeePercent}%, Ad: {s.adFeePercent}%
                </span>
                <span className="flex gap-1">
                  <button onClick={() => loadScenario(i)} className="text-blue-600 underline text-xs">Edit</button>
                  <button onClick={() => deleteScenario(i)} className="text-red-600 underline text-xs">Delete</button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PricingCalculator;
