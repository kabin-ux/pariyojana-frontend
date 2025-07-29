import { Download } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useMunicipalityPrideReports } from '../../hooks/useMunicipalityPrideTabReports';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ChartData {
    budget_distribution: Array<{
        label: string;
        percentage: number;
        value: number;
    }>;
    project_count_distribution: Array<{
        label: string;
        percentage: number;
        value: number;
    }>;
}

interface ReportContentProps {
    activeTab: string;
}

export const ReportContent = ({ activeTab }: ReportContentProps) => {
    const {
        municipalityPrideChart = {},
        municipalityPrideSubmitBudgetChart = {},

        municipalityPrideReport,
        municipalityPrideSubmitBudgetReport,

        municipalityPrideReportPDF,
        municipalityPrideSubmitBudgetReportPDF,

        downloadMunicipalityPrideExcel,
        downloadMunicipalityPrideSubmitBudgetExcel,

        downloadMunicipalityPridePDF,
        downloadMunicipalityPrideSubmitBudgetPDF,
    } = useMunicipalityPrideReports();

    let chartData: ChartData = { budget_distribution: [], project_count_distribution: [] };
    let reportTitle = '';
  let hasExcelLink = false;
  let hasPDFLink = false;

    switch (activeTab) {
        case 'प्रविष्टी भएका नगर गौरव आयोजना':
            chartData = municipalityPrideChart as ChartData;
            reportTitle = 'प्रविष्टी भएका नगर गौरव आयोजना';
            hasExcelLink = !!municipalityPrideReport;
            hasPDFLink = !!municipalityPrideReportPDF;
            break;
        case 'बजेट तथा कार्यक्रम तर्जुमा समितिमा पेश गरिएको परियोजना':
            chartData = municipalityPrideSubmitBudgetChart as ChartData;
            reportTitle = 'बजेट तथा कार्यक्रम तर्जुमा समितिमा पेश गरिएको परियोजना';
            hasExcelLink = !!municipalityPrideSubmitBudgetReport;
            hasPDFLink = !!municipalityPrideSubmitBudgetReportPDF;
            break;
        default:
            chartData = { budget_distribution: [], project_count_distribution: [] };
    }

    const { budget_distribution = [], project_count_distribution = [] } = chartData;



    if (activeTab && chartData) {

        return (
            <div>
                {/* Report Download Section */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">रिपोर्ट डाउनलोड ({reportTitle})</h3>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => {
                                    switch (activeTab) {
                                        case 'प्रविष्टी भएका नगर गौरव आयोजना':
                                            downloadMunicipalityPrideExcel();
                                            break;
                                        case 'बजेट तथा कार्यक्रम तर्जुमा समितिमा पेश गरिएको परियोजना':
                                            downloadMunicipalityPrideSubmitBudgetExcel();
                                            break;
                                        default:
                                            break;
                                    }
                                }}
                                disabled={!hasExcelLink}
                                className={`flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg transition-colors ${hasExcelLink
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
                                        case 'प्रविष्टी भएका नगर गौरव आयोजना':
                                            downloadMunicipalityPridePDF();
                                            break;
                                        case 'बजेट तथा कार्यक्रम तर्जुमा समितिमा पेश गरिएको परियोजना':
                                            downloadMunicipalityPrideSubmitBudgetPDF();
                                            break;
                                        default:
                                            break;
                                    }
                                }}
                                disabled={!hasPDFLink}
                                className={`flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg transition-colors ${hasPDFLink
                                    ? 'hover:bg-gray-50 cursor-pointer'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                <Download className="w-4 h-4" />
                                <span>PDF</span>
                            </button>
                        </div>
                    </div>
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
    unit = '',
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
    ];

    const chartData = {
        labels,
        datasets: [
            {
                data: percentages,
                backgroundColor: colors.slice(0, data.length),
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
                <Doughnut data={chartData} options={options} />
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