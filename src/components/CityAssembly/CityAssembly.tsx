import React, { useState } from 'react';
import { usePlanning } from '../../hooks/usePlanning';
import CityAssemblyBreadcrumb from './CityAssemblyBreadCrumb';
import CityAssemblyTabs from './CityAssemblyTabs';
import CityAssemblySearch from './CityAssemblySearch';
import CityAssemblyTable from './CityAssemblyTable';
import toast from 'react-hot-toast';
import axios from 'axios';
import { EmptyState } from '../WardOffice/EmptyState';
import { ReportContent } from './ReportContent';
import { ReportTabs } from './ReportTabs';

// interface AssemblyData {
//   id: number;
//   plan_name: string;
//   thematic_area: string;
//   sub_area: string;
//   source: string;
//   expenditure_center: string;
//   budget: string;
//   ward_no: string;
//   status: string;
//   priority_no: number;
// }

const CityAssembly: React.FC = () => {
  const [activeTab, setActiveTab] = useState('सभामा पेश भएका परियोजना');
  const reportTabs = [
    'सभामा पेश भएका परियोजना',
    'नगर सभाले स्वीकृत गरिएको परियोजना',
  ];
  const [activeReportTab, setActiveReportTab] = useState(reportTabs[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const { submittedProjects = [], approvedProjects = [] } = usePlanning();

  const getFilteredData = () => {
    const sourceData =
      activeTab === 'नगर सभाले स्वीकृत गरिएको परियोजना' ? approvedProjects : submittedProjects;

    return sourceData.filter(item =>
      item?.plan_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredData = getFilteredData();

  const handleApproveProject = async (id: number) => {
    try {
      await axios.post(`/api/planning/municipal-assembly/submitted-projects/${id}/approve/`);
      toast.success('परियोजना सफलतापूर्वक बजेट तथा कार्यक्रम तर्जुमा समितिमा सिफारिस गरियो।');
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error('बजेट समितिमा सिफारिस गर्न असफल भयो। कृपया पुनः प्रयास गर्नुहोस्।');
    }
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
        <CityAssemblySearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        {filteredData.length > 0 ? (
          <CityAssemblyTable
            activeTab={activeTab}
            data={filteredData}
            onRecommend={handleApproveProject}
          />
        ) : (
          <div className="mt-8">
            <EmptyState />
          </div>
        )}
      </>
    );
  };

  return (
    <main className="flex-1 p-6">
      <CityAssemblyBreadcrumb />
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">नगर सभा</h1>
        <CityAssemblyTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {renderContent()}

      </div>
    </main>
  );
};

export default CityAssembly;