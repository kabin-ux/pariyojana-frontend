import React, { useState } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Home } from 'lucide-react';

const BudgetCommittee: React.FC = () => {
  const [activeTab, setActiveTab] = useState('वडा स्तरीय कार्यक्रम');
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = [
    'वडा स्तरीय कार्यक्रम',
    'नगर स्तरीय कार्यक्रम',
    'विषयगत समितिका कार्यक्रम',
    'नगर गौरव आयोजना',
    'प्रदेश सरकारबाट हस्तान्तरित कार्यक्रम',
    'संघिय सरकारबाट हस्तान्तरित कार्यक्रम',
    'रिपोर्ट'
  ];

  return (
    <main className="flex-1 p-6">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <ChevronLeft className="w-4 h-4" />
          <div className="flex items-center space-x-2">
            <Home className="w-4 h-4" />
            <span>गृहपृष्ठ</span>
            <ChevronRight className="w-3 h-3" />
            <span>योजना तर्जुमा</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-900 font-medium">बजेट तथा कार्यक्रम तर्जुमा समिति</span>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          <span className="text-gray-900 font-medium">वडा नं.- १</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">बजेट तथा कार्यक्रम तर्जुमा समिति</h1>

        {/* Tabs */}
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

        {/* Search and Filter */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="योजना तथा कार्यक्रम खोज्नुहोस्"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="w-4 h-4" />
                <span>फिल्टरहरू</span>
              </button>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Search className="w-4 h-4" />
              </button>
              <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                प्राथमिकता सेट गर्नुहोस्
              </button>
              <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                नगरकार्यपालिकाको कार्यालय पेश गर्नुहोस्
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">क्र.स</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">योजना तथा कार्यक्रम</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">क्षेत्र</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">उप-क्षेत्र</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">स्रोत</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">खर्च केन्द्र</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">बजेट</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">वडा नं.</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">स्थिति</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">प्राथमिकता नम्बर</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">अन्य</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={11} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-lg font-medium">No data</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default BudgetCommittee;