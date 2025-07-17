import React, { useState } from 'react';
import { BudgetCommitteeTabs } from './BudgetCommitteeTabs';
import { BudgetCommitteeSearch } from './BudgetCommitteeSearch';
import { BudgetCommitteeTable } from './BudgetCommitteeTable';
import { usePlanning } from '../../hooks/usePlanning';
import toast from 'react-hot-toast';
import axios from 'axios';
import { BudgetCommitteeBreadcrumb } from './BudgetCommitteeBreadcrumb';

const BudgetCommittee: React.FC = () => {
  const [activeTab, setActiveTab] = useState('वडा स्तरीय कार्यक्रम');
  const [searchTerm, setSearchTerm] = useState('');
  const {
    municipalityPrideBudget = [],
    wardLevelBudget = [],
    municipalityLevelBudget = [],
    thematicBudget = [],
    provincialGovernmentBudget = [],
    federalGovernmentBudget = []
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

  return (
    <main className="flex-1 p-6">
      <BudgetCommitteeBreadcrumb wardNumber="१" />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">बजेट तथा कार्यक्रम तर्जुमा समिति</h1>

        <BudgetCommitteeTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <BudgetCommitteeSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <BudgetCommitteeTable
          activeTab={activeTab}
          projects={filteredProjects}
          onRecommend={getRecommendHandler()}
        />
      </div>
    </main>
  );
};

export default BudgetCommittee;
