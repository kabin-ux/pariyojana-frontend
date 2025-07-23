// UploadFileModal.tsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface UploadFileModalProps {
  open: boolean;
  onClose: () => void;
  companyId: number;
  fieldKey: string; // new
}


const FileUploadModal: React.FC<UploadFileModalProps> = ({ open, onClose, companyId, fieldKey }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!open) return null;

  const handleUpload = async () => {
    if (!file) return toast.error('कृपया फाइल चयन गर्नुहोस्');

    const formData = new FormData();
    formData.append(fieldKey, file);

    try {
      setIsUploading(true);
      const token = localStorage.getItem('access_token');

      await axios.patch(`http://localhost:8000/api/inventory/supplier-registry/${companyId}/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('फाइल सफलतापूर्वक अपलोड गरियो');
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('फाइल अपलोड गर्न सकिएन');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">फाइल अपलोड गर्नुहोस्</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full mb-4"
          />

          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isUploading ? 'अपलोड हुँदैछ...' : 'सेभ गर्नुहोस्'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUploadModal;
