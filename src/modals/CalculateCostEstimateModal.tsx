import React, { useState, useEffect, useMemo } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSettings } from '../hooks/useSetting';

interface CostEstimateData {
    fiscal_year: '',
    provincial_budget: 0,
    local_budget: 0,
    total_without_vat: 0,
    ps_amount: 0
}

interface CostEstimateModalProps {
    isOpen: boolean;
    onClose: () => void;
    costData: CostEstimateData | null;
    onSave: (data: CostEstimateData) => void;
    projectId: number;
}

const CalculateCostEstimateModal: React.FC<CostEstimateModalProps> = ({
    isOpen,
    onClose,
    costData,
    onSave,
    projectId
}) => {
    const [formData, setFormData] = useState<CostEstimateData>({
        fiscal_year: '',
        provincial_budget: 0,
        local_budget: 0,
        total_without_vat: 0,
        ps_amount: 0
    });
    const { data: fiscalYears } = useSettings('आर्थिक वर्ष', true);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (costData) {
            const costDetail = Array.isArray(costData) ? costData[0] : costData;
            setFormData({
                ...costDetail,
                id: costDetail?.id || undefined,
            });
        }
    }, [costData]);



    const handleInputChange = (field: keyof CostEstimateData, value: string) => {
        const numValue = parseFloat(value) || 0;
        setFormData(prev => ({
            ...prev,
            [field]: numValue
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
            const response = await axios.post(
                `http://127.0.0.1:8000/api/projects/${projectId}/calculate-costestimations/`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success('लागत अनुमान सफलतापूर्वक सेभ भयो!');
            onSave(response.data); // if parent needs it
            onClose();
        } catch (error) {
            console.error('Error saving cost estimate:', error);
            toast.error('लागत अनुमान सेभ गर्न असफल भयो।');
        } finally {
            setLoading(false);
        }
    };


    const handleCancel = () => {
        if (costData) {
            setFormData(costData);
        }
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
                            {fiscalYears.map(year => (
                                <option key={year.id} value={year.id.toString()}>{year.year}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Provincial Budget (प्रदेशको बजेट):
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData?.provincial_budget}
                            onChange={(e) =>
                                handleInputChange('provincial_budget', e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Local Budget (स्थानीय बजेट) :
                        </label>
                        <input
                            type="number"
                            value={formData?.local_budget}
                            onChange={(e) =>
                                handleInputChange('local_budget', e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-lg text-gray-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Total Without VAT :
                        </label>
                        <input
                            type="number"
                            value={formData?.total_without_vat}
                            onChange={(e) =>
                                handleInputChange('total_without_vat', e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-lg text-gray-600"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            PS Amount:
                        </label>
                        <input
                            type="number"
                            value={formData?.ps_amount}
                            onChange={(e) =>
                                handleInputChange('ps_amount', e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-lg text-gray-600"
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

export default CalculateCostEstimateModal;
