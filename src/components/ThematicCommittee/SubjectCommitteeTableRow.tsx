import { Edit } from "lucide-react";
import { formatWardNumber } from "../../utils/formatters";

interface SubjectCommitteeTableRowProps {
  item: any;
  index: number;
  activeTab: string;
  onPrioritizeThematicWard: (id: number) => void;
  onPrioritize: (id: number) => void;
  onRecommend: (id: number) => void;
  onEdit: (item: any) => void;
}

// Correct typing for React components
interface IconProps {
  className?: string;
}

const FileIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
  </svg>
);

const NoFilesIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4z" />
  </svg>
);

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
    <td className="py-3 px-4">{item.thematic_area.name || item.thematic_area || '-'}</td>
    <td className="py-3 px-4">{item.sub_area.name || item.sub_area || '-'}</td>
    <td className="py-3 px-4">{item.source.name || item.source || '-'}</td>
    <td className="py-3 px-4">{item.expenditure_center.name || item.expenditure_center || '-'}</td>
    <td className="py-3 px-4">{item.budget || '-'}</td>
    <td className="py-3 px-4">{formatWardNumber(item.ward_no) || '-'}</td>
    <td className="py-3 px-4">{item.status || '-'}</td>
    <td className="py-3 px-4 text-sm space-y-2">
      {item.feasibility_file && (
        <a
          href={item.feasibility_file}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 hover:shadow-sm"
          title="सम्भाव्यता अध्ययन"
        >
          <FileIcon className="w-3.5 h-3.5" />
          सम्भाव्यता अध्ययन
        </a>
      )}

      {item.detailed_file && (
        <a
          href={item.detailed_file}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 hover:border-green-300 transition-all duration-200 hover:shadow-sm"
          title="विस्तृत अध्ययन"
        >
          <FileIcon className="w-3.5 h-3.5" />
          विस्तृत अध्ययन
        </a>
      )}

      {item.environmental_file && (
        <a
          href={item.environmental_file}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200 text-purple-700 rounded-lg text-xs font-medium hover:bg-purple-100 hover:border-purple-300 transition-all duration-200 hover:shadow-sm"
          title="वातावरणीय अध्ययन"
        >
          <FileIcon className="w-3.5 h-3.5" />
          वातावरणीय अध्ययन
        </a>
      )}

      {!item.feasibility_file &&
        !item.detailed_file &&
        !item.environmental_file && (
          <div className="flex items-center justify-center h-8 text-gray-400 text-xs">
            <NoFilesIcon className="w-4 h-4 mr-1" />
            कुनै फाइल छैन
          </div>
        )}
    </td>

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