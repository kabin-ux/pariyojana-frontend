import { Search, Filter } from 'lucide-react';

interface SubjectCommitteeSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const SubjectCommitteeSearch = ({ searchTerm, onSearchChange }: SubjectCommitteeSearchProps) => (
  <div className="mb-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="योजना तथा कार्यक्रम खोज्नुहोस्"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option>विषयगत समिति फिल्टर</option>
        </select>
      </div>
      <div className="flex items-center space-x-2">
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Filter className="w-4 h-4" />
          <span>फिल्टरहरू</span>
        </button>
      </div>
    </div>
  </div>
);