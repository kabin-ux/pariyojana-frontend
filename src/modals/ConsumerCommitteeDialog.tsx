import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import 'nepali-datepicker-reactjs/dist/index.css';

interface ConsumerCommitteeData {
    id?: number;
    consumer_committee_name: string;
    address: string;
    formation_date: string;
    representative_name: string;
    representative_position: string;
    contact_no: string;
    is_active: boolean;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: ConsumerCommitteeData) => void;
    committeeData?: ConsumerCommitteeData | null;
    projectId: number;
    token: string;
}

const ConsumerCommitteeDialog: React.FC<Props> = ({
    isOpen,
    onClose,
    onSave,
    committeeData,
    projectId,
}) => {
    const [formData, setFormData] = useState<ConsumerCommitteeData>({
        consumer_committee_name: '',
        address: '',
        formation_date: '',
        representative_name: '',
        representative_position: '',
        contact_no: '',
        is_active: true,
    });

    useEffect(() => {
        if (committeeData) {
            setFormData(committeeData);
        } else {
            setFormData({
                consumer_committee_name: '',
                address: '',
                formation_date: '',
                representative_name: '',
                representative_position: '',
                contact_no: '',
                is_active: true,
            });
        }
    }, [committeeData]);

    const handleChange = (field: keyof ConsumerCommitteeData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData); // Only pass data up
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-xl">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold">
                        उपभोक्ता समिति {committeeData ? 'सम्पादन' : 'थप्नुहोस्'}
                    </h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-black cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium">समितिको नाम</label>
                        <input
                            type="text"
                            value={formData.consumer_committee_name}
                            onChange={e => handleChange('consumer_committee_name', e.target.value)}
                            className="w-full mt-1 px-3 py-2 border rounded-md"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">ठेगाना</label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={e => handleChange('address', e.target.value)}
                            className="w-full mt-1 px-3 py-2 border rounded-md"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">गठन मिति</label>
                        <NepaliDatePicker
                            value={formData.formation_date}
                            onChange={(value) => handleChange('formation_date', value)}
                            options={{ calenderLocale: 'ne', valueLocale: 'en' }}
                            inputClassName="w-full mt-1 px-3 py-2 border rounded-md"
                            className="border border-gray-300 rounded-md"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">प्रतिनिधिको नाम</label>
                        <input
                            type="text"
                            value={formData.representative_name}
                            onChange={e => handleChange('representative_name', e.target.value)}
                            className="w-full mt-1 px-3 py-2 border rounded-md"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">प्रतिनिधिको पद</label>
                        <select
                            value={formData.representative_position}
                            onChange={e => handleChange('representative_position', e.target.value)}
                            className="w-full mt-1 px-3 py-2 border rounded-md"
                            required
                        >
                            <option value="" disabled>-- पद छान्नुहोस् --</option>
                            <option value="अध्यक्ष">अध्यक्ष</option>
                            <option value="कोषाध्यक्ष">कोषाध्यक्ष</option>
                            <option value="सचिव">सचिव</option>
                            <option value="सदस्य">सदस्य</option>
                        </select>
                    </div>


                    <div>
                        <label className="block text-sm font-medium">सम्पर्क नं.</label>
                        <input
                            type="text"
                            value={formData.contact_no}
                            onChange={e => handleChange('contact_no', e.target.value)}
                            className="w-full mt-1 px-3 py-2 border rounded-md"
                            required
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.is_active}
                            onChange={e => handleChange('is_active', e.target.checked)}
                        />
                        <label className="text-sm font-medium">सक्रिय छ</label>
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 cursor-pointer"
                        >
                            रद्द गर्नुहोस्
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
                        >
                            {committeeData ? 'अपडेट गर्नुहोस्' : 'थप्नुहोस्'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ConsumerCommitteeDialog;
