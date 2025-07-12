import React, { useEffect, useState } from 'react';
import { X, ChevronDown } from 'lucide-react';

interface BankAccountModalProps {
    isOpen?: boolean;
    onClose?: () => void;
    onSubmit?: (data: BankAccountData) => void;
    bankDetails?: any;
    signatories: SignatoryOption[];
    bankOptions: { id: number; name: string }[];

}

interface SignatoryOption {
    id: number;
    full_name: string;
    post: string;
}

interface BankAccountData {
    bankName: string;
    branch: string;
    signatories: SignatoryOption[];
}

const BankAccountModal: React.FC<BankAccountModalProps> = ({
    isOpen = true,
    bankDetails,
    signatories,
    bankOptions,
    onClose = () => { },
    onSubmit = () => { },

}) => {
    const [formData, setFormData] = useState<BankAccountData>({
        bank_id: bankDetails?.bank_id || '',
        branch: bankDetails?.branch || '',
        signatories: bankDetails?.signatories_details || [],
    });
    const [selectedBank, setSelectedBank] = useState<{ id: number; name: string } | null>(null);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSignatoryDropdownOpen, setIsSignatoryDropdownOpen] = useState(false);

    // Update form data when bankDetails prop changes
    useEffect(() => {
        if (bankDetails) {
            setFormData({
                bank_id: bankDetails?.bank_id || '',
                branch: bankDetails?.branch || '',
                signatories: bankDetails?.signatories_details?.map(s => s.id) || [],
            });
        } else {
            setFormData({
                bankName: '',
                branch: '',
                signatories: [],
            });
        }
    }, [bankDetails]);

    console.log("bamk det", bankOptions)
    const handleSubmit = () => {
        onSubmit(formData);
    };

    const handleReset = () => {
        setFormData({
            bankName: '',
            branch: '',
            signatories: [],
        });
        onClose();
    };

    // Toggle signatory
    const toggleSignatory = (signatory: SignatoryOption) => {
        setFormData(prev => ({
            ...prev,
            signatories: prev.signatories.includes(signatory.id)
                ? prev.signatories.filter(id => id !== signatory.id)
                : [...prev.signatories, signatory.id]
        }));
    };

    // Remove signatory
    const removeSignatory = (signatoryId: number) => {
        setFormData(prev => ({
            ...prev,
            signatories: prev.signatories.filter(id => id !== signatoryId)
        }));
    };

    console.log("signatories",signatories)

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-medium text-gray-900">
                        {bankDetails ? 'बैंक विवरण सम्पादन गर्नुहोस्' : 'बैंक खाता सञ्चालन गर्ने बारेमा'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                        <X size={20} />
                    </button>
                </div>

                {/* Form Content */}
                <div className="p-4 space-y-4">
                    {/* Bank Name Dropdown */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">बैंकको नाम *</label>
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white flex justify-between items-center cursor-pointer"
                            >
                                <span>
                                    {bankOptions.find(b => b.id === formData.bank_id)?.name || 'बैंक छान्नुहोस्'}
                                </span>
                                <ChevronDown size={16} className="text-gray-500" />
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                    {bankOptions.map((bank) => (
                                        <button
                                            key={bank.id}
                                            onClick={() => {
                                                setFormData(prev => ({ ...prev, bank_id: bank.id }));
                                                setIsDropdownOpen(false);
                                            }}
                                            className="w-full px-3 py-2 text-left hover:bg-gray-50 cursor-pointer"
                                        >
                                            {bank.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Branch Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">बैंकको शाखा *</label>
                        <input
                            type="text"
                            value={formData.branch}
                            onChange={(e) => setFormData(prev => ({ ...prev, branch: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="शाखा नाम प्रविष्ट गर्नुहोस्"
                        />
                    </div>

                    {/* Signatories Dropdown */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">दस्तखत कर्ता *</label>
                        <div className="relative">
                            <div className="w-full min-h-[40px] px-3 py-2 border border-gray-300 rounded-md bg-white">
                                <div className="flex flex-wrap gap-1 mb-1">
                                    {signatories.map((id) => {
                                        const signatory = signatories.find(s => s.id === id);
                                        return signatory ? (
                                            <span
                                                key={signatory.id}
                                                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                                            >
                                                {signatory.full_name} ({signatory.post})
                                                <button
                                                    onClick={() => removeSignatory(signatory.id)}
                                                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </span>
                                        ) : null
                                    })}
                                </div>
                                <button
                                    onClick={() => setIsSignatoryDropdownOpen(!isSignatoryDropdownOpen)}
                                    className="w-full text-left text-gray-400 flex items-center justify-between cursor-pointer"
                                >
                                    <span></span>
                                    <ChevronDown size={16} />
                                </button>
                            </div>

                            {isSignatoryDropdownOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                    {signatories
                                        .filter(option => !formData.signatories.find(s => s.id === option.id))
                                        .map((signatory) => (
                                            <button
                                                key={signatory.id}
                                                onClick={() => {
                                                    toggleSignatory(signatory);
                                                    setIsSignatoryDropdownOpen(false);
                                                }}
                                                className="w-full px-3 py-2 text-left hover:bg-gray-50 cursor-pointer"
                                            >
                                                {signatory.full_name} ({signatory.post})
                                            </button>
                                        ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 cursor-pointer"
                    >
                        रद्द गर्नुहोस्
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
                    >
                        {bankDetails ? 'अपडेट गर्नुहोस्' : 'सेभ गर्नुहोस्'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BankAccountModal;
