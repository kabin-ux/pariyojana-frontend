import React, { useEffect, useState } from 'react';
import { Edit, Upload, FileCheck, Eye } from 'lucide-react';
import { toNepaliNumber, formatBudget } from '../../utils/formatters';
import ProjectAgreementModal from '../../modals/ProjectAgreementModal';
import EmptyState from './EmptyState';
import * as BS from 'bikram-sambat-js';
import toast from 'react-hot-toast';
import axios from 'axios';
import ConsumerCommitteefileUploadModal from '../../modals/ConsumerCommitteefileUploadModal';

interface ProjectAgreementTabProps {
  project: any;
  projectAgreementDetails: any[];
  onAddProjectAgreement: (data: any) => void;
  onDownloadProjectAgreement: (itemSerialNo: number, projectSerialNo: number) => void;
  onDownloadProjectAgreementAndWorkLoad: (itemSerialNo: number, projectSerialNo: number) => void;
  onAgreementFileUpload?: (serialNo: number, file: File) => void;
  onFileUpload?: (serialNo: number, file: File) => void;
  onWorkFileUpload?: (serialNo: number, file: File) => void;
  uploadedProjectAgreementFiles?: { [key: number]: { file: File; type: string } };
  uploadedProjectAgreementWorkFiles?: { [key: number]: { file: File; type: string } };
}

const PROJECT_AGREEMENT_TITLES = [
  { "serial_no": 1, "title": "उपभोक्ता समिति बैठक र निर्णय", "description": "(खाता संन्चलन,योजना सम्झौता एवं अन्य अख्तियारी सम्बन्ध्मा)" },
  { "serial_no": 2, "title": "उपभोक्ता समितिले सम्झौता सिफारिसका लागी वडामा दिने निवेदन", "description": "(वडाबाट महानगरपालिकामा सिफारिस गरिदिन)" },
  { "serial_no": 3, "title": "योजना संचालन स्थलको फोटो - ४ प्रति", "description": "(कामगर्नु पुर्वको फोटो)" },
  { "serial_no": 4, "title": "नयाँ बैंक खाता सञ्चालन सिफारिस का लागि उपभोक्ता समितिले पेस गर्ने निवेदन" },
  { "serial_no": 5, "title": "वडा कार्यलयले महानगरपालिकालाई सम्झौताका लागी दिने सिफारिस", "description": "(नोट: वडाबाट सम्झौता हुने योजनालाई आवश्यक नभएको )" },
  { "serial_no": 6, "title": "उपभोक्ता सम्झौता सम्बन्धी टिप्पणी (उपभोक्ता समितिसँग सम्झौता गर्न सिफारिस सम्बन्धी टिप्पणी)" },
  { "serial_no": 7, "title": "उपभोक्ता समितिलाई कार्यादेश दिने सम्बन्धी टिप्पणी वा निर्णय" }
];

const PROJECT_AGREEMENT_WORK_TITLES = [
  { "serial_no": 1, "title": "योजना सम्झौता टिप्पणी र आदेश" },
  { "serial_no": 2, "title": "योजना/कार्यक्रम सम्झौताको लागि सम्झौता फाराम" },
  { "serial_no": 3, "title": "आयोजना सन्चालन कार्यादेश" },
  { "serial_no": 4, "title": "आयोजना सूचना पाटी को नमुना" },
];

