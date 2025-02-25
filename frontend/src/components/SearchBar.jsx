import { Search } from "lucide-react"

const SearchBar = () => {
  return (
    <div className="relative max-w-md w-full mx-auto">
      <input
        type="text"
        placeholder="Search causes..."
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
    </div>
  )
}

export default SearchBar

