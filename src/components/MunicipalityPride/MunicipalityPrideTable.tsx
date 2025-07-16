import { MunicipalityPrideTableRow } from './MunicipalityPrideTableRow';

interface MunicipalityPrideTableProps {
    activeTab: string;
    budget: any[];
    projects: any[];
    onRecommend: (id: number) => void;
}

export const MunicipalityPrideTable = ({ activeTab, projects, budget, onRecommend}: MunicipalityPrideTableProps) => {
    const isEntryTab = activeTab === 'प्रविष्टी भएका नगर गौरव आयोजना';
    const isBudgetTab = activeTab === 'बजेट तथा कार्यक्रम तर्जुमा समितिमा पेश गरिएको परियोजना';

    const dataToRender = isEntryTab ? projects : isBudgetTab ? budget : [];

    return (
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
                    {dataToRender && dataToRender.length > 0 ? (
                        dataToRender.map((project, index) => (
                            <MunicipalityPrideTableRow
                                activeTab={activeTab}
                                key={project.id}
                                project={project}
                                onRecommend={onRecommend}
                                index={index} />
                        ))
                    ) : (
                        <tr>
                            <td colSpan={11} className="py-12 text-center">
                                <div className="flex flex-col items-center justify-center text-gray-500">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                    </div>
                                    <p className="text-lg font-medium">No data</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
