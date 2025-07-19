import { Download } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useBudgetReports } from '../../hooks/useBudgetTabReports';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ReportContentProps {
    activeTab: string;
}

export const ReportContent = ({ activeTab }: ReportContentProps) => {
    const {
        municipalityLevelBudgetChart = {},
        federalGovernmentBudgetChart = {},
        municipalityPrideBudgetChart = {},
        provincialGovernmentBudgetChart = {},
        thematicBudgetChart = {},
        wardLevelBudgetChart = {},

        municipalityLevelBudgetReport,
        federalGovernmentBudgetReport,
        municipalityPrideBudgetReport,
        provincialGovernmentBudgetReport,
        thematicBudgetReport,
        wardLevelBudgetReport,

        municipalityLevelBudgetReportPDF,
        federalGovernmentBudgetReportPDF,
        municipalityPrideBudgetReportPDF,
        provincialGovernmentBudgetReportPDF,
        thematicBudgetReportPDF,
        wardLevelBudgetReportPDF,
    } = useBudgetReports();

    let chartData = {};
    let reportTitle = '';
    let excelLink = '';
    let pdfLink = '';

    switch (activeTab) {
        case 'वडा स्तरीय कार्यक्रम':
            chartData = wardLevelBudgetChart;
            reportTitle = 'वडा स्तरीय कार्यक्रम';
            excelLink = wardLevelBudgetReport;
            pdfLink = wardLevelBudgetReportPDF;
            console.log('URLs:', { excelLink, pdfLink });
            break;
        case 'नगर स्तरीय कार्यक्रम':
            chartData = municipalityLevelBudgetChart;
            reportTitle = 'नगर स्तरीय कार्यक्रम';
            excelLink = municipalityLevelBudgetReport;
            pdfLink = municipalityLevelBudgetReportPDF;
            break;
        case 'विषयगत समितिको कार्यक्रम':
            chartData = thematicBudgetChart;
            reportTitle = 'विषयगत समितिको कार्यक्रम';
            excelLink = thematicBudgetReport;
            pdfLink = thematicBudgetReportPDF;
            break;
        case 'नगर गौरव आयोजना':
            chartData = municipalityPrideBudgetChart;
            reportTitle = 'नगर गौरव आयोजना';
            excelLink = municipalityPrideBudgetReport;
            pdfLink = municipalityPrideBudgetReportPDF;
            break;
        case 'संघिय सरकारबाट हस्तान्तरित कार्यक्रम':
            chartData = federalGovernmentBudgetChart;
            reportTitle = 'संघिय सरकारबाट हस्तान्तरित कार्यक्रम';
            excelLink = federalGovernmentBudgetReport;
            pdfLink = federalGovernmentBudgetReportPDF;
            break;
        case 'प्रदेश सरकारबाट हस्तान्तरित कार्यक्रम':
            chartData = provincialGovernmentBudgetChart;
            reportTitle = 'प्रदेश सरकारबाट हस्तान्तरित कार्यक्रम';
            excelLink = provincialGovernmentBudgetReport;
            pdfLink = provincialGovernmentBudgetReportPDF;
            break;
        default:
            chartData = {};
    }

    const { budget_distribution = [], project_count_distribution = [] } = chartData;

    // Validate URL function
    const isValidUrl = (url: string): boolean => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    // Direct download approach (for same-origin URLs)
    const handleDirectDownload = (url: string, filename: string) => {
        if (!url || url.trim() === '') {
            alert('डाउनलोड लिंक उपलब्ध छैन।');
            return;
        }

        const safeUrl = encodeURI(url); // <-- fix here
        console.log('Attempting direct download:', safeUrl);

        const link = document.createElement('a');
        link.href = safeUrl;
        link.setAttribute('download', filename);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    // Fetch-based download with improved error handling
    const handleFetchDownload = async (url: string, filename: string) => {
        if (!url || url.trim() === '') {
            alert('डाउनलोड लिंक उपलब्ध छैन।');
            return;
        }

        // Validate URL format
        if (!isValidUrl(url)) {
            console.error('Invalid URL:', url);
            alert('अमान्य URL। कृपया फेरि प्रयास गर्नुहोस्।');
            return;
        }

        try {
            console.log('Fetching:', url);
            const safeUrl = encodeURI(url)

            const response = await fetch(safeUrl, {
                method: 'GET',
                headers: {
                    'Accept': '*/*',
                    // Add any required authentication headers here
                    // 'Authorization': 'Bearer ' + token,
                },
                mode: 'cors', // explicitly set CORS mode
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();

            // Check if blob is valid
            if (blob.size === 0) {
                throw new Error('Empty file received');
            }

            console.log('Blob size:', blob.size);
            console.log('Blob type:', blob.type);

            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);

            console.log('Download completed successfully');
        } catch (error) {
            console.error('Download failed:', error);

            // Provide more specific error messages
            if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                alert('नेटवर्क त्रुटि। कृपया इन्टरनेट जडान जाँच गर्नुहोस् र फेरि प्रयास गर्नुहोस्।');
            } else if (error instanceof Error && error.message.includes('HTTP error')) {
                alert(`सर्भर त्रुटि: ${error.message}। कृपया फेरि प्रयास गर्नुहोस्।`);
            } else {
                alert('डाउनलोड गर्न सकिएन। कृपया फेरि प्रयास गर्नुहोस्।');
            }

            // Fallback to direct download
            console.log('Attempting fallback to direct download');
            handleDirectDownload(url, filename);
        }
    };

    // Main download handler that tries different approaches
    const handleDownload = async (url: string, filename: string) => {
        console.log('Download requested:', { url, filename });

        // Check if URL is from same origin or if it's a relative path
        const currentOrigin = window.location.origin;
        const isRelativeUrl = !url.startsWith('http');
        const isSameOrigin = isRelativeUrl || url.startsWith(currentOrigin);

        if (isSameOrigin) {
            // For same-origin URLs, try direct download first
            console.log('Same origin detected, trying direct download');
            handleDirectDownload(url, filename);
        } else {
            // For cross-origin URLs, try fetch first, then fallback to direct
            console.log('Cross-origin detected, trying fetch download');
            await handleFetchDownload(url, filename);
        }
    };

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
                                onClick={() => handleDownload(excelLink, `${reportTitle}.xlsx`)}
                                disabled={!excelLink}
                                className={`flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg transition-colors ${excelLink
                                    ? 'hover:bg-gray-50 cursor-pointer'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                <Download className="w-4 h-4" />
                                <span>Excel</span>
                            </button>

                            <button
                                onClick={() => handleDownload(pdfLink, `${reportTitle}.pdf`)}
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
        '#6366f1', '#facc15', '#fb923c', '#4ade80',
    ];

    const pieData = {
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