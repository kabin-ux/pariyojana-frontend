import { Edit, MoreHorizontal } from 'lucide-react';
import { EmptyState } from './EmptyState';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useState } from 'react';
import EditProjectModal from '../../modals/EditProjectsModal';
import { formatWardNumber } from '../../utils/formatters';

interface ProjectsTableProps {
  data: any[];
  searchTerm: string;
  isWardLevel?: boolean;
  tabType: string;
  refetch?: () => void;
}

export const ProjectsTable = ({
  data,
  searchTerm,
  tabType,
  refetch
}: ProjectsTableProps) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const filteredData = data.filter(item =>
    (item?.title || item?.plan_name || '')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Updated formatWardNumber function to handle both string and array inputs
  const formatWards = (wardData:  number[]): string => {
    if (Array.isArray(wardData)) {
      return wardData.map(ward => formatWardNumber(ward)).join(', ');
    }
    return formatWardNumber(wardData) || '-';
  };

  const handlePrioritize = async (id: number) => {
    let endpoint = '';
    if (tabType === 'वडा स्तरीय परियोजना') {
      endpoint = `http://43.205.239.123/api/planning/ward-office/ward-projects/${id}/prioritize/`;
    } else if (tabType === 'विषयगत समितिका परियोजना') {
      endpoint = `http://43.205.239.123/api/planning/ward-office/ward-thematic-projects/${id}/prioritize/`;
    } else {
      return;
    }

    try {
      await axios.post(endpoint);
      toast.success('परियोजना प्राथमिकरण सफल भयो!');
      refetch?.();
    } catch (error) {
      console.error('Error prioritizing project:', error);
      toast.error('प्राथमिकरण असफल भयो।');
    }
  };

  const handleEdit = (item: any) => {
    setSelectedProject(item);
    setEditModalOpen(true);
  };

  const getProjectType = () => {
    if (tabType === 'वडा स्तरीय परियोजना') return 'ward';
    if (tabType === 'नगर स्तरीय परियोजना') return 'municipality';
    if (tabType === 'विषयगत समितिका परियोजना') return 'thematic';
    if (tabType === 'वडाले मार्ग गर्ने विषयगत समितिका परियोजना') return 'ward_thematic';
    if (tabType === 'प्राथमिकरण भएका वडा स्तरीय परियोजना') return 'ward';
    if (tabType === 'प्राथमिकरण भएका विषयगत समितिका परियोजना') return 'thematic';
    return 'ward';
  };

  const handleEditSave = () => {
    setEditModalOpen(false);
    setSelectedProject(null);
    refetch?.();
  };

  const handleRecommendtoBudget = async (id: number) => {
    try {
      await axios.post(`http://43.205.239.123/api/planning/ward-office/prioritized-ward-projects/${id}/recommend-to-budget-committee/`);
      toast.success('परियोजना सफलतापूर्वक बजेट तथा कार्यक्रम तर्जुमा समितिमा सिफारिस गरियो।');
      refetch?.();
    } catch (error) {
      console.error('Error recommending to budget committee:', error);
      toast.error('परियोजना सिफारिस गर्न असफल भयो। कृपया पुन: प्रयास गर्नुहोस्।');
    }
  };

  const handleRecommendMunicipalProgramToBudget = async (id: number) => {
    try {
      await axios.post(`http://43.205.239.123/api/planning/ward-office/municipality-projects/${id}/recommend-to-budget-committee/`);
      toast.success('परियोजना सफलतापूर्वक बजेट तथा कार्यक्रम तर्जुमा समितिमा सिफारिस गरियो।');
      refetch?.();
    } catch (error) {
      console.error('Error recommending to budget committee:', error);
      toast.error('परियोजना सिफारिस गर्न असफल भयो। कृपया पुन: प्रयास गर्नुहोस्।');
    }
  };

  const handleRecommendtoThematic = async (id: number) => {
    try {
      await axios.post(`http://43.205.239.123/api/planning/ward-office/prioritized-ward-thematic/${id}/recommend-to-ward-projects/`);
      toast.success('परियोजना सफलतापूर्वक विषयगत समितिमा सिफारिस गरियो।');
      refetch?.();
    } catch (error) {
      console.error('Error recommending to thematic committee:', error);
      toast.error('विषयगत समितिमा सिफारिस गर्न असफल भयो। कृपया पुन: प्रयास गर्नुहोस्।');
    }
  };

  const renderDynamicProjectsTable = () => (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">परियोजनाहरू</h2>
      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {[
                'क्र.स',
                'योजना तथा कार्यक्रम',
                'क्षेत्र',
                'उप-क्षेत्र',
                'स्रोत',
                'खर्च केन्द्र',
                'बजेट',
                'वडा नं.',
                'स्थिति',
                'प्राथमिकता नम्बर',
                'अन्य',
              ].map((header, index) => (
                <th
                  key={index}
                  className="text-left py-3 px-4 text-sm font-semibold text-gray-700 tracking-wide whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredData?.length > 0 ? (
              filteredData?.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-blue-50 transition-colors duration-150"
                >
                  <td className="py-3 px-4 text-sm text-gray-800">{index + 1}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{item.plan_name}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {item.thematic_area?.name || item.thematic_area || '-'}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {item.sub_area?.name || item.sub_area || '-'}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {item.source?.name || item.source || '-'}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {item.expenditure_center?.name || item.expenditure_center || '-'}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {item.budget || '-'}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {formatWards(item.ward_no)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {item.status || '-'}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {item.priority_no || '-'}
                  </td>
                  <td className="py-3 px-4">
                    {tabType === 'वडा स्तरीय परियोजना' || tabType === 'विषयगत समितिका परियोजना' ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handlePrioritize(item.id)}
                          className="text-sm bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                        >
                          प्राथमिकरण गर्नुहोस्
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-sm text-green px-3 py-1 rounded-md hover:bg-blue-600"
                        >
                          <Edit />
                        </button>
                      </div>
                    ) : tabType === 'प्राथमिकरण भएका वडा स्तरीय परियोजना' ? (
                      <button
                        onClick={() => handleRecommendtoBudget(item.id)}
                        className="text-sm bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 cursor-pointer"
                      >
                        बजेटमा पेश गर्नुहोस्
                      </button>
                    ) : tabType === 'नगर स्तरीय परियोजना' ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleRecommendMunicipalProgramToBudget(item.id)}
                          className="text-sm bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 cursor-pointer"
                        >
                          बजेटमा पेश गर्नुहोस्
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-sm text-green px-3 py-1 rounded-md hover:bg-blue-600"
                        >
                          <Edit />
                        </button>
                      </div>
                    ) : tabType === 'प्राथमिकरण भएका विषयगत समितिका परियोजना' ? (
                      <button
                        onClick={() => handleRecommendtoThematic(item.id)}
                        className="text-sm bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 cursor-pointer"
                      >
                        विषयगत समितिमा सिफारिस
                      </button>
                    ) : (
                      <MoreHorizontal className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11} className="py-12 text-center text-sm text-gray-500">
                  <EmptyState />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <EditProjectModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedProject(null);
        }}
        onSave={handleEditSave}
        projectData={selectedProject}
        projectType={getProjectType()}
      />
    </div>
  );

  return (
    <div className="mt-6">
      {renderDynamicProjectsTable()}
    </div>
  );
};