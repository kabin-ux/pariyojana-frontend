import React, { useState } from 'react';
import { useWardOffice } from '../../hooks/useWardOffice';
import { MunicipalityPrideTabs } from './MunicipalityPrideTabs';
import { MunicipalityPrideBreadcrumb } from './MunicipalityPrideBreadCrumb';
import { MunicipalityPrideSearch } from './MunicipalityPrideSearch';
import { MunicipalityPrideTable } from './MunicipalityPrideTable';
import axios from 'axios';
import toast from 'react-hot-toast';


const MunicipalityPrideProject: React.FC = () => {
  const [activeTab, setActiveTab] = useState('प्रविष्टी भएका नगर गौरव आयोजना');
  const [searchTerm, setSearchTerm] = useState('');
  const { municipalityPrideProjects = [], municipalityPrideBudget= [] } = useWardOffice();

  const filteredProjects = municipalityPrideProjects?.filter(item =>
    item.plan_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

   const filteredBudget = municipalityPrideBudget?.filter(item =>
    item.plan_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

   const handleRecommendtoBudget = async (id: number) => {
    try {
      await axios.post(`http://localhost:8000/api/planning/municipality-pride-project/municipality-pride-projects/${id}/recommend-to-budget-committee/`);
      toast.success('परियोजना सफलतापूर्वक बजेट तथा कार्यक्रम तर्जुमा समितिमा सिफारिस गरियो।');
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error('बजेट समितिमा सिफारिस गर्न असफल भयो। कृपया पुनः प्रयास गर्नुहोस्।');
    }
  };

  return (
    <main className="flex-1 p-6">
      <MunicipalityPrideBreadcrumb wardNumber="१" />
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">नगर गौरव आयोजना</h1>

        <MunicipalityPrideTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <MunicipalityPrideSearch 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm}
          activeTab={activeTab}
        />
        <MunicipalityPrideTable 
          activeTab={activeTab} 
          projects={filteredProjects} 
          budget={filteredBudget}
          onRecommend={handleRecommendtoBudget}
        />
      </div>
    </main>
  );
};

export default MunicipalityPrideProject;