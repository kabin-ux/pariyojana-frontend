import React from 'react';
import { ChevronLeft, Home } from 'lucide-react';

const Breadcrumb: React.FC = () => {
  return (
    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <ChevronLeft className="w-4 h-4" />
      <div className="flex items-center space-x-2">
        <Home className="w-4 h-4" />
        <span>गृहपृष्ठ</span>
        <span></span>
        <span>योजना तर्जुमा</span>
        <span></span>
        <span className="text-gray-900 font-medium">वडा कार्यालय</span>
      </div>
      <div className="ml-auto">
        <span className="text-gray-900 font-medium">वडा नं.- १</span>
      </div>
    </div>
  );
};

export default Breadcrumb;