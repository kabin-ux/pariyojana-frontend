import React from 'react';
import { X, Trash2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  loading?: boolean;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  open,
  onClose,
  onConfirm,
  itemName,
  loading = false
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">पुष्टि गर्नुहोस्</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-gray-900 font-medium">के तपाईं निश्चित हुनुहुन्छ?</p>
              <p className="text-sm text-gray-600">यो कार्य फिर्ता गर्न सकिँदैन।</p>
            </div>
          </div>
          <p className="text-sm text-gray-700">
            तपाईं <span className="font-semibold">"{itemName}"</span> मेटाउन लाग्दै हुनुहुन्छ।
          </p>
        </div>

        <div className="flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            रद्द गर्नुहोस्
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>{loading ? 'मेटाउँदै...' : 'मेटाउनुहोस्'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;