import React, { useState } from 'react';
import { Breadcrumb } from './BreadCrumbs';
import { MainTabs } from './WardTabs';
import { ReportTabs } from './ReportTabs';
import { ReportContent } from './ReportContent';
import { ProjectsTable } from './ProjectsTable';
import { SearchAndFilter } from './SearchFilterBar';
import { EmptyState } from './EmptyState';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { usePlanning } from '../../hooks/usePlanning';

interface WardData {
  id: number;
  title: string;
  date: string;
  plan_name?: string;
  // Add other fields as needed
}

const WardOfficeNew: React.FC = () => {
  const [activeTab, setActiveTab] = useState('वडा स्तरीय परियोजना');
  const reportTabs = [
    'वडा परियोजना प्रविष्टी',
    'नगर परियोजना प्रविष्टी',
    'विषयगत समितिका परियोजना',
    'वडा समितिले प्राथमिकरण गरिएको परियोजना',
    'प्राथमिकरण भएका विषयगत समितिका परियोजना',
  ];
  const [searchTerm, setSearchTerm] = useState('');
  const [activeReportTab, setActiveReportTab] = useState(reportTabs[0]);





  const tabs = [
    'वडा स्तरीय परियोजना',
    'नगर स्तरीय परियोजना',
    'विषयगत समितिका परियोजना',
    'प्राथमिकरण भएका वडा स्तरीय परियोजना',
    'प्राथमिकरण भएका विषयगत समितिका परियोजना',
    'रिपोर्ट'
  ];

  const {
    wardProjects = [],
    municipalityProjects = [],
    wardThematicProjects = [],
    prioritizedWardProjects = [],
    prioritizedWardThematicProjects = [],
    loading,
    error,
    refetch
  } = usePlanning();

  const getDataForActiveTab = (): WardData[] => {
    switch (activeTab) {
      case 'वडा स्तरीय परियोजना':
        return wardProjects;
      case 'नगर स्तरीय परियोजना':
        return municipalityProjects;
      case 'विषयगत समितिका परियोजना':
        return wardThematicProjects;
      case 'प्राथमिकरण भएका वडा स्तरीय परियोजना':
        return prioritizedWardProjects;
      case 'प्राथमिकरण भएका विषयगत समितिका परियोजना':
        return prioritizedWardThematicProjects;
      default:
        return [];
    }
  };

  const filteredData = getDataForActiveTab().filter((item) =>
    (item.title || item.plan_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex-1 p-6">
        <Breadcrumb />
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-h-[300px] flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-6">
        <Breadcrumb />
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center text-red-500">
            <p>Error loading data: {error}</p>
          </div>
        </div>
      </div>
    );
  }



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
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        {filteredData.length > 0 ? (
          <ProjectsTable
            searchTerm={searchTerm}
            data={getDataForActiveTab()}
            tabType={activeTab}
            refetch={refetch}
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
      <Breadcrumb />
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">वडा कार्यालय</h1>
        <MainTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        {renderContent()}
      </div>
    </main>
  );
};

export default WardOfficeNew;