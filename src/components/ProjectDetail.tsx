// import React, { useState, useEffect } from 'react';
// import { ChevronLeft, Home, ChevronRight, Edit, Download, Copy, MoreHorizontal, Plus, Trash2, Upload, DownloadCloud, View, Notebook, ImageDown, Dock, File, FileMinus2, FileMinusIcon, FileCheck2, FileCheck, FileSearch, FileText } from 'lucide-react';
// import { useProjectDetail } from '../hooks/useProjectDetail';
// import { formatBudget, formatWardNumber, toNepaliNumber } from '../utils/formatters';
// import ProgramDetailsTab from '../components/projectdetailssubtab/ProgramDetailTab';
// import CostEstimateModal from '../modals/CostEstimateModal';
// import type { CostEstimateDetail } from '../types/projectDetail';
// import InitiationProcessSection from '../modals/InitiationProcessSections';
// import ConsumerCommitteeDialog from '../modals/ConsumerCommitteeDialog';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import * as BS from 'bikram-sambat-js';
// import Modal from '../modals/AddOfficialDetailandMonitoringModal';
// import PaymentInstallment from './PaymentInstallment/PaymentInstallment';
// import ProjectAgreementModal from '../modals/ProjectAgreementModal';
// import AddDocumentModal from '../modals/AddDocumentModal';
// import OperationSiteUploadModal from '../modals/UploadSiteModal';
// import AddAuthenticationFileModal from '../modals/AddAuthenticationFileModal';
// import AuthenticationModal from '../modals/AuthenticationModal';
// import CalculateCostEstimateModal from '../modals/CalculateCostEstimateModal';
// import WorkTypeModal from '../modals/SetWorkTypeModal';
// import WorkInProgressModal from '../modals/WorkInProgressModal';

// interface FormRow {
//     id: number;
//     post: string;
//     full_name: string;
//     gender: string;
//     address: string;
//     citizenship_no: string;
//     contact_no: string;
//     citizenshipCopy: string;
//     citizenship_front?: File | null;
//     citizenship_back?: File | null;
// }

// interface ProjectDetailProps {
//     project: any;
//     onBack: () => void;
// }
// const CONSUMER_COMMITTEE_TITLES = [
//     { "serial_no": 1, "title": "योजना संचालन पुस्तिका विवरण पृष्ट" },
//     { "serial_no": 2, "title": "उपभोक्ता समिति गठन विधि एवं प्रकृया" },
//     { "serial_no": 3, "title": "उपभोत्ता समिति गठन गर्ने सम्बन्धी सुचना" },
//     { "serial_no": 4, "title": "उपभोत्ता समितिको काम कर्तव्य र अधिकारको विवरण" },
//     { "serial_no": 5, "title": "आम भेलाको माईनियुट (उपभोक्ता समिति गठन गर्दा छलफल तथा भेलाका विषयबस्तुहरु)" },
//     { "serial_no": 6, "title": "उपभोक्ता समिति गठन गरि पठाइएको बारे (प्रतीनिधीले वडा कार्यालयलाई पेस गर्ने निवेदन )" },
// ]

// const BUDGET_ESTIMATE_TITLES = [
//     { "serial_no": 1, "title": "सम्भव्यता अध्यायन प्रतिवेदन" },
//     { "serial_no": 2, "title": "नक्सा" },
//     { "serial_no": 3, "title": "लागत अनुमान (लागत इष्टिमेट)" },
//     { "serial_no": 4, "title": "प्राविधिक प्रतिवेदन" },
//     { "serial_no": 5, "title": "निर्माण कार्य तालिका" },
//     { "serial_no": 6, "title": "लागत अनुमान स्विकृती सम्बन्धी टिप्पणी आदेश" },
// ]

// const PROJECT_AGREEMENT_TITLES = [
//     { "serial_no": 1, "title": "उपभोक्ता समिति बैठक र निर्णय", "description": "(खाता संन्चलन,योजना सम्झौता एवं अन्य अख्तियारी सम्बन्ध्मा)" },
//     { "serial_no": 2, "title": "उपभोक्ता समितिले सम्झौता सिफारिसका लागी वडामा दिने निवेदन", "description": "(वडाबाट महानगरपालिकामा सिफारिस गरिदिन)" },
//     { "serial_no": 3, "title": "योजना संचालन स्थलको फोटो - ४ प्रति", "description": "(कामगर्नु पुर्वको फोटो)" },
//     { "serial_no": 4, "title": "नयाँ बैंक खाता सञ्चालन सिफारिस का लागि उपभोक्ता समितिले पेस गर्ने निवेदन" },
//     { "serial_no": 5, "title": "वडा कार्यलयले महानगरपालिकालाई सम्झौताका लागी दिने सिफारिस", "description": "(नोट: वडाबाट सम्झौता हुने योजनालाई आवश्यक नभएको )" },
//     { "serial_no": 6, "title": "उपभोक्ता सम्झौता सम्बन्धी टिप्पणी (उपभोक्ता समितिसँग सम्झौता गर्न सिफारिस सम्बन्धी टिप्पणी)" },
//     { "serial_no": 7, "title": "उपभोक्ता समितिलाई कार्यादेश दिने सम्बन्धी टिप्पणी वा निर्णय" }
// ]

// const PROJECT_AGREEMENT_WORK_TITLES = [
//     { "serial_no": 1, "title": "योजना सम्झौता टिप्पणी र आदेश" },
//     { "serial_no": 2, "title": "योजना/कार्यक्रम सम्झौताको लागि सम्झौता फाराम" },
//     { "serial_no": 3, "title": "आयोजना सन्चालन कार्यादेश" },
//     { "serial_no": 4, "title": "आयोजना सूचना पाटी को नमुना" },
// ]

// const LOCATION_DETAILS_TTTLES = [
//     { "serial_no": 1, "title": "निर्माण कार्य गर्नु पुर्वको फोटोहरु" },
//     { "serial_no": 2, "title": "योजनाको निर्माण कार्य भैरहेको अवस्थाको फोटोहरु" },
//     { "serial_no": 3, "title": "योजनाको निर्माण कार्य सकिएपछीका फोटोहरु" }
// ]

// const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack }) => {
//     const [activeTab, setActiveTab] = useState('कार्यक्रमको विवरण');
//     const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
//     const [costData, setCostData] = useState<CostEstimateDetail[]>([]);
//     const [isCostModalOpen, setIsCostModalOpen] = useState(false);
//     const [isDialogOpen, setIsDialogOpen] = useState(false);
//     const [isCostEstimateModalOpen, setIsCostEstimateModalOpen] = useState(false);
//     const [isSetWorkTypeModalOpen, setIsSetWorkTypeModalOpen] = useState(false);
//     const [isSetWorkInProgressOpen, setIsSetWorkInProgressOpen] = useState(false);
//     const [committeeDetail, setCommitteeDetail] = useState<any>(null);
//     const [agreementDetail, setAgreementDetail] = useState<any>(null);
//     const [operationLocationDetails, setOperationLocationDetails] = useState<any>(null);
//     const [isResearchModalOpen, setIsResearchModalOpen] = useState(false);
//     const [isPositionModalOpen, setIsPositionModalOpen] = useState(false);
//     const [isProjectAgreementModalOpen, setIsProjectAgreementModalOpen] = useState(false);
//     const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
//     const [documentDetail, setDocumentDetail] = useState<any>(null);
//     const [showLocationModal, setShowLocationModal] = useState(false);
//     const [selectedSerialNo, setSelectedSerialNo] = useState<number | null>(null);
//     const [isAuthenticationFileModalOpen, setAuthenticationFileModalOpen] = useState(false);
//     const [isAuthenticationModalOpen, setAuthenticationModalOpen] = useState(false);
//     const [editMapCostId, setEditMapCostId] = useState<number | null>(null);
//     const [mapCostDetails, setMapCostDetails] = useState<any>(null);
//     const [selectedMapCostItem, setSelectedMapCostItem] = useState<any>(null);

//     const researchCommitteeRows: FormRow[] = [
//         { id: 1, post: 'संयोजक', full_name: '', gender: '', address: '', citizenship_no: '', contact_no: '', citizenshipCopy: '' },
//         { id: 2, post: 'सदस्य सचिव', full_name: '', gender: '', address: '', citizenship_no: '', contact_no: '', citizenshipCopy: '' },
//         { id: 3, post: 'सदस्य', full_name: '', gender: '', address: '', citizenship_no: '', contact_no: '', citizenshipCopy: '' },
//     ];

//     const positionDistributionRows: FormRow[] = [
//         { id: 31, post: 'अध्यक्ष', full_name: '', gender: '', address: '', citizenship_no: '', contact_no: '', citizenshipCopy: '' },
//         { id: 32, post: 'सचिव', full_name: '', gender: '', address: '', citizenship_no: '', contact_no: '', citizenshipCopy: '' },
//         { id: 33, post: 'कोषाध्यक्ष', full_name: '', gender: '', address: '', citizenship_no: '', contact_no: '', citizenshipCopy: '' },
//         { id: 34, post: 'सदस्य', full_name: '', gender: '', address: '', citizenship_no: '', contact_no: '', citizenshipCopy: '' },
//         { id: 35, post: 'सदस्य', full_name: '', gender: '', address: '', citizenship_no: '', contact_no: '', citizenshipCopy: '' },
//         { id: 36, post: 'सदस्य', full_name: '', gender: '', address: '', citizenship_no: '', contact_no: '', citizenshipCopy: '' },
//         { id: 37, post: 'सदस्य', full_name: '', gender: '', address: '', citizenship_no: '', contact_no: '', citizenshipCopy: '' },
//     ];


