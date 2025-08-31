// OperationSiteUploadModal.tsx
import React, { useRef, useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useProjectDetail } from '../hooks/useProjectDetail';

interface Props {
  onClose: () => void;
  projectId: number;
  serialNo: number;
}

const OperationSiteUploadModal: React.FC<Props> = ({ onClose, projectId, serialNo }) => {
  const [image, setImage] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { loadOperationDetails } = useProjectDetail(projectId);
  const handleUpload = async () => {
    if (!image || !description) {
      toast.error("फोटो र कैफियत अनिवार्य छन्।");
      return;
    }

    const formData = new FormData();
    formData.append('photo', image);
    formData.append('description', description);
    formData.append('serial_no', serialNo.toString());
    formData.append('project', projectId.toString());

    try {
      const token = localStorage.getItem('access_token');
      await axios.post(`http://43.205.239.123/api/projects/${projectId}/operation-site-photos/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("अपलोड सफल भयो");
      onClose();
      loadOperationDetails()

    } catch (error) {
      console.error('Upload failed:', error);
      toast.error("अपलोड गर्न असफल भयो");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">फोटो अपलोड गर्नुहोस्</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-600 hover:text-red-600" />
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={(e) => e.target.files && setImage(e.target.files[0])}
          />

          <textarea
            placeholder="कैफियत लेख्नुहोस्..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded resize-none"
            rows={3}
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
            >
              रद्द गर्नुहोस्
            </button>
            <button
              onClick={handleUpload}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              अपलोड
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationSiteUploadModal;
