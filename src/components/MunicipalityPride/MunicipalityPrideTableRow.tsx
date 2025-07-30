import { Edit } from "lucide-react";
import { formatWardNumber } from "../../utils/formatters";

interface MunicipalityPrideTableRowProps {
    activeTab: string,
    project: any;
    index: number;
    onRecommend: (id: number) => void;
    onEdit: (project: any) => void;

}

export const MunicipalityPrideTableRow = ({ activeTab, project, onRecommend, onEdit, index }: MunicipalityPrideTableRowProps) => (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
        <td className="py-3 px-4 text-gray-900">{index + 1}</td>
        <td className="py-3 px-4 text-gray-900">{project.plan_name}</td>
        <td className="py-3 px-4 text-gray-900">{project.thematic_area.name}</td>
        <td className="py-3 px-4 text-gray-900">{project.sub_area.name}</td>
        <td className="py-3 px-4 text-gray-900">{project.source.name}</td>
        <td className="py-3 px-4 text-gray-900">{project.expenditure_center.name}</td>
        <td className="py-3 px-4 text-gray-900">{project.budget}</td>
        <td className="py-3 px-4 text-gray-900">{formatWardNumber(project.ward_no)}</td>
        <td className="py-3 px-4 text-gray-900">{project.status}</td>
        <td className="py-3 px-4 text-gray-900">{project.priority_no}</td>
        <td className="py-3 px-4 text-gray-900">
            {activeTab === 'प्रविष्टी भएका नगर गौरव आयोजना' && (
                <div className="flex items-center space-x-2">

                    <button
                        onClick={() => onRecommend(project.id)}
                        className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 cursor-pointer"
                    >
                        बजेट तथा कार्यक्रम तर्जुमा समितिमा पेश गर्नुहोस्
                    </button>
                    <button
                        onClick={() => onEdit(project)}
                        className="text-sm text-green-600 px-3 py-1 rounded-md hover:bg-green-50 border border-green-300 hover:border-green-400 transition-colors"
                    >
                        <Edit />
                    </button>
                </div>
            )}
        </td>
    </tr>
);