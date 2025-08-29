import React, { useState, useEffect } from 'react';
import { Building2, FileText, Camera, Plus, Edit, View, Calendar } from 'lucide-react';
import { toNepaliNumber } from '../../utils/formatters';
import BankAccountModal from '../../modals/AddBankDetailsModal';
import AddBankRecommendationModal from '../../modals/AddBankRecommendationModal';
import axios from 'axios';
import toast from 'react-hot-toast';
import StatusBadge from './StatusBadge';

interface BankDetailsSectionProps {
    project: any;
    officialDetails: any;
    banks: any;
    refetch: () => void;
}

const BankDetailsSection: React.FC<BankDetailsSectionProps> = ({
    project,
    officialDetails,
    banks,
    refetch
}) => {
    const [bankDetails, setBankDetails] = useState<any[]>([]);
    const [bankRecommendationDetails, setBankRecommendationDetails] = useState<any[]>([]);
    const [bankAccountPhotos, setBankAccountPhotos] = useState<any[]>([]);
    const [editBankId, setEditBankId] = useState<number | null>(null);
    const [editRecommendationId, setEditRecommendationId] = useState<number | null>(null);
    const [editAccountPhotoId, setEditAccountPhotoId] = useState<number | null>(null);
    const [isBankModalOpen, setIsBankModalOpen] = useState(false);
    const [isBankRecommendationModalOpen, setIsBankRecommendationModalOpen] = useState(false);
    const [isBankAccountPhotosModalOpen, setIsBankAccountPhotosModalOpen] = useState(false);

    const fetchBankDetails = async (projectId: number) => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get(
                `http://43.205.255.142/api/projects/${projectId}/bank-details/`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error: any) {
            console.error("Error fetching bank details:", error.response?.data || error.message);
            throw error;
        }
    };

    const fetchBankRecommendationDetails = async (projectId: number) => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get(
                `http://43.205.255.142/api/projects/${projectId}/bank-account-recommendation/`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error: any) {
            console.error("Error fetching bank recommendation details:", error.response?.data || error.message);
            throw error;
        }
    };

    const fetchBankAccountPhotos = async (projectId: number) => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get(
                `http://43.205.255.142/api/projects/${projectId}/account-photos/`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error: any) {
            console.error("Error fetching account photos:", error.response?.data || error.message);
            throw error;
        }
    };

    const saveBankRecommendation = async (data: any) => {
        try {
            const token = localStorage.getItem('access_token');
            const formData = new FormData();

            formData.append('title', data.title);
            formData.append('remarks', data.remarks);
            formData.append('project', data.project);
            formData.append('file', data.file);
            console.log("file:", data.file)
            if (data.file) {
                formData.append('file', data.file);
            }

            let url = `http://43.205.255.142/api/projects/${project.serial_number}/bank-account-recommendation/`;
            let method = 'post';

            if (editRecommendationId) {
                url = `http://43.205.255.142/api/projects/${project.serial_number}/bank-account-recommendation/${editRecommendationId}/`;
                method = 'patch';
            }

            await axios({
                url,
                method,
                data: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success(editRecommendationId ? 'बैंक सिफारिस सम्पादन भयो' : 'बैंक सिफारिस सफलतापूर्वक थपियो');
            const updatedData = await fetchBankRecommendationDetails(project.serial_number);
            setBankRecommendationDetails(updatedData);
            setIsBankRecommendationModalOpen(false);
            setEditRecommendationId(null);
        } catch (error) {
            console.error('Bank recommendation submission failed:', error);
            toast.error('बैंक सिफारिस सेभ गर्न सकिएन');
        }
    };

    const saveAccountPhoto = async (data: any) => {
        try {
            const token = localStorage.getItem('access_token');
            const formData = new FormData();

            formData.append('bank_account_number', data.bank_account_number);
            formData.append('remarks', data.remarks);
            formData.append('project', data.project);

            if (data.check_photo) {
                // If it's a new file upload
                if (data.check_photo instanceof File) {
                    formData.append('check_photo', data.check_photo);
                }
                // If it's an existing photo URL (during edit)
                else if (typeof data.check_photo === 'string') {
                    formData.append('check_photo', data.check_photo);
                }
            }

            let url = `http://43.205.255.142/api/projects/${project.serial_number}/account-photos/`;
            let method = 'post';

            if (editAccountPhotoId) {
                url = `http://43.205.255.142/api/projects/${project.serial_number}/account-photos/${editAccountPhotoId}/`;
                method = 'patch';
            }

            await axios({
                url,
                method,
                data: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success(editAccountPhotoId ? 'खाता फोटो सम्पादन भयो' : 'खाता फोटो सफलतापूर्वक थपियो');
            const updatedData = await fetchBankAccountPhotos(project.serial_number);
            setBankAccountPhotos(updatedData);
            setIsBankAccountPhotosModalOpen(false);
            setEditAccountPhotoId(null);
        } catch (error) {
            console.error('Account photo submission failed:', error);
            toast.error('खाता फोटो सेभ गर्न सकिएन');
        }
    };

    const addBankDetails = async (projectSerialNumber: number, data: {
        bank_id: number;
        branch: string;
        signatories: number[];
    }) => {
        try {
            const token = localStorage.getItem('access_token');
            let url = `http://43.205.255.142/api/projects/${projectSerialNumber}/bank-details/`;
            let method = 'post';
            if (editBankId) {
                url = `http://43.205.255.142/api/projects/${projectSerialNumber}/bank-details/${editBankId}/`;
                method = 'patch';
            }
            await axios({
                url,
                method,
                data: {
                    bank: data.bank_id,
                    branch: data.branch,
                    signatories: data.signatories
                },
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            toast.success(editBankId ? 'बैंक विवरण सम्पादन भयो' : 'बैंक विवरण सफलतापूर्वक थपियो');
            refetch();
            const updatedData = await fetchBankDetails(project.serial_number);
            setBankDetails(updatedData);
            setIsBankModalOpen(false);
            setEditBankId(null);
        } catch (error) {
            console.error('Bank details submission failed:', error);
            toast.error('बैंक विवरण सेभ गर्न सकिएन');
            throw error;
        }
    };

    const handleEditBank = (bankId: number) => {
        setEditBankId(bankId);
        setIsBankModalOpen(true);
    };

    const handleEditRecommendation = (recommendationId: number) => {
        setEditRecommendationId(recommendationId);
        setIsBankRecommendationModalOpen(true);
    };

    const handleEditAccountPhoto = (photoId: number) => {
        setEditAccountPhotoId(photoId);
        setIsBankAccountPhotosModalOpen(true);
    };

    useEffect(() => {
        const loadBankDetails = async () => {
            try {
                const data = await fetchBankDetails(project.serial_number);
                setBankDetails(data);
            } catch (err) {
                console.error("Failed to load bank details.");
            }
        };
        const loadBankRecommendationDetails = async () => {
            try {
                const data = await fetchBankRecommendationDetails(project.serial_number);
                setBankRecommendationDetails(data);
            } catch (err) {
                console.error("Failed to load bank recommendation details.");
            }
        };
        const loadBankAccountPhotos = async () => {
            try {
                const data = await fetchBankAccountPhotos(project.serial_number);
                setBankAccountPhotos(data);
            } catch (err) {
                console.error("Failed to load bank account photos.");
            }
        };

        loadBankDetails();
        loadBankRecommendationDetails();
        loadBankAccountPhotos();
    }, [project.serial_number]);

    return (
        <div className="space-y-8">
            {/* Bank Information Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-blue-600 rounded-lg">
                            <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">बैंकको विवरण</h3>
                    </div>

                    {bankDetails?.length === 0 && (
                        <button
                            type="button"
                            className="p-1 rounded text-blue-600 hover:text-blue-800 cursor-pointer"
                            onClick={() => setIsBankModalOpen(true)}
                        >
                            <Plus className="w-4 h-4" />
                            add गर्नुहोस्
                        </button>
                    )}

                    {bankDetails?.length > 0 && (
                        <button
                            type="button"
                            className="p-1 rounded text-blue-600 hover:text-blue-800 cursor-pointer"
                            onClick={() => handleEditBank(bankDetails[0].id)}
                        >
                            <Edit className="w-4 h-4" /> सम्पादन गर्नुहोस्
                        </button>
                    )}
                </div>

                {bankDetails?.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-600">बैंकको नाम:</label>
                            <p className="text-lg font-semibold text-gray-900 bg-white p-3 rounded-lg ">
                                {bankDetails[0].bank_name}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-600">बैंकको साखा:</label>
                            <p className="text-lg font-semibold text-gray-900 bg-white p-3 rounded-lg ">
                                {bankDetails[0].branch}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-600">दस्तावत कर्ता:</label>
                            <p className="text-lg font-semibold text-gray-900 bg-white p-3 rounded-lg ">
                                <ul>
                                    {bankDetails[0].signatories_details.map((signatory: any) => (
                                        <li key={signatory.id}>{signatory.full_name}</li>
                                    ))}
                                </ul>
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Bank Recommendation Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <FileText className="w-5 h-5 mr-2 text-blue-600" />
                            बैंक खाता सञ्चालन सिफारिस
                        </h3>
                        {bankRecommendationDetails.length === 0 && (
                            <button
                                type="button"
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                onClick={() => setIsBankRecommendationModalOpen(true)}
                            >
                                <Plus className="w-4 h-4" />
                                <span>थप्नुहोस्</span>
                            </button>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                    क्र.स
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                    शिर्षक
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                    मिति
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                    स्थिती
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                    अन्य
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {bankRecommendationDetails.map((item, index) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {toNepaliNumber(index + 1)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <div>
                                            <div className="font-medium">{item.title}</div>
                                            {item.remarks && (
                                                <div className="text-xs text-gray-500 mt-1">{item.remarks}</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                            {item.created_at ? new Date(item.created_at).toLocaleDateString('ne-NP') : 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={item.file ? 'अपलोड गरिएको' : 'बाँकी'} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleEditRecommendation(item.id)}
                                                className="p-1 rounded text-blue-600 hover:text-blue-800 hover:bg-blue-50 cursor-pointer"
                                                title="सम्पादन गर्नुहोस्"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            {item.file && (
                                                <button
                                                    onClick={() => window.open(item.file, '_blank')}
                                                    className="p-1 rounded text-green-600 hover:text-green-800 hover:bg-green-50 cursor-pointer"
                                                    title="फाइल हेर्नुहोस्"
                                                >
                                                    <View className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Account Details */}
            {/* Account Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <Camera className="w-5 h-5 mr-2 text-blue-600" />
                            खाता नम्बर र चेकको फोटो
                        </h3>
                        <button
                            type="button"
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
                            onClick={() => setIsBankAccountPhotosModalOpen(true)}
                        >
                            <Plus className="w-4 h-4" />
                            <span>{bankAccountPhotos.length > 0 ? 'सम्पादन गर्नुहोस्' : 'थप्नुहोस्'}</span>
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {bankAccountPhotos.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {bankAccountPhotos.map((photo) => (
                                <div key={photo.id} className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 mb-2 block">
                                            खाता नम्बर:
                                        </label>
                                        <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300">
                                            <p className="text-2xl font-bold text-gray-900 font-mono">
                                                {photo.bank_account_number}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-sm font-medium text-gray-600 mb-2 block">
                                            चेकको फोटो:
                                        </label>
                                        {photo.check_photo ? (
                                            <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300">
                                                <img
                                                    src={photo.check_photo}
                                                    alt="Check Photo"
                                                    className="w-full h-40 object-contain rounded-lg"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
                                                    }}
                                                />
                                                <button
                                                    onClick={() => handleEditAccountPhoto(photo.id)}
                                                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
                                                >
                                                    फोटो बदल्नुहोस्
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300">
                                                <div className="flex items-center justify-center h-40">
                                                    <div className="text-center">
                                                        <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                                        <p className="text-sm text-gray-500">चेकको फोटो अपलोड गर्नुहोस्</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">खाता फोटो थप्नुहोस्</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {isBankModalOpen && (
                <BankAccountModal
                    bankDetails={editBankId !== null ? bankDetails.find(b => b.id === editBankId) : null}
                    signatories={officialDetails}
                    bankOptions={banks}
                    onSubmit={(data) => addBankDetails(project.serial_number, data)}
                    onClose={() => {
                        setIsBankModalOpen(false);
                        setEditBankId(null);
                    }}
                />
            )}

            {isBankRecommendationModalOpen && (
                <AddBankRecommendationModal
                    onSave={saveBankRecommendation}
                    onClose={() => {
                        setIsBankRecommendationModalOpen(false);
                        setEditRecommendationId(null);
                    }}
                    documentData={editRecommendationId !== null ? bankRecommendationDetails.find(r => r.id === editRecommendationId) : null}
                    projectId={project.serial_number}
                />
            )}

            {isBankAccountPhotosModalOpen && (
                <AddBankRecommendationModal
                    onSave={saveAccountPhoto}
                    onClose={() => {
                        setIsBankAccountPhotosModalOpen(false);
                        setEditAccountPhotoId(null);
                    }}
                    documentData={editAccountPhotoId !== null ? bankAccountPhotos.find(p => p.id === editAccountPhotoId) : null}
                    projectId={project.serial_number}
                    isAccountPhoto={true}
                />
            )}
        </div>
    );
};

export default BankDetailsSection;