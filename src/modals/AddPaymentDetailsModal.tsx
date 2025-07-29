import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { toNepaliNumber } from '../utils/formatters';

export interface BudgetFormData {
    id?: number | null;
    title: string;
    amount_paid: string;
    payment_percent: number;
    physical_progress: number;
    agreement_amount: number;
    is_active?: boolean;
}

interface PaymentDetailModalProps {
    onClose: () => void;
    onSave: (data: BudgetFormData) => void;
    initialData?: BudgetFormData;
    usedTitles: string[]; // <-- new prop

}

export const PaymentDetailModal: React.FC<PaymentDetailModalProps> = ({
    onClose,
    onSave,
    usedTitles,
    initialData
}) => {
    const [formData, setFormData] = useState<BudgetFormData>({
        id: initialData?.id ?? null,
        title: initialData?.title ?? '',
        amount_paid: initialData?.amount_paid ?? '',
        payment_percent: initialData?.payment_percent ?? 0,
        physical_progress: initialData?.physical_progress ?? 0,
        agreement_amount: initialData?.agreement_amount ?? 0,
        is_active: initialData?.is_active ?? false,
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (field: keyof BudgetFormData, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (formData.id === null && usedTitles.includes(formData.title)) {
            toast.error(`"${formData.title}" को प्रविष्टि पहिले नै गरिएको छ।`);
            setIsLoading(false);
            return;
        }

        try {
            await onSave(formData);
        } catch (error) {
            console.error('Error saving payment details:', error);
        } finally {
            setIsLoading(false);
        }
    };


    const handleCancel = () => {
        setFormData({
            id: initialData?.id ?? null,
            title: initialData?.title ?? '',
            amount_paid: initialData?.amount_paid ?? '',
            payment_percent: initialData?.payment_percent ?? 0,
            physical_progress: initialData?.physical_progress ?? 0,
            agreement_amount: initialData?.agreement_amount ?? 0,
            is_active: initialData?.is_active ?? false,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        भुक्तानी सम्बन्धी विवरण
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Budget Information */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">सम्झौता बजेट:</span>
                            <span className="text-sm text-gray-900">रु. {formData.agreement_amount.toLocaleString('ne-NP', { minimumFractionDigits: 2 })}</span>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                शिर्षक <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500"
                                required
                            >
                                <option value="">शिर्षक</option>
                                {[
                                    "पहिलो पेश्की भुक्तानी",
                                    "दोस्रो किस्ता भुक्तानी",
                                    "अन्तिम किस्ता भुक्तानी"
                                ].map((titleOption) => (
                                    <option
                                        key={titleOption}
                                        value={titleOption}
                                        disabled={
                                            formData.id === null && usedTitles.includes(titleOption)
                                        }
                                    >
                                        {titleOption}
                                    </option>
                                ))}
                            </select>

                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                हाल भुक्तानी गर्नुपर्ने रकम <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={toNepaliNumber(formData.amount_paid)}
                                onChange={(e) => handleInputChange('amount_paid', e.target.value)}
                                placeholder="हाल भुक्तानी गर्नुपर्ने रकम"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                भुक्तानी प्रतिशत (%)
                            </label>
                            <input
                                type="text"
                                value={toNepaliNumber(formData.payment_percent)}
                                onChange={(e) => handleInputChange('payment_percent', e.target.value || 0)}
                                placeholder="भुक्तानी प्रतिशत (%)"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                भौतिक प्रगति (%) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={toNepaliNumber(formData.physical_progress)}
                                onChange={(e) => handleInputChange('physical_progress', e.target.value || 0)}
                                placeholder="भौतिक प्रगति (%)"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            रद्द गर्नुहोस्
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {isLoading ? 'सेभ हुँदैछ...' : 'सेभ गर्नुहोस्'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentDetailModal;