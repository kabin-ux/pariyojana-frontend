import React, { useState } from 'react';
import { usePlanning } from '../../hooks/usePlanning';
import { MunicipalityPrideTabs } from './MunicipalityPrideTabs';
import { MunicipalityPrideBreadcrumb } from './MunicipalityPrideBreadCrumb';
import { MunicipalityPrideSearch } from './MunicipalityPrideSearch';
import { MunicipalityPrideTable } from './MunicipalityPrideTable';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ReportTabs } from './ReportTabs';
import { ReportContent } from './ReportContent';
import { EmptyState } from '../WardOffice/EmptyState';
import EditProjectModal from '../../modals/EditProjectsModal';
import type { ProjectType } from '../../types/projectType';


const MunicipalityPrideProject: React.FC = () => {
  const [activeTab, setActiveTab] = useState('प्रविष्टी भएका नगर गौरव आयोजना');
  const reportTabs = [
    'प्रविष्टी भएका नगर गौरव आयोजना',
    'बजेट तथा कार्यक्रम तर्जुमा समितिमा पेश गरिएको परियोजना',
  ];
  const [activeReportTab, setActiveReportTab] = useState(reportTabs[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const { municipalityPrideProjects = [], municipalityPrideBudget = [], refetch } = usePlanning();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const filteredProjects = municipalityPrideProjects?.filter(item =>
    item.plan_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBudget = municipalityPrideBudget?.filter(item =>
    item.plan_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRecommendtoBudget = async (id: number) => {
    try {
      await axios.post(`http://3.108.67.147/api/planning/municipality-pride-project/municipality-pride-projects/${id}/recommend-to-budget-committee/`);
      toast.success('परियोजना सफलतापूर्वक बजेट तथा कार्यक्रम तर्जुमा समितिमा सिफारिस गरियो।');
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error('बजेट समितिमा सिफारिस गर्न असफल भयो। कृपया पुनः प्रयास गर्नुहोस्।');
    }
  };


  const handleEdit = (item: any) => {
    setSelectedProject(item);
    setEditModalOpen(true);
  };

  const getProjectType = (): ProjectType => {
    if (activeTab === 'प्रविष्टी भएका नगर गौरव आयोजना') return 'municipality-pride';
    return 'municipality-pride';
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
        <MunicipalityPrideSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          activeTab={activeTab}
        />
        {filteredProjects.length > 0 || filteredBudget.length > 0 ? (
          <MunicipalityPrideTable
            activeTab={activeTab}
            projects={filteredProjects}
            budget={filteredBudget}
            onRecommend={handleRecommendtoBudget}
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
      <MunicipalityPrideBreadcrumb />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">नगर गौरव आयोजना</h1>

        <MunicipalityPrideTabs activeTab={activeTab} onTabChange={setActiveTab} />
        {renderContent()}
      </div>
    </main>
  );
};

export default MunicipalityPrideProject;