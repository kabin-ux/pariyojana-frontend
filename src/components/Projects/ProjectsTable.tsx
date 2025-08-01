import React from 'react';
import { ChevronRight, Edit, Trash2 } from 'lucide-react';
import { formatBudget, formatWardNumber, formatStatus, getStatusColor, getNameById, toNepaliNumber } from '../../utils/formatters';
import type { Project } from '../../types/project';

// interface Project {
//   id: number;
//   serial_number: number;
//   project_name: string;
//   area: number;
//   sub_area: number;
//   source: number;
//   expenditure_center: number;
//   budget: number;
//   ward_no: number;
//   status: string;
// }

interface ProjectsTableProps {
  projects: Project[];
  loading: boolean;
  currentPage: number;
  thematicAreas: any[];
  sub_areas: any[];
  sources: any[];
  expenditureCenters: any[];
  onProjectClick: (project: Project) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({
  projects,
  loading,
  currentPage,
  thematicAreas,
  sub_areas,
  sources,
  expenditureCenters,
  onProjectClick,
  onEdit,
  onDelete
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="w-12 py-4 px-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">क्र.स</th>
                <th className="min-w-[200px] py-4 px-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">योजना तथा कार्यक्रम</th>
                <th className="py-4 px-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">क्षेत्र</th>
                <th className="py-4 px-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">उप-क्षेत्र</th>
                <th className="py-4 px-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">स्रोत</th>
                <th className="py-4 px-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">खर्च केन्द्र</th>
                <th className="py-4 px-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">बजेट</th>
                <th className="w-16 py-4 px-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">वडा नं.</th>
                <th className="w-24 py-4 px-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">स्थिति</th>
                <th className="w-28 py-4 px-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">कार्यहरू</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td colSpan={10} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
                    <span className="text-gray-600 font-medium">लोड हुँदैछ...</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="bg-white rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="w-12 py-4 px-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">क्र.स</th>
                <th className="min-w-[200px] py-4 px-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">योजना तथा कार्यक्रम</th>
                <th className="py-4 px-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">क्षेत्र</th>
                <th className="py-4 px-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">उप-क्षेत्र</th>
                <th className="py-4 px-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">स्रोत</th>
                <th className="py-4 px-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">खर्च केन्द्र</th>
                <th className="py-4 px-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">बजेट</th>
                <th className="w-16 py-4 px-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">वडा नं.</th>
                <th className="w-24 py-4 px-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">स्थिति</th>
                <th className="w-28 py-4 px-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">कार्यहरू</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td colSpan={10} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-full">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-700">कुनै परियोजना फेला परेन</p>
                      <p className="text-sm text-gray-500 mt-1">नयाँ परियोजना थप्नको लागि "थप गर्नुहोस्" बटन क्लिक गर्नुहोस्</p>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="w-12 py-4 px-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">क्र.स</th>
              <th className="min-w-[200px] py-4 px-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">योजना तथा कार्यक्रम</th>
              <th className="py-4 px-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">क्षेत्र</th>
              <th className="py-4 px-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">उप-क्षेत्र</th>
              <th className="py-4 px-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">स्रोत</th>
              <th className="py-4 px-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">खर्च केन्द्र</th>
              <th className="py-4 px-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">बजेट</th>
              <th className="w-16 py-4 px-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">वडा नं.</th>
              <th className="w-24 py-4 px-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">स्थिति</th>
              <th className="w-28 py-4 px-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">कार्यहरू</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((project, index) => (
              <tr
                key={project.id}
                className="hover:bg-blue-50/50 transition-colors duration-150"
              >
                <td className="py-4 px-3 text-sm text-gray-700 font-medium">
                  {toNepaliNumber((currentPage - 1) * 10 + index + 1)}
                </td>
                <td className="py-4 px-4 text-sm text-gray-900 font-medium max-w-[200px] truncate">
                  <span className="truncate">{project.project_name}</span>
                </td>
                <td className="py-4 px-3 text-sm text-gray-700">
                  {getNameById(thematicAreas, project.area)}
                </td>
                <td className="py-4 px-3 text-sm text-gray-700">
                  {getNameById(sub_areas, project.sub_area)}
                </td>
                <td className="py-4 px-3 text-sm text-gray-700">
                  {getNameById(sources, project.source)}
                </td>
                <td className="py-4 px-3 text-sm text-gray-700">
                  {getNameById(expenditureCenters, project.expenditure_center)}
                </td>
                <td className="py-4 px-3 text-sm text-gray-700 font-medium">
                  {toNepaliNumber(formatBudget(project.budget))}
                </td>
                <td className="py-4 px-3 text-sm text-gray-700 text-center">
                  {formatWardNumber(project.ward_no)}
                </td>
                <td className="py-4 px-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {formatStatus(project.status)}
                  </span>
                </td>
                <td className="py-4 px-3">
                  <div className="flex items-center justify-center space-x-3">
                    <button
                      onClick={() => onProjectClick(project)}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded-full cursor-pointer hover:bg-blue-100 transition-colors"
                      title="विवरण हेर्नुहोस्"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(project.serial_number)}
                      className="text-green-600 hover:text-green-800 p-1 rounded-full cursor-pointer hover:bg-green-100 transition-colors"
                      title="सम्पादन गर्नुहोस्"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(project.serial_number)}
                      className="text-red-600 hover:text-red-800 p-1 rounded-full cursor-pointer hover:bg-red-100 transition-colors"
                      title="हटाउनुहोस्"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectsTable;