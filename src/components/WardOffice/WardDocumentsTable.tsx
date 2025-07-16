// components/WardDocumentsTable.tsx
import React from 'react';
import { Download, MoreHorizontal, Search } from 'lucide-react';

interface WardData {
  id: number;
  title: string;
  date: string;
}

interface WardDocumentsTableProps {
  data: WardData[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const WardDocumentsTable: React.FC<WardDocumentsTableProps> = ({
  data,
  searchTerm,
  setSearchTerm
}) => {
  return (
    <div className="overflow-x-auto">
      <div className="mb-4">
        <div className="relative w-80">
          <input
            type="text"
            placeholder="योजना तथा कार्यक्रम खोज्नुहोस्"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-900">क्र.स.</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">विषयक</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">मिति</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">स्थिति</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">अन्य</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">{item.id}</td>
                <td className="py-3 px-4">{item.title}</td>
                <td className="py-3 px-4">{item.date}</td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Download className="w-4 h-4" />
                  </button>
                </td>
                <td className="py-3 px-4">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="py-12 text-center text-gray-500">
                <p>No data available</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WardDocumentsTable;
