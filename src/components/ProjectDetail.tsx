import React, { useState, useEffect } from 'react';
import { ChevronLeft, Home, ChevronRight, Edit, Download, Copy, MoreHorizontal, Plus, Trash2, Upload, DownloadCloud, View, Notebook, ImageDown, Dock, File, FileMinus2, FileMinusIcon, FileCheck2, FileCheck } from 'lucide-react';
import { useProjectDetail } from '../hooks/useProjectDetail';
import { formatBudget, formatWardNumber, toNepaliNumber } from '../utils/formatters';
import ProgramDetailsTab from '../components/projectdetailssubtab/ProgramDetailTab';
import CostEstimateModal from '../modals/CostEstimateModal';
import type { CostEstimateDetail } from '../types/projectDetail';
import InitiationProcessSection from '../modals/InitiationProcessSections';
import ConsumerCommitteeDialog from '../modals/ConsumerCommitteeDialog';
import axios from 'axios';
import toast from 'react-hot-toast';
import * as BS from 'bikram-sambat-js';
import Modal from '../modals/AddOfficialDetailandMonitoringModal';

interface FormRow {
    id: number;
    post: string;
    full_name: string;
    gender: string;
    address: string;
    citizenship_no: string;
    contact_no: string;
    citizenshipCopy: string;
    citizenship_front?: File | null;
    citizenship_back?: File | null;
}

interface ProjectDetailProps {
    project: any;
    onBack: () => void;
}
const CONSUMER_COMMITTEE_TITLES = [
    { "serial_no": 1, "title": "योजना संचालन पुस्तिका विवरण पृष्ट" },
    { "serial_no": 2, "title": "उपभोक्ता समिति गठन विधि एवं प्रकृया" },
    { "serial_no": 3, "title": "उपभोत्ता समिति गठन गर्ने सम्बन्धी सुचना" },
    { "serial_no": 4, "title": "उपभोत्ता समितिको काम कर्तव्य र अधिकारको विवरण" },
    { "serial_no": 5, "title": "आम भेलाको माईनियुट (उपभोक्ता समिति गठन गर्दा छलफल तथा भेलाका विषयबस्तुहरु)" },
    { "serial_no": 6, "title": "उपभोक्ता समिति गठन गरि पठाइएको बारे (प्रतीनिधीले वडा कार्यालयलाई पेस गर्ने निवेदन )" },
]

