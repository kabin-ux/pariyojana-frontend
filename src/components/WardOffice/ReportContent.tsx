import { Download } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import React, { useMemo } from 'react';
import { useWardReports } from '../../hooks/useWardTabReports';

ChartJS.register(ArcElement, Tooltip, Legend);


interface ReportContentProps {
  activeTab: string;
}

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


export const ReportContent = ({ activeTab }: ReportContentProps) => {
  const {
    wardLevelChart = {},
    wardLevelThematicChart = {},
    municipalityLevelChart = {},
    prioritizedWardChart = {},
    prioritizedWardThematicChart = {},

    wardLevelReport,
    wardLevelThematicReport,
    municipalityLevelReport,
    prioritizedWardReport,
    prioritizedWardThematicReport,

    wardLevelReportPDF,
    wardLevelThematicReportPDF,
    municipalityLevelReportPDF,
    prioritizedWardReportPDF,
    prioritizedWardThematicReportPDF,

    downloadWardLevelExcel,
    downloadWardLevelThematicExcel,
    downloadMunicipalityLevelExcel,
    downloadPrioritizedWardExcel,
    downloadPrioritizedWardThematicExcel,

    downloadWardLevelPDF,
    downloadWardLevelThematicPDF,
    downloadMunicipalityLevelPDF,
    downloadPrioritizedWardPDF,
    downloadPrioritizedWardThematicPDF

  } = useWardReports();

  console.log(wardLevelChart)

  let chartData: ChartData = { budget_distribution: [], project_count_distribution: [] };
  let reportTitle = '';
  let hasExcelLink = false;
  let hasPdfLink = false;

  switch (activeTab) {
    case 'वडा परियोजना प्रविष्टी':
      chartData = wardLevelChart as ChartData;
      reportTitle = 'वडा परियोजना प्रविष्टी';
      hasExcelLink = !!wardLevelReport;
      hasPdfLink = !!wardLevelReportPDF;
      break;
    case 'नगर परियोजना प्रविष्टी':
      chartData = municipalityLevelChart as ChartData;
      reportTitle = 'नगर परियोजना प्रविष्टी';
      hasExcelLink = !!municipalityLevelReport;
      hasPdfLink = !!municipalityLevelReportPDF;
      break;
    case 'विषयगत समितिका परियोजना':
      chartData = wardLevelThematicChart as ChartData;
      reportTitle = 'विषयगत समितिका परियोजना';
      hasExcelLink = !!wardLevelThematicReport;
      hasPdfLink = !!wardLevelThematicReportPDF;
      break;
    case 'वडा समितिले प्राथमिकरण गरिएको परियोजना':
      chartData = prioritizedWardChart as ChartData;
      reportTitle = 'वडा समितिले प्राथमिकरण गरिएको परियोजना';
      hasExcelLink = !!prioritizedWardReport;
      hasPdfLink = !!prioritizedWardReportPDF;
      break;
    case 'प्राथमिकरण भएका विषयगत समितिका परियोजना':
      chartData = prioritizedWardThematicChart as ChartData;
      reportTitle = 'प्राथमिकरण भएका विषयगत समितिका परियोजना';
      hasExcelLink = !!prioritizedWardThematicReport;
      hasPdfLink = !!prioritizedWardThematicReportPDF;
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
              {/* Excel Download Button */}
              <button
                onClick={() => {
                  switch (activeTab) {
                    case 'वडा परियोजना प्रविष्टी':
                      downloadWardLevelExcel();
                      break;
                    case 'नगर परियोजना प्रविष्टी':
                      downloadMunicipalityLevelExcel();
                      break;
                    case 'विषयगत समितिका परियोजना':
                      downloadWardLevelThematicExcel();
                      break;
                    case 'वडा समितिले प्राथमिकरण गरिएको परियोजना':
                      downloadPrioritizedWardExcel();
                      break;
                    case 'प्राथमिकरण भएका विषयगत समितिका परियोजना':
                      downloadPrioritizedWardThematicExcel();
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
                    case 'वडा परियोजना प्रविष्टी':
                      downloadWardLevelPDF();
                      break;
                    case 'नगर परियोजना प्रविष्टी':
                      downloadMunicipalityLevelPDF();
                      break;
                    case 'विषयगत समितिका परियोजना':
                      downloadWardLevelThematicPDF();
                      break;
                    case 'वडा समितिले प्राथमिकरण गरिएको परियोजना':
                      downloadPrioritizedWardPDF();
                      break;
                    case 'प्राथमिकरण भएका विषयगत समितिका परियोजना':
                      downloadPrioritizedWardThematicPDF();
                      break;
                    default:
                      break;
                  }
                }}
                disabled={!hasPdfLink}
                className={`flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg transition-colors ${hasPdfLink
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
const ChartCard = React.memo(function ChartCard({
  title,
  data = [],
  unit = ''
}: {
  title: string;
  data: { label: string; percentage: number; value: number }[];
  unit?: string;
}) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-500">डेटा उपलब्ध छैन</p>
      </div>
    );
  }

  // Limit to top 10 + "अन्य"
  const topData = data.slice(0, 10);
  const rest = data.slice(10);
  if (rest.length > 0) {
    const otherSum = rest.reduce(
      (acc, cur) => ({
        label: 'अन्य',
        value: acc.value + cur.value,
        percentage: acc.percentage + cur.percentage,
      }),
      { label: 'अन्य', value: 0, percentage: 0 }
    );
    topData.push(otherSum);
  }

  const labels = topData.map(d => d.label);
  const percentages = topData.map(d => d.percentage);
  const values = topData.map(d => d.value);
  const totalValue = values.reduce((sum, v) => sum + v, 0);

  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f43f5e', '#a3e635',
    '#ec4899', '#14b8a6', '#6366f1', '#facc15', '#fb923c', '#4ade80'
  ];

  // Memoize chart data
  const pieData = useMemo(() => ({
    labels,
    datasets: [{
      data: percentages,
      backgroundColor: colors.slice(0, labels.length),
      borderWidth: 1,
    }],
  }), [labels, percentages]);

  const options = useMemo(() => ({
    animation: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
      },
    },
    cutout: '70%',
  }), []);

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="flex flex-col items-center justify-center mb-4 relative h-48">
        <Doughnut data={pieData} options={options} />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-sm font-semibold text-gray-600 text-center">
            जम्मा: <br />
            {unit} {unit === 'रु' ? totalValue.toLocaleString('ne-NP') : totalValue}
          </span>
        </div>
      </div>
    </div>
  );
});