//     const projectIdNum = parseInt(project?.serial_number);
//     const {
//         programDetails,
//         initiationProcess,
//         consumerCommitteeDetails,
//         officialDetails,
//         monitoringCommittee,
//         costEstimateDetails,
//         mapCostEstimate,
//         calculateCostEstimateDetails,
//         workType,
//         workInProgress,
//         projectAgreementDetails,
//         documents,
//         otherdocuments,
//         operationLocation,
//         loading,
//         error,
//         loadProgramDetails,
//         loadInitiationProcess,
//         loadConsumerCommitteeDetails,
//         loadCostEstimate,
//         loadProjectAgreement,
//         loadDocuments,
//         loadOtherDocuments,
//         loadOperationDetails,
//         deleteOfficialDetail,
//         deleteMonitoringCommittee,
//         deleteDocument,
//     } = useProjectDetail(projectIdNum);
//     const [calculatedEstimate, setCalculatedEstimate] = useState(null);
//     const [workTypeDets, setWorkTypeDets] = useState(null);
//     const [workInProgressDets, setWorkInProgressDets] = useState(null);
//     const [loadingEstimate, setLoadingEstimate] = useState(false);


//     const transformedOfficialDetails: FormRow[] = officialDetails.map((member) => ({
//         // id: index + 1,
//         id: member.id,
//         post: member.post,
//         full_name: member.full_name,
//         gender: member.gender,
//         address: member.address,
//         citizenship_no: member.citizenship_no,
//         contact_no: member.contact_no,
//         citizenshipCopy: member.citizenship_front || member.citizenship_back ? 'अपलोड गरिएको' : '',
//         citizenship_front: member.citizenship_front, // You may handle this if editing upload later
//         citizenship_back: member.citizenship_back,
//     }));

//     const transformedMonitoringDetails: FormRow[] = monitoringCommittee.map((member) => ({
//         // id: index + 1,
//         id: member.id,
//         post: member.post,
//         full_name: member.full_name,
//         gender: member.gender,
//         address: member.address,
//         citizenship_no: member.citizenship_no,
//         contact_no: member.contact_no,
//         citizenshipCopy: member.citizenship_front || member.citizenship_back ? 'अपलोड गरिएको' : '',
//         citizenship_front: member.citizenship_front, // You may handle this if editing upload later
//         citizenship_back: member.citizenship_back,
//     }));


//     const tabs = [
//         'कार्यक्रमको विवरण',
//         'सुरुको प्रक्रिया',
//         'उपभोक्ता समिति',
//         'लागत अनुमान',
//         'योजना सम्झौता',
//         'संचालन स्थल',
//         'किस्ता भुक्तानी सम्बन्धी',
//         'अन्य डकुमेन्ट'
//     ];

//     // Load data when tab changes
//     useEffect(() => {
//         switch (activeTab) {
//             case 'कार्यक्रमको विवरण':
//                 loadProgramDetails();
//                 break;
//             case 'सुरुको प्रक्रिया':
//                 loadInitiationProcess();
//                 break;
//             case 'उपभोक्ता समिति':
//                 loadConsumerCommitteeDetails();
//                 break;
//             case 'लागत अनुमान':
//                 loadCostEstimate();
//                 break;
//             case 'योजना सम्झौता':
//                 loadProjectAgreement();
//                 break;
//             case 'संचालन स्थल':
//                 loadOperationDetails();
//                 break;
//             case 'अन्य डकुमेन्ट':
//                 loadDocuments();
//                 loadOtherDocuments();
//                 break;
//             default:
//                 break;
//         }
//     }, [activeTab, projectIdNum]);

//     useEffect(() => {
//         if (consumerCommitteeDetails.length > 0) {
//             setCommitteeDetail(consumerCommitteeDetails[0]);
//         }
//     }, [consumerCommitteeDetails]);

//     useEffect(() => {
//         if (otherdocuments.length > 0) {
//             setDocumentDetail(otherdocuments[0]);
//         }
//     }, [otherdocuments]);

//     useEffect(() => {
//         if (projectAgreementDetails.length > 0) {
//             setAgreementDetail(projectAgreementDetails[0]);
//         }
//     }, [projectAgreementDetails]);

//     useEffect(() => {
//         if (mapCostEstimate.length > 0) {
//             setMapCostDetails(mapCostEstimate[0]);
//         }
//     }, [mapCostEstimate]);

//     useEffect(() => {
//         if (calculateCostEstimateDetails.length > 0) {
//             setCalculatedEstimate(calculateCostEstimateDetails[0]);
//         }
//     }, [calculateCostEstimateDetails]);

//     useEffect(() => {
//         if (workType.length > 0) {
//             setWorkTypeDets(workType[0]);
//         }
//     }, [workType]);

//     useEffect(() => {
//         if (workInProgress.length > 0) {
//             setWorkInProgressDets(workInProgress[0]);
//         }
//     }, [workInProgress]);
//     // Assuming you have the BS library properly imported
//     const today = new Date(); // current Gregorian date

//     const bsDate = BS.ADToBS(today); // Convert to BS

//     // Format the date with leading zeros for month and day

//     const handleAdd = () => {
//         setCommitteeDetail(null);
//         setIsDialogOpen(true);
//     };

//     const handleEdit = () => {
//         setIsDialogOpen(true);
//     };

//     const handleSave = async (data: any) => {
//         try {
//             const token = localStorage.getItem('access_token');
//             const config = {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 }
//             };

//             if (committeeDetail) {
//                 // Update existing committee
//                 const url = `http://localhost:8000/api/projects/${project.serial_number}/consumer-committee-details/${committeeDetail.id}/`;
//                 await axios.patch(url, data, config);
//                 toast.success("समिति विवरण सफलतापूर्वक अपडेट गरियो");
//             } else {
//                 // Create new committee
//                 const url = `http://localhost:8000/api/projects/${project.serial_number}/consumer-committee-details/`;
//                 await axios.post(url, { ...data, project: project.serial_number }, config);
//                 toast.success("समिति विवरण सफलतापूर्वक थपियो");
//             }


//             await loadConsumerCommitteeDetails();

//             setIsDialogOpen(false);
//         } catch (error) {
//             console.error("Failed to save committee details", error);
//             // toast.error("सेभ गर्न सकिएन");
//         }
//     };

//     const token = localStorage.getItem('access_token');

//     const handleSavePosition = async (rows: FormRow[]) => {
//         try {
//             const token = localStorage.getItem('access_token');
//             if (!token) {
//                 throw new Error('Authentication token not found');
//             }

//             const officialDetailsArray = Array.isArray(officialDetails) ? officialDetails : [officialDetails];
//             console.log("officialDetails raw from backend:", officialDetails);
//             console.log("transformed rows:", rows);

//             // Filter only rows with matching IDs (i.e., update only existing ones)
//             const rowsToUpdate = rows.filter(row =>
//                 officialDetailsArray.some(detail => detail.id === row.id)
//             );
//             console.log("rows:", rows); // from UI
//             console.log("officialDetailsArray:", officialDetailsArray);
//             console.log("rowsToUpdate:", rowsToUpdate);

//             rows.forEach(row => {
//                 officialDetailsArray.forEach(detail => {
//                     console.log(`Comparing row.id ${row.id} with detail.id ${detail.id}`);
//                 });
//             });


//             const updatePromises = rowsToUpdate.map(async (row) => {
//                 const formData = new FormData();
//                 formData.append("project", project.serial_number);
//                 formData.append("post", row.post);
//                 formData.append("full_name", row.full_name);
//                 formData.append("address", row.address);
//                 formData.append("gender", row.gender);
//                 formData.append("citizenship_no", row.citizenship_no);
//                 formData.append("contact_no", row.contact_no);

//                 if (row.citizenship_front && typeof row.citizenship_front === 'object') {
//                     formData.append("citizenship_front", row.citizenship_front);
//                 }
//                 if (row.citizenship_back && typeof row.citizenship_back === 'object') {
//                     formData.append("citizenship_back", row.citizenship_back);
//                 }

//                 const matchedDetail = officialDetailsArray.find(detail => detail.id === row.id);
//                 const url = `http://localhost:8000/api/projects/${project.serial_number}/official-details/${matchedDetail.id}/`;

//                 return axios.patch(url, formData, {
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                         'Content-Type': 'multipart/form-data',
//                     },
//                 });
//             });

//             await Promise.all(updatePromises);
//             await loadConsumerCommitteeDetails();
//             toast.success("पदाधिकारी विवरण सफलतापूर्वक अपडेट गरियो।");
//         } catch (error) {
//             console.error("Error saving official details:", error);
//             toast.error("पदाधिकारी विवरण अपडेट गर्न सकिएन।");
//         }
//     };


//     // const handleSaveResearch = async (rows: FormRow[]) => {
//     //     try {
//     //         for (const row of rows) {
//     //             const formData = new FormData();
//     //             formData.append("serial_no", row.id.toString());
//     //             formData.append("project", project.serial_number);
//     //             formData.append("post", row.post);
//     //             formData.append("full_name", row.full_name);
//     //             formData.append("address", row.address);
//     //             formData.append("gender", row.gender);
//     //             formData.append("citizenship_no", row.citizenship_no);
//     //             formData.append("contact_no", row.contact_no);
//     //             if (row.citizenship_front) formData.append("citizenship_front", row.citizenship_front);
//     //             if (row.citizenship_back) formData.append("citizenship_back", row.citizenship_back);

//     //             // await axios.post(
//     //             //     `http://localhost:8000/api/projects/${project.serial_number}/monitoring-committee/`,
//     //             //     formData,
//     //             //     {
//     //             //         headers: {
//     //             //             Authorization: `Bearer ${token}`,
//     //             //             'Content-Type': 'multipart/form-data',
//     //             //         },
//     //             //     }
//     //             // );

//     //             await axios.patch(
//     //                 `http://localhost:8000/api/projects/${project.serial_number}/monitoring-committee/${row.id}/`,
//     //                 formData,
//     //                 {
//     //                     headers: {
//     //                         Authorization: `Bearer ${token}`,
//     //                         'Content-Type': 'multipart/form-data',
//     //                     },
//     //                 }
//     //             );

//     //         }

//     //         alert("अनुगमन तथा सहजिकरण समिति सफलतापूर्वक सेभ गरियो।");
//     //     } catch (error) {
//     //         console.error("Error saving monitoring committee:", error);
//     //         alert("अनुगमन समिति सेभ गर्न सकिएन।");
//     //     }
//     // };
// const handleSaveResearch = async (rows: FormRow[]) => {
//     try {
//         const token = localStorage.getItem('access_token');
//         if (!token) {
//             throw new Error('Authentication token not found');
//         }

