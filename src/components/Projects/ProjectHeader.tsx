import React from 'react';
import { Plus, Upload, Download } from 'lucide-react';

interface ProjectsHeaderProps {
  onAddProject: () => void;
  onImport: () => void;
  onExport: () => void;
  isExporting: boolean;
}

const ProjectsHeader: React.FC<ProjectsHeaderProps> = ({
  onAddProject,
  onImport,
  onExport,
  isExporting
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-gray-900">परियोजनाहरू</h1>
      <div className="flex items-center space-x-3">
        <button
          onClick={onAddProject}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>नयाँ परियोजना थप्नुहोस्</span>
        </button>
        <button
          onClick={onImport}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2 cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Excel बाट डेटा आयात गर्नुहोस्</span>
        </button>
        <button
          onClick={onExport}
          disabled={isExporting}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center space-x-2 cursor-pointer disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? 'निर्यात गर्दै...' : 'नयाँ फाइल Excel मा निर्यात गर्नुहोस्'}</span>
        </button>
      </div>
    </div>
  );
};

export default ProjectsHeader;