import React from 'react';
import { ChevronLeft, Home, ChevronRight } from 'lucide-react';
import { toNepaliNumber } from '../../utils/formatters';

interface ProjectDetailHeaderProps {
  onBack: () => void;
  activeTab: string;
  projectSerialNumber: number;
}

const ProjectDetailHeader: React.FC<ProjectDetailHeaderProps> = ({
  onBack,
  activeTab,
  projectSerialNumber
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <button onClick={onBack} className="flex items-center space-x-1 hover:text-gray-900 cursor-pointer">
          <ChevronLeft className="w-4 h-4" />
          <span>पछि जानुहोस्</span>
        </button>
        <div className="flex items-center space-x-2">
          <Home className="w-4 h-4" />
          <span>गृहपृष्ठ</span>
          <ChevronRight className="w-3 h-3" />
          <span>परियोजनाहरू</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 font-medium">{activeTab}</span>
        </div>
      </div>
      <div className="text-sm text-gray-600">
        <span className="text-gray-900 font-medium">परियोजना ID: {toNepaliNumber(projectSerialNumber)}</span>
      </div>
    </div>
  );
};

export default ProjectDetailHeader;