//         const monitoringDetailsArray = Array.isArray(monitoringCommittee) ? monitoringCommittee : [monitoringCommittee];

//         console.log("monitoringCommittee raw from backend:", monitoringCommittee);
//         console.log("transformed rows from UI:", rows);

//         // Match existing rows by ID
//         const rowsToUpdate = rows.filter(row =>
//             monitoringDetailsArray.some(detail => detail.id === row.id)
//         );

//         console.log("rowsToUpdate:", rowsToUpdate);

//         const updatePromises = rowsToUpdate.map(async (row) => {
//             const formData = new FormData();
//             const matchedDetail = monitoringDetailsArray.find(detail => detail.id === row.id);
            
//             // Use the existing serial_no from the matched detail
//             formData.append("project", project.serial_number);
//             formData.append("serial_no", matchedDetail.serial_no.toString()); // Use matchedDetail.serial_no instead of row.id
//             formData.append("post", row.post);
//             formData.append("full_name", row.full_name || '');
//             formData.append("address", row.address || '');
//             formData.append("gender", row.gender || '');
//             formData.append("citizenship_no", row.citizenship_no || '');
//             formData.append("contact_no", row.contact_no || '');

//             if (row.citizenship_front && typeof row.citizenship_front === 'object') {
//                 formData.append("citizenship_front", row.citizenship_front);
//             }

//             if (row.citizenship_back && typeof row.citizenship_back === 'object') {
//                 formData.append("citizenship_back", row.citizenship_back);
//             }

//             const url = `http://localhost:8000/api/projects/${project.serial_number}/monitoring-committee/${matchedDetail.id}/`;

//             return axios.patch(url, formData, {
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });
//         });

//         await Promise.all(updatePromises);
//         await loadConsumerCommitteeDetails(); 
//         toast.success("अनुगमन तथा सहजिकरण समिति सफलतापूर्वक अपडेट गरियो।");
//     } catch (error) {
//         console.error("Error saving monitoring committee:", error);
//         toast.error("अनुगमन समिति सेभ गर्न सकिएन।");
//     }
// };

//     const handleFileUpload = async (data: any) => {
//         try {
//             const token = localStorage.getItem('access_token');
//             const formData = new FormData();

//             // Get the title from the selected map cost item
//             const titleToSend = selectedMapCostItem?.title || data.title;
//             formData.append('title', titleToSend);

//             if (data.file) {
//                 formData.append('file', data.file);
//             }

//             if (data.remarks) {
//                 formData.append('remarks', data.remarks);
//             }

//             let url = `http://localhost:8000/api/projects/${projectIdNum}/map-cost-estimate/`;
//             let method = 'post';

//             if (editMapCostId) {
//                 url = `http://localhost:8000/api/projects/${projectIdNum}/map-cost-estimate/${editMapCostId}/`;
//                 method = 'patch';
//             }

//             const response = await axios({
//                 url,
//                 method,
//                 data: formData,
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'multipart/form-data'
//                 }
//             });

//             toast.success(editMapCostId ? 'फाइल अपलोड सम्पादन भयो' : 'फाइल अपलोड सफलतापूर्वक थपियो');

//             // Refresh map cost estimate details
//             await loadCostEstimate();

//             setAuthenticationFileModalOpen(false);
//             setEditMapCostId(null);
//             setSelectedMapCostItem(null);
//         } catch (error) {
//             console.error('File upload failed:', error);
//             toast.error('फाइल अपलोड गर्न सकिएन');
//         }
//     };

//     const handleSendAuthentication = async (data: any) => {
//         console.log('Authentication sent successfully!');
//         toast.success('प्रमाणीकरण सफलतापूर्वक पठाइयो');
//         setAuthenticationModalOpen(false);
//         // Refresh data if needed
//         await loadCostEstimate();
//     };

//     const handleDownload = async (itemSerialNo: number, projectSerialNo: number) => {
//         try {
//             const response = await axios.get(
//                 `http://localhost:8000/api/projects/consumer-committee/generate-pdf/${itemSerialNo}/${projectSerialNo}/`,
//                 {
//                     responseType: 'blob', // Important to handle PDF blobs
//                 }
//             );

//             // Create a blob URL and trigger download
//             const blob = new Blob([response.data], { type: 'application/pdf' });
//             const url = window.URL.createObjectURL(blob);
//             const link = document.createElement('a');
//             link.href = url;
//             link.setAttribute('download', `committee-template-${itemSerialNo}.pdf`);
//             document.body.appendChild(link);
//             link.click();
//             link.remove();
//         } catch (error) {
//             console.error('PDF download failed:', error);
//             alert('डाउनलोड गर्न समस्या भयो।');
//         }
//     };

//     const handleDownloadProjectAgreement = async (itemSerialNo: number, projectSerialNo: number) => {
//         try {
//             const response = await axios.get(
//                 `http://localhost:8000/api/projects/project-plan-tracker/download/${itemSerialNo}/${projectSerialNo}/`,
//                 {
//                     responseType: 'blob', // Important to handle PDF blobs
//                 }
//             );

//             // Create a blob URL and trigger download
//             const blob = new Blob([response.data], { type: 'application/pdf' });
//             const url = window.URL.createObjectURL(blob);
//             const link = document.createElement('a');
//             link.href = url;
//             link.setAttribute('download', `project-agreement-template-${itemSerialNo}.pdf`);
//             document.body.appendChild(link);
//             link.click();
//             link.remove();
//         } catch (error) {
//             console.error('PDF download failed:', error);
//             alert('डाउनलोड गर्न समस्या भयो।');
//         }
//     };

//     const handleDownloadProjectAgreementAndWorkLoad = async (itemSerialNo: number, projectSerialNo: number) => {
//         try {
//             const response = await axios.get(
//                 `http://localhost:8000/api/projects/project-aggrement/download/${itemSerialNo}/${projectSerialNo}/`,
//                 {
//                     responseType: 'blob', // Important to handle PDF blobs
//                 }
//             );

//             // Create a blob URL and trigger download
//             const blob = new Blob([response.data], { type: 'application/pdf' });
//             const url = window.URL.createObjectURL(blob);
//             const link = document.createElement('a');
//             link.href = url;
//             link.setAttribute('download', `project-agreement-template-${itemSerialNo}.pdf`);
//             document.body.appendChild(link);
//             link.click();
//             link.remove();
//         } catch (error) {
//             console.error('PDF download failed:', error);
//             alert('डाउनलोड गर्न समस्या भयो।');
//         }
//     };

//     const handleAddProjectAgreement = async (data: any) => {
//         try {
//             const token = localStorage.getItem('access_token');
//             const config = {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 }
//             };

//             if (agreementDetail) {
//                 // Update existing committee
//                 const url = `http://localhost:8000/api/projects/${project.serial_number}/project-agreement-details/${agreementDetail.id}/`;
//                 await axios.patch(url, data, config);
//                 toast.success("समिति विवरण सफलतापूर्वक अपडेट गरियो");
//             } else {
//                 // Create new committee
//                 const url = `http://localhost:8000/api/projects/${project.serial_number}/project-agreement-details/`;
//                 await axios.post(url, { ...data, project: project.serial_number }, config);
//                 toast.success("समिति विवरण सफलतापूर्वक थपियो");
//             }


//             await loadProjectAgreement();

//             setIsDialogOpen(false);
//         } catch (error) {
//             console.error("Failed to save committee details", error);
//             // toast.error("सेभ गर्न सकिएन");
//         }
//     }

//     const handleDownloadOtherDocument = async (itemSerialNo: number, projectSerialNo: number) => {
//         try {
//             const response = await axios.get(
//                 `http://localhost:8000/api/projects/other-documents/download/${itemSerialNo}/${projectSerialNo}/`,
//                 {
//                     responseType: 'blob', // Important to handle PDF blobs
//                 }
//             );

//             // Create a blob URL and trigger download
//             const blob = new Blob([response.data], { type: 'application/pdf' });
//             const url = window.URL.createObjectURL(blob);
//             const link = document.createElement('a');
//             link.href = url;
//             link.setAttribute('download', `other-document-template-${itemSerialNo}.pdf`);
//             document.body.appendChild(link);
//             link.click();
//             link.remove();
//         } catch (error) {
//             console.error('PDF download failed:', error);
//             alert('डाउनलोड गर्न समस्या भयो।');
//         }
//     }

//     const handleAddDocument = async (formPayload: FormData) => {
//         try {
//             const token = localStorage.getItem('access_token');
//             const config = {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     'Content-Type': 'multipart/form-data',
//                 }
//             };

//             const url = `http://localhost:8000/api/projects/${project.serial_number}/documents/`;
//             await axios.post(url, formPayload, config);

//             toast.success("डकुमेन्ट सफलतापूर्वक अपलोड भयो।");
//             await loadOtherDocuments();
//             setIsDocumentModalOpen(false);

//         } catch (error) {
//             console.error("Failed to save document", error);
//             toast.error("डकुमेन्ट सेभ गर्न असफल भयो।");
//         }
//     };

//     const handleEditDocument = async (data: any) => {
//         try {
//             const token = localStorage.getItem('access_token');
//             const config = {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     'Content-Type': 'multipart/form-data',
//                 },
//             };

//             const formData = new FormData();
//             formData.append('title', data.title);
//             formData.append('description', data.description || '');
//             if (data.file) {
//                 formData.append('file', data.file); // only append if updated
//             }

//             const url = `http://localhost:8000/api/projects/${project.serial_number}/documents/${documentDetail.id}/`;
//             await axios.patch(url, formData, config);

//             toast.success("डकुमेन्ट सफलतापूर्वक सम्पादन भयो");
//             await loadOtherDocuments();
//             setIsDocumentModalOpen(false);
//             setDocumentDetail(null);
//         } catch (error) {
//             console.error("अपडेट गर्न असफल", error);
//             toast.error("अपडेट गर्न असफल भयो");
//         }
//     };

