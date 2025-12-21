import React, { useState } from 'react';
import axios from 'axios';
import { usePlanning } from '../../hooks/usePlanning';
import { SubjectCommitteeTabs } from './SubjectCommitteeTabs';
import { SubjectCommitteeSearch } from './SubjectCommitteeSearch';
import { SubjectCommitteeTable } from './SubjectCommitteeTable';
import toast from 'react-hot-toast';
import { SubjectCommitteeBreadcrumb } from './SubjectCommitteeBreadCrumb';
import { EmptyState } from '../WardOffice/EmptyState';
import { ReportContent } from './ReportContent';
import { ReportTabs } from './ReportTabs';
import EditProjectModal from '../../modals/EditProjectsModal';

const SubjectCommittee: React.FC = () => {
  const [activeTab, setActiveTab] = useState('वडाबाट सिफारिस भएका परियोजना');
  const reportTabs = [
    'वडा समितिले सिफारिस गरेका योजना',
    'विषयगत समितिले प्रविष्ट गरेको योजना',
    'विषयगत समितिले प्राथमिकरण गरिएको परियोजना',
  ];
  const [activeReportTab, setActiveReportTab] = useState(reportTabs[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const {
    recommendedThematicWardProjects = [],
    thematicProjects = [],
    prioritizedThematicProjects = [],
    refetch
  } = usePlanning();

  // 🔁 Select appropriate data based on active tab
  const getActiveTabData = () => {
    if (activeTab === 'वडाबाट सिफारिस भएका परियोजना') {
      return recommendedThematicWardProjects;
    } else if (activeTab === 'विषयगत समितिले प्रविष्ट गरेको योजना') {
      return thematicProjects;
    } else if (activeTab === 'विषयगत समितिले प्राथमिकरण गरेको परियोजना') {
      return prioritizedThematicProjects;
    } else {
      return [];
    }
  };

  const filteredData = getActiveTabData().filter(item =>
    (item?.plan_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrioritizeThematicWardProject = async (id: number) => {
    try {
      await axios.post(`http://213.199.53.33:81/api/planning/thematic/wardrecommend-project/${id}/prioritize/`);
      toast.success('परियोजना सफलतापूर्वक प्राथमिकरण गरियो।');
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error('परियोजना प्राथमिकरण गर्न असफल भयो। कृपया पुनः प्रयास गर्नुहोस्।');
    }
  };

  const handlePrioritize = async (id: number) => {
    try {
      await axios.post(`http://213.199.53.33:81/api/planning/thematic/thematic-plans/${id}/prioritize/`);
      toast.success('परियोजना सफलतापूर्वक प्राथमिकरण गरियो।');
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error('परियोजना प्राथमिकरण गर्न असफल भयो। कृपया पुनः प्रयास गर्नुहोस्।');
    }
  };

  const handleRecommendtoBudget = async (id: number) => {
    try {
      await axios.post(`http://213.199.53.33:81/api/planning/thematic/prioritized-plans/${id}/submit-to-budget-committee/`);
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

  const getProjectType = () => {
    if (activeTab === 'वडाबाट सिफारिस भएका परियोजना') return 'wardrecommend';
    if (activeTab === 'विषयगत समितिले प्रविष्ट गरेको योजना') return 'thematic';
    return 'ward';
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
        <SubjectCommitteeSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        {filteredData.length > 0 ? (
          <SubjectCommitteeTable
            activeTab={activeTab}
            data={filteredData}
            onPrioritizeThematicWard={handlePrioritizeThematicWardProject}
            onPrioritize={handlePrioritize}
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
      <SubjectCommitteeBreadcrumb  />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">विषयगत समिति</h1>

        <SubjectCommitteeTabs activeTab={activeTab} onTabChange={setActiveTab} />
        {renderContent()}
      </div>
    </main>
  );
};

export default SubjectCommittee;
