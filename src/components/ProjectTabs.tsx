import React, { useState } from 'react';

const ProjectTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('वडा स्तरीय परियोजना');
  
  const tabs = [
    'वडा स्तरीय परियोजना',
    'नगर स्तरीय परियोजना',
    'विषयगत समितिका परियोजना',
    'प्राथमिकरण भएका वडा स्तरीय परियोजना',
    'प्राथमिकरण भएका विषयगत समितिका परियोजना',
    'रिपोर्ट'
  ];

  return (
    <div className="border-b border-gray-200 mb-6">
      <div className="flex space-x-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
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

export default ProjectTabs;