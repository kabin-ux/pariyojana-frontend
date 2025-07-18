interface CityAssemblyTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  'सभामा पेश भएका परियोजना',
  'नगर सभाले स्वीकृत गरिएको परियोजना',
  'रिपोर्ट'
];

const CityAssemblyTabs: React.FC<CityAssemblyTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="border-b border-gray-200 mb-6">
      <div className="flex space-x-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
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
};

export default CityAssemblyTabs;