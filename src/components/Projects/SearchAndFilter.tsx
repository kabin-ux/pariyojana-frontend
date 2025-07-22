import React from 'react';
import { Search, Filter } from 'lucide-react';

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  onSearchChange
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="योजना तथा कार्यक्रम खोज्नुहोस्"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
          <Filter className="w-4 h-4" />
          <span>फिल्टरहरू</span>
        </button>
        <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
          <Search className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SearchAndFilter;