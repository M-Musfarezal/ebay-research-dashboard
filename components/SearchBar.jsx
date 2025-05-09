export default function SearchBar({ search, setSearch, sortBy, setSortBy, onExport }) {
  return (
    <div className="p-6 flex flex-wrap gap-4 items-center bg-white rounded-2xl shadow-lg mb-8 backdrop-blur-sm bg-white/80">
      <div className="flex-1 min-w-[260px]">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition bg-white/50 placeholder:text-gray-400"
        />
      </div>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="px-4 py-3 border border-gray-200 rounded-xl bg-white/50 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition text-gray-700 min-w-[160px]"
      >
        <option value="latest">Sort: Latest</option>
        <option value="highest">Sort: Highest Sold</option>
      </select>
      <button
        onClick={onExport}
        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        Export CSV
      </button>
    </div>
  )
}