//     const handleDeleteDocument = async (id: number) => {
//         try {
//             const token = localStorage.getItem('access_token');
//             const res = axios.delete(`http://localhost:8000/api/projects/${project.serial_number}/documents/${id}/`,
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${token}`
//                     }
//                 }
//             )
//             await loadOtherDocuments();
//             toast.success('सफलतापूर्वक मेटाइयो')
//         } catch (error) {
//             console.error('error deleting')
//         }
//     }

//     const handleSaveDocument = (data: any) => {
//         if (documentDetail) {
//             handleEditDocument(data);
//         } else {
//             handleAddDocument(data);
//         }
//     };

//     const handleDelete = async (id: number, type: 'official' | 'monitoring' | 'document') => {
//         if (window.confirm('के तपाईं यो मेटाउन चाहनुहुन्छ?')) {
//             try {
//                 switch (type) {
//                     case 'official':
//                         await deleteOfficialDetail(id);
//                         break;
//                     case 'monitoring':
//                         await deleteMonitoringCommittee(id);
//                         break;
//                     case 'document':
//                         await deleteDocument(id);
//                         break;
//                 }
//                 toast.success("सफलतापूर्वक मेटाइयो");
//             } catch (error) {
//                 console.error('Error deleting item:', error);
//                 toast.error('मेटाउन सकिएन');
//             }
//         }
//         setDropdownOpen(null);
//     };




//     const LoadingSpinner = () => (
//         <div className="flex items-center justify-center py-12">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//             <span className="ml-2">लोड गर्दै...</span>
//         </div>
//     );

//     const EmptyState = ({ message }: { message: string }) => (
//         <div className="py-12 text-center">
//             <div className="flex flex-col items-center justify-center text-gray-500">
//                 <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//                     <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                     </svg>
//                 </div>
//                 <p className="text-lg font-medium">{message}</p>
//             </div>
//         </div>
//     );

//     const handleGenerateBill = async (projectId: number) => {
//         try {
//             const response = await fetch(`http://127.0.0.1:8000/api/projects/bill/project/${projectId}/pdf/`, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/pdf',
//                 },
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to generate bill PDF');
//             }

//             const blob = await response.blob();
//             const url = window.URL.createObjectURL(blob);
//             const a = document.createElement('a');
//             a.href = url;
//             a.download = `bill_project_${projectId}.pdf`;
//             document.body.appendChild(a);
//             a.click();
//             a.remove();
//             window.URL.revokeObjectURL(url);
//         } catch (error) {
//             console.error('Error generating bill PDF:', error);
//             alert('बिल डाउनलोड गर्न असफल भयो। कृपया पुनः प्रयास गर्नुहोस्।');
//         }
//     };


//     const renderTabContent = () => {
//         if (error) {
//             return (
//                 <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
//                     <p className="text-red-600">त्रुटि: {error}</p>
//                 </div>
//             );
//         }

//         switch (activeTab) {
//             case 'कार्यक्रमको विवरण':
//                 if (loading.program) return <LoadingSpinner />;
//                 return (
//                     <ProgramDetailsTab
//                         projectData={project}
//                         loading={loading.program}
//                     />
//                 );

//             case 'सुरुको प्रक्रिया':
//                 if (loading.initiation) return <LoadingSpinner />;
//                 return (
//                     <InitiationProcessSection projectId={project?.id || projectIdNum} />
//                 );

//             case 'उपभोक्ता समिति':
//                 if (loading.committee) return <LoadingSpinner />;

//                 return (
//                     <div className="space-y-8">
//                         {/* Consumer Committee Formation */}
//                         <div>
//                             <div className="flex items-center justify-between mb-4">
//                                 <h3 className="text-lg font-semibold text-gray-900">उपभोक्ता समिति गठन सम्बन्धमा</h3>
//                             </div>
//                             <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200">
//                                 <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
//                                     <thead className="bg-gray-100">
//                                         <tr>
//                                             <th className="py-3 px-5 font-semibold text-gray-800">क्र.स</th>
//                                             <th className="py-3 px-5 font-semibold text-gray-800">शिर्षक</th>
//                                             <th className="py-3 px-5 font-semibold text-gray-800">मिति</th>
//                                             <th className="py-3 px-5 font-semibold text-gray-800">स्थिती</th>
//                                             <th className="py-3 px-5 font-semibold text-gray-800">अन्य</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="divide-y divide-gray-100 bg-white">
//                                         {CONSUMER_COMMITTEE_TITLES.map((item, index) => (
//                                             <tr key={item.serial_no} className="hover:bg-gray-50">
//                                                 <td className="py-3 px-5 text-gray-700">{toNepaliNumber(item.serial_no)}</td>
//                                                 <td className="py-3 px-5 text-gray-700">{item.title}</td>
//                                                 <td className="py-3 px-5 text-gray-700">{toNepaliNumber(bsDate)}</td>
//                                                 <td className="py-3 px-5 text-gray-700">–</td>
//                                                 <td className="py-3 px-5">
//                                                     <div className="flex items-center space-x-3">
//                                                         <button
//                                                             type="button"
//                                                             className="text-blue-600 hover:text-blue-800 cursor-pointer"
//                                                             onClick={() => {
//                                                                 console.log("Upload clicked");
//                                                             }}
//                                                         >
//                                                             <Upload className="w-5 h-5" />
//                                                         </button>
//                                                         <button
//                                                             type="button"
//                                                             className="text-green-600 hover:text-green-800 cursor-pointer"
//                                                             onClick={() => {
//                                                                 handleDownload(item.serial_no, project.serial_number);
//                                                             }}
//                                                         >
//                                                             <DownloadCloud className="w-5 h-5" />
//                                                         </button>
//                                                     </div>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>

//                         </div>

//                         {/* Consumer Committee Details */}
//                         <div>
//                             <div className="flex items-center justify-between mb-4">
//                                 <h3 className="text-lg font-semibold text-gray-900">उपभोक्ता समितिको विवरण</h3>
//                                 <button
//                                     className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer"
//                                     onClick={committeeDetail ? handleEdit : handleAdd}
//                                 >
//                                     {committeeDetail ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
//                                     <span>{committeeDetail ? 'सम्पादन गर्नुहोस्' : 'थप गर्नुहोस्'}</span>
//                                 </button>
//                             </div>

//                             {committeeDetail ? (
//                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                                     <div>
//                                         <p className="text-sm text-gray-600 mb-1">उपभोक्ता समितिको नाम:</p>
//                                         <p className="text-gray-900">{committeeDetail.consumer_committee_name || '-'}</p>
//                                     </div>
//                                     <div>
//                                         <p className="text-sm text-gray-600 mb-1">ठेगाना:</p>
//                                         <p className="text-gray-900">{committeeDetail.address || '-'}</p>
//                                     </div>
//                                     <div>
//                                         <p className="text-sm text-gray-600 mb-1">उपभोक्ता समिति गठन मिति:</p>
//                                         <p className="text-gray-900">{toNepaliNumber(committeeDetail.formation_date) || '-'}</p>
//                                     </div>
//                                     <div>
//                                         <p className="text-sm text-gray-600 mb-1">प्रतिनिधिको नाम:</p>
//                                         <p className="text-gray-900">{committeeDetail.representative_name || '-'}</p>
//                                     </div>
//                                     <div>
//                                         <p className="text-sm text-gray-600 mb-1">प्रतिनिधिको पद:</p>
//                                         <p className="text-gray-900">{committeeDetail.representative_position || '-'}</p>
//                                     </div>
//                                     <div>
//                                         <p className="text-sm text-gray-600 mb-1">सम्पर्क नं.:</p>
//                                         <p className="text-gray-900">{toNepaliNumber(committeeDetail.contact_no) || '-'}</p>
//                                     </div>
//                                 </div>
//                             ) : (
//                                 <EmptyState message="उपभोक्ता समिति विवरण उपलब्ध छैन" />
//                             )}

//                             {/* Dialog Component */}
//                             {isDialogOpen && (
//                                 <ConsumerCommitteeDialog
//                                     isOpen={isDialogOpen}
//                                     onClose={() => setIsDialogOpen(false)}
//                                     onSave={handleSave}
//                                     committeeData={committeeDetail}
//                                     projectId={project.serial_number}
//                                 />
//                             )}
//                         </div>

//                         {/* Committee Members Table */}
//                         <div>
//                             <div className="flex items-center justify-between mb-4">
//                                 <h3 className="text-lg font-semibold text-gray-900">पदाधिकारीको विवरण</h3>
//                                 {officialDetails.length === 0 ?
//                                     (<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer"
//                                         onClick={() => setIsPositionModalOpen(true)}
//                                     >
//                                         <Plus className="w-4 h-4" />
//                                         <span>नयाँ सदस्य थप्नुहोस्</span>

//                                     </button>
//                                     ) : (
//                                         <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer"
//                                             onClick={() => setIsPositionModalOpen(true)}
//                                         >
//                                             <Edit className="w-4 h-4" />
//                                             <span>  सम्पादन गर्नुहोस्</span>
//                                         </button>
//                                     )}
//                             </div>

