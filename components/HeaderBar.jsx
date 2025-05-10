import { useRouter } from 'next/router'

export default function HeaderBar({ userEmail, onLogout }) {
  const router = useRouter()
  
  return (
    <header className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 shadow-xl p-6 flex justify-between items-center rounded-b-3xl mb-8">
      <div className="flex items-center gap-6">
        <h1 className="text-2xl font-bold text-white tracking-tight drop-shadow-md">
          eBay Research Dashboard
        </h1>
        <nav className="hidden sm:flex gap-6">
          <button
            onClick={() => router.push('/dashboard')}
            className={`text-sm font-medium ${
              router.pathname === '/dashboard'
                ? 'text-white'
                : 'text-blue-100 hover:text-white'
            } transition-colors`}
          >
            Dashboard
          </button>
          <button
            onClick={() => router.push('/calculator')}
            className={`text-sm font-medium ${
              router.pathname === '/calculator'
                ? 'text-white'
                : 'text-blue-100 hover:text-white'
            } transition-colors`}
          >
            Calculator
          </button>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-blue-50 bg-blue-700/20 backdrop-blur-sm px-4 py-2 rounded-full font-medium border border-blue-400/20">
          👤 {userEmail}
        </span>
        <button
          onClick={onLogout}
          className="text-white bg-red-500/90 hover:bg-red-600 px-4 py-2 rounded-xl font-semibold shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105"
        >
          Logout
        </button>
      </div>
    </header>
  )
}
