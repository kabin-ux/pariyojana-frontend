import { Search } from 'lucide-react';

interface MunicipalOfficeSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const MunicipalOfficeSearch: React.FC<MunicipalOfficeSearchProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="योजना तथा कार्यक्रम खोज्नुहोस्"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Search className="w-4 h-4" />
          </button>
          <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            प्राथमिकता सेट गर्नुहोस्
          </button>
          <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            नगर सभामा पेश गर्नुहोस्
          </button>
        </div>
      </div>
    </div>
  );
};

export default MunicipalOfficeSearch;