//                             <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
//                                 <table className="min-w-full divide-y divide-gray-200 text-sm">
//                                     <thead className="bg-gray-50">
//                                         <tr>
//                                             <th className="px-5 py-3 text-left font-semibold text-gray-700">क्र.स</th>
//                                             <th className="px-5 py-3 text-left font-semibold text-gray-700">पद</th>
//                                             <th className="px-5 py-3 text-left font-semibold text-gray-700">नाम थर</th>
//                                             <th className="px-5 py-3 text-left font-semibold text-gray-700">ठेगाना</th>
//                                             <th className="px-5 py-3 text-left font-semibold text-gray-700">सम्पर्क नं.</th>
//                                             <th className="px-5 py-3 text-left font-semibold text-gray-700">लिंग</th>
//                                             <th className="px-5 py-3 text-left font-semibold text-gray-700">नागरिकता प्र. नं.</th>
//                                             <th className="px-5 py-3 text-left font-semibold text-gray-700">अन्य</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="divide-y divide-gray-100">
//                                         {officialDetails.length === 0 ? (
//                                             <tr>
//                                                 <td colSpan={8} className="py-10 text-center text-gray-500">
//                                                     <EmptyState message="अहिले कुनै डाटा उपलब्ध छैन।" />
//                                                 </td>
//                                             </tr>
//                                         ) : (
//                                             officialDetails.map((member, index) => (
//                                                 <tr key={member.id} className="hover:bg-gray-50">
//                                                     <td className="px-5 py-3 text-gray-800">{toNepaliNumber(index + 1)}</td>
//                                                     <td className="px-5 py-3 text-gray-800">{member.post}</td>
//                                                     <td className="px-5 py-3 text-gray-800">{member.full_name}</td>
//                                                     <td className="px-5 py-3 text-gray-800">{member.address}</td>
//                                                     <td className="px-5 py-3 text-gray-800">{toNepaliNumber(member.contact_no)}</td>
//                                                     <td className="px-5 py-3 text-gray-800">{member.gender}</td>
//                                                     <td className="px-5 py-3 text-gray-800">{member.citizenship_no}</td>
//                                                     <td className="px-5 py-3">
//                                                         <div className="flex items-center gap-2">
//                                                             <button
//                                                                 className="text-blue-600 hover:text-blue-800 transition cursor-pointer"
//                                                                 onClick={() => {/* Edit functionality */ }}
//                                                             >
//                                                                 <FileMinusIcon className="w-5 h-5" />
//                                                             </button>
//                                                         </div>
//                                                     </td>
//                                                 </tr>
//                                             ))
//                                         )}
//                                     </tbody>
//                                 </table>
//                             </div>

//                         </div>
//                         {/* monitoring details */}
//                         <div>
//                             <div className="flex items-center justify-between mb-4">
//                                 <h3 className="text-lg font-semibold text-gray-900">अनुगमन तथा सहजिकरण समिती :</h3>
//                                 <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer"
//                                     onClick={() => setIsResearchModalOpen(true)}
//                                 >
//                                     <Plus className="w-4 h-4" />
//                                     <span>नयाँ सदस्य थप्नुहोस्</span>
//                                 </button>
//                             </div>

//                             <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
//                                 <table className="min-w-full divide-y divide-gray-200">
//                                     <thead className="bg-gray-50">
//                                         <tr>
//                                             <th className="text-left py-3 px-4 font-semibold text-gray-700">क्र.स</th>
//                                             <th className="text-left py-3 px-4 font-semibold text-gray-700">पद</th>
//                                             <th className="text-left py-3 px-4 font-semibold text-gray-700">नाम थर</th>
//                                             <th className="text-left py-3 px-4 font-semibold text-gray-700">ठेगाना</th>
//                                             <th className="text-left py-3 px-4 font-semibold text-gray-700">सम्पर्क नं.</th>
//                                             <th className="text-left py-3 px-4 font-semibold text-gray-700">लिंग</th>
//                                             <th className="text-left py-3 px-4 font-semibold text-gray-700">नागरिकता प्र. नं.</th>
//                                             <th className="text-center py-3 px-4 font-semibold text-gray-700">कार्यहरू</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="bg-white divide-y divide-gray-100">
//                                         {monitoringCommittee.length === 0 ? (
//                                             <tr>
//                                                 <td colSpan={8} className="py-12 text-center text-gray-500">
//                                                     <EmptyState message="अहिले कुनै डाटा उपलब्ध छैन।" />
//                                                 </td>
//                                             </tr>
//                                         ) : (
//                                             monitoringCommittee.map((member, index) => (
//                                                 <tr key={member.id} className="hover:bg-gray-50">
//                                                     <td className="py-3 px-4 text-gray-900">{toNepaliNumber(index + 1)}</td>
//                                                     <td className="py-3 px-4 text-gray-900">{member.post}</td>
//                                                     <td className="py-3 px-4 text-gray-900">{member.full_name}</td>
//                                                     <td className="py-3 px-4 text-gray-900">{member.address}</td>
//                                                     <td className="py-3 px-4 text-gray-900">{member.contact_no}</td>
//                                                     <td className="py-3 px-4 text-gray-900">{member.gender}</td>
//                                                     <td className="py-3 px-4 text-gray-900">{member.citizenship_no}</td>
//                                                     <td className="py-3 px-4">
//                                                         <div className="flex items-center justify-center space-x-2">
//                                                             <button
//                                                                 className="text-blue-600 hover:text-blue-800 transition-colors duration-150 cursor-pointer"
//                                                                 onClick={() => {
//                                                                     // Edit functionality
//                                                                 }}
//                                                             >
//                                                                 <Edit className="w-4 h-4" />
//                                                             </button>
//                                                             <button
//                                                                 className="text-red-600 hover:text-red-800 transition-colors duration-150 cursor-pointer"
//                                                                 onClick={() => handleDelete(member.id, 'official')}
//                                                             >
//                                                                 <Trash2 className="w-4 h-4" />
//                                                             </button>
//                                                         </div>
//                                                     </td>
//                                                 </tr>
//                                             ))
//                                         )}
//                                     </tbody>
//                                 </table>
//                             </div>


//                             <Modal
//                                 isOpen={isPositionModalOpen}
//                                 onClose={() => setIsPositionModalOpen(false)}
//                                 title="पदाधिकारीको विवरण"
//                                 rows={officialDetails.length > 0 ? transformedOfficialDetails : positionDistributionRows}
//                                 onSave={handleSavePosition}
//                             />
//                             <Modal
//                                 isOpen={isResearchModalOpen}
//                                 onClose={() => setIsResearchModalOpen(false)}
//                                 title="अनुगमन तथा सहजिकरण समिति"
//                                 rows={monitoringCommittee.length > 0 ? transformedMonitoringDetails : researchCommitteeRows}
//                                 onSave={handleSaveResearch}
//                             />
//                         </div>
//                     </div>
//                 );

//             case 'लागत अनुमान':
//                 if (loading.cost) return <LoadingSpinner />;

//                 const costDetail = costEstimateDetails.find(item => item.project === project?.id);
//                 const mapDetail = mapCostEstimate?.find(item => item.project === project?.id)
//                 return (
//                     <div className="space-y-8">
//                         {/* Cost Estimate Documents */}
//                         <div>
//                             <h3 className="text-lg font-semibold text-gray-900 mb-4">नक्सा तथा लागत अनुमान</h3>
//                             <div className="space-y-4">
//                                 <div className="flex justify-end">
//                                     <button
//                                         className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
//                                         onClick={() => handleGenerateBill(project.serial_number)}
//                                     >
//                                         <FileText className="w-4 h-4" />
//                                         <span>Generate Bill</span>
//                                     </button>
//                                 </div>

//                                 <div className="overflow-x-auto rounded-lg border border-gray-200">
//                                     <table className="min-w-full divide-y divide-gray-200">
//                                         <thead className="bg-gray-100 sticky top-0 z-10">
//                                             <tr>
//                                                 <th className="text-left py-3 px-4 font-semibold text-gray-700">क्र.स.</th>
//                                                 <th className="text-left py-3 px-4 font-semibold text-gray-700">शीर्षक</th>
//                                                 <th className="text-left py-3 px-4 font-semibold text-gray-700">मिति</th>
//                                                 <th className="text-left py-3 px-4 font-semibold text-gray-700">स्थिति</th>
//                                                 <th className="text-left py-3 px-4 font-semibold text-gray-700">कार्यहरू</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody className="bg-white divide-y divide-gray-100">
//                                             {BUDGET_ESTIMATE_TITLES.map((item, index) => {
//                                                 const mapCostItem = mapCostEstimate.find(mapItem => mapItem.serial_no === item.serial_no);
//                                                 return (
//                                                     <tr key={item.serial_no} className="hover:bg-gray-50">
//                                                         <td className="py-3 px-4 text-gray-900">{toNepaliNumber(item.serial_no)}</td>
//                                                         <td className="py-3 px-4 text-gray-900 text-sm">{item.title}</td>
//                                                         <td className="py-3 px-4 text-gray-900 text-sm">{toNepaliNumber(bsDate)}</td>
//                                                         <td className="py-3 px-4 text-gray-900 text-sm">
//                                                             {mapCostItem?.status === 'pending' ? 'अपलोड गरिएको' : mapCostItem?.status}
//                                                         </td>
//                                                         <td className="py-3 px-4 text-sm flex items-center space-x-4">
//                                                             <button
//                                                                 type="button"
//                                                                 className="text-blue-600 hover:text-blue-800"
//                                                                 onClick={() => {
//                                                                     setSelectedMapCostItem(item);
//                                                                     setEditMapCostId(mapCostItem?.id || null);
//                                                                     setAuthenticationFileModalOpen(true);
//                                                                 }}
//                                                             >
//                                                                 <Upload className="w-5 h-5" />
//                                                             </button>

//                                                             <div className="relative group">
//                                                                 <button
//                                                                     type="button"
//                                                                     className="text-blue-600 hover:text-blue-800"
//                                                                     onClick={() => {
//                                                                         setSelectedMapCostItem(mapCostItem);
//                                                                         setEditMapCostId(mapCostItem?.id || null);
//                                                                         setAuthenticationModalOpen(true);
//                                                                     }}
//                                                                 >
//                                                                     <FileSearch className="w-5 h-5" />
//                                                                 </button>
//                                                                 <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition duration-200">
//                                                                     प्रमाणिकरण
//                                                                 </span>
//                                                             </div>
//                                                         </td>
//                                                     </tr>
//                                                 );
//                                             })}
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             </div>
//                             {
//                                 isAuthenticationFileModalOpen && (
//                                     <AddAuthenticationFileModal
//                                         onSave={handleFileUpload}
//                                         onClose={() => {
//                                             setAuthenticationFileModalOpen(false);
//                                             setSelectedMapCostItem(null);
//                                             setEditMapCostId(null);
//                                         }}
//                                         documentData={selectedMapCostItem}
//                                         projectId={projectIdNum}
//                                     />
//                                 )
//                             }
//                             {
//                                 isAuthenticationModalOpen && (
//                                     <AuthenticationModal
//                                         onSave={handleFileUpload}
//                                         onClose={() => {
//                                             setAuthenticationModalOpen(false);
//                                             setSelectedMapCostItem(null);
//                                             // editMapCostId={editMapCostId}
//                                         }}
//                                         documentData={selectedMapCostItem}
//                                         projectIdNum={projectIdNum}
//                                         editMapCostId={editMapCostId}
//                                         onAuthenticationSent={handleSendAuthentication}
//                                     />
//                                 )
//                             }

