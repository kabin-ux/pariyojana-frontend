import React, { useState } from 'react';
import { BudgetCommitteeTabs } from './BudgetCommitteeTabs';
import { BudgetCommitteeSearch } from './BudgetCommitteeSearch';
import { BudgetCommitteeTable } from './BudgetCommitteeTable';
import { usePlanning } from '../../hooks/usePlanning';
import toast from 'react-hot-toast';
import axios from 'axios';
import { BudgetCommitteeBreadcrumb } from './BudgetCommitteeBreadcrumb';
import { EmptyState } from '../WardOffice/EmptyState';
import { ReportContent } from './ReportContent';
import { ReportTabs } from './ReportTabs';
import EditProjectModal from '../../modals/EditProjectsModal';

const BudgetCommittee: React.FC = () => {
  const [activeTab, setActiveTab] = useState('वडा स्तरीय कार्यक्रम');
  const reportTabs = [
    'वडा स्तरीय कार्यक्रम',
    'नगर स्तरीय कार्यक्रम',
    'विषयगत समितिको कार्यक्रम',
    'नगर गौरव आयोजना',
    'संघिय सरकारबाट हस्तान्तरित कार्यक्रम',
    'प्रदेश सरकारबाट हस्तान्तरित कार्यक्रम',
  ];
  const [activeReportTab, setActiveReportTab] = useState(reportTabs[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const {
    municipalityPrideBudget = [],
    wardLevelBudget = [],
    municipalityLevelBudget = [],
    thematicBudget = [],
    provincialGovernmentBudget = [],
    federalGovernmentBudget = [],
    refetch
  } = usePlanning();

  // Choose data source based on tab
  const getBudgetData = () => {
    switch (activeTab) {
      case 'वडा स्तरीय कार्यक्रम':
        return wardLevelBudget;
      case 'नगर स्तरीय कार्यक्रम':
        return municipalityLevelBudget;
      case 'विषयगत समितिको कार्यक्रम':
        return thematicBudget;
      case 'नगर गौरव आयोजना':
        return municipalityPrideBudget;
      case 'प्रदेश सरकारबाट हस्तान्तरित कार्यक्रम':
        return provincialGovernmentBudget;
      case 'संघिय सरकारबाट हस्तान्तरित कार्यक्रम':
        return federalGovernmentBudget;
      default:
        return [];
    }
  };

  const selectedProjects = getBudgetData();

  const filteredProjects = selectedProjects?.filter(item =>
    (item?.plan_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRecommendWardLevelToPreAssemblyProject = async (id: number) => {
    try {
      await axios.post(`http://localhost:8000/api/planning/budget-committee/budget-ward-projects/${id}/submit-to-executive/`);
      toast.success('परियोजना सफलतापूर्वक बजेट तथा कार्यक्रम तर्जुमा समितिमा सिफारिस गरियो।');
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error('बजेट समितिमा सिफारिस गर्न असफल भयो। कृपया पुनः प्रयास गर्नुहोस्।');
    }
  }
  const handleRecommendThematicToPreAssemblyProject = async (id: number) => {
    try {
      await axios.post(`http://localhost:8000/api/planning/budget-committee/thematic-programs/${id}/submit-to-executive/`);
      toast.success('परियोजना सफलतापूर्वक बजेट तथा कार्यक्रम तर्जुमा समितिमा सिफारिस गरियो।');
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error('बजेट समितिमा सिफारिस गर्न असफल भयो। कृपया पुनः प्रयास गर्नुहोस्।');
    }
  }
  const handleRecommendMunicipalityLevelToPreAssemblyProject = async (id: number) => {
    try {
      await axios.post(`http://localhost:8000/api/planning/budget-committee/municipality-programs/${id}/submit-to-executive/`);
      toast.success('परियोजना सफलतापूर्वक बजेट तथा कार्यक्रम तर्जुमा समितिमा सिफारिस गरियो।');
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error('बजेट समितिमा सिफारिस गर्न असफल भयो। कृपया पुनः प्रयास गर्नुहोस्।');
    }
  }

  const handleRecommendMunicipalityPrideToPreAssemblyProject = async (id: number) => {
    try {
      await axios.post(`http://localhost:8000/api/planning/budget-committee/municipality-pride/${id}/submit-to-executive/`);
      toast.success('परियोजना सफलतापूर्वक बजेट तथा कार्यक्रम तर्जुमा समितिमा सिफारिस गरियो।');
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error('बजेट समितिमा सिफारिस गर्न असफल भयो। कृपया पुनः प्रयास गर्नुहोस्।');
    }
  }

  const handleRecommendProvincialGovernmentToPreAssemblyProject = async (id: number) => {
    try {
      await axios.post(`http://localhost:8000/api/planning/budget-committee/provience-transfer-projects/${id}/submit-to-executive/`);
      toast.success('परियोजना सफलतापूर्वक बजेट तथा कार्यक्रम तर्जुमा समितिमा सिफारिस गरियो।');
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error('बजेट समितिमा सिफारिस गर्न असफल भयो। कृपया पुनः प्रयास गर्नुहोस्।');
    }
  }

  const handleRecommendFederalGovernmentToPreAssemblyProject = async (id: number) => {
    try {
      await axios.post(`http://localhost:8000/api/planning/budget-committee/federal-gov-projects/${id}/submit-to-executive/`);
      toast.success('परियोजना सफलतापूर्वक बजेट तथा कार्यक्रम तर्जुमा समितिमा सिफारिस गरियो।');
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error('बजेट समितिमा सिफारिस गर्न असफल भयो। कृपया पुनः प्रयास गर्नुहोस्।');
    }
  }

  const getRecommendHandler = () => {
    switch (activeTab) {
      case 'वडा स्तरीय कार्यक्रम':
        return handleRecommendWardLevelToPreAssemblyProject;
      case 'नगर स्तरीय कार्यक्रम':
        return handleRecommendMunicipalityLevelToPreAssemblyProject;
      case 'विषयगत समितिको कार्यक्रम':
        return handleRecommendThematicToPreAssemblyProject;
      case 'नगर गौरव आयोजना':
        return handleRecommendMunicipalityPrideToPreAssemblyProject;
      case 'प्रदेश सरकारबाट हस्तान्तरित कार्यक्रम':
        return handleRecommendProvincialGovernmentToPreAssemblyProject;
      case 'संघिय सरकारबाट हस्तान्तरित कार्यक्रम':
        return handleRecommendFederalGovernmentToPreAssemblyProject;
      default:
        return () => { };
    }
  };

  const handleEdit = (item: any) => {
    setSelectedProject(item);
    setEditModalOpen(true);
  };

  const getProjectType = () => {
    if (activeTab === 'प्रदेश सरकारबाट हस्तान्तरित कार्यक्रम') return 'provience-transfer-projects';
    if (activeTab === 'संघिय सरकारबाट हस्तान्तरित कार्यक्रम') return 'federal-gov-projects';
    return 'budget-committee';
  };

  const handleEditSave = () => {
    setEditModalOpen(false);
    setSelectedProject(null);
    refetch?.();
  };

  const renderContent = () => {
    if (activeTab === 'रिपोर्ट') {
      return (
        <div className="mt-8">
          <ReportTabs
            tabs={reportTabs}
            activeTab={activeReportTab}
            onTabChange={setActiveReportTab}
          />
          <ReportContent activeTab={activeReportTab} />
        </div>
      );
    }


    return (
      <>
        <BudgetCommitteeSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        {filteredProjects.length > 0 ? (
          <BudgetCommitteeTable
            activeTab={activeTab}
            projects={filteredProjects}
            onRecommend={getRecommendHandler()}
            onEdit={handleEdit}
          />
        ) : (
          <div className="mt-8">
            <EmptyState />
          </div>
        )}
        {/* Edit Modal */}
        <EditProjectModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={handleEditSave}
          projectData={selectedProject}
          projectType={getProjectType()}
        />
      </>
    );
  };

  return (
    <main className="flex-1 p-6">
      <BudgetCommitteeBreadcrumb wardNumber="१" />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">बजेट तथा कार्यक्रम तर्जुमा समिति</h1>

        <BudgetCommitteeTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {renderContent()}
      </div>
    </main>
  );
};

export default BudgetCommittee;
