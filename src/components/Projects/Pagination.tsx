import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toNepaliNumber } from '../../utils/formatters';

interface PaginationProps {
  currentPage: number;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalCount,
  hasNext,
  hasPrevious,
  onPageChange
}) => {
  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-600">
        कुल: {toNepaliNumber(totalCount)} वटा परियोजनाहरू
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => {
            if (hasPrevious) {
              onPageChange(currentPage - 1);
            }
          }}
          disabled={!hasPrevious}
          className={`px-3 py-1 border border-gray-300 rounded text-sm ${hasPrevious ? 'hover:bg-gray-50 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="px-3 py-1 text-sm text-gray-700">
          {toNepaliNumber(currentPage)} / {toNepaliNumber(Math.ceil(totalCount / 10))}
        </span>

        <button
          onClick={() => {
            if (hasNext) {
              onPageChange(currentPage + 1);
            }
          }}
          disabled={!hasNext}
          className={`px-3 py-1 border border-gray-300 rounded text-sm ${hasNext ? 'hover:bg-gray-50 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;