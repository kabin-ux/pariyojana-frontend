import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Home, ChevronRight, Edit, Download, Copy, MoreHorizontal, Plus, Trash2, Upload, DownloadCloud, View, Notebook, ImageDown, Lock as Dock, File, FileMinus2, FileMinusIcon, FileCheck2, FileCheck, Building2, Calendar, MapPin, Phone, User, Users, DollarSign, FileText, Camera, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { formatBudget, toNepaliNumber } from '../../utils/formatters';
import * as BS from 'bikram-sambat-js';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useInstallmentDetails } from '../../hooks/useInstallments';

interface ProjectDetailProps {
    project: {
        id: number;
        serial_number: string;
        name: string;
        ward_number: number;
        budget: number;
        status: string;
        start_date: string;
        end_date: string;
        description: string;
    };
    onBack: () => void;
}

const FIRST_BACK_TITLES = [
    { "serial_no": 1, "title": "उपभोक्ता समिति बैठक र निर्णय", "description": "(काम सुरुवात तथा पेश्की माग सम्बन्धित)" },
    { "serial_no": 2, "title": "उपभोक्ता समितिले अग्रीम पहिलो/ पेश्की माग सम्बन्धित निवेदन" },
    { "serial_no": 3, "title": "वडा कार्यालयको पेश्की भुक्तानी सिफरिस" }
]

const SECOND_BACK_TITLES = [
    { "serial_no": 1, "title": "उपभोक्ता समिति बैठक र निर्णय", "description": "(दोस्रो किस्ता भुक्तानी माग सम्बन्धित)" },
    { "serial_no": 2, "title": "नापजाँच गरी दोस्रो किस्ता भुक्तानीका लागी निवेदन" },
    { "serial_no": 3, "title": "योजना संचालन स्थलको फोटो - ४ प्रति", "description": "(दोस्रो किस्ता भुक्तानीगर्नु पुर्वको फोटो)" },
    { "serial_no": 4, "title": "आयोजनाको आम्दानी र खर्चको विवरण" },
    { "serial_no": 5, "title": "उपभोक्ता समितिको भौतिक तथा वित्तिय प्रगती प्रतिवेदन" },
    { "serial_no": 6, "title": "नापी किताव" },
    { "serial_no": 7, "title": "ठेक्का सम्बन्धि बिल" },
    { "serial_no": 8, "title": "प्राविधिको प्रतिवेदन" },
    { "serial_no": 9, "title": "वडा कार्यालयको भुक्तानी सिफरिस" },
]

const THIRD_BACK_TITLES = [
    { "serial_no": 1, "title": "उपभोक्ता समिति बैठक र निर्णय", "description": "(अन्तिम किस्ता भुक्तानी माग सम्बन्धित)" },
    { "serial_no": 2, "title": "नापजाँच गरी दोस्रो अन्तिम भुक्तानीका लागी निवेदन" },
    { "serial_no": 3, "title": "योजना संचालन स्थलको फोटो - ४ प्रति", "description": "(अन्तिम किस्ता भुक्तानीगर्नु पुर्वको फोटो)" },
    { "serial_no": 4, "title": "आयोजनाको आम्दानी र खर्चको विवरण" },
    { "serial_no": 5, "title": "उपभोक्ता समितिको भौतिक तथा वित्तिय प्रगती प्रतिवेदन" },
    { "serial_no": 6, "title": "नापी किताव" },
    { "serial_no": 7, "title": "वडा कार्यालयको भुक्तानी सिफरिस" },
    { "serial_no": 8, "title": "अनुगमन तथा सहजिकरण समितिको प्रतिवेदन" },
    { "serial_no": 9, "title": "ठेक्का सम्बन्धि बिल" },
    { "serial_no": 10, "title": "कार्य स्विकार / कार्य सम्पन्न प्रतिवेदन" },
    { "serial_no": 11, "title": "सामजिक समिक्षा फाराम" },
    { "serial_no": 12, "title": "खर्च सार्वजनिक सुचना फारम" },
    { "serial_no": 13, "title": "आयोजना हस्तान्तरण फाराम" },
    { "serial_no": 14, "title": "अनुगमन तथा सुपरिवेक्ष समितिको प्रतिवेदन" },
    { "serial_no": 15, "title": "जाचपास समितीको निर्णय" },
]

