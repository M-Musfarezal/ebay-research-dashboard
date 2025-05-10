export default function ProductStats({ products }) {
  const totalSold = products.reduce((sum, p) => sum + p.sold, 0)
  const totalValue = products.reduce((sum, p) => sum + p.price * p.sold, 0)
  const averageRating =
    products.reduce((sum, p) => sum + (p.rating || 0), 0) / products.length || 0
  const topSeller = [...products].sort((a, b) => b.sold - a.sold)[0]

  // Calculate total profit with proper USD conversion
  const totalProfit = products.reduce((sum, p) => {
    // First convert cost from MYR to USD using the exchange rate
    const costInUSD = p.cost_price_myr && p.exchange_rate 
      ? p.cost_price_myr / p.exchange_rate 
      : (p.cost_price_usd || 0);
    
    // Calculate profit per unit in USD
    const profitPerUnit = p.price - costInUSD - (p.postage_cost || 0);
    
    // Calculate total profit for this product
    const productProfit = profitPerUnit * (p.sold || 0);
    
    return sum + (isNaN(productProfit) ? 0 : productProfit);
  }, 0);

  // Calculate average profit per product
  const avgProfit = products.length > 0 ? totalProfit / products.length : 0;

  // Calculate profit margin percentage
  const profitMargin = totalValue > 0 ? (totalProfit / totalValue) * 100 : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl shadow-lg p-6 flex flex-col items-start transform transition-transform hover:scale-105">
        <h3 className="text-xs font-semibold text-blue-700 uppercase mb-1 tracking-wide">Total Products</h3>
        <p className="text-2xl font-bold text-gray-900">{products.length}</p>
      </div>

      <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-2xl shadow-lg p-6 flex flex-col items-start transform transition-transform hover:scale-105">
        <h3 className="text-xs font-semibold text-green-700 uppercase mb-1 tracking-wide">Total Sold</h3>
        <p className="text-2xl font-bold text-gray-900">{totalSold.toLocaleString()}</p>
      </div>

      <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-2xl shadow-lg p-6 flex flex-col items-start transform transition-transform hover:scale-105">
        <h3 className="text-xs font-semibold text-yellow-700 uppercase mb-1 tracking-wide">Total Value</h3>
        <p className="text-2xl font-bold text-gray-900">${totalValue.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
      </div>

      <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl shadow-lg p-6 flex flex-col items-start transform transition-transform hover:scale-105">
        <h3 className="text-xs font-semibold text-purple-700 uppercase mb-1 tracking-wide">Top Seller</h3>
        <p className="text-lg font-bold text-gray-900 line-clamp-1">
          {topSeller ? topSeller.title : "N/A"}{" "}
          <span className="text-xs font-normal text-gray-500">
            ({topSeller?.sold || 0} sold)
          </span>
        </p>
      </div>

      <div className="bg-gradient-to-br from-pink-100 to-pink-50 rounded-2xl shadow-lg p-6 flex flex-col items-start transform transition-transform hover:scale-105">
        <h3 className="text-xs font-semibold text-pink-700 uppercase mb-1 tracking-wide">Total Profit</h3>
        <p className="text-2xl font-bold text-gray-900">${totalProfit.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
        <p className="text-sm text-pink-600">{profitMargin.toFixed(1)}% margin</p>
      </div>

      <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-2xl shadow-lg p-6 flex flex-col items-start transform transition-transform hover:scale-105">
        <h3 className="text-xs font-semibold text-red-700 uppercase mb-1 tracking-wide">Avg. Profit/Product</h3>
        <p className="text-2xl font-bold text-gray-900">${avgProfit.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
      </div>
    </div>
  )
}
