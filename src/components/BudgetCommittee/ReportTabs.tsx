interface ReportTabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const ReportTabs = ({ tabs, activeTab, onTabChange }: ReportTabsProps) => (
  <div className="border-b border-gray-200 mb-6">
    <div className="flex space-x-8 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`py-3 px-1 border-b-2 font-medium text-sm cursor-pointer whitespace-nowrap ${
            activeTab === tab
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  </div>
);