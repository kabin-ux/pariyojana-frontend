import React, { useState, useEffect } from 'react';
import { Edit, Plus,  Upload, View, Lock as  FileCheck, Building2, Calendar,  FileText, Camera } from 'lucide-react';
import {  toNepaliNumber } from '../../utils/formatters';
import * as BS from 'bikram-sambat-js';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useInstallmentDetails } from '../../hooks/useInstallments';
import BankAccountModal, { type SignatoryOption } from '../../modals/AddBankDetailsModal';
import { useProjectDetail } from '../../hooks/useProjectDetail';
import AddBankRecommendationModal from '../../modals/AddBankRecommendationModal';
import PaymentDetailModal from '../../modals/AddPaymentDetailsModal';


interface Project {
    serial_number: number;
    budget?: number;
}



interface BankDetail {
    id: number;
    branch: string;
    bank_name: string;
    signatories_details: SignatoryOption[];
}

interface BudgetFormData {
    title: string;
    amount_paid: string | number;
    payment_percent: number;
    physical_progress: number;
    agreement_amount: number;
}

interface ProjectDetailProps {
    project: Project;
}


// Assuming you have the BS library properly imported
const today = new Date(); // current Gregorian date
const bsDate = BS.ADToBS(today); // Convert to BS

const PaymentInstallment: React.FC<ProjectDetailProps> = ({ project }) => {
    const [activeTab, setActiveTab] = useState('बैंकको विवरण');
    // const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [bankDetails, setBankDetails] = useState<BankDetail[]>([]);
    const [bankRecommendationDetails, setBankRecommendationDetails] = useState<any[]>([]);
    const [bankAccountPhotos, setBankAccountPhotos] = useState<any[]>([]);
    const [editBankId, setEditBankId] = useState<number | null>(null);
    const [editRecommendationId, setEditRecommendationId] = useState<number | null>(null);
    const [editAccountPhotoId, setEditAccountPhotoId] = useState<number | null>(null);
    const [isPaymentDetailModalOpen, setPaymentDetailModalOpen] = useState(false);
    // const [isDownloading, setIsDownloading] = useState<{ [key: string]: boolean }>({});

    const projectIdNum = project?.serial_number;
    const {
        officialDetails, loadConsumerCommitteeDetails
    } = useProjectDetail(projectIdNum)

    useEffect(() => {
        if (projectIdNum) {
            loadConsumerCommitteeDetails();
        }
    }, [projectIdNum]);

    const fetchBankDetails = async (projectId: number) => {
        try {
            const token = localStorage.getItem('access_token')

            const response = await axios.get(`http://213.199.53.33:8000/api/projects/${projectId}/bank-details/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error: any) {
            console.error("Error fetching bank details:", error.response?.data || error.message);
            throw error;
        }
    };

    const fetchBankRecommendationDetails = async (projectId: number) => {
        try {
            const token = localStorage.getItem('access_token')

            const response = await axios.get(`http://213.199.53.33:8000/api/projects/${projectId}/bank-account-recommendation/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error: any) {
            console.error("Error fetching bank recommendation details:", error.response?.data || error.message);
            throw error;
        }
    };

    const fetchBankAccountPhotos = async (projectId: number) => {
        try {
            const token = localStorage.getItem('access_token')

            const response = await axios.get(`http://213.199.53.33:8000/api/projects/${projectId}/account-photos/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
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

            if (data.file) {
                formData.append('file', data.file);
            }

            let url = `http://213.199.53.33:8000/api/projects/${projectIdNum}/bank-account-recommendation/`;
            let method = 'post';

            if (editRecommendationId) {
                url = `http://213.199.53.33:8000/api/projects/${projectIdNum}/bank-account-recommendation/${editRecommendationId}/`;
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

            // Refresh recommendation details
            const updatedData = await fetchBankRecommendationDetails(projectIdNum);
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
                formData.append('check_photo', data.check_photo);
            }

            let url = `http://213.199.53.33:8000/api/projects/${projectIdNum}/account-photos/`;
            let method = 'post';

            if (editAccountPhotoId) {
                url = `http://213.199.53.33:8000/api/projects/${projectIdNum}/account-photos/${editAccountPhotoId}/`;
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

            // Refresh account photos
            const updatedData = await fetchBankAccountPhotos(projectIdNum);
            setBankAccountPhotos(updatedData);

            setIsBankAccountPhotosModalOpen(false);
            setEditAccountPhotoId(null);
        } catch (error) {
            console.error('Account photo submission failed:', error);
            toast.error('खाता फोटो सेभ गर्न सकिएन');
        }
    };

    useEffect(() => {
        const loadBankDetails = async () => {
            try {
                const data = await fetchBankDetails(projectIdNum);
                setBankDetails(data);
                console.log("bank details", data)
            } catch (err) {
                console.error("Failed to load bank details.");
            }
        };
        const loadBankRecommendationDetails = async () => {
            try {
                const data = await fetchBankRecommendationDetails(projectIdNum);
                setBankRecommendationDetails(data);
                console.log("bank recomm details", data)
            } catch (err) {
                console.error("Failed to load bank recommendation details.");
            }
        };
        const loadBankAccountPhotos = async () => {
            try {
                const data = await fetchBankAccountPhotos(projectIdNum);
                setBankAccountPhotos(data);
                console.log("bank account photos", data)
            } catch (err) {
                console.error("Failed to load bank account photos.");
            }
        };

        loadBankDetails();
        loadBankRecommendationDetails();
        loadBankAccountPhotos();
    }, [projectIdNum]);

    console.log("official det", officialDetails)
    const {
        banks,
        firstInstallment,
        secondInstallment,
        thirdInstallment,
        paymentDetails,
       
        refetch
    } = useInstallmentDetails(project.serial_number);
    const [isBankModalOpen, setIsBankModalOpen] = useState(false);
    const [isBankRecommendationModalOpen, setIsBankRecommendationModalOpen] = useState(false);
    const [isBankAccountPhotosModalOpen, setIsBankAccountPhotosModalOpen] = useState(false);

    console.log(banks)

    const tabs = [
        'बैंकको विवरण',
        'पहिलो पेस्की भुक्तानी',
        'दोस्रो किस्ता भुक्तानी',
        'अन्तिम किस्ता भुक्तानी',
        'भुक्तानी विवरण'
    ];

    const savePaymentDetails = async (data: BudgetFormData) => {
        try {
            const token = localStorage.getItem('access_token');
            const url = `http://213.199.53.33:8000/api/projects/${projectIdNum}/payment-details/`;

             await axios.post(url, {
                title: data.title,
                amount_paid: data.amount_paid,
                payment_percent: data.payment_percent,
                physical_progress: data.physical_progress,
                agreement_amount: data.agreement_amount
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            toast.success('भुक्तानी विवरण सफलतापूर्वक थपियो');
            refetch(); // Refresh the payment details
            setPaymentDetailModalOpen(false);
        } catch (error) {
            console.error('Payment details submission failed:', error);
            toast.error('भुक्तानी विवरण सेभ गर्न सकिएन');
        }
    };

    const uploadFirstInstallment = async (file: File, projectId: number, serial_no: number) => {
        try {
            const token = localStorage.getItem('access_token')

            const formData = new FormData();
            formData.append('file', file);
            formData.append('serial_no', serial_no.toString());
            formData.append('project_id', projectId.toString());

            const response = await axios.post(
                `http://213.199.53.33:8000/api/projects/first-installment/${projectId}/upload/`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    },
                }
            );

            refetch()

            console.log('First Installment uploaded successfully:', response.data);
            toast.success('पहिलो पेश्की भुक्तानी अपलोड सफल भयो।');
        } catch (error) {
            console.error('First Installment upload failed:', error);
            toast.error('पहिलो पेश्की अपलोड गर्न समस्या भयो।');
        }
    };

    const uploadSecondInstallment = async (file: File, projectId: number, serial_no: number) => {
        try {
            const token = localStorage.getItem('access_token')

            const formData = new FormData();
            formData.append('file', file);
            formData.append('serial_no', serial_no.toString());
            formData.append('project_id', projectId.toString());

            const response = await axios.post(
                `http://213.199.53.33:8000/api/projects/second-installment/${projectId}/upload/`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    },
                }
            );
            refetch()

            console.log('Second Installment uploaded successfully:', response.data);
            toast.success('दोस्रो किस्ता भुक्तानी अपलोड सफल भयो।');
        } catch (error) {
            console.error('Second Installment upload failed:', error);
            toast.error('दोस्रो किस्ता अपलोड गर्न समस्या भयो।');
        }
    };

    const uploadThirdInstallment = async (file: File, projectId: number, serial_no: number) => {
        try {
            const token = localStorage.getItem('access_token')

            const formData = new FormData();
            formData.append('file', file);
            formData.append('serial_no', serial_no.toString());
            formData.append('project_id', projectId.toString());

            const response = await axios.post(
                `http://213.199.53.33:8000/api/projects/third-installment/${projectId}/upload/`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    },
                }
            );
            refetch()

            console.log('Third Installment uploaded successfully:', response.data);
            toast.success('अन्तिम किस्ता भुक्तानी अपलोड सफल भयो।');
        } catch (error) {
            console.error('Third Installment upload failed:', error);
            toast.error('अन्तिम किस्ता अपलोड गर्न समस्या भयो।');
        }
    };

    // Add this function at the component level
    // const handleDownloadPDF = async (installmentType: 'first' | 'second' | 'third', serialNo: number, projectId: string) => {
    //     try {
    //         setIsDownloading({ ...isDownloading, [`${installmentType}-${serialNo}`]: true });

    //         const response = await axios.get(
    //             `http://213.199.53.33:8000/api/projects/${installmentType}-installment/generate-pdf/${serialNo}/${projectId}/`,
    //             { responseType: 'blob' }
    //         );

    //         const blob = new Blob([response.data], { type: 'application/pdf' });
    //         const url = window.URL.createObjectURL(blob);
    //         const link = document.createElement('a');
    //         link.href = url;
    //         link.setAttribute('download', `${installmentType}-installment-${serialNo}.pdf`);
    //         document.body.appendChild(link);
    //         link.click();
    //         link.remove();
    //         window.URL.revokeObjectURL(url);
    //     } catch (error) {
    //         console.error('PDF download failed:', error);
    //         toast.error('डाउनलोड गर्न समस्या भयो।');
    //     } finally {
    //         setIsDownloading({ ...isDownloading, [`${installmentType}-${serialNo}`]: false });
    //     }
    // };



    const addBankDetails = async (projectSerialNumber: number, data: {
        bank_id: number;
        branch: string;
        signatories: number[];
    }) => {
        try {
            const token = localStorage.getItem('access_token');
            let url = `http://213.199.53.33:8000/api/projects/${projectSerialNumber}/bank-details/`;
            let method = 'post';
            if (editBankId) {
                url = `http://213.199.53.33:8000/api/projects/${projectSerialNumber}/bank-details/${editBankId}/`;
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

            // Refresh bank details
            const updatedData = await fetchBankDetails(projectIdNum);
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

    const StatusBadge = ({ status }: { status: string }) => {
        const getStatusColor = (status: string) => {
            switch (status.toLowerCase()) {
                case 'completed':
                case 'अपलोड गरिएको':
                    return 'bg-green-100 text-green-800 border-green-200';
                case 'in-progress':
                case 'प्रगतिमा':
                    return 'bg-blue-100 text-blue-800 border-blue-200';
                case 'pending':
                case 'बाँकी':
                    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
                default:
                    return 'bg-gray-100 text-gray-800 border-gray-200';
            }
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                {status}
            </span>
        );
    };

    const totalPaid = paymentDetails?.reduce(
        (sum, item) => sum + Number(item.amount_paid || 0),
        0
    ) ?? 0;
    // console.log("totelpaid",totalPaid)

    const totalPercent = paymentDetails.reduce(
        (sum, item) => sum + (Number(item.payment_percent) || 0),
        0
    );
    const maxProgress = paymentDetails.reduce((max, item) => Math.max(max, item.physical_progress || 0), 0);
    const remainingAmount = parseFloat(String(project.budget ?? '0')) - totalPaid;


 

    const handlePayment = async (projectId: number) => {
        try {
            const response = await axios.get(`http://213.199.53.33:8000/api/projects/installment/payment/project/${projectId}/pdf/`, {
                responseType: 'blob', // important for binary data like PDF
            });

            // Create a URL from the blob and open/download
            const file = new Blob([response.data], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL); // opens in new tab
            // OR use below line to download
            // const link = document.createElement('a');
            // link.href = fileURL;
            // link.setAttribute('download', 'payment-receipt.pdf');
            // document.body.appendChild(link);
            // link.click();
            // link.remove();

        } catch (error) {
            console.error('Failed to fetch payment PDF:', error);
        }
    };


    const renderBankDetails = () => (
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

                    {/* Show "add" button only if no bank details exist */}
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

                    {/* Show "edit" button only if bank details exist */}
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
                                    {bankDetails[0].signatories_details.map(signatory => (
                                        <li key={signatory.id}>{signatory.full_name}</li>
                                    ))}
                                </ul>
                            </p>
                        </div>
                    </div>
                )}

                {isBankModalOpen && (
                    <BankAccountModal
                        bankDetails={editBankId !== null ? bankDetails.find(b => b.id === editBankId) : null}
                        signatories={officialDetails}
                        bankOptions={banks}
                        onSubmit={(data) => addBankDetails((project.serial_number), data)}
                        onClose={() => {
                            setIsBankModalOpen(false);
                            setEditBankId(null);
                        }}
                    />
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

                {isBankRecommendationModalOpen && (
                    <AddBankRecommendationModal
                        onSave={saveBankRecommendation}
                        onClose={() => {
                            setIsBankRecommendationModalOpen(false);
                            setEditRecommendationId(null);
                        }}
                        documentData={editRecommendationId !== null ? bankRecommendationDetails.find(r => r.id === editRecommendationId) : null}
                        projectId={projectIdNum}
                    />
                )}
            </div>

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
                                        {photo.file ? (
                                            <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300">
                                                <img
                                                    src={photo.file}
                                                    alt="Check Photo"
                                                    className="w-full h-40 object-cover rounded-lg"
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

                {isBankAccountPhotosModalOpen && (
                    <AddBankRecommendationModal
                        onSave={saveAccountPhoto}
                        onClose={() => {
                            setIsBankAccountPhotosModalOpen(false);
                            setEditAccountPhotoId(null);
                        }}
                        documentData={editAccountPhotoId !== null ? bankAccountPhotos.find(p => p.id === editAccountPhotoId) : null}
                        projectId={projectIdNum}
                        isAccountPhoto={true}
                    />
                )}
            </div>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'बैंकको विवरण':
                return renderBankDetails();
            case 'पहिलो पेस्की भुक्तानी':
                return (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">पहिलो पेश्की भुक्तानी</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">क्र.स.</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">शीर्षक</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">मिति</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">स्थिति</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">अन्य</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {firstInstallment?.map((item) => (
                                        <tr key={item.serial_no} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-gray-900">{toNepaliNumber(item.serial_no)}</td>
                                            <td className="py-3 px-4 text-gray-900 text-sm">
                                                <div>{item.title}</div>
                                                <div className="text-gray-600 text-xs mt-1">{item.description}</div>
                                            </td>
                                            <td className="py-3 px-4 text-gray-900 text-sm">{toNepaliNumber(bsDate)}</td>
                                            <td className="py-3 px-4 text-gray-900 text-sm">
                                                {item.file_uploaded_name ? 'फाइल अपलोड गरिएको' : 'बाँकी'}
                                            </td>
                                            <td className="py-3 px-4 text-gray-900 text-sm flex space-x-2">
                                                <input
                                                    type="file"
                                                    id={`file-input-${item.serial_no}`}
                                                    className="hidden"
                                                    onChange={e => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            uploadFirstInstallment(file, project.serial_number, item.serial_no);
                                                        }
                                                    }}
                                                />

                                                <button
                                                    type="button"
                                                    className="p-1 rounded text-blue-600 hover:text-blue-800 cursor-pointer"
                                                    onClick={() => document.getElementById(`file-input-${item.serial_no}`)?.click()}
                                                >
                                                    <Upload className="w-4 h-4" />
                                                </button>

                                                <button
                                                    type="button"
                                                    className="p-1 rounded text-blue-600 hover:text-blue-800 cursor-pointer"
                                                    onClick={async () => {
                                                        try {
                                                            const response = await axios.get(
                                                                `http://213.199.53.33:8000/api/projects/first-installment/generate-pdf/${item.serial_no}/${project.serial_number}/`,
                                                                { responseType: 'blob' }
                                                            );
                                                            const blob = new Blob([response.data], { type: 'application/pdf' });
                                                            const url = window.URL.createObjectURL(blob);
                                                            const link = document.createElement('a');
                                                            link.href = url;
                                                            link.setAttribute('download', `first-installment-${item.serial_no}.pdf`);
                                                            document.body.appendChild(link);
                                                            link.click();
                                                            link.remove();
                                                            window.URL.revokeObjectURL(url);
                                                        } catch (error) {
                                                            console.error('PDF download failed:', error);
                                                            toast.error('डाउनलोड गर्न समस्या भयो।');
                                                        }
                                                    }}
                                                >
                                                    <FileCheck className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            case 'दोस्रो किस्ता भुक्तानी':
                return (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">दोस्रो किस्ता भुक्तानी</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">क्र.स.</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">शीर्षक</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">मिति</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">स्थिति</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">अन्य</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {secondInstallment?.map((item) => (
                                        <tr key={item.serial_no} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-gray-900">{toNepaliNumber(item.serial_no)}</td>
                                            <td className="py-3 px-4 text-gray-900 text-sm">
                                                <div>{item.title}</div>
                                                <div className="text-gray-600 text-xs mt-1">{item.description}</div>
                                            </td>
                                            <td className="py-3 px-4 text-gray-900 text-sm">{toNepaliNumber(bsDate)}</td>
                                            <td className="py-3 px-4 text-gray-900 text-sm">
                                                {item.file_uploaded_name ? 'फाइल अपलोड गरिएको' : 'बाँकी'}
                                            </td>
                                            <td className="py-3 px-4 text-gray-900 text-sm flex space-x-2">
                                                <input
                                                    type="file"
                                                    id={`file-input-${item.serial_no}`}
                                                    className="hidden"
                                                    onChange={e => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            uploadSecondInstallment(file, project.serial_number, item.serial_no);
                                                        }
                                                    }}
                                                />

                                                <button
                                                    type="button"
                                                    className="p-1 rounded text-blue-600 hover:text-blue-800 cursor-pointer"
                                                    onClick={() => document.getElementById(`file-input-${item.serial_no}`)?.click()}
                                                >
                                                    <Upload className="w-4 h-4" />
                                                </button>

                                                <button
                                                    type="button"
                                                    className="p-1 rounded text-blue-600 hover:text-blue-800 cursor-pointer"
                                                    onClick={async () => {
                                                        try {
                                                            const response = await axios.get(
                                                                `http://213.199.53.33:8000/api/projects/second-installment/generate-pdf/${item.serial_no}/${project.serial_number}/`,
                                                                { responseType: 'blob' }
                                                            );
                                                            const blob = new Blob([response.data], { type: 'application/pdf' });
                                                            const url = window.URL.createObjectURL(blob);
                                                            const link = document.createElement('a');
                                                            link.href = url;
                                                            link.setAttribute('download', `second-installment-${item.serial_no}.pdf`);
                                                            document.body.appendChild(link);
                                                            link.click();
                                                            link.remove();
                                                            window.URL.revokeObjectURL(url);
                                                        } catch (error) {
                                                            console.error('PDF download failed:', error);
                                                            toast.error('डाउनलोड गर्न समस्या भयो।');
                                                        }
                                                    }}
                                                >
                                                    <FileCheck className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            case 'अन्तिम किस्ता भुक्तानी':
                return (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">अन्तिम किस्ता भुक्तानी</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">क्र.स.</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">शीर्षक</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">मिति</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">स्थिति</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">अन्य</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {thirdInstallment?.map((item) => (
                                        <tr key={item.serial_no} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-gray-900">{toNepaliNumber(item.serial_no)}</td>
                                            <td className="py-3 px-4 text-gray-900 text-sm">
                                                <div>{item.title}</div>
                                                <div className="text-gray-600 text-xs mt-1">{item.description}</div>
                                            </td>
                                            <td className="py-3 px-4 text-gray-900 text-sm">{toNepaliNumber(bsDate)}</td>
                                            <td className="py-3 px-4 text-gray-900 text-sm">
                                                {item.file_uploaded_name ? 'फाइल अपलोड गरिएको' : 'बाँकी'}
                                            </td>
                                            <td className="py-3 px-4 text-gray-900 text-sm flex space-x-2">
                                                <input
                                                    type="file"
                                                    id={`file-input-${item.serial_no}`}
                                                    className="hidden"
                                                    onChange={e => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            uploadThirdInstallment(file, project.serial_number, item.serial_no);
                                                        }
                                                    }}
                                                />

                                                <button
                                                    type="button"
                                                    className="p-1 rounded text-blue-600 hover:text-blue-800 cursor-pointer"
                                                    onClick={() => document.getElementById(`file-input-${item.serial_no}`)?.click()}
                                                >
                                                    <Upload className="w-4 h-4" />
                                                </button>

                                                <button
                                                    type="button"
                                                    className="p-1 rounded text-blue-600 hover:text-blue-800 cursor-pointer"
                                                    onClick={async () => {
                                                        try {
                                                            const response = await axios.get(
                                                                `http://213.199.53.33:8000/api/projects/third-installment/generate-pdf/${item.serial_no}/${project.serial_number}/`,
                                                                { responseType: 'blob' }
                                                            );
                                                            const blob = new Blob([response.data], { type: 'application/pdf' });
                                                            const url = window.URL.createObjectURL(blob);
                                                            const link = document.createElement('a');
                                                            link.href = url;
                                                            link.setAttribute('download', `third-installment-${item.serial_no}.pdf`);
                                                            document.body.appendChild(link);
                                                            link.click();
                                                            link.remove();
                                                            window.URL.revokeObjectURL(url);
                                                        } catch (error) {
                                                            console.error('PDF download failed:', error);
                                                            toast.error('डाउनलोड गर्न समस्या भयो।');
                                                        }
                                                    }}
                                                >
                                                    <FileCheck className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            case 'भुक्तानी विवरण':
                return (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">भुक्तानी सम्बन्धी विवरण</h3>
                        <div className="overflow-x-auto">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                                <button
                                    type="button"
                                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition cursor-pointer"
                                    onClick={() => setPaymentDetailModalOpen(true)}
                                >
                                    नयाँ प्रविष्टी गर्नुहोस
                                </button>
                                <button
                                    type="button"
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
                                    onClick={() => handlePayment(project.serial_number)}
                                >
                                    भुक्तानी विवरण
                                </button>
                            </div>

                            <table className="min-w-full rounded-lg shadow-sm">
                                <thead className="bg-gray-100">
                                    <tr className="text-sm font-semibold text-gray-700">
                                        <th className="text-left py-3 px-4">क्र.स.</th>
                                        <th className="text-left py-3 px-4">शीर्षक</th>
                                        <th className="text-left py-3 px-4">जारी मिति</th>
                                        <th className="text-left py-3 px-4">भुक्तानी गरिएको रकम</th>
                                        <th className="text-left py-3 px-4">भुक्तनी प्रतिशत (%)</th>
                                        <th className="text-left py-3 px-4">भौतिक प्रगती (%)</th>
                                        <th className="text-left py-3 px-4">अन्य</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paymentDetails.map((item, index) => (
                                        <tr
                                            key={item.serial_no}
                                            className={`text-sm text-gray-800 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                                } hover:bg-blue-50`}
                                        >
                                            <td className="py-3 px-4">{toNepaliNumber(item.id)}</td>
                                            <td className="py-3 px-4">{item.title}</td>
                                            <td className="py-3 px-4">{toNepaliNumber(bsDate)}</td>
                                            <td className="py-3 px-4">{toNepaliNumber(item.amount_paid)}</td>
                                            <td className="py-3 px-4">{toNepaliNumber(item.payment_percent)}%</td>
                                            <td className="py-3 px-4">
                                                {toNepaliNumber(item.physical_progress ?? 0)}%
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center space-x-3">
                                                    <button
                                                        type="button"
                                                        title="Upload File"
                                                        className="text-blue-600 hover:text-blue-800 transition cursor-pointer"
                                                        onClick={() => console.log("Upload clicked")}
                                                    >
                                                        <Upload className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        title="Download PDF"
                                                        className="text-blue-600 hover:text-blue-800 transition cursor-pointer"
                                                        onClick={() => console.log("Download PDF clicked")}
                                                    >
                                                        <FileCheck className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>


                        <div className="bg-gray-50 rounded-lg p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">कुल भुक्तानी गरिएको रकम:</p>
                                    <p className="text-lg font-semibold">रु. {toNepaliNumber(totalPaid?.toFixed(2))}</p>

                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">कुल भुक्तानी हुन बाकी रकम:</p>
                                    <p className="text-lg font-semibold">रु. {toNepaliNumber(remainingAmount?.toFixed(2))}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">कुल भुक्तनी प्रतिशत (%):</p>
                                    <p className="text-lg font-semibold">
                                        {toNepaliNumber(totalPercent?.toFixed(2))}%
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">कुल भौतिक प्रगती (%):</p>
                                    <p className="text-lg font-semibold">{toNepaliNumber(maxProgress)}%</p>
                                </div>
                            </div>
                        </div>

                        {isPaymentDetailModalOpen && (
                            <PaymentDetailModal
                                onClose={() => setPaymentDetailModalOpen(false)}
                                onSave={savePaymentDetails}
                                usedTitles={paymentDetails.map(p => p.title)} // Pass used titles here
                                initialData={{
                                    title: '',
                                    amount_paid: '',
                                    payment_percent: 0,
                                    physical_progress: 0,
                                    agreement_amount: project.budget || 0
                                }}
                            />
                        )}

                    </div>
                )
            default:
                return renderBankDetails();
        }
    };

    return (
        <div className="bg-gray-50">
            <div className="mx-auto">
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">किस्ता भुक्तानी सम्बन्धी विवरण</h3>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6 overflow-x-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer whitespace-nowrap transition-colors duration-200 ${activeTab === tab
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6">
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentInstallment;