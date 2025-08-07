import { Search } from 'lucide-react';

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const SearchAndFilter = ({ searchTerm, onSearchChange }: SearchAndFilterProps) => (
  <div className="mb-4 flex flex-row justify-between">
    <div className="relative">
      <input
        type="text"
        placeholder="योजना तथा कार्यक्रम खोज्नुहोस्"
        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
    </div>
    <div className="flex items-center space-x-2">
    </div>
  </div>
);