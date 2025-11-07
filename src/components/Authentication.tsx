import React, { useEffect, useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Home, Check, ThumbsUp, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/hooks';

interface AuthDocument {
  id: number;
  source_id: number;
  file_title: string;
  file_title_display: string;
  uploader_role: string;
  status: string;
  status_nepali: string;
  file_path: string;
  project: number;
  checker: number;
  approver: number;
  remarks: string | null;
}

const Authentication: React.FC = () => {
  const { user } = useAuth();
  const [authenticationDocuments, setAuthenticationDocuments] = useState<AuthDocument[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<AuthDocument | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    fetchAuthenticationDocuments();
  }, []);

  const fetchAuthenticationDocuments = async () => {
    const token = localStorage.getItem('access_token');
    setIsLoading(true);
    try {
      const response = await fetch(`http://213.199.53.33:8001/api/authentication/verification-logs/?all=true`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch auth documents');
      const data = await response.json();
      setAuthenticationDocuments(data);
    } catch (err) {
      console.error('Error fetching documents:', err);
      toast.error("Error fetching auth documents");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentClick = (document: AuthDocument) => {
    setSelectedDocument(document);
    setIsModalOpen(true);
    setComment('');
  };

  const handleCheckDocument = async () => {
    if (!selectedDocument) return;

    const token = localStorage.getItem('access_token');
    setIsActionLoading(true);
    try {
      const response = await fetch(
        `http://213.199.53.33:8001/api/authentication/documents/${selectedDocument?.source_id}/check/`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            remarks: comment
          })
        }
      );

      if (!response.ok) throw new Error('Failed to check document');
      toast.success("Document checked successfully");
      fetchAuthenticationDocuments();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error checking document:', err);
      toast.error("Error checking document");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleApproveDocument = async () => {
    if (!selectedDocument) return;

    const token = localStorage.getItem('access_token');
    setIsActionLoading(true);
    try {
      const response = await fetch(
        `http://213.199.53.33:8001/api/authentication/documents/${selectedDocument.source_id}/approve/`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            remarks: comment
          })
        }
      );

      if (!response.ok) throw new Error('Failed to approve document');
      toast.success("Document approved successfully");
      fetchAuthenticationDocuments();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error approving document:', err);
      toast.error("Error approving document");
    } finally {
      setIsActionLoading(false);
    }
  };

  // Determine if current user is the checker for this document
  const isChecker = selectedDocument?.checker === user?.user_id;
  // Determine if current user is the approver for this document
  const isApprover = selectedDocument?.approver === user?.user_id;
  // Document is ready for checking (based on status)
  const needsChecking = selectedDocument?.status === 'चेक जाँचको लागी पठाइएको';
  // Document is ready for approval (after being checked)
  const needsApproval = selectedDocument?.status === 'checked';

  const filteredData = authenticationDocuments.filter(item =>
    item.file_title_display.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-12">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      <span className="ml-2 text-gray-600">लोड हुँदैछ...</span>
    </div>
  );

  return (
    <main className="flex-1 p-6">
      {/* BreadCrumb */}
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
            </div>
          </div>
        </div>

        {/* Modal for document actions */}
        {isModalOpen && selectedDocument && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">प्रमाणिकरण विवरण</h2>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                  disabled={isActionLoading}
                >
                  <X />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">फाइल शीर्षक:</p>
                  <p className="text-gray-900 font-medium">{selectedDocument.file_title_display}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">स्थिति:</p>
                  <p className="text-gray-900 font-medium">{selectedDocument.status_nepali}</p>
                </div>
                {selectedDocument.file_path && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">डकुमेन्ट:</p>
                    <a
                      href={selectedDocument.file_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      डकुमेन्ट हेर्नुहोस्
                    </a>
                  </div>
                )}
              </div>

              {/* Check/Approve Section */}
              <div className="mb-6">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="टिप्पणी थप्नुहोस् (वैकल्पिक)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  disabled={isActionLoading}
                />

                <div className="flex space-x-3 mt-3">
                  {isChecker && needsChecking && (
                    <button
                      onClick={handleCheckDocument}
                      disabled={isActionLoading}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isActionLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      <span>जाँच गर्नुहोस्</span>
                    </button>
                  )}

                  {isApprover && needsApproval && (
                    <button
                      onClick={handleApproveDocument}
                      disabled={isActionLoading}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isActionLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ThumbsUp className="w-4 h-4" />
                      )}
                      <span>स्वीकृत गर्नुहोस्</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full bg-white divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">क्र.स</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">फाइल शीर्षक</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">भूमिका</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">स्थिति</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">कार्य</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-sm text-gray-900">{index + 1}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{item.file_title_display}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{item.uploader_role}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full
                            ${item.status_nepali.includes('स्वीकृत')
                              ? 'bg-green-100 text-green-800'
                              : item.status_nepali.includes('जाँच गरिएको')
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'}`}
                        >
                          {item.status_nepali}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleDocumentClick(item)}
                          className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4 inline-block" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      {searchTerm ? 'कुनै परिणाम फेला परेन' : 'कुनै डाटा उपलब्ध छैन'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
};

export default Authentication;