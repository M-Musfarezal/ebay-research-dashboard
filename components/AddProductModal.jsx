import { useState } from "react"
import { supabase } from "../lib/supabaseClient"

export default function AddProductModal({ isOpen, onClose, onProductAdded }) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: "",
    price: "",
    sold: "",
    rating: "",
    cost_price_myr: "",
    cost_price_usd: "",
    exchange_rate: "4.70", // Default exchange rate MYR to USD
    postage_cost: "",
    supplier_link: "",
    supplier_name: "",
    notes: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => {
      const newForm = { ...prev, [name]: value }
      
      // Auto-calculate USD cost when MYR cost or exchange rate changes
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
    console.log('Form submission started')

    try {
      // Get the current user's ID
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        console.error('Auth error:', userError)
        throw new Error('User not authenticated')
      }

      console.log('Submitting product with data:', {
        title: form.title,
        price: form.price,
        user_id: user.id
      })
      
      const { data, error } = await supabase.from("products").insert([
        {
          title: form.title,
          price: parseFloat(form.price),
          sold: parseInt(form.sold),
          rating: form.rating ? parseFloat(form.rating) : null,
          cost_price_myr: form.cost_price_myr ? parseFloat(form.cost_price_myr) : null,
          cost_price_usd: form.cost_price_usd ? parseFloat(form.cost_price_usd) : null,
          exchange_rate: form.exchange_rate ? parseFloat(form.exchange_rate) : null,
          postage_cost: form.postage_cost ? parseFloat(form.postage_cost) : null,
          supplier_link: form.supplier_link || null,
          supplier_name: form.supplier_name || null,
          notes: form.notes || null,
          user_id: user.id
        }
      ]).select()

      if (error) {
        console.error('Supabase insert error:', error)
        throw error
      }

      console.log('Product added successfully:', data)
      onProductAdded()  // Notify parent component
      onClose()        // Close the modal
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      alert(`Failed to add product: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-2">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col" style={{ maxHeight: 'calc(100vh - 2rem)' }}>
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Add New Product</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form id="add-product-form" onSubmit={handleSubmit}>
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 12rem)' }}>
            <div className="p-4 space-y-3">
              {/* Product Title */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 text-sm"
                  required
                />
              </div>
              {/* Price and Sold */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Sold *</label>
                  <input
                    type="number"
                    name="sold"
                    value={form.sold}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 text-sm"
                    required
                  />
                </div>
              </div>
              {/* Cost, Exchange Rate, Cost USD */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Cost (MYR)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="cost_price_myr"
                    value={form.cost_price_myr}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Exchange Rate</label>
                  <input
                    type="number"
                    step="0.01"
                    name="exchange_rate"
                    value={form.exchange_rate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Cost (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="cost_price_usd"
                    value={form.cost_price_usd}
                    readOnly
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm"
                  />
                </div>
              </div>
              {/* Postage Cost */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Postage Cost</label>
                <input
                  type="number"
                  step="0.01"
                  name="postage_cost"
                  value={form.postage_cost}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 text-sm"
                />
              </div>
              {/* Supplier Link */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Supplier Link</label>
                <input
                  type="url"
                  name="supplier_link"
                  value={form.supplier_link}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 text-sm"
                />
              </div>
              {/* Supplier Name */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Supplier Name</label>
                <input
                  type="text"
                  name="supplier_name"
                  value={form.supplier_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 text-sm"
                />
              </div>
              {/* Notes */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 text-sm"
                  rows={2}
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer with buttons */}
        <div className="p-4 border-t mt-auto sticky bottom-0 bg-white">
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-medium text-sm"
            >
              Cancel
            </button>
            <button
              form="add-product-form"
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium disabled:opacity-70 text-sm"
            >
              {loading ? "Adding..." : "Add Product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
