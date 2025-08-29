import React, { useState, useEffect, useMemo } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface CostEstimateData {
    id?: number; // optional if you're editing existing data
    estimated_cost: number;
    contingency_percent: number;
    contingency_amount: number;
    total_estimated_cost: number;
    project?: number; // for sending in PATCH request if required
}

interface CostEstimateModalProps {
    isOpen: boolean;
    onClose: () => void;
    costData: CostEstimateData[];
    onSave: (data: CostEstimateData) => void;
    projectId: number;
}

const CostEstimateModal: React.FC<CostEstimateModalProps> = ({
    isOpen,
    onClose,
    costData,
    onSave,
    projectId
}) => {
    const [formData, setFormData] = useState<CostEstimateData>({
        estimated_cost: 0,
        contingency_percent: 0,
        contingency_amount: 0,
        total_estimated_cost: 0
    });

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


    // Calculate on-the-fly instead of keeping in state
    const contingency_amount = useMemo(() => {
        return (formData.estimated_cost * formData.contingency_percent) / 100;
    }, [formData.estimated_cost, formData.contingency_percent]);

    const total_estimated_cost = useMemo(() => {
        return formData.estimated_cost + contingency_amount;
    }, [formData.estimated_cost, contingency_amount]);


    const handleInputChange = (field: keyof CostEstimateData, value: string) => {
        const numValue = parseFloat(value) || 0;
        setFormData(prev => ({
            ...prev,
            [field]: numValue
        }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('access_token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };



            const isEditing = !!formData.id;

            const url = isEditing
                ? `http://13.233.254.0/api/projects/cost-estimate-details/${formData?.id}/`
                : `http://13.233.254.0/api/projects/${projectId}/cost-estimate-details/`;

            const method = isEditing ? 'patch' : 'post';

            const dataToSubmit = {
                ...formData,
                contingency_amount,
                total_estimated_cost
            };

            const response = await axios[method](url, dataToSubmit, config);

            toast.success('लागत विवरण सफलतापूर्वक सेभ गरियो।');
            onSave(response.data);
            onClose();
        } catch (error) {
            console.error('Failed to save cost estimate:', error);
            toast.error('सेभ गर्दा त्रुटि भयो।');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (costData && costData.length > 0) {
            setFormData(costData[0]);
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
                            लागत अनुमान:
                        </label>
                        <input
                            type="number"
                            value={formData?.estimated_cost}
                            onChange={(e) =>
                                handleInputChange('estimated_cost', e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            कन्टिन्जेन्सी प्रतिशत :
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData?.contingency_percent}
                            onChange={(e) =>
                                handleInputChange('contingency_percent', e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            कन्टिन्जेन्सी रकम :
                        </label>
                        <input
                            type="number"
                            value={contingency_amount}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-lg text-gray-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            कुल लागत अनुमान :
                        </label>
                        <input
                            type="number"
                            value={total_estimated_cost}
                            readOnly
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

export default CostEstimateModal;
