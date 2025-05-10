import { useState } from "react"
import EditProductModal from "./EditProductModal"
import { supabase } from "../lib/supabaseClient"

export default function ProductTable({ products, onRefresh }) {
  const [editProduct, setEditProduct] = useState(null)

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const { error } = await supabase.from("products").delete().eq("id", id)
      if (!error) onRefresh()
    }
  }

  const handleEdit = (product) => {
    setEditProduct(product)
  }

  const handleUpdate = async () => {
    await onRefresh()
    setEditProduct(null)
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl shadow-lg bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <th className="px-6 py-4 font-semibold text-gray-700 text-left">
                  Title
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-left">
                  Price ($)
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-left">
                  Sold
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-left">
                  Rating
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-left">
                  Cost (MYR)
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-left">
                  Cost (USD)
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-left">
                  Exchange Rate
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-left">
                  Postage Cost ($)
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-left">
                  Supplier
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-left">
                  Notes
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-left sticky right-0 bg-gradient-to-r from-gray-50 to-gray-100 z-10">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="bg-white transition-colors hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">
                    {product.title}
                  </td>
                  <td className="px-6 py-4 text-gray-700">${product.price?.toFixed(2)}</td>
                  <td className="px-6 py-4 text-gray-700">{product.sold}</td>
                  <td className="px-6 py-4 text-gray-700">{product.rating || "-"}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {product.cost_price_myr ? `RM${product.cost_price_myr.toFixed(2)}` : '-'}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {product.cost_price_usd ? `$${product.cost_price_usd.toFixed(2)}` : '-'}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {product.exchange_rate ? product.exchange_rate.toFixed(2) : '-'}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {product.postage_cost ? `$${product.postage_cost.toFixed(2)}` : '-'}
                  </td>
                  <td className="px-6 py-4 text-blue-700 underline break-all">
                    {product.supplier_link ? (
                      <a
                        href={product.supplier_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        {product.supplier_name || 'Link'}
                      </a>
                    ) : (
                      product.supplier_name || '-'
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{product.notes || '-'}</td>
                  <td className="px-6 py-4 sticky right-0 bg-white z-10">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium flex items-center gap-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4.243 1.414 1.414-4.243a4 4 0 01.828-1.414z" /></svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {editProduct && (
        <EditProductModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onUpdated={handleUpdate}
        />
      )}
    </>
  )
}
