import React, { useState } from 'react';
import { Search, Filter, Plus, ChevronLeft, ChevronRight, Home } from 'lucide-react';
import AddYojanaPravidhiModal from '../modals/AddYojanaPravidhiModal';

const ProjectMethods: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentType, setCurrentType] = useState<string | null>(null); // NEW

  const openModalWithType = (type: string) => {
    setCurrentType(type);
    setIsModalOpen(true);
  };

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
            <span className="text-gray-900 font-medium">योजना प्रविधि</span>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          <span className="text-gray-900 font-medium">वडा नं.- १</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">योजना प्रविधि</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

          {[
            { title: 'वडा स्तरीय परियोजना', type: 'ward_level' },
            { title: 'नगर स्तरीय परियोजना', type: 'municipality_level' },
            { title: 'वडाले मार्ग गर्ने विषयगत समितिका परियोजना', type: 'ward_requested_thematic' },
            { title: 'विषयगत समितिका परियोजना', type: 'thematic_committee' },
            { title: 'नगर गौरव आयोजना', type: 'pride_project' },
            { title: 'प्रदेश सरकार परियोजना', type: 'provincial' },
            { title: 'संघिय सरकार परियोजना', type: 'federal' },
          ].map(({ title, type }) => (
            <div key={type} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
              <button
                onClick={() => openModalWithType(type)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 w-full justify-center cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>नयाँ परियोजना प्रविधि</span>
              </button>
            </div>
          ))}

        </div>
      </div>

      {isModalOpen && (
        <AddYojanaPravidhiModal
          onClose={() => setIsModalOpen(false)}
          type={currentType} // pass the current type
        />
      )}
    </main>
  );
};

export default ProjectMethods;
