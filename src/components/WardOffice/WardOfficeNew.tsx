import React, { useState } from 'react';
import { Download, MoreHorizontal } from 'lucide-react';
import { Breadcrumb } from './BreadCrumbs';
import { MainTabs } from './WardTabs';
import { ReportTabs } from './ReportTabs';
import { ReportContent } from './ReportContent';
import { ProjectsTable } from './ProjectsTable';
import { SearchAndFilter } from './SearchFilterBar';
import { EmptyState } from './EmptyState';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useWardOffice } from '../../hooks/useWardOffice';

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
    'वडा परियोजना प्रतिवेदन',
    'नगर परियोजना प्रतिवेदन',
    'विषयगत समिति प्रतिवेदन',
    'प्राथमिकरण भएका वडा स्तरीय परियोजना',
    'प्राथमिकरण भएका विषयगत समितिका परियोजना',
  ];
  const [searchTerm, setSearchTerm] = useState('');
  const [activeReportTab, setActiveReportTab] = useState(reportTabs[0]);

  // Static data for notices/manuals
  const staticWardData: WardData[] = [
    {
      id: 1,
      title: 'योजना छनोटका लागि आम भेलाको सूचना',
      date: '२०८२-०३-११'
    },
    {
      id: 2,
      title: 'योजना छनोट भेलाको मान्यूअल',
      date: '२०८२-०३-११'
    }
  ];



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
  } = useWardOffice();

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
  console.log(filteredData)

  if (loading) {
    return (
      <div className="flex-1 p-6">
        <Breadcrumb wardNumber="१" />
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-h-[300px] flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-6">
        <Breadcrumb wardNumber="१" />
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center text-red-500">
            <p>Error loading data: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const renderWardLevelContent = () => (
    <div className="mt-6">
      {/* Static Notices/Manuals Section */}
      <div className="mb-8">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">क्र.स.</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">विषयक</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">मिति</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">स्थिति</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">अन्य</th>
              </tr>
            </thead>
            <tbody>
              {staticWardData.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{item.id}</td>
                  <td className="py-3 px-4 text-gray-900">{item.title}</td>
                  <td className="py-3 px-4 text-gray-900">{item.date}</td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dynamic Projects Section */}
      <div>
        {filteredData.length > 0 ? (
          <ProjectsTable
            data={filteredData}
            searchTerm={searchTerm}
            tabType={activeTab}
            refetch={refetch} // ✅ Pass refetch here
          />

        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );

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

    if (activeTab === 'वडा स्तरीय परियोजना') {
      return (
        <>
          <SearchAndFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          {renderWardLevelContent()}
        </>
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
            data={filteredData}
            tabType={activeTab}
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
      <Breadcrumb wardNumber="१" />
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">वडा कार्यालय</h1>
        <MainTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        {renderContent()}
      </div>
    </main>
  );
};

export default WardOfficeNew;