import React, { useState } from 'react';
import { Search, Filter, Download, ChevronLeft, ChevronRight, Home, MoreHorizontal } from 'lucide-react';

interface WardData {
  id: number;
  title: string;
  date: string;
}

const WardOfficeNew: React.FC = () => {
  const [activeTab, setActiveTab] = useState('वडा स्तरीय परियोजना');
  const [searchTerm, setSearchTerm] = useState('');

  //  reportTabs and activeReportTab
  const reportTabs = [
    'वडा परियोजना प्रतिवेदन',
    'नगर परियोजना प्रतिवेदन',
    'विषयगत समिति प्रतिवेदन',
    'प्राथमिकरण भएका वडा स्तरीय परियोजना',
    'प्राथमिकरण भएका विषयगत समितिका परियोजना',
  ];
  const [activeReportTab, setActiveReportTab] = useState(reportTabs[0]);


  const tabs = [
    'वडा स्तरीय परियोजना',
    'नगर स्तरीय परियोजना',
    'विषयगत समितिका परियोजना',
    'प्राथमिकरण भएका वडा स्तरीय परियोजना',
    'प्राथमिकरण भएका विषयगत समितिका परियोजना',
    'रिपोर्ट'
  ];

  const wardData: WardData[] = [
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

  const filteredData = wardData.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <span className="text-gray-900 font-medium">वडा कार्यालय</span>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          <span className="text-gray-900 font-medium">वडा नं.- १</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">वडा कार्यालय</h1>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === tab
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

        {/* Reports Tab */}
        {activeTab === 'रिपोर्ट' && (
          <div className="mt-8">
            {/* Report Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <div className="flex space-x-8 overflow-x-auto">
                {reportTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveReportTab(tab)}
                    className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeReportTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Report Content based on active tab */}
            {activeReportTab === 'वडा परियोजना प्रतिवेदन' && (
              <div>
                {/* Report Download Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">रिपोर्ट डाउनलोड</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700">क्षेत्र:</label>
                        <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>क्षेत्र</option>
                        </select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700">उप-क्षेत्र:</label>
                        <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>उप-क्षेत्र</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Download className="w-4 h-4" />
                        <span>Excel</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Download className="w-4 h-4" />
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-4">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      रिपोर्ट यूनिफाइड
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      रिपोर्ट बनाउनुहोस्
                    </button>
                  </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Budget Distribution Chart */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">क्षेत्रगत बजेट वितरण</h3>
                    <div className="flex items-center justify-center mb-4">
                      <div className="relative w-48 h-48">
                        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="20"
                            strokeDasharray="251.2 0"
                            className="opacity-100"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold text-blue-600">100%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      <span className="text-sm text-gray-600">सामाजिक विकास</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">कुल बजेट:</span> रु ९२,७५९.००
                      </p>
                    </div>
                  </div>

                  {/* Project Status Chart */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">क्षेत्रगत योजनाहरूको तथ्याङ्क</h3>
                    <div className="flex items-center justify-center mb-4">
                      <div className="relative w-48 h-48">
                        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="20"
                            strokeDasharray="251.2 0"
                            className="opacity-100"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold text-blue-600">100%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      <span className="text-sm text-gray-600">सामाजिक विकास</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">कुल प्रस्तावित परियोजनाहरू:</span> २
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other Report Tabs Content */}
            {activeReportTab === 'नगर परियोजना प्रतिवेदन' && (
              <div>
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">नगर परियोजना रिपोर्ट डाउनलोड</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700">क्षेत्र:</label>
                        <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>क्षेत्र</option>
                        </select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700">उप-क्षेत्र:</label>
                        <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>उप-क्षेत्र</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Download className="w-4 h-4" />
                        <span>Excel</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Download className="w-4 h-4" />
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-4">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      रिपोर्ट यूनिफाइड
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      रिपोर्ट बनाउनुहोस्
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">नगर स्तरीय बजेट वितरण</h3>
                    <div className="flex items-center justify-center mb-4">
                      <div className="relative w-48 h-48">
                        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="20"
                            strokeDasharray="251.2 0"
                            className="opacity-100"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold text-green-600">100%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      <span className="text-sm text-gray-600">पूर्वाधार विकास</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">कुल बजेट:</span> रु ५,२०,०००.००
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">नगर स्तरीय योजना तथ्याङ्क</h3>
                    <div className="flex items-center justify-center mb-4">
                      <div className="relative w-48 h-48">
                        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="20"
                            strokeDasharray="251.2 0"
                            className="opacity-100"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold text-green-600">100%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      <span className="text-sm text-gray-600">पूर्वाधार विकास</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">कुल प्रस्तावित परियोजनाहरू:</span> ५
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Default content for other tabs */}
            {!['वडा परियोजना प्रतिवेदन', 'नगर परियोजना प्रतिवेदन'].includes(activeReportTab) && (
              <div>
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">रिपोर्ट डाउनलोड</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700">क्षेत्र:</label>
                        <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>क्षेत्र</option>
                        </select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700">उप-क्षेत्र:</label>
                        <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>उप-क्षेत्र</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Download className="w-4 h-4" />
                        <span>Excel</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Download className="w-4 h-4" />
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-4">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      रिपोर्ट यूनिफाइड
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      रिपोर्ट बनाउनुहोस्
                    </button>
                  </div>
                </div>

                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium text-gray-500">यस ट्याबको लागि डाटा उपलब्ध छैन</p>
                </div>
              </div>
            )}
          </div>
        )}


        {/* Empty Projects Table for other tabs */}
        {activeTab !== 'वडा स्तरीय परियोजना' && activeTab !== 'रिपोर्ट' && (
          <div className="mt-8">
            <div className="mb-4 flex flex-row justify-between">
              <div className="relative">
                <input
                  type="text"
                  placeholder="योजना तथा कार्यक्रम खोज्नुहोस्"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="w-4 h-4" />
                  <span>फिल्टरहरू</span>
                </button>
              </div>
            </div>

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
        )}
        {/* Table */}
        {activeTab === 'वडा स्तरीय परियोजना' && (
          <div className="overflow-x-auto mb-8">
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
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
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
                )}
              </tbody>
            </table>
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


        )}



      </div>
    </main>
  );
};

export default WardOfficeNew;