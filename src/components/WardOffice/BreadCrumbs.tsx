import { ChevronLeft, ChevronRight, Home } from 'lucide-react';



export const Breadcrumb = () => (
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
      {/* <span className="text-gray-900 font-medium">वडा नं.- {wardNumber}</span> */}
    </div>
  </div>
);