const ProjectAgreementTab: React.FC<ProjectAgreementTabProps> = ({
  project,
  projectAgreementDetails,
  onAddProjectAgreement,
  onDownloadProjectAgreement,
  onDownloadProjectAgreementAndWorkLoad,
  onAgreementFileUpload,
  onWorkFileUpload,
  uploadedProjectAgreementFiles = {},
  uploadedProjectAgreementWorkFiles = {}
}) => {
  const [isProjectAgreementModalOpen, setIsProjectAgreementModalOpen] = useState(false);
  const [isAgreementFileUploadModalOpen, setIsAgreementFileUploadModalOpen] = useState(false);
  const [isWorkFileUploadModalOpen, setIsWorkFileUploadModalOpen] = useState(false);

  const [selectedAgreementUploadItem, setSelectedAgreementUploadItem] = useState<{ serial_no: number; title: string } | null>(null);
  const [selectedWorkUploadItem, setSelectedWorkUploadItem] = useState<{ serial_no: number; title: string } | null>(null);

  const [localUploadedAgreementFiles, setLocalUploadedAgreementFiles] = useState<{ [key: number]: { file: File; type: string; file_url?: string } }>({});
  const [localUploadedWorkFiles, setLocalUploadedWorkFiles] = useState<{ [key: number]: { file: File; type: string, file_url?: string } }>({});

  const [previewAgreementImage, setPreviewAgreementImage] = useState<{ url: string; title: string } | null>(null);
  const [previewWorkImage, setPreviewWorkImage] = useState<{ url: string; title: string } | null>(null);

  const [fetchedAgreementFiles, setFetchedAgreementFiles] = useState<any[]>([]);
  const [fetchedWorkFiles, setFetchedWorkFiles] = useState<any[]>([]);

  const today = new Date();
  const bsDate = BS.ADToBS(today);
  const agreementDetail = projectAgreementDetails[0];

  const fetchAgreementFiles = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.get(
        `http://213.199.53.33:8000/api/projects/project-aggrement/${project.serial_number}/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      setFetchedAgreementFiles(response.data);
    } catch (error) {
      console.error('Failed to fetch agreement files:', error);
      toast.error('सम्झौता फाइलहरू लोड गर्न सकिएन');
    }
  };

  const fetchWorkFiles = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.get(
        `http://213.199.53.33:8000/api/projects/project-plan-tracker/${project.serial_number}/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      setFetchedWorkFiles(response.data);
    } catch (error) {
      console.error('Failed to fetch work files:', error);
      toast.error('कार्यादेश फाइलहरू लोड गर्न सकिएन');
    }
  };

  useEffect(() => {
    fetchAgreementFiles();
    fetchWorkFiles();
  }, [project.serial_number]);

  const handleAgreementUploadClick = (serialNo: number, title: string) => {
    setSelectedAgreementUploadItem({ serial_no: serialNo, title });
    setIsAgreementFileUploadModalOpen(true);
  };

  const handleWorkUploadClick = (serialNo: number, title: string) => {
    setSelectedWorkUploadItem({ serial_no: serialNo, title });
    setIsWorkFileUploadModalOpen(true);
  };

  const handleAgreementFileUpload = async (serialNo: number, file: File) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('serial_no', project.serial_number.toString());
      formData.append('document_type', serialNo.toString());

      await axios.post(
        `http://213.199.53.33:8000/api/projects/project-aggrement/${project.serial_number}/upload/`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const fileType = file.type.startsWith('image/') ? 'image' : 'pdf';

      // Update only agreement files state
      setLocalUploadedAgreementFiles(prev => {
        const newState = { ...prev };
        newState[serialNo] = { file, type: fileType };
        return newState;
      });

      // Call the specific agreement file upload handler
      if (onAgreementFileUpload) {
        onAgreementFileUpload(serialNo, file);
      }

      toast.success('फाइल सफलतापूर्वक अपलोड भयो');
      fetchAgreementFiles(); // Refresh the agreement files list

      setIsAgreementFileUploadModalOpen(false);
    } catch (error) {
      console.error('File upload failed:', error);
      toast.error('फाइल अपलोड गर्न सकिएन');
      throw error;
    }
  };

  const handleWorkFileUpload = async (serialNo: number, file: File) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('serial_no', project.serial_number.toString());

      await axios.post(
        `http://213.199.53.33:8000/api/projects/project-plan-tracker/${project.serial_number}/upload/`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const fileType = file.type.startsWith('image/') ? 'image' : 'pdf';

      // Update only work files state
      setLocalUploadedWorkFiles(prev => {
        const newState = { ...prev };
        newState[serialNo] = { file, type: fileType };
        return newState;
      });

      // Call the specific work file upload handler
      if (onWorkFileUpload) {
        onWorkFileUpload(serialNo, file);
      }

      toast.success('फाइल सफलतापूर्वक अपलोड भयो');
      fetchWorkFiles(); // Refresh the work files list

      setIsWorkFileUploadModalOpen(false);
    } catch (error) {
      console.error('File upload failed:', error);
      toast.error('फाइल अपलोड गर्न सकिएन');
      throw error;
    }
  };

  const handleAgreementPreviewImage = (serialNo: number) => {
    const uploadedFile = localUploadedAgreementFiles[serialNo] ||
      uploadedProjectAgreementFiles[serialNo] ||
      fetchedAgreementFiles.find(file => file.document_type === serialNo.toString());

    if (!uploadedFile) return;

    const item = PROJECT_AGREEMENT_TITLES.find(item => item.serial_no === serialNo);

    // For API-fetched files
    if (uploadedFile.file_url) {
      setPreviewAgreementImage({ url: uploadedFile.file_url, title: item?.title || 'Image Preview' });
      return;
    }

    // For local uploads
    if (uploadedFile.type === 'image') {
      const url = URL.createObjectURL(uploadedFile.file);
      setPreviewAgreementImage({ url, title: item?.title || 'Image Preview' });
    }
  };

  const handleWorkPreviewImage = (serialNo: number) => {
    const uploadedFile = localUploadedWorkFiles[serialNo] ||
      uploadedProjectAgreementWorkFiles[serialNo] ||
      fetchedWorkFiles.find(file => file.document_type === serialNo.toString());

    if (!uploadedFile) return;

    const item = PROJECT_AGREEMENT_WORK_TITLES.find(item => item.serial_no === serialNo);

    // For API-fetched files
    if (uploadedFile.file_url) {
      setPreviewWorkImage({ url: uploadedFile.file_url, title: item?.title || 'Image Preview' });
      return;
    }

    // For local uploads
    if (uploadedFile.type === 'image') {
      const url = URL.createObjectURL(uploadedFile.file);
      setPreviewWorkImage({ url, title: item?.title || 'Image Preview' });
    }
  };

  const closeAgreementPreview = () => {
    if (previewAgreementImage) {
      URL.revokeObjectURL(previewAgreementImage.url);
      setPreviewAgreementImage(null);
    }
  };

  const closeWorkPreview = () => {
    if (previewWorkImage) {
      URL.revokeObjectURL(previewWorkImage.url);
      setPreviewWorkImage(null);
    }
  };

  const getAgreementUploadStatus = (serialNo: number) => {
    const uploadedFile = localUploadedAgreementFiles[serialNo] ||
      uploadedProjectAgreementFiles[serialNo] ||
      fetchedAgreementFiles.find(file => file.document_type === serialNo.toString());
    return uploadedFile ? 'अपलोड गरिएको' : '–';
  };

  const getWorkUploadStatus = (serialNo: number) => {
    const uploadedFile = localUploadedWorkFiles[serialNo] ||
      uploadedProjectAgreementWorkFiles[serialNo] ||
      fetchedWorkFiles.find(file => file.document_type === serialNo.toString());
    return uploadedFile ? 'अपलोड गरिएको' : '–';
  };

  const isAgreementFileUploaded = (serialNo: number) => {
    return !!(localUploadedAgreementFiles[serialNo] ||
      uploadedProjectAgreementFiles[serialNo] ||
      fetchedAgreementFiles.find(file => file.document_type === serialNo.toString()));
  };

  const isWorkFileUploaded = (serialNo: number) => {
    return !!(localUploadedWorkFiles[serialNo] ||
      uploadedProjectAgreementWorkFiles[serialNo] ||
      fetchedWorkFiles.find(file => file.document_type === serialNo.toString()));
  };

  const getAgreementFileType = (serialNo: number) => {
    const uploadedFile = localUploadedAgreementFiles[serialNo] ||
      uploadedProjectAgreementFiles[serialNo] ||
      fetchedAgreementFiles.find(file => file.document_type === serialNo.toString());

    if (!uploadedFile) return null;

    // For API-fetched files
    if (uploadedFile.file_url) {
      const extension = uploadedFile.file_url.split('.').pop()?.toLowerCase();
      return extension === 'pdf' ? 'pdf' : 'image';
    }

    // For local uploads
    return uploadedFile.type;
  };

  const getWorkFileType = (serialNo: number) => {
    const uploadedFile = localUploadedWorkFiles[serialNo] ||
      uploadedProjectAgreementWorkFiles[serialNo] ||
      fetchedWorkFiles.find(file => file.document_type === serialNo.toString());

    if (!uploadedFile) return null;

    // For API-fetched files
    if (uploadedFile.file_url) {
      const extension = uploadedFile.file_url.split('.').pop()?.toLowerCase();
      return extension === 'pdf' ? 'pdf' : 'image';
    }

    // For local uploads
    return uploadedFile.type;
  };

  return (
    <div className="space-y-8">
      {/* Project Agreement Recommendation and Others */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">योजना सम्झौता सिफारिस तथा अन्य</h3>
        <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
          <table className="min-w-full text-sm text-left text-gray-800">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 font-semibold text-gray-900">क्र.स.</th>
                <th className="py-3 px-4 font-semibold text-gray-900">शीर्षक</th>
                <th className="py-3 px-4 font-semibold text-gray-900">मिति</th>
                <th className="py-3 px-4 font-semibold text-gray-900">स्थिति</th>
                <th className="py-3 px-4 font-semibold text-gray-900">कार्य</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {PROJECT_AGREEMENT_TITLES.map((item) => (
                <tr
                  key={`agreement-${item.serial_no}`}
                  className="hover:bg-gray-50 transition duration-150 ease-in-out"
                >
                  <td className="py-3 px-4">{toNepaliNumber(item.serial_no)}</td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{item.title}</div>
                    {item.description && <div className="text-xs text-gray-500">{item.description}</div>}
                  </td>
                  <td className="py-3 px-4">{toNepaliNumber(bsDate)}</td>
                  <td className="py-3 px-4">
                    <span className={isAgreementFileUploaded(item.serial_no) ? 'text-green-600 font-medium' : ''}>
                      {getAgreementUploadStatus(item.serial_no)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        className={`cursor-pointer ${isAgreementFileUploaded(item.serial_no) ? 'text-green-600 hover:text-green-800' : 'text-blue-600 hover:text-blue-800'}`}
                        onClick={() => handleAgreementUploadClick(item.serial_no, item.title)}
                        title={isAgreementFileUploaded(item.serial_no) ? 'फाइल परिवर्तन गर्नुहोस्' : 'फाइल अपलोड गर्नुहोस्'}
                      >
                        <Upload className="w-5 h-5" />
                      </button>
                      {getAgreementFileType(item.serial_no) === 'image' && (
                        <button
                          type="button"
                          className="text-purple-600 hover:text-purple-800 cursor-pointer"
                          onClick={() => handleAgreementPreviewImage(item.serial_no)}
                          title="छवि हेर्नुहोस्"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => onDownloadProjectAgreement(item.serial_no, project.serial_number)}
                        className="p-1 text-green-600 hover:text-green-800 transition cursor-pointer"
                        title="Download PDF"
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
      </div>

      {/* Project Agreement Details */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">योजना सम्झौता विवरण</h3>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer"
            onClick={() => setIsProjectAgreementModalOpen(true)}
          >
            <Edit className="w-4 h-4" />
            <span>{agreementDetail ? 'इडिट गर्नुहोस्' : 'थप गर्नुहोस्'}</span>
          </button>
        </div>
        {!agreementDetail ? (
          <EmptyState message="योजना सम्झौता विवरण उपलब्ध छैन।" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">स्वीकृत लागत अनुमान:</p>
              <p className="text-lg font-semibold">{toNepaliNumber(formatBudget(agreementDetail.cost_estimate))}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">कन्टिन्जेन्सी प्रतिशत:</p>
              <p className="text-lg font-semibold">{toNepaliNumber(agreementDetail.contingency_percentage) || '0'}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">कन्टिन्जेन्सी रकम:</p>
              <p className="text-lg font-semibold">{toNepaliNumber(formatBudget(agreementDetail.contingency_amount))}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">कुल लागत अनुमान:</p>
              <p className="text-lg font-semibold">{toNepaliNumber(formatBudget(agreementDetail.total_cost_estimate))}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">सम्झौता रकम:</p>
              <p className="text-lg font-semibold">{toNepaliNumber(formatBudget(agreementDetail.agreement_amount))}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">सम्झौता मिति:</p>
              <p className="text-lg font-semibold">{toNepaliNumber(agreementDetail.agreement_date) || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">नगरपालिकाले ब्यहेर्ने रकम रु:</p>
              <p className="text-lg font-semibold">{toNepaliNumber(formatBudget(agreementDetail.municipality_amount))}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">नगरपालिकाले ब्यहेर्ने रकमको प्रतिशत:</p>
              <p className="text-lg font-semibold">{toNepaliNumber(agreementDetail.municipality_percentage) || 'N/A'}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">जनसहभागिता रकम:</p>
              <p className="text-lg font-semibold">{toNepaliNumber(formatBudget(agreementDetail.public_participation_amount))}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">जनसहभागिताले ब्यहेर्ने रकमको प्रतिशत:</p>
              <p className="text-lg font-semibold">{toNepaliNumber(agreementDetail.public_participation_percentage) || 'N/A'}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">कार्यादेश मिति:</p>
              <p className="text-lg font-semibold">{toNepaliNumber(agreementDetail.work_order_date) || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">कार्य सम्पन्न गर्नुपर्ने मिति:</p>
              <p className="text-lg font-semibold">{toNepaliNumber(agreementDetail.completion_date) || 'N/A'}</p>
            </div>
          </div>
        )}

        {isProjectAgreementModalOpen && (
          <ProjectAgreementModal
            onClose={() => setIsProjectAgreementModalOpen(false)}
            onSave={onAddProjectAgreement}
            agreementData={agreementDetail}
            projectId={project.serial_number}
          />
        )}
      </div>

      {/* Project Agreement and Work Order */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">योजना सम्झौता तथा कार्यादेश</h3>
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
              {PROJECT_AGREEMENT_WORK_TITLES.map((item) => (
                <tr key={`work-${item.serial_no}`} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{toNepaliNumber(item.serial_no)}</td>
                  <td className="py-3 px-4 text-gray-900 text-sm">
                    <div>{item.title}</div>
                  </td>
                  <td className="py-3 px-4 text-gray-900 text-sm">{toNepaliNumber(bsDate)}</td>
                  <td className="py-3 px-4 text-gray-900 text-sm">
                    <span className={isWorkFileUploaded(item.serial_no) ? 'text-green-600 font-medium' : ''}>
                      {getWorkUploadStatus(item.serial_no)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-900 text-sm flex space-x-2">
                    <button
                      type="button"
                      className={`cursor-pointer ${isWorkFileUploaded(item.serial_no) ? 'text-green-600 hover:text-green-800' : 'text-blue-600 hover:text-blue-800'}`}
                      onClick={() => handleWorkUploadClick(item.serial_no, item.title)}
                      title={isWorkFileUploaded(item.serial_no) ? 'फाइल परिवर्तन गर्नुहोस्' : 'फाइल अपलोड गर्नुहोस्'}
                    >
                      <Upload className="w-5 h-5" />
                    </button>
                    {getWorkFileType(item.serial_no) === 'image' && (
                      <button
                        type="button"
                        className="text-purple-600 hover:text-purple-800 cursor-pointer"
                        onClick={() => handleWorkPreviewImage(item.serial_no)}
                        title="छवि हेर्नुहोस्"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    )}

                    <button
                      type="button"
                      className="p-1 rounded text-blue-600 hover:text-blue-800 cursor-pointer"
                      onClick={() => onDownloadProjectAgreementAndWorkLoad(item.serial_no, project.serial_number)}
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

      {/* Agreement File Upload Modal */}
      {isAgreementFileUploadModalOpen && selectedAgreementUploadItem && (
        <ConsumerCommitteefileUploadModal
          isOpen={isAgreementFileUploadModalOpen}
          onClose={() => {
            setIsAgreementFileUploadModalOpen(false);
            setSelectedAgreementUploadItem(null);
          }}
          onUpload={handleAgreementFileUpload}
          serialNo={selectedAgreementUploadItem.serial_no}
          title={selectedAgreementUploadItem.title}
        />
      )}

      {/* Work File Upload Modal */}
      {isWorkFileUploadModalOpen && selectedWorkUploadItem && (
        <ConsumerCommitteefileUploadModal
          isOpen={isWorkFileUploadModalOpen}
          onClose={() => {
            setIsWorkFileUploadModalOpen(false);
            setSelectedWorkUploadItem(null);
          }}
          onUpload={handleWorkFileUpload}
          serialNo={selectedWorkUploadItem.serial_no}
          title={selectedWorkUploadItem.title}
        />
      )}

      {/* Agreement Image Preview Modal */}
      {previewAgreementImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeAgreementPreview}>
          <div className="max-w-4xl max-h-4xl p-4">
            <div className="bg-white rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{previewAgreementImage.title}</h3>
                <button
                  onClick={closeAgreementPreview}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <img
                src={previewAgreementImage.url}
                alt={previewAgreementImage.title}
                className="max-w-full max-h-96 object-contain mx-auto"
              />
            </div>
          </div>
        </div>
      )}

      {/* Work Image Preview Modal */}
      {previewWorkImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeWorkPreview}>
          <div className="max-w-4xl max-h-4xl p-4">
            <div className="bg-white rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{previewWorkImage.title}</h3>
                <button
                  onClick={closeWorkPreview}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <img
                src={previewWorkImage.url}
                alt={previewWorkImage.title}
                className="max-w-full max-h-96 object-contain mx-auto"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectAgreementTab;