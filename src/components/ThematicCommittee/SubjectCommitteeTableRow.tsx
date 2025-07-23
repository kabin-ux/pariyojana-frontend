import { Edit } from "lucide-react";

interface SubjectCommitteeTableRowProps {
  item: any;
  index: number;
  activeTab: string;
  onPrioritizeThematicWard: (id: number) => void;
  onPrioritize: (id: number) => void;
  onRecommend: (id: number) => void;
  onEdit: (item: any) => void;
}

export const SubjectCommitteeTableRow = ({
  item,
  index,
  activeTab,
  onPrioritizeThematicWard,
  onPrioritize,
  onRecommend,
  onEdit
}: SubjectCommitteeTableRowProps) => (
  <tr className="border-b border-gray-100 hover:bg-gray-50">
    <td className="py-3 px-4">{index + 1}</td>
    <td className="py-3 px-4">{item.plan_name}</td>
    <td className="py-3 px-4">{item.thematic_area || '-'}</td>
    <td className="py-3 px-4">{item.sub_area || '-'}</td>
    <td className="py-3 px-4">{item.source || '-'}</td>
    <td className="py-3 px-4">{item.expenditure_center || '-'}</td>
    <td className="py-3 px-4">{item.budget || '-'}</td>
    <td className="py-3 px-4">{item.ward_no || '-'}</td>
    <td className="py-3 px-4">{item.status || '-'}</td>
    <td className="py-3 px-4">{item.priority_no || '-'}</td>
    <td className="py-3 px-4">
      {activeTab === 'वडाबाट सिफारिस भएका परियोजना' && (
        <button
          onClick={() => onPrioritizeThematicWard(item.id)}
          className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 cursor-pointer"
        >
          प्राथमिकरण गर्नुहोस्
        </button>
      )}
      {activeTab === 'विषयगत समितिले प्रविष्ट गरेको योजना' && (
        <div className="flex items-center space-x-2">

          <button
            onClick={() => onPrioritize(item.id)}
            className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 cursor-pointer"
          >
            प्राथमिकरण गर्नुहोस्
          </button>
          <button
            onClick={() => onEdit(item)}
            className="text-sm text-green-600 px-3 py-1 rounded-md hover:bg-green-50 border border-green-300 hover:border-green-400 transition-colors"
          >
            <Edit />
          </button>
        </div>

      )}
      {activeTab === 'विषयगत समितिले प्राथमिकरण गरेको परियोजना' && (
        <button
          onClick={() => onRecommend(item.id)}
          className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 cursor-pointer"
        >
          बजेट तथा कार्यक्रम तर्जुमा समितिमा पेश गर्नुहोस्
        </button>
      )}
    </td>
  </tr>
);