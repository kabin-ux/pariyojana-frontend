import { Download } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useThematicReports } from '../../hooks/useThematicTabReports';

ChartJS.register(ArcElement, Tooltip, Legend);


interface ReportContentProps {
    activeTab: string;
}

export const ReportContent = ({ activeTab }: ReportContentProps) => {
    const {
        wardRecommendedChart = {},
        thematicChart = {},
        thematicRecommendedChart = {},
        wardRecommendedReport,
        thematicReport,
        thematicRecommendedReport,
        wardRecommendedReportPDF,
        thematicReportPDF,
        thematicRecommendedReportPDF,

        downloadWardRecommendedExcel,
        downloadThematicExcel,
        downloadThematicRecommendedExcel,


        downloadWardRecommendedPDF,
        downloadThematicPDF,
        downloadThematicRecommendedPDF,
    } = useThematicReports();

    let chartData = {};
    let reportTitle = '';
    let excelLink = '';
    let pdfLink = '';

    switch (activeTab) {
        case 'वडा समितिले सिफारिस गरेका योजना':
            chartData = wardRecommendedChart;
            reportTitle = 'वडा समितिले सिफारिस गरेका योजना';
            excelLink = wardRecommendedReport;
            pdfLink = wardRecommendedReportPDF;
            console.log('URLs:', { excelLink, pdfLink });
            break;
        case 'विषयगत समितिले प्रविष्ट गरेको योजना':
            chartData = thematicChart;
            reportTitle = 'विषयगत समितिले प्रविष्ट गरेको योजना';
            excelLink = thematicReport;
            pdfLink = thematicReportPDF;
            break;
        case 'विषयगत समितिले प्राथमिकरण गरिएको परियोजना':
            chartData = thematicRecommendedChart;
            reportTitle = 'विषयगत समितिले प्राथमिकरण गरिएको परियोजना';
            excelLink = thematicRecommendedReport;
            pdfLink = thematicRecommendedReportPDF;
            break;
        default:
            chartData = {};
    }

    const { budget_distribution = [], project_count_distribution = [] } = chartData;

    if (activeTab && chartData) {
        const topBudget = budget_distribution[0];
        const topProject = project_count_distribution[0];

        return (
            <div>
                {/* Report Download Section */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">रिपोर्ट डाउनलोड ({reportTitle})</h3>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <label className="text-sm font-medium text-gray-700">क्षेत्र:</label>
                                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option>क्षेत्र</option>
                                </select>
                            </div>
                            <div className="flex items-center space-x-2">
                                <label className="text-sm font-medium text-gray-700">उप-क्षेत्र:</label>
                                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option>उप-क्षेत्र</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => {
                                    switch (activeTab) {
                                        case 'वडा समितिले सिफारिस गरेका योजना':
                                            downloadWardRecommendedExcel(reportTitle);
                                            break;
                                        case 'विषयगत समितिले प्रविष्ट गरेको योजना':
                                            downloadThematicExcel(reportTitle);
                                            break;
                                        case 'विषयगत समितिले प्राथमिकरण गरिएको परियोजना':
                                            downloadThematicRecommendedExcel(reportTitle);
                                            break;
                                        default:
                                            break;
                                    }
                                }}
                                disabled={!excelLink}
                                className={`flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg transition-colors ${excelLink
                                    ? 'hover:bg-gray-50 cursor-pointer'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                <Download className="w-4 h-4" />
                                <span>Excel</span>
                            </button>

                            {/* PDF Download Button */}
                            <button
                                onClick={() => {
                                    switch (activeTab) {
                                        case 'वडा समितिले सिफारिस गरेका योजना':
                                            downloadWardRecommendedPDF(reportTitle);
                                            break;
                                        case 'विषयगत समितिले प्रविष्ट गरेको योजना':
                                            downloadThematicPDF(reportTitle);
                                            break;
                                        case 'विषयगत समितिले प्राथमिकरण गरिएको परियोजना':
                                            downloadThematicRecommendedPDF(reportTitle);
                                            break;
                                        default:
                                            break;
                                    }
                                }}
                                disabled={!pdfLink}
                                className={`flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg transition-colors ${pdfLink
                                    ? 'hover:bg-gray-50 cursor-pointer'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                <Download className="w-4 h-4" />
                                <span>PDF</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-4">
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            रिपोर्ट यूनिफाइड
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                            रिपोर्ट बनाउनुहोस्
                        </button>
                    </div>

                    {/* Debug info (remove in production) */}
                    {/* {process.env.NODE_ENV === 'development' && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                                <strong>Debug Info:</strong><br />
                                Excel URL: {excelLink || 'Not available'}<br />
                                PDF URL: {pdfLink || 'Not available'}
                            </p>
                        </div>
                    )} */}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <ChartCard
                        title="क्षेत्रगत बजेट वितरण"
                        data={budget_distribution}
                        unit="रु"
                    />
                    <ChartCard
                        title="क्षेत्रगत योजनाहरूको तथ्याङ्क"
                        data={project_count_distribution}
                        unit="परियोजना"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                </svg>
            </div>
            <p className="text-lg font-medium text-gray-500">यस ट्याबको लागि डाटा उपलब्ध छैन</p>
        </div>
    );
};

// Reusable chart component
const ChartCard = ({
    title,
    data = [],
    unit = ''
}: {
    title: string;
    data: { label: string; percentage: number; value: number }[];
    unit?: string;
}) => {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
                <p className="text-gray-500">डेटा उपलब्ध छैन</p>
            </div>
        );
    }

    const labels = data.map(d => d.label);
    const percentages = data.map(d => d.percentage);
    const values = data.map(d => d.value);
    const totalValue = values.reduce((sum, v) => sum + v, 0);

    const colors = [
        '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
        '#06b6d4', '#f43f5e', '#a3e635', '#ec4899', '#14b8a6',
        '#6366f1', '#facc15', '#fb923c', '#4ade80'
    ];

    const pieData = {
        labels,
        datasets: [
            {
                data: percentages,
                backgroundColor: colors.slice(0, labels.length),
                borderWidth: 1,
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                display: true,
                position: 'bottom' as const,
            },
        },
        cutout: '70%',
    };

    return (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
            <div className="flex flex-col items-center justify-center mb-4 relative h-64">
                <Doughnut data={pieData} options={options} />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-sm font-semibold text-gray-600 text-center">
                        जम्मा:<br />
                        {unit} {unit === 'रु' ? totalValue.toLocaleString('ne-NP') : totalValue}
                    </span>
                </div>
            </div>
        </div>
    );
};