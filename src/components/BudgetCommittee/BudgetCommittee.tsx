import React, { useState } from 'react';
import { BudgetCommitteeBreadcrumb } from './BudgetCommitteeBreadCrumb';
import { BudgetCommitteeTabs } from './BudgetCommitteeTabs';
import { BudgetCommitteeSearch } from './BudgetCommitteeSearch';
import { BudgetCommitteeTable } from './BudgetCommitteeTable';
import { useWardOffice } from '../../hooks/useWardOffice';

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
  } = useWardOffice();

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
        />
      </div>
    </main>
  );
};

export default BudgetCommittee;
