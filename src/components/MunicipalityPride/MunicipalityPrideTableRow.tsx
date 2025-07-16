interface MunicipalityPrideTableRowProps {
    activeTab,
    project: any;
    index: number;
      onRecommend: (id: number) => void;
}

export const MunicipalityPrideTableRow = ({ activeTab, project, onRecommend, index }: MunicipalityPrideTableRowProps) => (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
        <td className="py-3 px-4 text-gray-900">{index + 1}</td>
        <td className="py-3 px-4 text-gray-900">{project.plan_name}</td>
        <td className="py-3 px-4 text-gray-900">{project.thematic_area}</td>
        <td className="py-3 px-4 text-gray-900">{project.sub_area}</td>
        <td className="py-3 px-4 text-gray-900">{project.source}</td>
        <td className="py-3 px-4 text-gray-900">{project.expenditure_center}</td>
        <td className="py-3 px-4 text-gray-900">{project.budget}</td>
        <td className="py-3 px-4 text-gray-900">{project.ward_no}</td>
        <td className="py-3 px-4 text-gray-900">{project.status}</td>
        <td className="py-3 px-4 text-gray-900">{project.priority_no}</td>
        <td className="py-3 px-4 text-gray-900">
            {activeTab === 'प्रविष्टी भएका नगर गौरव आयोजना' && (
                <button
                    onClick={() => onRecommend(project.id)}
                    className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 cursor-pointer"
                >
                    बजेट तथा कार्यक्रम तर्जुमा समितिमा पेश गर्नुहोस्
                </button>
            )}
        </td>
    </tr>
);