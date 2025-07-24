import { MunicipalityPrideTableRow } from './MunicipalityPrideTableRow';

interface MunicipalityPrideTableProps {
    activeTab: string;
    budget: any[];
    projects: any[];
    onRecommend: (id: number) => void;
    onEdit: (item: any) => void;
}

export const MunicipalityPrideTable = ({ activeTab, projects, budget, onRecommend, onEdit }: MunicipalityPrideTableProps) => {
    const isEntryTab = activeTab === 'प्रविष्टी भएका नगर गौरव आयोजना';
    const isBudgetTab = activeTab === 'बजेट तथा कार्यक्रम तर्जुमा समितिमा पेश गरिएको परियोजना';

    const dataToRender = isEntryTab ? projects : isBudgetTab ? budget : [];

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-800">
                <thead className="bg-gray-100">
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
                        ].map((heading, i) => (
                            <th
                                key={i}
                                className="text-left py-3 px-4 font-semibold text-gray-800 whitespace-nowrap"
                            >
                                {heading}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {dataToRender && dataToRender.length > 0 ? (
                        dataToRender.map((project, index) => (
                            <MunicipalityPrideTableRow
                                key={project.id}
                                project={project}
                                index={index}
                                activeTab={activeTab}
                                onRecommend={onRecommend}
                                onEdit={onEdit}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan={11} className="py-12 text-center">
                                <div className="flex flex-col items-center justify-center text-gray-500">
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
                                    <p className="text-lg font-medium text-gray-500">हाल उपलब्ध डाटा छैन</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
