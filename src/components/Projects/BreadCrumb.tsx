import React from 'react';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';

const Breadcrumb: React.FC = () => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <ChevronLeft className="w-4 h-4 cursor-pointer" />
        <div className="flex items-center space-x-2">
          <Home className="w-4 h-4" />
          <span>गृहपृष्ठ</span>
          <ChevronRight className="w-3 h-3 cursor-pointer" />
          <span className="text-gray-900 font-medium">परियोजनाहरू</span>
        </div>
      </div>
      <div className="text-sm text-gray-600">
        <span className="text-gray-900 font-medium">आर्थिक वर्ष : २०८२/८३</span>
      </div>
    </div>
  );
};

export default Breadcrumb;