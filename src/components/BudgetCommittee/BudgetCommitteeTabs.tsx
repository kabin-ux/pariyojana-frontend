interface BudgetCommitteeTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  'वडा स्तरीय कार्यक्रम',
  'नगर स्तरीय कार्यक्रम',
  'विषयगत समितिको कार्यक्रम',
  'नगर गौरव आयोजना',
  'प्रदेश सरकारबाट हस्तान्तरित कार्यक्रम',
  'संघिय सरकारबाट हस्तान्तरित कार्यक्रम',
  'रिपोर्ट'
];

export const BudgetCommitteeTabs = ({ activeTab, onTabChange }: BudgetCommitteeTabsProps) => (
  <div className="border-b border-gray-200 mb-6">
    <div className="flex space-x-8 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`py-3 px-1 border-b-2 font-medium cursor-pointer text-sm whitespace-nowrap ${
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