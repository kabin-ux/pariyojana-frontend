import React, { useState } from 'react';
import { usePlanning } from '../../hooks/usePlanning';
import MunicipalOfficeBreadcrumb from './MunicipalOfficeBreadCrumb';
import MunicipalOfficeTabs from './MunicipalOfficeTabs';
import MunicipalOfficeSearch from './MunicipalOfficeSearch';
import MunicipalOfficeTable from './MunicipalOfficeTable';
import axios from 'axios';
import toast from 'react-hot-toast';

const MunicipalOffice: React.FC = () => {
  const [activeTab, setActiveTab] = useState('नगर सभामा पेश गर्नु अघिको परियोजना');
  const [searchTerm, setSearchTerm] = useState('');
  const { preAssemblyProjects = [], councilProjects = [] } = usePlanning();

  const getFilteredData = () => {
    const sourceData =
      activeTab === 'नगर सभा पेश भएका परियोजना' ? councilProjects : preAssemblyProjects;

    return sourceData.filter(item =>
      item?.plan_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredData = getFilteredData();

  const handleCouncilProjects = async (id: number) => {
    try {
      await axios.post(`http://localhost:8000/api/planning/municipality-executive/pre-assembly-projects/${id}/submit-to-assembly/`);
      toast.success('परियोजना सफलतापूर्वक नगर सभामा पेश गरियो।');
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error('नगर सभामा पेश गर्न असफल भयो। कृपया पुनः प्रयास गर्नुहोस्।');
    }
  };

  return (
    <main className="flex-1 p-6">
      <MunicipalOfficeBreadcrumb />
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">नगरकार्यपालिकाको कार्यालय</h1>

        <MunicipalOfficeTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <MunicipalOfficeSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <MunicipalOfficeTable
          activeTab={activeTab}
          data={filteredData}
          onRecommend={handleCouncilProjects}
        />
      </div>
    </main>
  );
};

export default MunicipalOffice;