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

      await axios.patch(`http://43.205.239.123/api/inventory/supplier-registry/${companyId}/`, formData, {
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeIn">
    {/* Header */}
    <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
      <h2 className="text-lg font-semibold text-gray-900">📂 फाइल अपलोड गर्नुहोस्</h2>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-red-500 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>
    </div>

    {/* Content */}
    <div className="p-6 space-y-5">
      {/* Upload Box */}
      <label className="w-full flex flex-col items-center justify-center px-4 py-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden"
        />
        <svg
          className="w-12 h-12 text-blue-500 mb-3"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v9m0-9l-3-3m3 3l3-3m-6 3H5a2 2 0 01-2-2V7a2 2 0 012-2h3m10 0h3a2 2 0 012 2v3a2 2 0 01-2 2h-3"
          />
        </svg>
        <span className="text-gray-600 font-medium">
          {file ? file.name : "फाइल चयन गर्न क्लिक गर्नुहोस्"}
        </span>
      </label>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={isUploading || !file}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold shadow hover:bg-blue-700 disabled:opacity-50 transition"
      >
        {isUploading ? "⏳ अपलोड हुँदैछ..." : "💾 सेभ गर्नुहोस्"}
      </button>
    </div>
  </div>
</div>

  );
};

export default FileUploadModal;
