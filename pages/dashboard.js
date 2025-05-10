import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { supabase } from "../lib/supabaseClient"
import HeaderBar from "../components/HeaderBar"
import SearchBar from "../components/SearchBar"
import ProductTable from "../components/ProductTable"
import ProductStats from "../components/ProductStats"
import AddProductModal from "../components/AddProductModal"
import FloatingButton from "../components/FloatingButton"
export default function Dashboard() {
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("latest")
  const [userEmail, setUserEmail] = useState("")
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  // Check auth and fetch products
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        router.push("/login")
        return
      }
      setUserEmail(session.user.email)
      fetchProducts()
    }

    getSession()
  }, [])

  const fetchProducts = async () => {
    try {
      console.log('Fetching products...')
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error('Error fetching products:', error)
        return
      }

      console.log('Products fetched:', data)
      setProducts(data)
      setFiltered(data)
    } catch (error) {
      console.error('Error in fetchProducts:', error)
    }
  }

  const handleProductAdded = async () => {
    console.log('Product added, refreshing list...')
    await fetchProducts()
    setShowModal(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const handleExport = () => {
    const csv = [
      [
        "Title",
        "Price",
        "Sold",
        "Rating",
        "Cost Price ($)",
        "Postage Cost ($)",
        "Supplier Link",
        "Supplier Name",
        "Notes",
        "Profit ($)"
      ],
      ...filtered.map((p) => [
        p.title,
        p.price,
        p.sold,
        p.rating,
        p.cost_price,
        p.postage_cost,
        p.supplier_link,
        p.supplier_name,
        p.notes,
        (p.price - (p.cost_price || 0)) * (p.sold || 0)
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "ebay-products.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  // Filter + sort
  useEffect(() => {
    let data = [...products]

    if (search) {
      data = data.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (sortBy === "highest") {
      data.sort((a, b) => b.sold - a.sold)
    } else {
      data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }

    setFiltered(data)
  }, [products, search, sortBy])

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderBar email={userEmail} onLogout={handleLogout} />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <SearchBar value={search} onChange={setSearch} />
          <FloatingButton onClick={() => setShowModal(true)} />
        </div>
        <ProductStats products={filtered} />
        <ProductTable
          products={filtered}
          sortBy={sortBy}
          onSort={setSortBy}
          onRefresh={fetchProducts}
        />        <AddProductModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onProductAdded={handleProductAdded}
        />
      </main>
    </div>
  )
}
