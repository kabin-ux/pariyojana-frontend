import React, { useEffect, useState } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Home } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/hooks';

interface AuthData {
  id: number;
  projectName: string;
  currentStatus: string;
  user: string;
  date: string;
  action: string;
}

const Authentication: React.FC = () => {
  const { user } = useAuth();
  const [authenticationDocuments, setAuthenticationDocuments] = useState();
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch users on component mount
  useEffect(() => {
    fetchAutenticationDocuments();
  }, []);

  const fetchAutenticationDocuments = async () => {
    const token = localStorage.getItem('access_token')
    try {
      const response = await fetch(`http://localhost:8000/api/authentication/verification-logs/?all=true`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch auth documents');
      }
      const userData = await response.json();
      setAuthenticationDocuments(userData);
    } catch (err) {
      console.error('Error fetching users:', err);
      toast.error("Error fetching auth documents")
    }
  };

  const authData: AuthData[] = [
    {
      id: 1,
      projectName: 'सुनाकोठी साक्षरता केन्द्र संचालन आधारभूत सुनाकोठी साक्षरता केन्द्र संचालन आधारभूत',
      currentStatus: 'समायोजना अध्ययन प्रतिवेदन',
      user: 'अपलोड गर्नी',
      date: 'देख जानकारी लागी पत्राचारको',
      action: 'view'
    }
  ];

  const filteredData = authenticationDocuments?.filter(item =>
    item?.file_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="flex-1 p-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <ChevronLeft className="w-4 h-4" />
        <div className="flex items-center space-x-2">
          <Home className="w-4 h-4" />
          <span>गृहपृष्ठ</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 font-medium">प्रमाणिकरण</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">प्रमाणिकरण</h1>

        {/* Search and Filter */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="योजना / फाइल खोज्नुहोस्"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="w-4 h-4" />
                <span>फिल्टरहरू</span>
              </button>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">क्र.स</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">योजना तथा कार्यक्रम</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">फाइल शीर्षक</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">भूमिका</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">स्थिति</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">अन्य</th>
              </tr>
            </thead>
            <tbody>
              {filteredData?.length > 0 ? (
                filteredData?.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900">{item.id}</td>
                    <td className="py-3 px-4 text-gray-900 max-w-md">{item.project}</td>
                    <td className="py-3 px-4 text-gray-900">{item.file_title}</td>
                    <td className="py-3 px-4 text-gray-900">{item.uploader_role}</td>
                    <td className="py-3 px-4">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:text-blue-800">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-lg font-medium">No data</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center mt-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">1</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Authentication;