const INSTALLMENT_DESC = [
    { "serial_no": 1, "title": "पहिलो पेश्की भुक्तानी" },
    { "serial_no": 2, "title": "दोस्रो किस्ता भुक्तानी	" },
    { "serial_no": 3, "title": "अन्तिम किस्ता भुक्तानी	" }
]


// Assuming you have the BS library properly imported
const today = new Date(); // current Gregorian date

const bsDate = BS.ADToBS(today); // Convert to BS

const PaymentInstallment: React.FC<ProjectDetailProps> = ({ project, onBack }) => {
    const [activeTab, setActiveTab] = useState('बैंकको विवरण');
    const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const {
        banks,
        firstInstallment,
        secondInstallment,
        thirdInstallment,
        firstLoading,
        secondLoading,
        thirdLoading,
        firstError,
        secondError,
        thirdError,
        refetch
    } = useInstallmentDetails(project.serial_number);
    console.log(banks)

    const tabs = [
        'बैंकको विवरण',
        'पहिलो पेस्की भुक्तानी',
        'दोस्रो किस्ता भुक्तानी',
        'अन्तिम किस्ता भुक्तानी',
        'भुक्तानी विवरण'
    ];

    // Sample bank data
   

    // Sample installment data
    const installmentData = [
        {
            id: 1,
            title: 'बैंक खाता सञ्चालन सिफारिस',
            date: '२०९०-०३-१४',
            status: 'अपलोड गरिएको',
            description: '(बैंक वा नगरपालिकाले दिने सिफारिस)'
        }
    ];

    // Account details
    const accountDetails = {
        accountNumber: '1234567',
        checkPhoto: '/api/placeholder/200/150'
    };

    const uploadFirstInstallment = async (file: File, projectId: number, serial_no: number) => {
        try {
            const token = localStorage.getItem('access_token')

            const formData = new FormData();
            formData.append('file', file);
            formData.append('serial_no', serial_no)
            formData.append('project_id', projectId.toString());

            const response = await axios.post(
                `http://localhost:8000/api/projects/first-installment/${projectId}/upload/`,
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
            formData.append('serial_no', serial_no)
            formData.append('project_id', projectId.toString());

            const response = await axios.post(
                `http://localhost:8000/api/projects/second-installment/${projectId}/upload/`,
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

    const uploadThirdInstallment = async (file: File, projectId: number, serial_no: number) => {
        try {
            const token = localStorage.getItem('access_token')

            const formData = new FormData();
            formData.append('file', file);
            formData.append('serial_no', serial_no)
            formData.append('project_id', projectId.toString());

            const response = await axios.post(
                `http://localhost:8000/api/projects/third-installment/${projectId}/upload/`,
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

    const ActionButton = ({ icon: Icon, onClick, className = "", title }: {
        icon: any;
        onClick: () => void;
        className?: string;
        title: string;
    }) => (
        <button
            type="button"
            className={`p-2 rounded-lg transition-colors duration-200 ${className}`}
            onClick={onClick}
            title={title}
        >
            <Icon className="w-4 h-4" />
        </button>
    );

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
                    <ActionButton
                        icon={Edit}
                        onClick={() => console.log('Edit bank details')}
                        className="bg-blue-600 text-white hover:bg-blue-700"
                        title="सम्पादन गर्नुहोस्"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">बैंकको नाम:</label>
                        <p className="text-lg font-semibold text-gray-900 bg-white p-3 rounded-lg border">
                            {banks.name}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">बैंकको साखा:</label>
                        <p className="text-lg font-semibold text-gray-900 bg-white p-3 rounded-lg border">
                            {banks.branch}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">दस्तावत कर्ता:</label>
                        <p className="text-lg font-semibold text-gray-900 bg-white p-3 rounded-lg border">
                            {banks.documents}
                        </p>
                    </div>
                </div>
            </div>

            {/* Installment Reports Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-blue-600" />
                        बैंक खाता सञ्चालन सिफारिस
                    </h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    क्र.स
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    शिर्षक
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    मिति
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    स्थिती
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    अन्य
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {installmentData.map((item, index) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {toNepaliNumber(item.id)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <div>
                                            <div className="font-medium">{item.title}</div>
                                            <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                            {item.date}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={item.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center space-x-2">
                                            <ActionButton
                                                icon={Edit}
                                                onClick={() => console.log('Edit item')}
                                                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                                title="सम्पादन गर्नुहोस्"
                                            />
                                            <ActionButton
                                                icon={MoreHorizontal}
                                                onClick={() => console.log('More options')}
                                                className="text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                                                title="थप विकल्पहरू"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Account Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <User className="w-5 h-5 mr-2 text-blue-600" />
                            खाता नम्बर र चेकको फोटो
                        </h3>
                        <ActionButton
                            icon={Edit}
                            onClick={() => console.log('Edit account details')}
                            className="bg-blue-600 text-white hover:bg-blue-700"
                            title="सम्पादन गर्नुहोस्"
                        />
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-2 block">
                                    खाता नम्बर:
                                </label>
                                <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300">
                                    <p className="text-2xl font-bold text-gray-900 font-mono">
                                        {toNepaliNumber(accountDetails.accountNumber)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-medium text-gray-600 mb-2 block">
                                चेकको फोटो:
                            </label>
                            <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300">
                                <div className="flex items-center justify-center h-40">
                                    <div className="text-center">
                                        <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-500">चेकको फोटो अपलोड गर्नुहोस्</p>
                                        <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                                            फोटो छान्नुहोस्
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderInstallmentTab = (tabName: string) => (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 bg-green-600 rounded-lg">
                        <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{tabName}</h3>
                </div>
                <p className="text-gray-600">यस खण्डमा {tabName} सम्बन्धी जानकारी र दस्तावेजहरू राखिएको छ।</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">कुनै डाटा उपलब्ध छैन</h3>
                    <p className="text-gray-500 mb-6">यस खण्डमा अहिले कुनै जानकारी उपलब्ध छैन।</p>
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center mx-auto">
                        <Plus className="w-5 h-5 mr-2" />
                        नयाँ रेकर्ड थप्नुहोस्
                    </button>
                </div>
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
                                    {firstInstallment?.map((item, index) => (
                                        <tr key={item.serial_no} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-gray-900">{toNepaliNumber(item.serial_no)}</td>
                                            <td className="py-3 px-4 text-gray-900 text-sm">
                                                <div>{item.title}</div>
                                                <div className="text-gray-600 text-xs mt-1">{item.description}</div>
                                            </td>

                                            <td className="py-3 px-4 text-gray-900 text-sm">{toNepaliNumber(bsDate)}</td>
                                            {item.file_uploaded_name ? 'फाइल अपलोड गरिएको' : ''}
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
                                                    onClick={() => {
                                                        // Your download PDF logic here
                                                        console.log("Download PDF clicked");
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
                                    {secondInstallment?.map((item, index) => (
                                        <tr key={item.serial_no} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-gray-900">{toNepaliNumber(item.serial_no)}</td>
                                            <td className="py-3 px-4 text-gray-900 text-sm">
                                                <div>{item.title}</div>
                                                <div className="text-gray-600 text-xs mt-1">{item.description}</div>
                                            </td>
                                            <td className="py-3 px-4 text-gray-900 text-sm">{toNepaliNumber(bsDate)}</td>
                                            <td className="py-3 px-4 text-gray-900 text-sm" >  {item.file_uploaded_name ? 'फाइल अपलोड गरिएको' : ''}</td>
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
                                                    onClick={() => {
                                                        // Your download PDF logic here
                                                        console.log("Download PDF clicked");
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
                                    {thirdInstallment?.map((item, index) => (
                                        <tr key={item.serial_no} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-gray-900">{toNepaliNumber(item.serial_no)}</td>
                                            <td className="py-3 px-4 text-gray-900 text-sm">
                                                <div>{item.title}</div>
                                                <div className="text-gray-600 text-xs mt-1">{item.description}</div>
                                            </td>
                                            <td className="py-3 px-4 text-gray-900 text-sm">{toNepaliNumber(bsDate)}</td>
                                            <td className="py-3 px-4 text-gray-900 text-sm" >{item.file_uploaded_name ? 'फाइल अपलोड गरिएको' : ''}</td>
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
                                                    onClick={() => {
                                                        // Your download PDF logic here
                                                        console.log("Download PDF clicked");
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
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">क्र.स.</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">शीर्षक</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">जारी मिति	</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">भुक्तानी गरिएको रकम</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">भुक्तनी प्रतिशत (%)</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">भौतिक प्रगती (%)</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">अन्य</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {INSTALLMENT_DESC.map((item, index) => (
                                        <tr key={item.serial_no} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-gray-900">{toNepaliNumber(item.serial_no)}</td>
                                            <td className="py-3 px-4 text-gray-900 text-sm">
                                                <div>{item.title}</div>
                                                <div className="text-gray-600 text-xs mt-1">{ }</div>
                                            </td>
                                            <td className="py-3 px-4 text-gray-900 text-sm">{toNepaliNumber(bsDate)}</td>
                                            <td className="py-3 px-4 text-gray-900 text-sm" >{ }</td>
                                            <td className="py-3 px-4 text-gray-900 text-sm" >{ }</td>
                                            <td className="py-3 px-4 text-gray-900 text-sm" >{ }</td>
                                            <td className="py-3 px-4 text-gray-900 text-sm flex space-x-2">
                                                <button
                                                    type="button"
                                                    className="p-1 rounded text-blue-600 hover:text-blue-800 cursor-pointer"
                                                    onClick={() => {
                                                        // Your upload logic here
                                                        console.log("Upload clicked");
                                                    }}
                                                >
                                                    <Upload className="w-4 h-4" />
                                                </button>

                                                <button
                                                    type="button"
                                                    className="p-1 rounded text-blue-600 hover:text-blue-800 cursor-pointer"
                                                    onClick={() => {
                                                        // Your download PDF logic here
                                                        console.log("Download PDF clicked");
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

                        <div className="bg-gray-50 rounded-lg p-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-black-600 mb-1">कुल भुक्तानी गरिएको रकम:</p>
                                    <p className="text-lg font-semibold">{ }</p>
                                </div>
                                <div>
                                    <p className="text-sm text-black-600 mb-1">कुल भुक्तानी हुन बाकी रकम:</p>
                                    <p className="text-lg font-semibold">{ }</p>
                                </div>
                                <div>
                                    <p className="text-sm text-black-600 mb-1">कुल भुक्तनी प्रतिशत (%):</p>
                                    <p className="text-lg font-semibold">{ }%</p>
                                </div>
                                <div>
                                    <p className="text-sm text-black-600 mb-1">कुल भौतिक प्रगती (%):</p>
                                    <p className="text-lg font-semibold">{ }%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            default:
                return renderBankDetails();
        }
    };

    return (
        <div className=" bg-gray-50">
            {/* Main Content */}
            <div className="mx-auto">
                {/* Project Header */}
                <div className=" mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">किस्ता भुक्तानी सम्बन्धी विवरण</h3>

                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6 overflow-x-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${activeTab === tab
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentInstallment;