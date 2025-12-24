import React, { useState } from 'react';
import { Plus, Edit, Trash2, FileCheck, Eye } from 'lucide-react';
import { toNepaliNumber } from '../../utils/formatters';
import AddDocumentModal from '../../modals/AddDocumentModal';
import EmptyState from './EmptyState';

interface DocumentsTabProps {
  project: any;
  documents: any[];
  otherdocuments: any[];
  onSaveDocument: (data: any) => void;
  onDeleteDocument: (id: number) => void;
  onDownloadOtherDocument: (itemSerialNo: number, projectSerialNo: number) => void;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({
  project,
  documents,
  otherdocuments,
  onSaveDocument,
  onDeleteDocument,
  onDownloadOtherDocument
}) => {
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [documentDetail, setDocumentDetail] = useState<any>(null);
  // const getFileType = (fileName?: string): 'pdf' | 'image' | null => {
  //   if (!fileName) return null;
  //   const extension = fileName.split('.').pop()?.toLowerCase();
  //   return extension === 'pdf' ? 'pdf' : 'image';
  // };
  const handleFilePreview = (item: any) => {
    if (!item.file) return;
    // const fileType = getFileType(item.file);
    window.open(item.file, '_blank', 'noopener,noreferrer');
  };

  const hasFile = (item: any) => {
    return !!item.file;
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">अन्य आवश्यक कागजातहरु</h3>
        </div>

        {documents.length === 0 ? (
          <EmptyState message="अन्य डकुमेन्ट उपलब्ध छैन।" />
        ) : (
          <div className="overflow-x-auto mt-4 rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100 text-gray-700 text-left">
                <tr>
                  <th className="py-3 px-5 font-semibold">क्र.स.</th>
                  <th className="py-3 px-5 font-semibold">शीर्षक</th>
                  <th className="py-3 px-5 font-semibold">मिति</th>
                  <th className="py-3 px-5 font-semibold">स्थिती</th>
                  <th className="py-3 px-5 font-semibold text-center">कार्यहरू</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {documents.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="py-3 px-5 text-gray-800">{toNepaliNumber(index + 1)}</td>
                    <td className="py-3 px-5 text-gray-800">{item.title}</td>
                    <td className="py-3 px-5 text-gray-800">{toNepaliNumber(item.date)}</td>
                    <td className="py-3 px-5 text-gray-800">
                      <span className="inline-block px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                        सक्रिय
                      </span>
                    </td>
                    <td className="py-3 px-5">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-800 cursor-pointer"
                          onClick={() => onDownloadOtherDocument(item.serial_no, project.serial_number)}
                        >
                          <FileCheck className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Other documents */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">अन्य डकुमेन्टहरु</h3>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer"
            onClick={() => setIsDocumentModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            <span>नयाँ प्रविष्टि गर्नुहोस्</span>
          </button>
        </div>

        {otherdocuments.length === 0 ? (
          <EmptyState message="अन्य डकुमेन्ट उपलब्ध छैन।" />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">क्र.स.</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">फायलको नाम</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">अपलोड कर्ता</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">अपलोड मिति</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">अन्य</th>
                </tr>
              </thead>
              <tbody>
                {otherdocuments.map((item, index) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900">{toNepaliNumber(index + 1)}</td>
                    <td className="py-3 px-4 text-gray-900">{item.title}</td>
                    <td className="py-3 px-4 text-gray-900">{item.uploaded_by_name}</td>
                    <td className="py-3 px-4 text-gray-900">
                      {toNepaliNumber(new Date(item.uploaded_at).toISOString().split('T')[0])}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-800 cursor-pointer"
                          onClick={() => {
                            setDocumentDetail(item);
                            setIsDocumentModalOpen(true);
                          }}
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        
                        {/* Eye button - only show when file exists */}
                        {hasFile(item) && (
                          <button
                            className="text-purple-600 hover:text-purple-800 cursor-pointer"
                            onClick={() => handleFilePreview(item)}
                            title="फाइल हेर्नुहोस्"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        )}
                        
                        <button
                          className="text-red-600 hover:text-red-800 cursor-pointer"
                          onClick={() => onDeleteDocument(item.id)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isDocumentModalOpen && (
        <AddDocumentModal
          onSave={onSaveDocument}
          onClose={() => {
            setIsDocumentModalOpen(false);
            setDocumentDetail(null);
          }}
          documentData={documentDetail}
          projectId={project.serial_number}
        />
      )}
    </div>
  );
};

export default DocumentsTab;
