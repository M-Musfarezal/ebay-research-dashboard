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
                  Cost Price ($)
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-left">
                  Postage Cost ($)
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-left">
                  Supplier Link
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-left">
                  Supplier Name
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-left">
                  Notes
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((p) => (
                <tr
                  key={p.id}
                  className="bg-white transition-colors hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">
                    {p.title}
                  </td>
                  <td className="px-6 py-4 text-gray-700">${p.price}</td>
                  <td className="px-6 py-4 text-gray-700">{p.sold}</td>
                  <td className="px-6 py-4 text-gray-700">{p.rating || "-"}</td>
                  <td className="px-6 py-4 text-gray-700">{p.cost_price ? `$${p.cost_price}` : "-"}</td>
                  <td className="px-6 py-4 text-gray-700">{p.postage_cost ? `$${p.postage_cost}` : "-"}</td>
                  <td className="px-6 py-4 text-blue-700 underline break-all">
                    {p.supplier_link ? (
                      <a href={p.supplier_link} target="_blank" rel="noopener noreferrer">Link</a>
                    ) : "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{p.supplier_name || "-"}</td>
                  <td className="px-6 py-4 text-gray-700">{p.notes || "-"}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditProduct(p)}
                        className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
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
          onUpdated={onRefresh}
        />
      )}
    </>
  )
}