//                         </div>

//                         {/* new cost calculation */}
//                         <div className='bg-gray-50 rounded-lg p-6'>
//                             <div className="flex items-center justify-between mb-4">
//                                 <h2 className="text-xl font-bold text-gray-800 mb-4">
//                                     लागत अनुमान गणना र विवरण
//                                 </h2>
//                                 <button
//                                     className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer"
//                                     onClick={() => setIsCostEstimateModalOpen(true)}
//                                 >
//                                     <Edit className="w-4 h-4" />
//                                     <span>लागत अनुमान गणना गर्नुहोस्</span>
//                                 </button>
//                             </div>
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                                 <div>
//                                     <p className="text-sm text-gray-600 mb-1">प्रदेश सरकारबाट बजेट:</p>
//                                     <p className="text-lg font-semibold">
//                                         {toNepaliNumber(formatBudget(calculatedEstimate?.provincial_budget))}
//                                     </p>
//                                 </div>
//                                 <div>
//                                     <p className="text-sm text-gray-600 mb-1">स्थानीय तहबाट बजेट:</p>
//                                     <p className="text-lg font-semibold">
//                                         {toNepaliNumber(formatBudget(calculatedEstimate?.local_budget))}
//                                     </p>
//                                 </div>
//                                 <div>
//                                     <p className="text-sm text-gray-600 mb-1">भ्याट प्रतिशत:</p>
//                                     <p className="text-lg font-semibold">
//                                         {toNepaliNumber(calculatedEstimate?.vat_percent)}%
//                                     </p>
//                                 </div>
//                                 <div>
//                                     <p className="text-sm text-gray-600 mb-1">भ्याट रकम:</p>
//                                     <p className="text-lg font-semibold">
//                                         {toNepaliNumber(formatBudget(calculatedEstimate?.vat_amount))}
//                                     </p>
//                                 </div>
//                                 <div>
//                                     <p className="text-sm text-gray-600 mb-1">कन्टिन्जेन्सी प्रतिशत:</p>
//                                     <p className="text-lg font-semibold">
//                                         {toNepaliNumber(calculatedEstimate?.contingency_percent)}%
//                                     </p>
//                                 </div>
//                                 <div>
//                                     <p className="text-sm text-gray-600 mb-1">कन्टिन्जेन्सी रकम:</p>
//                                     <p className="text-lg font-semibold">
//                                         {toNepaliNumber(formatBudget(calculatedEstimate?.contingency_amount))}
//                                     </p>
//                                 </div>
//                                 <div>
//                                     <p className="text-sm text-gray-600 mb-1">भ्याट बिना लागत:</p>
//                                     <p className="text-lg font-semibold">
//                                         {toNepaliNumber(formatBudget(calculatedEstimate?.total_without_vat))}
//                                     </p>
//                                 </div>
//                                 <div>
//                                     <p className="text-sm text-gray-600 mb-1">कुल लागत (भ्याट + कन्टिन्जेन्सी सहित):</p>
//                                     <p className="text-lg font-semibold">
//                                         {toNepaliNumber(formatBudget(calculatedEstimate?.grand_total))}
//                                     </p>
//                                 </div>
//                             </div>


//                             {isCostEstimateModalOpen && (
//                                 <CalculateCostEstimateModal
//                                     isOpen={isCostEstimateModalOpen}
//                                     onClose={() => setIsCostEstimateModalOpen(false)}
//                                     costData={calculateCostEstimateDetails}
//                                     onSave={() => {
//                                         loadCostEstimate();
//                                         setIsCostModalOpen(false);
//                                     }}
//                                     projectId={project.serial_number}
//                                 />
//                             )
//                             }
//                         </div>

//                         {/* work type set */}

//                         <div className='bg-gray-50 rounded-lg p-6'>
//                             <div className="flex items-center justify-between mb-4">
//                                 <h2 className="text-xl font-bold text-gray-800 mb-4">
//                                     परियोजनाको कामको प्रकार सेट गर्नुहोस्
//                                 </h2>
//                                 <button
//                                     className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer"
//                                     onClick={() => setIsSetWorkTypeModalOpen(true)}
//                                 >
//                                     <Edit className="w-4 h-4" />
//                                     <span>कामको प्रकार सेट गर्नुहोस्</span>
//                                 </button>
//                             </div>

//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                                 <div>
//                                     <p className="text-sm text-gray-600 mb-1">परियोजनाको नाम</p>
//                                     <p className="text-lg font-semibold">
//                                         {workTypeDets?.project}
//                                     </p>
//                                 </div>
//                                 <div>
//                                     <p className="text-sm text-gray-600 mb-1">कामको प्रकार</p>
//                                     <p className="text-lg font-semibold">
//                                         {workTypeDets?.name}
//                                     </p>
//                                 </div>
//                                 <div>
//                                     <p className="text-sm text-gray-600 mb-1">एकाइ</p>
//                                     <p className="text-lg font-semibold">
//                                         {workTypeDets?.unit_name}
//                                     </p>
//                                 </div>
//                             </div>


//                             {isSetWorkTypeModalOpen && (
//                                 <WorkTypeModal
//                                     isOpen={isSetWorkTypeModalOpen}
//                                     onClose={() => setIsSetWorkTypeModalOpen(false)}
//                                     workTypeData={workTypeDets}
//                                     onSave={() => {
//                                         loadCostEstimate();
//                                         setIsSetWorkTypeModalOpen(false);
//                                     }}
//                                     projectId={project.serial_number}
//                                 />
//                             )}
//                         </div>

//                         {/* work in progress */}
//                         <div className='bg-gray-50 rounded-lg p-6'>
//                             <div className="flex items-center justify-between mb-4">

//                                 <h2 className="text-xl font-bold text-gray-800 mb-4">
//                                     प्रगतिमा रहेका कार्यको विवरण
//                                 </h2>
//                                 <button
//                                     className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer"
//                                     onClick={() => setIsSetWorkInProgressOpen(true)}
//                                 >
//                                     <Edit className="w-4 h-4" />
//                                     <span>प्रगतिमा काम</span>
//                                 </button>
//                             </div>

//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                                 <div>
//                                     <p className="text-sm text-gray-600 mb-1">परियोजनाको नाम</p>
//                                     <p className="text-lg font-semibold">
//                                         {workInProgressDets?.project_name}
//                                     </p>
//                                 </div>
//                                 <div>
//                                     <p className="text-sm text-gray-600 mb-1">आर्थिक वर्ष</p>
//                                     <p className="text-lg font-semibold">
//                                         {workInProgressDets?.fiscal_year_display}
//                                     </p>
//                                 </div>
//                                 <div>
//                                     <p className="text-sm text-gray-600 mb-1">कामको प्रकार</p>
//                                     <p className="text-lg font-semibold">
//                                         {workInProgressDets?.work_type?.name}
//                                     </p>
//                                 </div>
//                                 <div>
//                                     <p className="text-sm text-gray-600 mb-1">मात्रा</p>
//                                     <p className="text-lg font-semibold">
//                                         {workInProgressDets?.quantity}
//                                     </p>
//                                 </div>
//                                 <div>
//                                     <p className="text-sm text-gray-600 mb-1">टिप्पणीहरू
//                                     </p>
//                                     <p className="text-lg font-semibold">
//                                         {workInProgressDets?.remarks}
//                                     </p>
//                                 </div>
//                             </div>


//                             {isSetWorkInProgressOpen && (
//                                 <WorkInProgressModal
//                                     isOpen={isSetWorkInProgressOpen}
//                                     onClose={() => setIsSetWorkInProgressOpen(false)}
//                                     workInProgressData={workInProgressDets}
//                                     onSave={() => {
//                                         loadCostEstimate();
//                                         setIsSetWorkInProgressOpen(false);
//                                     }}
//                                     projectId={project.serial_number}
//                                 />
//                             )}
//                         </div>

//                         {/* Cost Summary */}
//                         <div className="bg-gray-50 rounded-lg p-6">
//                             <div className="flex items-center justify-between mb-4">
//                                 <h3 className="text-lg font-semibold text-gray-900">लागत अनुमान तथा अन्य विवरण:</h3>
//                                 <button
//                                     className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer"
//                                     onClick={() => setIsCostModalOpen(true)}
//                                 >
//                                     <Edit className="w-4 h-4" />
//                                     <span>इडिट गर्नुहोस्</span>
//                                 </button>
//                             </div>
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                                 <div>
//                                     <p className="text-sm text-gray-600 mb-1">लागत अनुमान:</p>
//                                     <p className="text-lg font-semibold">{toNepaliNumber(formatBudget(costDetail?.estimated_cost))}</p>
//                                 </div>
//                                 <div>
//                                     <p className="text-sm text-gray-600 mb-1">कन्टिन्जेन्सी प्रतिशत:</p>
//                                     <p className="text-lg font-semibold">{toNepaliNumber(costDetail?.contingency_percent) || '0'}%</p>
//                                 </div>
//                                 <div>
//                                     <p className="text-sm text-gray-600 mb-1">कन्टिन्जेन्सी रकम:</p>
//                                     <p className="text-lg font-semibold">{toNepaliNumber(formatBudget(costDetail?.contingency_amount))}</p>
//                                 </div>
//                                 <div>
//                                     <p className="text-sm text-gray-600 mb-1">कुल लागत अनुमान:</p>
//                                     <p className="text-lg font-semibold">{toNepaliNumber(formatBudget(costDetail?.total_estimated_cost))}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 );

//             case 'योजना सम्झौता':
//                 if (loading.agreement) return <LoadingSpinner />;

//                 const agreementDetail = projectAgreementDetails[0];

