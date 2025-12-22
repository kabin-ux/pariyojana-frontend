import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import 'nepali-datepicker-reactjs/dist/index.css';
import { toNepaliNumber } from '../utils/formatters';
import axios from 'axios';
import toast from 'react-hot-toast';

interface FormData {
    totalAmount: string;
    contractualAmount: string;
    agreement_amount: string;
    agreement_date: string;
    municipality_amount: string;
    municipality_percentage: string;
    public_participation_amount: string;
    public_participation_percentage: string;
    work_order_date: string;
    completion_date: string;
    total_cost_estimate?: string;
}

interface ProjectAgreementModalProps {
    onClose: () => void;
    onSave: (data: FormData) => void;
    agreementData?: FormData;
    projectId?: string;
}

const ProjectAgreementModal: React.FC<ProjectAgreementModalProps> = ({ onClose, onSave, agreementData, projectId }) => {
    const [formData, setFormData] = useState<FormData>({
        totalAmount: '',
        contractualAmount: '',
        agreement_amount: '',
        agreement_date: '',
        municipality_amount: '',
        municipality_percentage: '',
        public_participation_amount: '',
        public_participation_percentage: '',
        work_order_date: '',
        completion_date: ''
    });

    const [costEstimation, setCostEstimation] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const token = localStorage.getItem('access_token');
    if (!token) {
        toast.error('Authentication token not found.');
        return;
    }

    useEffect(() => {
        if (!projectId || !token) return;

        const fetchCostEstimation = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(
                    `http://213.199.53.33:81/api/projects/${projectId}/calculate-costestimations/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setCostEstimation(response.data);
            } catch (err: any) {
                setError('Failed to load cost estimation');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCostEstimation();
    }, [projectId, token]);

    console.log(costEstimation)

    useEffect(() => {
        if (agreementData) {
            setFormData(agreementData);
        } else {
            setFormData({
                totalAmount: '',
                contractualAmount: '',
                agreement_amount: '',
                agreement_date: '',
                municipality_amount: '',
                municipality_percentage: '',
                public_participation_amount: '',
                public_participation_percentage: '',
                work_order_date: '',
                completion_date: ''
            });
        }
    }, [agreementData]);

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleDateChange = (field: keyof FormData, nepaliDate: string) => {
        // Convert Nepali date to English date if needed for backend
        // Or store as Nepali date if your backend supports it
        setFormData(prev => ({
            ...prev,
            [field]: nepaliDate
        }));
    };

    // Calculate percentage values dynamically whenever amounts change
    useEffect(() => {
        const agreementAmount = parseFloat(formData.agreement_amount) || 0;
        const municipalityAmount = parseFloat(formData.municipality_amount) || 0;
        const publicAmount = agreementAmount - municipalityAmount;

        const municipalityPercentage = agreementAmount > 0 ? ((municipalityAmount / agreementAmount) * 100).toFixed(2) : '0';
        const publicPercentage = agreementAmount > 0 ? ((publicAmount / agreementAmount) * 100).toFixed(2) : '0';

        setFormData((prev) => ({
            ...prev,
            public_participation_amount: publicAmount.toString(),
            municipality_percentage: municipalityPercentage,
            public_participation_percentage: publicPercentage
        }));
    }, [formData.agreement_amount, formData.municipality_amount]);

    const handleSubmit = () => {
        const agreementAmount = Number(formData.agreement_amount || 0);
        const totalCostEstimate = Number(costEstimation[0]?.grand_total || 0);

        if (agreementAmount > totalCostEstimate) {
            setError('साझेदारी रकम कुल लागत अनुमान भन्दा बढी हुन सक्दैन');
            return;
        }

        setError(null);
        onSave(formData);
        onClose();
    };


    const handleCancel = () => {
        onClose();
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">योजना साझेदारी</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                        <X size={24} />
                    </button>
                </div>

                {/* Form Content */}
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="text-gray-600">कुल लागत अनुमान: </span>{loading && <p>...</p>}
                            {toNepaliNumber(costEstimation?.[0]?.grand_total ? costEstimation[0]?.grand_total : 0)}<span className="ml-2 font-medium"></span></div>
                        {/* <div><span className="text-gray-600">करारजन्य प्रतिधत:</span> <span className="ml-2 font-medium"></span></div>
                        <div><span className="text-gray-600">करारजन्य रकम:</span> <span className="ml-2 font-medium"></span></div>
                        <div><span className="text-gray-600">कुल लागत अनुमान:</span> <span className="ml-2 font-medium"></span></div> */}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    साझेदारी रकम रु. <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={formData.agreement_amount}
                                    onChange={(e) => handleInputChange('agreement_amount', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                />
                                {error && (
                                    <p className="text-red-600 text-sm mt-2">{error}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    नगरपालिकाले व्यहोर्ने रकम <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={formData.municipality_amount}
                                    onChange={(e) => handleInputChange('municipality_amount', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    जनसहभागिता <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={formData.public_participation_amount}
                                    onChange={(e) => handleInputChange('public_participation_amount', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    कार्यारम्भ मिति <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <NepaliDatePicker
                                        value={formData.work_order_date}
                                        onChange={(value) => handleDateChange('work_order_date', value)}
                                        options={{ calenderLocale: 'ne', valueLocale: 'en' }}
                                        inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        className="border border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    साझेदारी मिति <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <NepaliDatePicker
                                        value={formData.agreement_date}
                                        onChange={(value) => handleDateChange('agreement_date', value)}
                                        options={{ calenderLocale: 'ne', valueLocale: 'en' }}
                                        inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        className="border border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    नगरपालिकाले व्यहोर्ने रकमको प्रतिशत (%)
                                </label>
                                <input
                                    type="text"
                                    value={formData.municipality_percentage}
                                    readOnly
                                    className="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-md text-gray-700"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    जनसहभागिताले व्यहोर्ने रकमको प्रतिशत (%)
                                </label>
                                <input
                                    type="text"
                                    value={formData.public_participation_percentage}
                                    readOnly
                                    className="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-md text-gray-700"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    कार्य समप्ति मिति <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <NepaliDatePicker
                                        value={formData.completion_date}
                                        onChange={(value) => handleDateChange('completion_date', value)}
                                        options={{ calenderLocale: 'ne', valueLocale: 'en' }}
                                        inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        className="border border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                    >
                        रद्द गर्नुहोस्
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={Number(formData.agreement_amount) > Number(agreementData?.total_cost_estimate)}
                        className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 cursor-pointer"
                    >
                        {agreementData ? 'अपडेट गर्नुहोस्' : 'थप गर्नुहोस्'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectAgreementModal;