// components/modals/FileViewerModal.tsx
import React from 'react';

interface FileViewerModalProps {
  open: boolean;
  onClose: () => void;
  fileUrl: string;
}

const FileViewerModal: React.FC<FileViewerModalProps> = ({ open, onClose, fileUrl }) => {
  if (!open) return null;

  const isPdf = fileUrl.toLowerCase().endsWith('.pdf');
  const isImage = ['jpg', 'jpeg', 'png', 'gif'].some(ext => 
    fileUrl.toLowerCase().endsWith(`.${ext}`)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">File Viewer</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            Close
          </button>
        </div>
        
        <div className="p-4">
          {isImage && (
            <img 
              src={fileUrl} 
              alt="Document" 
              className="max-w-full max-h-[80vh] mx-auto"
            />
          )}
          
          {isPdf && (
            <iframe 
              src={fileUrl} 
              className="w-full h-[80vh] border-none"
              title="PDF Viewer"
            />
          )}
          
          {!isImage && !isPdf && (
            <div className="text-center py-8">
              <p>This file type cannot be previewed.</p>
              <a 
                href={fileUrl} 
                download
                className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded"
              >
                Download File
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileViewerModal;