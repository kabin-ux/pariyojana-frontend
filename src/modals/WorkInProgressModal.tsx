import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSettings } from '../hooks/useSetting';
import { toNepaliNumber } from '../utils/formatters';

interface WorkTypeData {
  id?: number;
  project?: number;
  name?: string;
  unit?: number;
  unit_name?: string;
  fiscal_year: string;
  quantity: number;
  remarks: string;
}

interface CostEstimateModalProps {
  isOpen: boolean;
  onClose: () => void;
  workInProgressData: WorkTypeData | null;
  onSave: (data: WorkTypeData) => void;
  projectId: number;
}

const WorkInProgressModal: React.FC<CostEstimateModalProps> = ({
  isOpen,
  onClose,
  workInProgressData,
  onSave,
  projectId,
}) => {
  const { data: fiscalYears } = useSettings('आर्थिक वर्ष', true);

  const [formData, setFormData] = useState<WorkTypeData>({
    fiscal_year: '',
    quantity: 0,
    remarks: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (workInProgressData) {
      setFormData({
        id: workInProgressData.id,
        fiscal_year: workInProgressData.fiscal_year || '',
        quantity: workInProgressData.quantity || 0,
        remarks: workInProgressData.remarks || '',
      });
    } else {
      setFormData({
        id: undefined,
        fiscal_year: '',
        quantity: 0,
        remarks: '',
      });
    }
  }, [workInProgressData, isOpen]);

  const handleInputChange = (field: 'fiscal_year' | 'quantity', value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === 'quantity' ? Number(value) : value,
    }));
  };

  const handleTextInputChange = (field: 'remarks', value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      toast.error('Authentication token not found.');
      return;
    }

    setLoading(true);
    try {
      const hasId = formData.id !== undefined;
      const url = hasId
        ? `http://213.199.53.33/api/projects/${projectId}/work-progress/${formData.id}/`
        : `http://213.199.53.33/api/projects/${projectId}/work-progress/work-type/1/`;

      const method = hasId ? 'patch' : 'post';

      const response = await axios({
        method,
        url,
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(hasId ? 'लागत अनुमान अपडेट भयो!' : 'लागत अनुमान सेभ भयो!');
      onSave(response.data);
      onClose();
    } catch (error) {
      console.error('Error saving cost estimate:', error);
      toast.error('लागत अनुमान सेभ गर्न असफल भयो।');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">लागत अनुमान</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              आर्थिक वर्ष <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.fiscal_year}
              onChange={(e) => handleInputChange('fiscal_year', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">आर्थिक वर्ष</option>
              {fiscalYears?.map((year: any) => (
                <option key={year.id} value={year.id.toString()}>
                  {toNepaliNumber(year.year)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2">मात्रा:</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2">टिप्पणीहरू:</label>
            <input
              type="text"
              value={formData.remarks}
              onChange={(e) => handleTextInputChange('remarks', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
            disabled={loading}
          >
            रद्द गर्नुहोस्
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
            disabled={loading}
          >
            {loading ? 'सेभ हुँदैछ...' : 'सेभ गर्नुहोस्'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkInProgressModal;
