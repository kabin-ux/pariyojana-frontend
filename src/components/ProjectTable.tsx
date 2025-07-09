import React from 'react';
import { Download, MoreHorizontal, Filter, Search } from 'lucide-react';

interface ProjectData {
  id: number;
  description: string;
  date: string;
}

const ProjectTable: React.FC = () => {
  const projectData: ProjectData[] = [
    {
      id: 1,
      description: 'योजना छनोटका लागि आम भेलाको सूचना',
      date: '२०८२-०३-११'
    },
    {
      id: 2,
      description: 'योजना छनोट भेलाको मान्यूअल',
      date: '२०८२-०३-११'
    }
  ];

  return (
    <div className="bg-white">
      {/* Search and Filter Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="योजना तथा कार्यक्रम खोज्नुहोस्"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              <span>फिल्टरहरू</span>
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Search className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
              प्राथमिकता सेट गर्नुहोस्
            </button>
            <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
              प्राथमिकरण गर्नुहोस्
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
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
            {projectData.map((project) => (
              <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-900">{project.id}</td>
                <td className="py-3 px-4 text-gray-900">{project.description}</td>
                <td className="py-3 px-4 text-gray-900">{project.date}</td>
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

      {/* Empty State for Additional Table */}
      <div className="mt-8 border border-gray-200 rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
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
    </div>
  );
};

export default ProjectTable;