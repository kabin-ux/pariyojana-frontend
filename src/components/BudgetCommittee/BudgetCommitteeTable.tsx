import { Edit } from "lucide-react";
import { formatWardNumber } from "../../utils/formatters";

interface BudgetCommitteeProps {
    activeTab: string;
    projects: any[];
    onRecommend: (id: number) => void;
    onEdit: (project: any) => void;
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

export const BudgetCommitteeTable = ({ activeTab, projects, onRecommend, onEdit }: BudgetCommitteeProps) => (
    <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
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
                        'प्रतिवेदनहरु',
                        'अन्य',
                    ].map((header, index) => (
                        <th
                            key={index}
                            className="text-left text-sm font-semibold text-gray-700 py-3 px-4 whitespace-nowrap"
                        >
                            {header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
                {projects?.length > 0 ? (
                    projects.map((project, index) => (
                        <tr key={project.id} className="hover:bg-gray-50 transition">
                            <td className="py-3 px-4 text-sm text-gray-800">{index + 1}</td>
                            <td className="py-3 px-4 text-sm text-gray-800 truncate max-w-[200px]" title={project.plan_name}>
                                {project.plan_name}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-800">{project.thematic_area.name || project.thematic_area || '-'}</td>
                            <td className="py-3 px-4 text-sm text-gray-800">{project.sub_area.name || project.sub_area || '-'}</td>
                            <td className="py-3 px-4 text-sm text-gray-800">{project.source.name || project.source || '-'}</td>
                            <td className="py-3 px-4 text-sm text-gray-800">{project.expenditure_center.name || project.expenditure_center || '-'}</td>
                            <td className="py-3 px-4 text-sm text-gray-800">{project.budget || '-'}</td>
                            <td className="py-3 px-4 text-sm text-gray-800">{formatWardNumber(project.ward_no) || '-'}</td>
                            <td className="py-3 px-4">
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                    {project?.status}
                                </span>
                            </td>                            <td className="py-3 px-4 text-sm space-y-2">
                                {project.feasibility_file && (
                                    <a
                                        href={project.feasibility_file}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 hover:shadow-sm"
                                        title="सम्भाव्यता अध्ययन"
                                    >
                                        <FileIcon className="w-3.5 h-3.5" />
                                        सम्भाव्यता अध्ययन
                                    </a>
                                )}

                                {project.detailed_file && (
                                    <a
                                        href={project.detailed_file}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 hover:border-green-300 transition-all duration-200 hover:shadow-sm"
                                        title="विस्तृत अध्ययन"
                                    >
                                        <FileIcon className="w-3.5 h-3.5" />
                                        विस्तृत अध्ययन
                                    </a>
                                )}

                                {project.environmental_file && (
                                    <a
                                        href={project.environmental_file}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200 text-purple-700 rounded-lg text-xs font-medium hover:bg-purple-100 hover:border-purple-300 transition-all duration-200 hover:shadow-sm"
                                        title="वातावरणीय अध्ययन"
                                    >
                                        <FileIcon className="w-3.5 h-3.5" />
                                        वातावरणीय अध्ययन
                                    </a>
                                )}

                                {!project.feasibility_file &&
                                    !project.detailed_file &&
                                    !project.environmental_file && (
                                        <div className="flex items-center justify-center h-8 text-gray-400 text-xs">
                                            <NoFilesIcon className="w-4 h-4 mr-1" />
                                            कुनै फाइल छैन
                                        </div>
                                    )}
                            </td>

                            <td className="py-3 px-4 space-x-2">
                                <button
                                    onClick={() => onRecommend(project.id)}
                                    className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                                >
                                    पेश गर्नुहोस्
                                </button>

                                {(activeTab === 'प्रदेश सरकारबाट हस्तान्तरित कार्यक्रम' ||
                                    activeTab === 'संघीय सरकारबाट हस्तान्तरित कार्यक्रम') && (
                                        <button
                                            onClick={() => onEdit(project)}
                                            className="text-sm text-green-600 px-3 py-1 rounded-md hover:bg-green-50 border border-green-300 hover:border-green-400 transition-colors"
                                        >
                                            <Edit />
                                        </button>
                                    )}
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={11} className="py-12 text-center text-gray-500">
                            <div className="flex flex-col items-center justify-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <svg
                                        className="w-8 h-8 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                </div>
                                <p className="text-lg font-medium">डेटा फेला परेन</p>
                            </div>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
);
