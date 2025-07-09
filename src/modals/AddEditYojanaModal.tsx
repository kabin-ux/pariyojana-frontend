import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface BeneficiaryItem {
    id: number;
    title: string;
    female: number;
    male: number;
    other: number;
    total: number;
    project: number;
}

interface BeneficiaryDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: BeneficiaryItem[]) => void;
    beneficiaryData: BeneficiaryItem[];
}

const titleMap: Record<string, string> = {
    total_households: 'जम्मा परिवार',
    total_population: 'जम्मा जनसंख्या',
    indigenous_families: 'आदिवासी जनजातिको परिवार संख्या',
    dalit_families: 'दलित वर्गको परिवार संख्या',
    children_population: 'बालबालिकाको जनसंख्या',
    other_families: 'अन्य वर्गको परिवार संख्या'
};

const BeneficiaryDialog: React.FC<BeneficiaryDialogProps> = ({
    isOpen,
    onClose,
    onSave,
    beneficiaryData
}) => {
    const [formData, setFormData] = useState<BeneficiaryItem[]>([]);

    useEffect(() => {
        if (beneficiaryData) {
            setFormData(JSON.parse(JSON.stringify(beneficiaryData))); // Deep copy
        }
    }, [beneficiaryData]);

    const handleChange = (index: number, field: 'female' | 'male' | 'other', value: number) => {
        const updated = [...formData];
        updated[index][field] = value;
        updated[index].total = updated[index].female + updated[index].male + updated[index].other;
        setFormData(updated);
    };

    const handleSave = async () => {
        if (!formData.length) return;

    const projectId = formData[0].project;

        try {
            const res = await axios.patch(
                `http://localhost:8000/api/projects/${projectId}/beneficiaries/`,
                formData
            );
            toast.success('डेटा सफलतापूर्वक सेभ गरियो!');
            onSave(res.data); // send updated data to parent
        } catch (error) {
            console.error('Failed to update beneficiary data:', error);
            alert('डेटा सेभ गर्न असफल भयो!');
        }
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-3xl overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold">लाभान्वित विवरण सम्पादन</h2>
                    <button onClick={onClose}><X className="w-5 h-5 text-gray-600" /></button>
                </div>

                <div className="p-6 space-y-4">
                    {formData.map((item, index) => (
                        <div key={item.id} className="border p-4 rounded-md">
                            <p className="font-medium mb-2">{titleMap[item.title] || item.title}</p>
                            <div className="grid grid-cols-3 gap-4">
                                {['female', 'male', 'other'].map((field) => (
                                    <div key={field}>
                                        <label className="block text-sm text-gray-700 mb-1">{field === 'female' ? 'महिला' : field === 'male' ? 'पुरुष' : 'अन्य'}</label>
                                        <input
                                            type="number"
                                            value={item[field as keyof BeneficiaryItem]}
                                            onChange={(e) => handleChange(index, field as any, parseInt(e.target.value) || 0)}
                                            className="w-full border px-3 py-2 rounded-md"
                                            min={0}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="mt-2 text-right text-sm text-gray-600">
                                जम्मा: {item.total}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end px-6 py-4 border-t space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
                </div>
            </div>
        </div>
    );
};

export default BeneficiaryDialog;
