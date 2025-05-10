import PricingCalculator from '../components/PricingCalculator'
import HeaderBar from '../components/HeaderBar'
import { supabase } from "../lib/supabaseClient"
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

export default function CalculatorPage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push("/login")
        return
      }
      setUserEmail(session.user.email)
    }
    getSession()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <HeaderBar userEmail={userEmail} onLogout={handleLogout} />
      <main className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">eBay Pricing Calculator</h1>
              <p className="mt-2 text-gray-600">Calculate optimal pricing and estimate profits for your listings</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl">
            <PricingCalculator />
          </div>
        </div>
      </main>
    </div>
  )
}