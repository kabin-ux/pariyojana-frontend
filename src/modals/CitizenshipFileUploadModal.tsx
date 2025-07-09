import { Download, X } from "lucide-react";
import { useState } from "react";

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  rowId: number;
  onSaveFiles: (rowId: number, frontFile: File | null, backFile: File | null) => void;
  frontFile?: File | null;
  backFile?: File | null;
}

const CitizenshipFileUploadModal: React.FC<FileUploadModalProps> = ({ 
  isOpen, 
  onClose, 
  rowId, 
  onSaveFiles, 
  frontFile, 
  backFile 
}) => {
  const [tempFrontFile, setTempFrontFile] = useState<File | null>(frontFile || null);
  const [tempBackFile, setTempBackFile] = useState<File | null>(backFile || null);

  if (!isOpen) return null;

  const handleFrontFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setTempFrontFile(file);
  };

  const handleBackFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setTempBackFile(file);
  };

  const handleSave = () => {
    onSaveFiles(rowId, tempFrontFile, tempBackFile);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">नागरिकता प्रतिलिपी</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              नागरिकताको अगाडि
            </label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFrontFileChange}
              className="hidden"
              id={`front-file-${rowId}`}
            />
            <label
              htmlFor={`front-file-${rowId}`}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <Download size={16} className="mr-2" />
              <span className="text-sm text-gray-700">
                {tempFrontFile ? tempFrontFile.name : 'नागरिकताको अगाडि'}
              </span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              नागरिकताको पछाडि
            </label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleBackFileChange}
              className="hidden"
              id={`back-file-${rowId}`}
            />
            <label
              htmlFor={`back-file-${rowId}`}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <Download size={16} className="mr-2" />
              <span className="text-sm text-gray-700">
                {tempBackFile ? tempBackFile.name : 'नागरिकताको पछाडि'}
              </span>
            </label>
          </div>
        </div>

        <div className="p-4">
          <button
            onClick={handleSave}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            सेभ गर्नुहोस
          </button>
        </div>
      </div>
    </div>
  );
};

export default CitizenshipFileUploadModal;