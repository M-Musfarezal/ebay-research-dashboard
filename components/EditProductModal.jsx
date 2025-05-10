import { useState } from "react"
import { supabase } from "../lib/supabaseClient"

export default function EditProductModal({ product, onClose, onUpdated }) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: product.title,
    price: product.price,
    sold: product.sold,
    rating: product.rating || 0,
    cost_price_myr: product.cost_price_myr || "",
    cost_price_usd: product.cost_price_usd || "",
    exchange_rate: product.exchange_rate || "4.70",
    postage_cost: product.postage_cost || "",
    supplier_link: product.supplier_link || "",
    supplier_name: product.supplier_name || "",
    notes: product.notes || "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => {
      const newForm = { ...prev, [name]: value }
      
      if (name === 'cost_price_myr' || name === 'exchange_rate') {
        if (newForm.cost_price_myr && newForm.exchange_rate) {
          newForm.cost_price_usd = (parseFloat(newForm.cost_price_myr) / parseFloat(newForm.exchange_rate)).toFixed(2)
        }
      }
      return newForm
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from("products")
        .update({
          title: form.title,
          price: parseFloat(form.price),
          sold: parseInt(form.sold),
          rating: parseFloat(form.rating),
          cost_price_myr: form.cost_price_myr ? parseFloat(form.cost_price_myr) : null,
          cost_price_usd: form.cost_price_usd ? parseFloat(form.cost_price_usd) : null,
          exchange_rate: form.exchange_rate ? parseFloat(form.exchange_rate) : null,
          postage_cost: form.postage_cost ? parseFloat(form.postage_cost) : null,
          supplier_link: form.supplier_link || null,
          supplier_name: form.supplier_name || null,
          notes: form.notes || null,
        })
        .eq("id", product.id)

      if (error) throw error
      onUpdated()
      onClose()
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Failed to update product: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b shrink-0">
          <h2 className="text-xl font-semibold">Edit Product</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-4 space-y-6 overflow-y-auto flex-1">
            {/* Title Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700">Product Title *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            {/* Price and Sold Section */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Price ($) *</label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    className="mt-1 block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="0.01"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    className="mt-1 h-2 flex-1 rounded-lg appearance-none cursor-pointer bg-gray-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Sold *</label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    name="sold"
                    value={form.sold}
                    onChange={handleChange}
                    className="mt-1 block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    name="sold"
                    value={form.sold}
                    onChange={handleChange}
                    className="mt-1 h-2 flex-1 rounded-lg appearance-none cursor-pointer bg-gray-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Rating</label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    name="rating"
                    value={form.rating}
                    onChange={handleChange}
                    className="mt-1 block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.1"
                    name="rating"
                    value={form.rating}
                    onChange={handleChange}
                    className="mt-1 h-2 flex-1 rounded-lg appearance-none cursor-pointer bg-gray-200"
                  />
                </div>
              </div>
            </div>

            {/* Cost Section */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cost (MYR)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="cost_price_myr"
                    value={form.cost_price_myr}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Exchange Rate</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.01"
                      name="exchange_rate"
                      value={form.exchange_rate}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cost (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="cost_price_usd"
                    value={form.cost_price_usd}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Postage Cost</label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    step="0.01"
                    name="postage_cost"
                    value={form.postage_cost}
                    onChange={handleChange}
                    className="mt-1 block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="0.01"
                    name="postage_cost"
                    value={form.postage_cost || 0}
                    onChange={handleChange}
                    className="mt-1 h-2 flex-1 rounded-lg appearance-none cursor-pointer bg-gray-200"
                  />
                </div>
              </div>
            </div>

            {/* Supplier Section */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Supplier Link</label>
                <input
                  type="url"
                  name="supplier_link"
                  value={form.supplier_link}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Supplier Name</label>
                <input
                  type="text"
                  name="supplier_name"
                  value={form.supplier_name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Notes Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows="3"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Footer with buttons */}
          <div className="flex items-center justify-end gap-3 p-4 border-t bg-gray-50 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
