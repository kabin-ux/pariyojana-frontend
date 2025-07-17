import React, { useState } from 'react';
import { usePlanning } from '../../hooks/usePlanning';
import CityAssemblyBreadcrumb from './CityAssemblyBreadCrumb';
import CityAssemblyTabs from './CityAssemblyTabs';
import CityAssemblySearch from './CityAssemblySearch';
import CityAssemblyTable from './CityAssemblyTable';
import toast from 'react-hot-toast';
import axios from 'axios';

interface AssemblyData {
  id: number;
  plan_name: string;
  thematic_area: string;
  sub_area: string;
  source: string;
  expenditure_center: string;
  budget: string;
  ward_no: string;
  status: string;
  priority_no: number;
}

const CityAssembly: React.FC = () => {
  const [activeTab, setActiveTab] = useState('सभामा पेश भएका परियोजना');
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
      await axios.post(`http://localhost:8000/api/planning/municipal-assembly/submitted-projects/${id}/approve/`);
      toast.success('परियोजना सफलतापूर्वक बजेट तथा कार्यक्रम तर्जुमा समितिमा सिफारिस गरियो।');
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error('बजेट समितिमा सिफारिस गर्न असफल भयो। कृपया पुनः प्रयास गर्नुहोस्।');
    }
  };

  return (
    <main className="flex-1 p-6">
      <CityAssemblyBreadcrumb />
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">नगर सभा</h1>
        <CityAssemblyTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <CityAssemblySearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <CityAssemblyTable
          activeTab={activeTab}
          data={filteredData}
          onRecommend={handleApproveProject}
        />
      </div>
    </main>
  );
};

export default CityAssembly;