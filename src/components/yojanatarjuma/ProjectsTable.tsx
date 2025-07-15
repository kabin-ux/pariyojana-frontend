import { Download, MoreHorizontal } from 'lucide-react';
import { EmptyState } from './EmptyState';

interface WardData {
  id: number;
  plan_name: string;
  date: string;
  // Add other fields needed for the full table
  thematic_area?: string;
  sub_area?: string;
  source?: string;
  expenditure_center?: string;
  budget?: string;
  ward_no?: string;
  status?: string;
  priority_no?: string;
}

interface ProjectsTableProps {
  data: WardData[];
  searchTerm: string;
  isWardLevel?: boolean; // Flag to indicate if this is the ward level projects table
}

export const ProjectsTable = ({ data, searchTerm, isWardLevel = false }: ProjectsTableProps) => {
  const filteredData = data.filter(item =>
    item?.plan_name?.toLowerCase()?.includes(searchTerm?.toLowerCase() ?? '')
  );

  // Render the static notices table (5 columns)
  const renderStaticNoticesTable = () => (
    <div className="mb-8">
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
            {data.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-900">{item.id}</td>
                <td className="py-3 px-4 text-gray-900">{item.plan_name}</td>
                <td className="py-3 px-4 text-gray-900">{item.date}</td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-800" aria-label="Download">
                    <Download className="w-4 h-4" />
                  </button>
                </td>
                <td className="py-3 px-4">
                  <button className="text-gray-400 hover:text-gray-600" aria-label="More options">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Render the dynamic projects table (11 columns)
  const renderDynamicProjectsTable = () => (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">वडा स्तरीय परियोजनाहरू</h2>
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
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{item.id}</td>
                  <td className="py-3 px-4 text-gray-900">{item.plan_name}</td>
                  <td className="py-3 px-4 text-gray-900">{item.thematic_area || '-'}</td>
                  <td className="py-3 px-4 text-gray-900">{item.sub_area || '-'}</td>
                  <td className="py-3 px-4 text-gray-900">{item.source || '-'}</td>
                  <td className="py-3 px-4 text-gray-900">{item.expenditure_center || '-'}</td>
                  <td className="py-3 px-4 text-gray-900">{item.budget || '-'}</td>
                  <td className="py-3 px-4 text-gray-900">{item.ward_no || '-'}</td>
                  <td className="py-3 px-4 text-gray-900">{item.status || '-'}</td>
                  <td className="py-3 px-4 text-gray-900">{item.priority_no || '-'}</td>
                  <td className="py-3 px-4">
                    <button className="text-gray-400 hover:text-gray-600" aria-label="More options">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11} className="py-12 text-center">
                  <EmptyState />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="mt-6">
      {isWardLevel && renderStaticNoticesTable()}
      {renderDynamicProjectsTable()}
    </div>
  );
};