//                 return (
//                     <div className="space-y-8">
//                         {/*  Project Agreement Recommendation and Others */}
//                         <div>
//                             <h3 className="text-lg font-semibold text-gray-900 mb-4">योजना सम्झौता सिफारिस तथा अन्य</h3>
//                             <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
//                                 <table className="min-w-full text-sm text-left text-gray-800">
//                                     <thead className="bg-gray-100">
//                                         <tr>
//                                             <th className="py-3 px-4 font-semibold text-gray-900">क्र.स.</th>
//                                             <th className="py-3 px-4 font-semibold text-gray-900">शीर्षक</th>
//                                             <th className="py-3 px-4 font-semibold text-gray-900">मिति</th>
//                                             <th className="py-3 px-4 font-semibold text-gray-900">स्थिति</th>
//                                             <th className="py-3 px-4 font-semibold text-gray-900">कार्य</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="divide-y divide-gray-100">
//                                         {PROJECT_AGREEMENT_TITLES.map((item, index) => (
//                                             <tr
//                                                 key={item.serial_no}
//                                                 className="hover:bg-gray-50 transition duration-150 ease-in-out"
//                                             >
//                                                 <td className="py-3 px-4">{toNepaliNumber(item.serial_no)}</td>
//                                                 <td className="py-3 px-4">
//                                                     <div className="font-medium text-gray-900">{item.title}</div>
//                                                     <div className="text-xs text-gray-500">{item.description}</div>
//                                                 </td>
//                                                 <td className="py-3 px-4">{toNepaliNumber(bsDate)}</td>
//                                                 <td className="py-3 px-4">
//                                                     <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-medium">
//                                                         {/* Replace with actual status */}
//                                                         उपलब्ध छैन
//                                                     </span>
//                                                 </td>
//                                                 <td className="py-3 px-4">
//                                                     <div className="flex items-center space-x-2">
//                                                         <button
//                                                             onClick={() => console.log("Upload clicked")}
//                                                             className="p-1 text-blue-600 hover:text-blue-800 transition cursor-pointer"
//                                                             title="Upload"
//                                                         >
//                                                             <Upload className="w-4 h-4" />
//                                                         </button>
//                                                         <button
//                                                             onClick={() =>
//                                                                 handleDownloadProjectAgreement(item.serial_no, project.serial_number)
//                                                             }
//                                                             className="p-1 text-green-600 hover:text-green-800 transition cursor-pointer"
//                                                             title="Download PDF"
//                                                         >
//                                                             <FileCheck className="w-4 h-4" />
//                                                         </button>
//                                                     </div>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>

//                         </div>

//                         {/* Project Agreement Details */}
//                         <div className="bg-gray-50 rounded-lg p-6">
//                             <div className="flex items-center justify-between mb-4">
//                                 <h3 className="text-lg font-semibold text-gray-900">योजना सम्झौता विवरण</h3>
//                                 <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer"
//                                     onClick={() => setIsProjectAgreementModalOpen(true)}
//                                 >
//                                     <Edit className="w-4 h-4" />
//                                     <span> {agreementDetail ? 'इडिट गर्नुहोस्' : 'थप गर्नुहोस्'}</span>
//                                 </button>
//                             </div>
//                             {!agreementDetail ? (
//                                 <EmptyState message="योजना सम्झौता विवरण उपलब्ध छैन।" />
//                             ) : (
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                     <div>
//                                         <p className="text-sm text-gray-600 mb-1">स्वीकृत लागत अनुमान:</p>
//                                         <p className="text-lg font-semibold">{toNepaliNumber(formatBudget(agreementDetail.cost_estimate))}</p>
//                                     </div>
//                                     <div>
//                                         <p className="text-sm text-gray-600 mb-1">कन्टिन्जेन्सी प्रतिशत:</p>
//                                         <p className="text-lg font-semibold">{toNepaliNumber(agreementDetail.contingency_percentage) || '0'}%</p>
//                                     </div>
//                                     <div>
//                                         <p className="text-sm text-gray-600 mb-1">कन्टिन्जेन्सी रकम:</p>
//                                         <p className="text-lg font-semibold">{toNepaliNumber(formatBudget(agreementDetail.contingency_amount))}</p>
//                                     </div>
//                                     <div>
//                                         <p className="text-sm text-gray-600 mb-1">कुल लागत अनुमान:</p>
//                                         <p className="text-lg font-semibold">{toNepaliNumber(formatBudget(agreementDetail.total_cost_estimate))}</p>
//                                     </div>
//                                     <div>
//                                         <p className="text-sm text-gray-600 mb-1">सम्झौता रकम:</p>
//                                         <p className="text-lg font-semibold">{toNepaliNumber(formatBudget(agreementDetail.agreement_amount))}</p>
//                                     </div>
//                                     <div>
//                                         <p className="text-sm text-gray-600 mb-1">सम्झौता मिति:</p>
//                                         <p className="text-lg font-semibold">{toNepaliNumber(agreementDetail.agreement_date) || 'N/A'}</p>
//                                     </div>
//                                     <div>
//                                         <p className="text-sm text-gray-600 mb-1">नगरपालिकाले ब्यहेर्ने रकम रु:</p>
//                                         <p className="text-lg font-semibold">{toNepaliNumber(formatBudget(agreementDetail.municipality_amount))}</p>
//                                     </div>
//                                     <div>
//                                         <p className="text-sm text-gray-600 mb-1">नगरपालिकाले ब्यहेर्ने रकमको प्रतिशत:</p>
//                                         <p className="text-lg font-semibold">{toNepaliNumber(agreementDetail.municipality_percentage) || 'N/A'}%</p>
//                                     </div>
//                                     <div>
//                                         <p className="text-sm text-gray-600 mb-1">जनसहभागिता रकम:</p>
//                                         <p className="text-lg font-semibold">{toNepaliNumber(formatBudget(agreementDetail.public_participation_amount))}</p>
//                                     </div>
//                                     <div>
//                                         <p className="text-sm text-gray-600 mb-1">जनसहभागिताले ब्यहेर्ने रकमको प्रतिशत:</p>
//                                         <p className="text-lg font-semibold">{toNepaliNumber(agreementDetail.public_participation_percentage) || 'N/A'}%</p>
//                                     </div>
//                                     <div>
//                                         <p className="text-sm text-gray-600 mb-1">कार्यादेश मिति:</p>
//                                         <p className="text-lg font-semibold">{toNepaliNumber(formatBudget(agreementDetail.work_order_date))}</p>
//                                     </div>
//                                     <div>
//                                         <p className="text-sm text-gray-600 mb-1">कार्य सम्पन्न गर्नुपर्ने मिति:</p>
//                                         <p className="text-lg font-semibold">{toNepaliNumber(agreementDetail.completion_date) || 'N/A'}</p>
//                                     </div>
//                                 </div>
//                             )}

//                             {isProjectAgreementModalOpen && (<ProjectAgreementModal
//                                 onClose={() => setIsProjectAgreementModalOpen(false)
//                                 }
//                                 onSave={handleAddProjectAgreement}
//                                 agreementData={agreementDetail}
//                                 projectId={project.serial_number}
//                             />)

//                             }
//                         </div>

//                         {/* Project Agreement and Work Order */}
//                         <div>
//                             <h3 className="text-lg font-semibold text-gray-900 mb-4">योजना सम्झौता तथा कार्यादेश</h3>
//                             <div className="overflow-x-auto">
//                                 <table className="min-w-full">
//                                     <thead>
//                                         <tr className="border-b border-gray-200">
//                                             <th className="text-left py-3 px-4 font-medium text-gray-900">क्र.स.</th>
//                                             <th className="text-left py-3 px-4 font-medium text-gray-900">शीर्षक</th>
//                                             <th className="text-left py-3 px-4 font-medium text-gray-900">मिति</th>
//                                             <th className="text-left py-3 px-4 font-medium text-gray-900">स्थिति</th>
//                                             <th className="text-left py-3 px-4 font-medium text-gray-900">अन्य</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {PROJECT_AGREEMENT_WORK_TITLES.map((item, index) => (
//                                             <tr key={item.serial_no} className="border-b border-gray-100 hover:bg-gray-50">
//                                                 <td className="py-3 px-4 text-gray-900">{toNepaliNumber(item.serial_no)}</td>
//                                                 <td className="py-3 px-4 text-gray-900 text-sm">
//                                                     <div>{item.title}</div>
//                                                 </td>
//                                                 <td className="py-3 px-4 text-gray-900 text-sm">{toNepaliNumber(bsDate)}</td>
//                                                 <td className="py-3 px-4 text-gray-900 text-sm" >{ }</td>
//                                                 <td className="py-3 px-4 text-gray-900 text-sm flex space-x-2">
//                                                     <button
//                                                         type="button"
//                                                         className="p-1 rounded text-blue-600 hover:text-blue-800 cursor-pointer"
//                                                         onClick={() => {
//                                                             // Your upload logic here
//                                                             console.log("Upload clicked");
//                                                         }}
//                                                     >
//                                                         <Upload className="w-4 h-4" />
//                                                     </button>

//                                                     <button
//                                                         type="button"
//                                                         className="p-1 rounded text-blue-600 hover:text-blue-800 cursor-pointer"
//                                                         onClick={() => {
//                                                             handleDownloadProjectAgreementAndWorkLoad(item.serial_no, project.serial_number)
//                                                         }}
//                                                     >
//                                                         <FileCheck className="w-4 h-4" />
//                                                     </button>
//                                                 </td>

//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     </div>
//                 );



//             case 'संचालन स्थल':
//                 if (loading.agreement) return <LoadingSpinner />;

//                 const locationDetail = projectAgreementDetails[0];