const BUDGET_ESTIMATE_TITLES = [
    { "serial_no": 1, "title": "सम्भव्यता अध्यायन प्रतिवेदन" },
    { "serial_no": 2, "title": "नक्सा" },
    { "serial_no": 3, "title": "लागत अनुमान (लागत इष्टिमेट)" },
    { "serial_no": 4, "title": "प्राविधिक प्रतिवेदन" },
    { "serial_no": 5, "title": "निर्माण कार्य तालिका" },
    { "serial_no": 6, "title": "लागत अनुमान स्विकृती सम्बन्धी टिप्पणी आदेश" },
]

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack }) => {
    const [activeTab, setActiveTab] = useState('कार्यक्रमको विवरण');
    const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
    const [costData, setCostData] = useState<CostEstimateDetail[]>([]);
    const [isCostModalOpen, setIsCostModalOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [committeeDetail, setCommitteeDetail] = useState<any>(null);
    const [isResearchModalOpen, setIsResearchModalOpen] = useState(false);
    const [isPositionModalOpen, setIsPositionModalOpen] = useState(false);

    const researchCommitteeRows: FormRow[] = [
        { id: 1, post: 'संयोजक', full_name: '', gender: '', address: '', citizenship_no: '', contact_no: '', citizenshipCopy: '' },
        { id: 2, post: 'सदस्य सचिव', full_name: '', gender: '', address: '', citizenship_no: '', contact_no: '', citizenshipCopy: '' },
        { id: 3, post: 'सदस्य', full_name: '', gender: '', address: '', citizenship_no: '', contact_no: '', citizenshipCopy: '' },
    ];

    const positionDistributionRows: FormRow[] = [
        { id: 1, post: 'अध्यक्ष', full_name: '', gender: '', address: '', citizenship_no: '', contact_no: '', citizenshipCopy: '' },
        { id: 2, post: 'सचिव', full_name: '', gender: '', address: '', citizenship_no: '', contact_no: '', citizenshipCopy: '' },
        { id: 3, post: 'कोषाध्यक्ष', full_name: '', gender: '', address: '', citizenship_no: '', contact_no: '', citizenshipCopy: '' },
        { id: 4, post: 'सदस्य', full_name: '', gender: '', address: '', citizenship_no: '', contact_no: '', citizenshipCopy: '' },
        { id: 5, post: 'सदस्य', full_name: '', gender: '', address: '', citizenship_no: '', contact_no: '', citizenshipCopy: '' },
        { id: 6, post: 'सदस्य', full_name: '', gender: '', address: '', citizenship_no: '', contact_no: '', citizenshipCopy: '' },
        { id: 7, post: 'सदस्य', full_name: '', gender: '', address: '', citizenship_no: '', contact_no: '', citizenshipCopy: '' },
    ];


    const projectIdNum = parseInt(project?.serial_number);
    const {
        programDetails,
        initiationProcess,
        consumerCommitteeDetails,
        officialDetails,
        monitoringCommittee,
        costEstimateDetails,
        mapCostEstimate,
        projectAgreementDetails,
        documents,
        loading,
        error,
        loadProgramDetails,
        loadInitiationProcess,
        loadConsumerCommitteeDetails,
        loadCostEstimate,
        loadProjectAgreement,
        loadDocuments,
        deleteOfficialDetail,
        deleteMonitoringCommittee,
        deleteDocument,
    } = useProjectDetail(projectIdNum);

    const transformedOfficialDetails: FormRow[] = officialDetails.map((member, index) => ({
        id: index + 1,
        post: member.post,
        full_name: member.full_name,
        gender: member.gender,
        address: member.address,
        citizenship_no: member.citizenship_no,
        contact_no: member.contact_no,
        citizenshipCopy: member.citizenship_front || member.citizenship_back ? 'अपलोड गरिएको' : '',
        citizenship_front: member.citizenship_front, // You may handle this if editing upload later
        citizenship_back: member.citizenship_back,
    }));


    const tabs = [
        'कार्यक्रमको विवरण',
        'सुरुको प्रक्रिया',
        'उपभोक्ता समिति',
        'लागत अनुमान',
        'योजना सम्झौता',
        'संचालन स्थल',
        'किस्ता भुक्तानी सम्बन्धी',
        'अन्य डकुमेन्ट'
    ];

    // Load data when tab changes
    useEffect(() => {
        switch (activeTab) {
            case 'कार्यक्रमको विवरण':
                loadProgramDetails();
                break;
            case 'सुरुको प्रक्रिया':
                loadInitiationProcess();
                break;
            case 'उपभोक्ता समिति':
                loadConsumerCommitteeDetails();
                break;
            case 'लागत अनुमान':
                loadCostEstimate();
                break;
            case 'योजना सम्झौता':
                loadProjectAgreement();
                break;
            case 'अन्य डकुमेन्ट':
                loadDocuments();
                break;
            default:
                break;
        }
    }, [activeTab, projectIdNum]);

    useEffect(() => {
        if (consumerCommitteeDetails.length > 0) {
            setCommitteeDetail(consumerCommitteeDetails[0]);
        }
    }, [consumerCommitteeDetails]);

    // Assuming you have the BS library properly imported
    const today = new Date(); // current Gregorian date

    const bsDate = BS.ADToBS(today); // Convert to BS

    // Format the date with leading zeros for month and day

    const handleAdd = () => {
        setCommitteeDetail(null);
        setIsDialogOpen(true);
    };

    const handleEdit = () => {
        setIsDialogOpen(true);
    };

    const handleSave = async (data: any) => {
        try {
            const token = localStorage.getItem('access_token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            if (committeeDetail) {
                // Update existing committee
                const url = `http://localhost:8000/api/projects/${project.serial_number}/consumer-committee-details/${committeeDetail.id}/`;
                await axios.patch(url, data, config);
                toast.success("समिति विवरण सफलतापूर्वक अपडेट गरियो");
            } else {
                // Create new committee
                const url = `http://localhost:8000/api/projects/${project.serial_number}/consumer-committee-details/`;
                await axios.post(url, { ...data, project: project.serial_number }, config);
                toast.success("समिति विवरण सफलतापूर्वक थपियो");
            }


            await loadConsumerCommitteeDetails();

            setIsDialogOpen(false);
        } catch (error) {
            console.error("Failed to save committee details", error);
            // toast.error("सेभ गर्न सकिएन");
        }
    };

    const token = localStorage.getItem('access_token');

    const handleSavePosition = async (rows: FormRow[]) => {
        try {
            for (const row of rows) {
                const formData = new FormData();
                formData.append("serial_no", row.id.toString());
                formData.append("project", project.serial_number);
                formData.append("post", row.post);
                formData.append("full_name", row.full_name);
                formData.append("address", row.address);
                formData.append("gender", row.gender);
                formData.append("citizenship_no", row.citizenship_no);
                formData.append("contact_no", row.contact_no);
                if (row.citizenship_front) formData.append("citizenship_front", row.citizenship_front);
                if (row.citizenship_back) formData.append("citizenship_back", row.citizenship_back);

                await axios.post(
                    `http://localhost:8000/api/projects/${project.serial_number}/official-details/`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
            }

            alert("पदाधिकारी विवरण सफलतापूर्वक सेभ गरियो।");
        } catch (error) {
            console.error("Error saving official details:", error);
            alert("पदाधिकारी विवरण सेभ गर्न सकिएन।");
        }
    };

    const handleSaveResearch = async (rows: FormRow[]) => {
        try {
            for (const row of rows) {
                const formData = new FormData();
                formData.append("serial_no", row.id.toString());
                formData.append("project", project.serial_number);
                formData.append("post", row.post);
                formData.append("full_name", row.full_name);
                formData.append("address", row.address);
                formData.append("gender", row.gender);
                formData.append("citizenship_no", row.citizenship_no);
                formData.append("contact_no", row.contact_no);
                if (row.citizenship_front) formData.append("citizenship_front", row.citizenship_front);
                if (row.citizenship_back) formData.append("citizenship_back", row.citizenship_back);

                await axios.post(
                    `http://localhost:8000/api/projects/${project.serial_number}/monitoring-committee/`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
            }

            alert("अनुगमन तथा सहजिकरण समिति सफलतापूर्वक सेभ गरियो।");
        } catch (error) {
            console.error("Error saving monitoring committee:", error);
            alert("अनुगमन समिति सेभ गर्न सकिएन।");
        }
    };


    const handleDelete = async (id: number, type: 'official' | 'monitoring' | 'document') => {
        if (window.confirm('के तपाईं यो मेटाउन चाहनुहुन्छ?')) {
            try {
                switch (type) {
                    case 'official':
                        await deleteOfficialDetail(id);
                        break;
                    case 'monitoring':
                        await deleteMonitoringCommittee(id);
                        break;
                    case 'document':
                        await deleteDocument(id);
                        break;
                }
                toast.success("सफलतापूर्वक मेटाइयो");
            } catch (error) {
                console.error('Error deleting item:', error);
                toast.error('मेटाउन सकिएन');
            }
        }
        setDropdownOpen(null);
    };

    const LoadingSpinner = () => (
        <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">लोड गर्दै...</span>
        </div>
    );

    const EmptyState = ({ message }: { message: string }) => (
        <div className="py-12 text-center">
            <div className="flex flex-col items-center justify-center text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <p className="text-lg font-medium">{message}</p>
            </div>
        </div>
    );

    const renderTabContent = () => {
        if (error) {
            return (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600">त्रुटि: {error}</p>
                </div>
            );
        }

        switch (activeTab) {
            case 'कार्यक्रमको विवरण':
                if (loading.program) return <LoadingSpinner />;
                return (
                    <ProgramDetailsTab
                        projectData={project}
                        loading={loading.program}
                    />
                );

            case 'सुरुको प्रक्रिया':
                if (loading.initiation) return <LoadingSpinner />;
                return (
                    <InitiationProcessSection projectId={project?.id || projectIdNum} />
                );

            case 'उपभोक्ता समिति':
                if (loading.committee) return <LoadingSpinner />;

                return (
                    <div className="space-y-8">
                        {/* Consumer Committee Formation */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">उपभोक्ता समिति गठन सम्बन्धमा</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 font-medium text-gray-900">क्र.स</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900">शिर्षक</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900">मिति</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900">स्थिती</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900">अन्य</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {CONSUMER_COMMITTEE_TITLES.map((item, index) => (
                                            <tr key={item.serial_no} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-3 px-4 text-gray-900">{toNepaliNumber(item.serial_no)}</td>
                                                <td className="py-3 px-4 text-gray-900 text-sm">{item.title}</td>
                                                <td className="py-3 px-4 text-gray-900 text-sm">{toNepaliNumber(bsDate)}</td>
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
                                                        <DownloadCloud className="w-4 h-4" />
                                                    </button>
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>

                                </table>
                            </div>
                        </div>

                        {/* Consumer Committee Details */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">उपभोक्ता समितिको विवरण</h3>
                                <button
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                                    onClick={committeeDetail ? handleEdit : handleAdd}
                                >
                                    {committeeDetail ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                    <span>{committeeDetail ? 'सम्पादन गर्नुहोस्' : 'थप गर्नुहोस्'}</span>
                                </button>
                            </div>

                            {committeeDetail ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">उपभोक्ता समितिको नाम:</p>
                                        <p className="text-gray-900">{committeeDetail.consumer_committee_name || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">ठेगाना:</p>
                                        <p className="text-gray-900">{committeeDetail.address || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">उपभोक्ता समिति गठन मिति:</p>
                                        <p className="text-gray-900">{committeeDetail.formation_date || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">प्रतिनिधिको नाम:</p>
                                        <p className="text-gray-900">{committeeDetail.representative_name || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">प्रतिनिधिको पद:</p>
                                        <p className="text-gray-900">{committeeDetail.representative_position || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">सम्पर्क नं.:</p>
                                        <p className="text-gray-900">{toNepaliNumber(committeeDetail.contact_no) || '-'}</p>
                                    </div>
                                </div>
                            ) : (
                                <EmptyState message="उपभोक्ता समिति विवरण उपलब्ध छैन" />
                            )}

                            {/* Dialog Component */}
                            {isDialogOpen && (
                                <ConsumerCommitteeDialog
                                    isOpen={isDialogOpen}
                                    onClose={() => setIsDialogOpen(false)}
                                    onSave={handleSave}
                                    committeeData={committeeDetail}
                                    projectId={project.serial_number}
                                />
                            )}
                        </div>

                        {/* Committee Members Table */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">पदाधिकारीको विवरण</h3>
                                {officialDetails.length === 0 ?
                                    (<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer"
                                        onClick={() => setIsPositionModalOpen(true)}
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>नयाँ सदस्य थप्नुहोस्</span>

                                    </button>
                                    ) : (
                                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer"
                                            onClick={() => setIsPositionModalOpen(true)}
                                        >
                                            <Edit className="w-4 h-4" />
                                            <span>  सम्पादन गर्नुहोस्</span>
                                        </button>
                                    )}
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 font-medium text-gray-900">क्र.स</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900">पद</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900">नाम थर</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900">ठेगाना</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900">सम्पर्क नं.</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900">लिंग</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900">नागरिकता प्र. नं.</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900">अन्य</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {officialDetails.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="py-12 text-center">
                                                    <EmptyState message="अहिले कुनै डाटा उपलब्ध छैन।" />
                                                </td>
                                            </tr>
                                        ) : (
                                            officialDetails.map((member, index) => (
                                                <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 px-4 text-gray-900">{toNepaliNumber(index + 1)}</td>
                                                    <td className="py-3 px-4 text-gray-900">{member.post}</td>
                                                    <td className="py-3 px-4 text-gray-900">{member.full_name}</td>
                                                    <td className="py-3 px-4 text-gray-900">{member.address}</td>
                                                    <td className="py-3 px-4 text-gray-900">{toNepaliNumber(member.contact_no)}</td>
                                                    <td className="py-3 px-4 text-gray-900">{member.gender}</td>
                                                    <td className="py-3 px-4 text-gray-900">{member.citizenship_no}</td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center space-x-2">
                                                            <button
                                                                className="text-blue-600 hover:text-blue-800 cursor-pointer"
                                                                onClick={() => {/* Edit functionality */ }}
                                                            >
                                                                <FileMinusIcon className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* monitoring details */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">अनुगमन तथा सहजिकरण समिती :</h3>
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer"
                                    onClick={() => setIsResearchModalOpen(true)}
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>नयाँ सदस्य थप्नुहोस्</span>
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 font-medium text-gray-900">क्र.स</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900">पद</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900">नाम थर</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900">ठेगाना</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900">सम्पर्क नं.</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900">लिंग</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900">नागरिकता प्र. नं.</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900">अन्य</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {monitoringCommittee.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="py-12 text-center">
                                                    <EmptyState message="अहिले कुनै डाटा उपलब्ध छैन।" />
                                                </td>
                                            </tr>
                                        ) : (
                                            monitoringCommittee.map((member, index) => (
                                                <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 px-4 text-gray-900">{toNepaliNumber(index + 1)}</td>
                                                    <td className="py-3 px-4 text-gray-900">{member.position}</td>
                                                    <td className="py-3 px-4 text-gray-900">{member.name}</td>
                                                    <td className="py-3 px-4 text-gray-900">{member.address}</td>
                                                    <td className="py-3 px-4 text-gray-900">{member.contact_number}</td>
                                                    <td className="py-3 px-4 text-gray-900">{member.gender}</td>
                                                    <td className="py-3 px-4 text-gray-900">{member.citizenship_number}</td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center space-x-2">
                                                            <button
                                                                className="text-blue-600 hover:text-blue-800"
                                                                onClick={() => {/* Edit functionality */ }}
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                className="text-red-600 hover:text-red-800"
                                                                onClick={() => handleDelete(member.id, 'official')}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <Modal
                                isOpen={isPositionModalOpen}
                                onClose={() => setIsPositionModalOpen(false)}
                                title="पदाधिकारीको विवरण"
                                rows={officialDetails.length > 0 ? transformedOfficialDetails : positionDistributionRows}
                                onSave={handleSavePosition}
                            />

                            <Modal
                                isOpen={isResearchModalOpen}
                                onClose={() => setIsResearchModalOpen(false)}
                                title="अनुगमन तथा सहजिकरण समिति"
                                rows={researchCommitteeRows}
                                onSave={handleSaveResearch}
                            />


                        </div>

                    </div>
                );

            case 'लागत अनुमान':
                if (loading.cost) return <LoadingSpinner />;

                const costDetail = costEstimateDetails.find(item => item.project === project?.id);

                return (
                    <div className="space-y-8">
                        {/* Cost Estimate Documents */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">नक्सा तथा लागत अनुमान</h3>
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
                                        {BUDGET_ESTIMATE_TITLES.map((item, index) => (
                                            <tr key={item.serial_no} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-3 px-4 text-gray-900">{toNepaliNumber(item.serial_no)}</td>
                                                <td className="py-3 px-4 text-gray-900 text-sm">{item.title}</td>
                                                <td className="py-3 px-4 text-gray-900 text-sm">{toNepaliNumber(bsDate)}</td>
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
                        </div>

                        {/* Cost Summary */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">लागत अनुमान तथा अन्य विवरण</h3>
                                <button
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                                    onClick={() => setIsCostModalOpen(true)}
                                >
                                    <Edit className="w-4 h-4" />
                                    <span>इडिट गर्नुहोस्</span>
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">लागत अनुमान:</p>
                                    <p className="text-lg font-semibold">{formatBudget(costDetail?.estimated_cost)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">कन्टिन्जेन्सी प्रतिशत:</p>
                                    <p className="text-lg font-semibold">{costDetail?.contingency_percent || '0'}%</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">कन्टिन्जेन्सी रकम:</p>
                                    <p className="text-lg font-semibold">{formatBudget(costDetail?.contingency_amount)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">कुल लागत अनुमान:</p>
                                    <p className="text-lg font-semibold">{formatBudget(costDetail?.total_estimated_cost)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'योजना सम्झौता':
                if (loading.agreement) return <LoadingSpinner />;

                const agreementDetail = projectAgreementDetails[0];

                return (
                    <div className="space-y-8">
                        {/* Project Agreement Details */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">योजना सम्झौता विवरण</h3>
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                                    <Edit className="w-4 h-4" />
                                    <span>इडिट गर्नुहोस्</span>
                                </button>
                            </div>
                            {!agreementDetail ? (
                                <EmptyState message="योजना सम्झौता विवरण उपलब्ध छैन।" />
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">स्वीकृत लागत अनुमान:</p>
                                        <p className="text-lg font-semibold">{formatBudget(agreementDetail.approved_cost_estimate)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">कन्टिन्जेन्सी प्रतिशत:</p>
                                        <p className="text-lg font-semibold">{agreementDetail.contingency_percentage || '0'}%</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">कन्टिन्जेन्सी रकम:</p>
                                        <p className="text-lg font-semibold">{formatBudget(agreementDetail.contingency_amount)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">कुल लागत अनुमान:</p>
                                        <p className="text-lg font-semibold">{formatBudget(agreementDetail.total_cost_estimate)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">सम्झौता रकम:</p>
                                        <p className="text-lg font-semibold">{formatBudget(agreementDetail.agreement_amount)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">सम्झौता मिति:</p>
                                        <p className="text-lg font-semibold">{agreementDetail.agreement_date || 'N/A'}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'अन्य डकुमेन्ट':
                if (loading.documents) return <LoadingSpinner />;

                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">अन्य डकुमेन्ट</h3>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                                <Plus className="w-4 h-4" />
                                <span>नयाँ डकुमेन्ट थप्नुहोस्</span>
                            </button>
                        </div>

                        {documents.length === 0 ? (
                            <EmptyState message="अन्य डकुमेन्ट उपलब्ध छैन।" />
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 font-medium text-gray-900">क्र.स.</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900">शीर्षक</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900">प्रकार</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900">मिति</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900">अन्य</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {documents.map((item, index) => (
                                            <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-3 px-4 text-gray-900">{toNepaliNumber(index + 1)}</td>
                                                <td className="py-3 px-4 text-gray-900">{item.title}</td>
                                                <td className="py-3 px-4 text-gray-900">{item.document_type}</td>
                                                <td className="py-3 px-4 text-gray-900">{item.date}</td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center space-x-2">
                                                        <button className="text-blue-600 hover:text-blue-800">
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button className="text-blue-600 hover:text-blue-800">
                                                            <Download className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            className="text-red-600 hover:text-red-800"
                                                            onClick={() => handleDelete(item.id, 'document')}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                );

            default:
                return <EmptyState message="यो खण्डमा अहिले कुनै डाटा उपलब्ध छैन।" />;
        }
    };

    return (
        <main className="flex-1 p-6">
            {/* Breadcrumb */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <button onClick={onBack} className="flex items-center space-x-1 hover:text-gray-900 cursor-pointer">
                        <ChevronLeft className="w-4 h-4" />
                        <span>पछि जानुहोस्</span>
                    </button>
                    <div className="flex items-center space-x-2">
                        <Home className="w-4 h-4" />
                        <span>गृहपृष्ठ</span>
                        <ChevronRight className="w-3 h-3" />
                        <span>परियोजनाहरू</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-gray-900 font-medium">{activeTab}</span>
                    </div>
                </div>
                <div className="text-sm text-gray-600">
                    <span className="text-gray-900 font-medium">परियोजना ID: {project.serial_number}</span>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">परियोजना विवरण</h1>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                    <div className="flex space-x-8 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-3 cursor-pointer px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === tab
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <CostEstimateModal
                    isOpen={isCostModalOpen}
                    onClose={() => setIsCostModalOpen(false)}
                    costData={costEstimateDetails}
                    onSave={() => {
                        loadCostEstimate();
                        setIsCostModalOpen(false);
                    }}
                    projectId={project.serial_number}
                />

                {/* Tab Content */}
                {renderTabContent()}
            </div>
        </main>
    );
};

export default ProjectDetail;