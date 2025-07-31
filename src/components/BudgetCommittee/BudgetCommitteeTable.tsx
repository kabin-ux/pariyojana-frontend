import { Edit } from "lucide-react";
import { formatWardNumber } from "../../utils/formatters";

interface BudgetCommitteeProps {
    activeTab: string;
    projects: any[];
    onRecommend: (id: number) => void;
    onEdit: (project: any) => void;
}

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
                        'प्राथमिकता नम्बर',
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
                            <td className="py-3 px-4 text-sm text-gray-800">{project.status || '-'}</td>
                            <td className="py-3 px-4 text-sm text-gray-800">{project.priority_no || '-'}</td>
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