//                 return (
//                     <div className="space-y-8">
//                         {/*  Project Operation Location */}
//                         <div>
//                             <h3 className="text-lg font-semibold text-gray-900 mb-4">योजना संचालन स्थलको फोटो</h3>
//                             <div className="overflow-x-auto bg-white shadow rounded-lg border border-gray-200">
//                                 <table className="min-w-full divide-y divide-gray-200 text-sm">
//                                     <thead className="bg-gray-100">
//                                         <tr>
//                                             <th className="text-left py-3 px-4 font-semibold text-gray-700">क्र.स.</th>
//                                             <th className="text-left py-3 px-4 font-semibold text-gray-700">शीर्षक</th>
//                                             <th className="text-left py-3 px-4 font-semibold text-gray-700">फोटोहरु</th>
//                                             <th className="text-left py-3 px-4 font-semibold text-gray-700">अन्य</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="divide-y divide-gray-100">
//                                         {operationLocation.map((item, index) => (
//                                             <tr key={item.serial_no} className="hover:bg-gray-50">
//                                                 <td className="py-3 px-4 text-gray-800">{toNepaliNumber(index + 1)}</td>
//                                                 <td className="py-3 px-4 text-gray-800">
//                                                     <div className="font-medium">{item.title}</div>
//                                                     <div className="text-xs text-gray-500 mt-1">{item.description}</div>
//                                                 </td>
//                                                 <td className="py-3 px-4 text-gray-800">
//                                                     {item.photo ? (
//                                                         <img
//                                                             src={item.photo}
//                                                             alt={item.title || 'uploaded photo'}
//                                                             className="h-16 w-24 object-cover rounded-md border border-gray-300"
//                                                         />
//                                                     ) : (
//                                                         <span className="text-gray-500 italic">फोटो उपलब्ध छैन</span>
//                                                     )}
//                                                 </td>
//                                                 <td className="py-3 px-4 text-gray-800 flex space-x-2">
//                                                     <button
//                                                         type="button"
//                                                         className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition cursor-pointer"
//                                                         onClick={() => {
//                                                             setSelectedSerialNo(item.serial_no);
//                                                             setShowLocationModal(true);
//                                                         }}
//                                                     >
//                                                         <Upload className="w-4 h-4" />
//                                                     </button>

//                                                     <button
//                                                         type="button"
//                                                         className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded transition cursor-pointer"
//                                                         onClick={() => {
//                                                             console.log("Download PDF clicked");
//                                                         }}
//                                                     >
//                                                         <FileCheck className="w-4 h-4" />
//                                                     </button>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>


//                             {showLocationModal && selectedSerialNo && (
//                                 <OperationSiteUploadModal
//                                     onClose={() => {
//                                         setShowLocationModal(false)
//                                         loadOperationDetails()
//                                     }}
//                                     projectId={project.serial_number}
//                                     serialNo={selectedSerialNo}
//                                 />
//                             )}
//                         </div>
//                     </div>
//                 )
//             case 'किस्ता भुक्तानी सम्बन्धी':
//                 if (loading.documents) return <LoadingSpinner />;

//                 return (
//                     <PaymentInstallment project={project} />
//                 )
//             case 'अन्य डकुमेन्ट':
//                 if (loading.documents) return <LoadingSpinner />;

//                 return (
//                     <div className="space-y-6">
//                         <div>
//                             {/* Important DOcuments */}
//                             <div className="flex items-center justify-between">
//                                 <h3 className="text-lg font-semibold text-gray-900">अन्य आवश्यक कागजातहरु</h3>
//                             </div>

//                             {documents.length === 0 ? (
//                                 <EmptyState message="अन्य डकुमेन्ट उपलब्ध छैन।" />
//                             ) : (
//                                 <div className="overflow-x-auto mt-4 rounded-lg shadow-sm">
//                                     <table className="min-w-full divide-y divide-gray-200 text-sm">
//                                         <thead className="bg-gray-100 text-gray-700 text-left">
//                                             <tr>
//                                                 <th className="py-3 px-5 font-semibold">क्र.स.</th>
//                                                 <th className="py-3 px-5 font-semibold">शीर्षक</th>
//                                                 <th className="py-3 px-5 font-semibold">मिति</th>
//                                                 <th className="py-3 px-5 font-semibold">स्थिती</th>
//                                                 <th className="py-3 px-5 font-semibold text-center">कार्यहरू</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody className="divide-y divide-gray-100 bg-white">
//                                             {documents.map((item, index) => (
//                                                 <tr key={item.id} className="hover:bg-gray-50">
//                                                     <td className="py-3 px-5 text-gray-800">{toNepaliNumber(index + 1)}</td>
//                                                     <td className="py-3 px-5 text-gray-800">{item.title}</td>
//                                                     <td className="py-3 px-5 text-gray-800">{toNepaliNumber(item.date)}</td>
//                                                     <td className="py-3 px-5 text-gray-800">
//                                                         {/* Placeholder for status if needed */}
//                                                         <span className="inline-block px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
//                                                             सक्रिय
//                                                         </span>
//                                                     </td>
//                                                     <td className="py-3 px-5">
//                                                         <div className="flex items-center justify-center space-x-2">
//                                                             <button
//                                                                 className="text-blue-600 hover:text-blue-800 cursor-pointer"
//                                                                 onClick={() =>
//                                                                     handleDownloadOtherDocument(item.serial_no, project.serial_number)
//                                                                 }
//                                                             >
//                                                                 <FileCheck className="w-5 h-5" />
//                                                             </button>
//                                                         </div>
//                                                     </td>
//                                                 </tr>
//                                             ))}
//                                         </tbody>
//                                     </table>
//                                 </div>

//                             )}
//                         </div>

//                         {/* Other documents */}
//                         <div className="space-y-6">
//                             <div className="flex items-center justify-between">
//                                 <h3 className="text-lg font-semibold text-gray-900">अन्य डकुमेन्टहरु</h3>
//                                 <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer"
//                                     onClick={() => setIsDocumentModalOpen(true)}
//                                 >
//                                     <Plus className="w-4 h-4" />
//                                     <span>नयाँ प्रविष्टि गर्नुहोस्</span>
//                                 </button>
//                             </div>

//                             {otherdocuments.length === 0 ? (
//                                 <EmptyState message="अन्य डकुमेन्ट उपलब्ध छैन।" />
//                             ) : (
//                                 <div className="overflow-x-auto">
//                                     <table className="min-w-full">
//                                         <thead>
//                                             <tr className="border-b border-gray-200">
//                                                 <th className="text-left py-3 px-4 font-medium text-gray-900">क्र.स.</th>
//                                                 <th className="text-left py-3 px-4 font-medium text-gray-900">फायलको नाम</th>
//                                                 <th className="text-left py-3 px-4 font-medium text-gray-900">अपलोड कर्ता	</th>
//                                                 <th className="text-left py-3 px-4 font-medium text-gray-900">अपलोड मिति</th>
//                                                 <th className="text-left py-3 px-4 font-medium text-gray-900">अन्य</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             {otherdocuments.map((item, index) => (
//                                                 <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
//                                                     <td className="py-3 px-4 text-gray-900">{toNepaliNumber(index + 1)}</td>
//                                                     <td className="py-3 px-4 text-gray-900">{item.title}</td>
//                                                     <td className="py-3 px-4 text-gray-900">{item.uploaded_by_name}</td>
//                                                     <td className="py-3 px-4 text-gray-900">
//                                                         {toNepaliNumber(new Date(item.uploaded_at).toISOString().split('T')[0])}
//                                                     </td>
//                                                     <td className="py-3 px-4">
//                                                         <div className="flex items-center space-x-2">
//                                                             <button
//                                                                 className="text-blue-600 hover:text-blue-800 cursor-pointer"
//                                                                 onClick={() => setIsDocumentModalOpen(true)}
//                                                             >
//                                                                 <Edit className="w-5 h-5" />
//                                                             </button>
//                                                             <button
//                                                                 className="text-red-600 hover:text-red-800 cursor-pointer"
//                                                                 onClick={() => handleDeleteDocument(item.id)}
//                                                             >
//                                                                 <Trash2 className="w-5 h-5" />
//                                                             </button>
//                                                         </div>
//                                                     </td>
//                                                 </tr>
//                                             ))}
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             )}

//                             {isDocumentModalOpen && (
//                                 <AddDocumentModal
//                                     onSave={handleSaveDocument}
//                                     onClose={() => {
//                                         setIsDocumentModalOpen(false);
//                                         setDocumentDetail(null); // reset
//                                     }}
//                                     documentData={documentDetail}
//                                     projectId={project.serial_number}
//                                 />
//                             )}

//                         </div>
//                     </div>
//                 );

//             default:
//                 return <EmptyState message="यो खण्डमा अहिले कुनै डाटा उपलब्ध छैन।" />;
//         }
//     };

//     return (
//         <main className="flex-1 p-6">
//             {/* Breadcrumb */}
//             <div className="flex items-center justify-between mb-6">
//                 <div className="flex items-center space-x-2 text-sm text-gray-600">
//                     <button onClick={onBack} className="flex items-center space-x-1 hover:text-gray-900 cursor-pointer">
//                         <ChevronLeft className="w-4 h-4" />
//                         <span>पछि जानुहोस्</span>
//                     </button>
//                     <div className="flex items-center space-x-2">
//                         <Home className="w-4 h-4" />
//                         <span>गृहपृष्ठ</span>
//                         <ChevronRight className="w-3 h-3" />
//                         <span>परियोजनाहरू</span>
//                         <ChevronRight className="w-3 h-3" />
//                         <span className="text-gray-900 font-medium">{activeTab}</span>
//                     </div>
//                 </div>
//                 <div className="text-sm text-gray-600">
//                     <span className="text-gray-900 font-medium">परियोजना ID: {toNepaliNumber(project.serial_number)}</span>
//                 </div>
//             </div>

//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                 <h1 className="text-2xl font-bold text-gray-900 mb-6">परियोजना विवरण</h1>

//                 {/* Tabs */}
//                 <div className="border-b border-gray-200 mb-6">
//                     <div className="flex space-x-8 overflow-x-auto">
//                         {tabs.map((tab) => (
//                             <button
//                                 key={tab}
//                                 onClick={() => setActiveTab(tab)}
//                                 className={`py-3 cursor-pointer px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === tab
//                                     ? 'border-blue-500 text-blue-600'
//                                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                                     }`}
//                             >
//                                 {tab}
//                             </button>
//                         ))}
//                     </div>
//                 </div>

//                 <CostEstimateModal
//                     isOpen={isCostModalOpen}
//                     onClose={() => setIsCostModalOpen(false)}
//                     costData={costEstimateDetails}
//                     onSave={() => {
//                         loadCostEstimate();
//                         setIsCostModalOpen(false);
//                     }}
//                     projectId={project.serial_number}
//                 />

//                 {/* Tab Content */}
//                 {renderTabContent()}
//             </div>
//         </main>
//     );
// };

// export default ProjectDetail;