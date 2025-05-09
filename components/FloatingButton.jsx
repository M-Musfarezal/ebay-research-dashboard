export default function FloatingButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-2xl shadow-2xl hover:scale-105 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 z-50 border border-blue-400/20 backdrop-blur-sm"
      aria-label="Add Product"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
    </button>
  )
}
