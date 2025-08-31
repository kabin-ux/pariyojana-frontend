import React, { useState, useEffect } from 'react';
import { useProjectDetail } from '../../hooks/useProjectDetail';
import ProgramDetailsTab from '../../components/projectdetailssubtab/ProgramDetailTab';
import InitiationProcessSection from '../../modals/InitiationProcessSections';
import PaymentInstallment from '../PaymentInstallment/PaymentInstallment';
import axios from 'axios';
import toast from 'react-hot-toast';
import ProjectDetailTabs from './ProjectDetailTabs';
import ProjectDetailHeader from './ProjectDetailHeader';
import EmptyState from './EmptyState';
import DocumentsTab from './DocumentsTab';
import LoadingSpinner from './LoadingSpinner';
import OperationLocationTab from './OperationLocationTab';
import ProjectAgreementTab from './ProjectAgreementTab';
import CostEstimateTab from './CostEstimateTab';
import ConsumerCommitteeTab from './ConsumerCommitteeTab';
import Swal from 'sweetalert2';


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

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack }) => {
  const [activeTab, setActiveTab] = useState('कार्यक्रमको विवरण');
  const [committeeDetail, setCommitteeDetail] = useState<any>(null);
  const [agreementDetail, setAgreementDetail] = useState<any>(null);
  const [documentDetail, setDocumentDetail] = useState<any>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: number]: { file: File; type: string } }>({});
  const [uploadedProjectAgreementFiles, setUploadedProjectAgreementFiles] = useState<{ [key: number]: { file: File; type: string } }>({});
  const [uploadedProjectAgreementWorkFiles, setUploadedProjectAgreementWorkFiles] = useState<{ [key: number]: { file: File; type: string } }>({});

  const projectIdNum = parseInt(project?.serial_number);
  const {
    consumerCommitteeDetails,
    officialDetails,
    monitoringCommittee,
    costEstimateDetails,
    mapCostEstimate,
    calculateCostEstimateDetails,
    workType,
    workInProgress,
    projectAgreementDetails,
    documents,
    otherdocuments,
    operationLocation,
    loading,
    error,
    loadProgramDetails,
    loadInitiationProcess,
    loadConsumerCommitteeDetails,
    loadCostEstimate,
    loadProjectAgreement,
    loadDocuments,
    loadOtherDocuments,
    loadOperationDetails,
    deleteOfficialDetail,
    deleteMonitoringCommittee,
    deleteDocument,
  } = useProjectDetail(projectIdNum);

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
      case 'संचालन स्थल':
        loadOperationDetails();
        break;
      case 'अन्य डकुमेन्ट':
        loadDocuments();
        loadOtherDocuments();
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

  useEffect(() => {
    if (otherdocuments.length > 0) {
      setDocumentDetail(otherdocuments[0]);
    }
  }, [otherdocuments]);

  useEffect(() => {
    if (projectAgreementDetails.length > 0) {
      setAgreementDetail(projectAgreementDetails[0]);
    }
  }, [projectAgreementDetails]);

  // Handler functions
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
        const url = `http://43.205.239.123/api/projects/${project.serial_number}/consumer-committee-details/${committeeDetail.id}/`;
        await axios.patch(url, data, config);
        toast.success("समिति विवरण सफलतापूर्वक अपडेट गरियो");
      } else {
        const url = `http://43.205.239.123/api/projects/${project.serial_number}/consumer-committee-details/`;
        await axios.post(url, { ...data, project: project.serial_number }, config);
        toast.success("समिति विवरण सफलतापूर्वक थपियो");
      }

      await loadConsumerCommitteeDetails();
    } catch (error) {
      console.error("Failed to save committee details", error);
    }
  };

  const handleSavePosition = async (rows: FormRow[]) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const officialDetailsArray = Array.isArray(officialDetails) ? officialDetails : [officialDetails];
      const rowsToUpdate = rows.filter(row =>
        officialDetailsArray.some(detail => detail.id === row.id)
      );

      const updatePromises = rowsToUpdate.map(async (row) => {
        const formData = new FormData();
        formData.append("project", project.serial_number);
        formData.append("post", row.post);
        formData.append("full_name", row.full_name || '');
        formData.append("address", row.address || '');
        formData.append("gender", row.gender || '');
        formData.append("citizenship_no", row.citizenship_no || '');
        formData.append("contact_no", row.contact_no || '');

        if (row.citizenship_front && typeof row.citizenship_front === 'object') {
          formData.append("citizenship_front", row.citizenship_front);
        }
        if (row.citizenship_back && typeof row.citizenship_back === 'object') {
          formData.append("citizenship_back", row.citizenship_back);
        }

        const matchedDetail = officialDetailsArray.find(detail => detail.id === row.id);
        const url = `http://43.205.239.123/api/projects/${project.serial_number}/official-details/${matchedDetail?.id}/`;

        return axios.patch(url, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      });

      await Promise.all(updatePromises);
      await loadConsumerCommitteeDetails();
      toast.success("पदाधिकारी विवरण सफलतापूर्वक अपडेट गरियो।");
    } catch (error) {
      console.error("Error saving official details:", error);
      // toast.error("पदाधिकारी विवरण अपडेट गर्न सकिएन।");
    }
  };

  const handleSaveResearch = async (rows: FormRow[]) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const monitoringDetailsArray = Array.isArray(monitoringCommittee) ? monitoringCommittee : [monitoringCommittee];
      const rowsToUpdate = rows.filter(row =>
        monitoringDetailsArray.some(detail => detail.id === row.id)
      );

      const updatePromises = rowsToUpdate.map(async (row) => {
        const formData = new FormData();
        const matchedDetail = monitoringDetailsArray.find(detail => detail.id === row.id);

        formData.append("project", project.serial_number);
        formData.append("serial_no", matchedDetail?.serial_no?.toString() ?? '');
        formData.append("post", row.post);
        formData.append("full_name", row.full_name || '');
        formData.append("address", row.address || '');
        formData.append("gender", row.gender || '');
        formData.append("citizenship_no", row.citizenship_no || '');
        formData.append("contact_no", row.contact_no || '');

        if (row.citizenship_front && typeof row.citizenship_front === 'object') {
          formData.append("citizenship_front", row.citizenship_front);
        }

        if (row.citizenship_back && typeof row.citizenship_back === 'object') {
          formData.append("citizenship_back", row.citizenship_back);
        }

        const url = `http://43.205.239.123/api/projects/${project.serial_number}/monitoring-committee/${matchedDetail?.id}/`;

        return axios.patch(url, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      });

      await Promise.all(updatePromises);
      await loadConsumerCommitteeDetails();
      toast.success("अनुगमन तथा सहजिकरण समिति सफलतापूर्वक अपडेट गरियो।");
    } catch (error) {
      console.error("Error saving monitoring committee:", error);
      // toast.error("अनुगमन समिति सेभ गर्न सकिएन।");
    }
  };

  const handleFileUpload = async (data: any) => {
    try {
      const token = localStorage.getItem('access_token');
      const formData = new FormData();

      formData.append('title', data.title);

      if (data.file) {
        formData.append('file', data.file);
      }

      if (data.remarks) {
        formData.append('remarks', data.remarks);
      }

      let url = `http://43.205.239.123/api/projects/${projectIdNum}/map-cost-estimate/`;
      let method = 'post';

      if (data.editMapCostId) {
        url = `http://43.205.239.123/api/projects/${projectIdNum}/map-cost-estimate/${data.editMapCostId}/`;
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

      toast.success(data.editMapCostId ? 'फाइल अपलोड सम्पादन भयो' : 'फाइल अपलोड सफलतापूर्वक थपियो');
      await loadCostEstimate();
    } catch (error) {
      console.error('File upload failed:', error);
      toast.error('फाइल अपलोड गर्न सकिएन');
    }
  };

  const handleSendAuthentication = async () => {
    console.log('Authentication sent successfully!');
    toast.success('प्रमाणीकरण सफलतापूर्वक पठाइयो');
    await loadCostEstimate();
  };

  const handleDownload = async (itemSerialNo: number, projectSerialNo: number) => {
    try {
      const response = await axios.get(
        `http://43.205.239.123/api/projects/consumer-committee/generate-pdf/${itemSerialNo}/${projectSerialNo}/`,
        {
          responseType: 'blob',
        }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `committee-template-${itemSerialNo}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('PDF download failed:', error);
      toast.error('डाउनलोड गर्न समस्या भयो।');
    }
  };

  const handleDownloadProjectAgreement = async (itemSerialNo: number, projectSerialNo: number) => {
    try {
      const response = await axios.get(
        `http://43.205.239.123/api/projects/project-plan-tracker/download/${itemSerialNo}/${projectSerialNo}/`,
        {
          responseType: 'blob',
        }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `project-agreement-template-${itemSerialNo}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('PDF download failed:', error);
      toast.error('डाउनलोड गर्न समस्या भयो।');
    }
  };

  const handleDownloadProjectAgreementAndWorkLoad = async (itemSerialNo: number, projectSerialNo: number) => {
    try {
      const response = await axios.get(
        `http://43.205.239.123/api/projects/project-aggrement/download/${itemSerialNo}/${projectSerialNo}/`,
        {
          responseType: 'blob',
        }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `project-agreement-template-${itemSerialNo}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('PDF download failed:', error);
      toast.error('डाउनलोड गर्न समस्या भयो।');
    }
  };

  const handleAddProjectAgreement = async (data: any) => {
    try {
      const token = localStorage.getItem('access_token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      if (agreementDetail) {
        const url = `http://43.205.239.123/api/projects/${project.serial_number}/project-agreement-details/${agreementDetail.id}/`;
        await axios.patch(url, data, config);
        toast.success("समिति विवरण सफलतापूर्वक अपडेट गरियो");
      } else {
        const url = `http://43.205.239.123/api/projects/${project.serial_number}/project-agreement-details/`;
        await axios.post(url, { ...data, project: project.serial_number }, config);
        toast.success("समिति विवरण सफलतापूर्वक थपियो");
      }

      await loadProjectAgreement();
    } catch (error) {
      console.error("Failed to save committee details", error);
    }
  };

  const handleDownloadOtherDocument = async (itemSerialNo: number, projectSerialNo: number) => {
    try {
      const response = await axios.get(
        `http://43.205.239.123/api/projects/other-documents/download/${itemSerialNo}/${projectSerialNo}/`,
        {
          responseType: 'blob',
        }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `other-document-template-${itemSerialNo}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('PDF download failed:', error);
      toast.error('डाउनलोड गर्न समस्या भयो।');
    }
  };

  const handleAddDocument = async (formPayload: FormData) => {
    try {
      const token = localStorage.getItem('access_token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      };

      const url = `http://43.205.239.123/api/projects/${project.serial_number}/documents/`;
      await axios.post(url, formPayload, config);

      toast.success("डकुमेन्ट सफलतापूर्वक अपलोड भयो।");
      await loadOtherDocuments();
    } catch (error) {
      console.error("Failed to save document", error);
      toast.error("डकुमेन्ट सेभ गर्न असफल भयो।");
    }
  };

  const handleEditDocument = async (data: any) => {
    try {
      const token = localStorage.getItem('access_token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description || '');
      if (data.file) {
        formData.append('file', data.file);
      }

      const url = `http://43.205.239.123/api/projects/${project.serial_number}/documents/${documentDetail.id}/`;
      await axios.patch(url, formData, config);

      toast.success("डकुमेन्ट सफलतापूर्वक सम्पादन भयो");
      await loadOtherDocuments();
    } catch (error) {
      console.error("अपडेट गर्न असफल", error);
      toast.error("अपडेट गर्न असफल भयो");
    }
  };

  const handleDeleteDocument = async (id: number) => {
  const result = await Swal.fire({
    title: 'के तपाईं यो कागजात मेटाउन निश्चित हुनुहुन्छ?',
    text: 'यो कार्य फिर्ता गर्न सकिँदैन!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'हो, मेटाउनुहोस्',
    cancelButtonText: 'रद्द गर्नुहोस्',
  });

  if (result.isConfirmed) {
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`http://43.205.239.123/api/projects/${project.serial_number}/documents/${id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      await loadOtherDocuments();
      toast.success('सफलतापूर्वक मेटाइयो');
    } catch (error) {
      console.error('error deleting');
      toast.error('मेटाउन सकिएन');
    }
  }
};

  const handleSaveDocument = (data: any) => {
    if (documentDetail) {
      handleEditDocument(data);
    } else {
      handleAddDocument(data);
    }
  };

  const handleDelete = async (id: number, type: 'official' | 'monitoring' | 'document') => {
    const result = await Swal.fire({
      title: 'के तपाईं यो मेटाउन चाहनुहुन्छ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'हो, मेटाउनुहोस्',
      cancelButtonText: 'रद्द गर्नुहोस्',
    });

    if (result.isConfirmed) {
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
  };

  const handleGenerateBill = async (projectId: number) => {
    try {
      const response = await fetch(`http://43.205.239.123/api/projects/bill/project/${projectId}/pdf/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate bill PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bill_project_${projectId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating bill PDF:', error);
      toast.error('बिल डाउनलोड गर्न असफल भयो। कृपया पुनः प्रयास गर्नुहोस्।');
    }
  };

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
          <ConsumerCommitteeTab
            project={project}
            committeeDetail={committeeDetail}
            officialDetails={officialDetails}
            monitoringCommittee={monitoringCommittee}
            onSave={handleSave}
            onSavePosition={handleSavePosition}
            onSaveResearch={handleSaveResearch}
            onDelete={handleDelete}
            onDownload={handleDownload}
            onFileUpload={(serialNo, file) => {
              // Track uploaded files in parent component
              const fileType = file.type.startsWith('image/') ? 'image' : 'pdf';
              setUploadedFiles(prev => ({
                ...prev,
                [serialNo]: { file, type: fileType }
              }));
              console.log(`File uploaded for serial ${serialNo}:`, file.name);
            }}
            uploadedFiles={uploadedFiles}
          />
        );

      case 'लागत अनुमान':
        if (loading.cost) return <LoadingSpinner />;
        return (
          <CostEstimateTab
            project={project}
            costEstimateDetails={costEstimateDetails}
            mapCostEstimate={mapCostEstimate}
            calculateCostEstimateDetails={calculateCostEstimateDetails}
            workType={workType}
            workInProgress={workInProgress}
            onFileUpload={handleFileUpload}
            onSendAuthentication={handleSendAuthentication}
            onGenerateBill={handleGenerateBill}
            onLoadCostEstimate={loadCostEstimate}
          />
        );

      case 'योजना सम्झौता':
        if (loading.agreement) return <LoadingSpinner />;
        return (
          <ProjectAgreementTab
            project={project}
            projectAgreementDetails={projectAgreementDetails}
            onAddProjectAgreement={handleAddProjectAgreement}
            onDownloadProjectAgreement={handleDownloadProjectAgreement}
            onDownloadProjectAgreementAndWorkLoad={handleDownloadProjectAgreementAndWorkLoad}
            onFileUpload={(serialNo, file) => {
              // Track uploaded files in parent component
              const fileType = file.type.startsWith('image/') ? 'image' : 'pdf';
              setUploadedProjectAgreementFiles(prev => ({
                ...prev,
                [serialNo]: { file, type: fileType }
              }));
              console.log(`File uploaded for serial ${serialNo}:`, file.name);
            }}
            uploadedProjectAgreementFiles={uploadedProjectAgreementFiles}

            onWorkFileUpload={(serialNo, file) => {
              // Track uploaded files in parent component
              const fileType = file.type.startsWith('image/') ? 'image' : 'pdf';
              setUploadedProjectAgreementWorkFiles(prev => ({
                ...prev,
                [serialNo]: { file, type: fileType }
              }));
              console.log(`File uploaded for serial ${serialNo}:`, file.name);
            }}
            uploadedProjectAgreementWorkFiles={uploadedProjectAgreementWorkFiles}

          />
        );

      case 'संचालन स्थल':
        if (loading.agreement) return <LoadingSpinner />;
        return (
          <OperationLocationTab
            project={project}
            operationLocation={operationLocation}
            onLoadOperationDetails={loadOperationDetails}
          />
        );

      case 'किस्ता भुक्तानी सम्बन्धी':
        if (loading.documents) return <LoadingSpinner />;
        return <PaymentInstallment project={project} />;

      case 'अन्य डकुमेन्ट':
        if (loading.documents) return <LoadingSpinner />;
        return (
          <DocumentsTab
            project={project}
            documents={documents}
            otherdocuments={otherdocuments}
            onSaveDocument={handleSaveDocument}
            onDeleteDocument={handleDeleteDocument}
            onDownloadOtherDocument={handleDownloadOtherDocument}
          />
        );

      default:
        return <EmptyState message="यो खण्डमा अहिले कुनै डाटा उपलब्ध छैन।" />;
    }
  };

  return (
    <main className="flex-1 p-6">
      <ProjectDetailHeader
        onBack={onBack}
        activeTab={activeTab}
        projectSerialNumber={project.serial_number}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">परियोजना विवरण</h1>

        <ProjectDetailTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {renderTabContent()}
      </div>
    </main>
  );
};

export default ProjectDetail;