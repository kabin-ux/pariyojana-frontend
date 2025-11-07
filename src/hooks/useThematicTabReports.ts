import { useEffect, useState } from 'react';
import axios from 'axios';

export const useThematicReports = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Chart States
    const [wardRecommendedChart, setWardRecommendedChart] = useState([]);
    const [thematicChart, setThematicChart] = useState([]);
    const [thematicRecommendedChart, setThematicRecommendedChart] = useState([]);

    // Excel Report States
    const [wardRecommendedReport, setWardRecommendedReport] = useState([]);
    const [thematicReport, setThematicReport] = useState([]);
    const [thematicRecommendedReport, setThematicRecommendedReport] = useState([]);

    // PDF Report States
    const [wardRecommendedReportPDF, setWardRecommendedReportPDF] = useState([]);
    const [thematicReportPDF, setThematicReportPDF] = useState([]);
    const [thematicRecommendedReportPDF, setThematicRecommendedReportPDF] = useState([]);

    const fetchThematicReports = async () => {
        setLoading(true);
        setError(null);

        try {
            const [
                wardRecommendedChartRes,
                thematicChartRes,
                thematicRecommendedChartRes,

                wardRecommendedReportRes,
                thematicReportRes,
                thematicRecommendedReportRes,

                wardRecommendedReportPDFRes,
                thematicReportPDFRes,
                thematicRecommendedReportPDFRes,
            ] = await Promise.all([
                axios.get('http://213.199.53.33:8001/api/planning/thematic/wardlevel-chart/'),
                axios.get('http://213.199.53.33:8001/api/planning/thematic/wardlevelthemtic-chart/'),
                axios.get('http://213.199.53.33:8001/api/planning/thematic/Wardrecommended-chart/'),

                axios.get('http://213.199.53.33:8001/api/planning/thematic/wardlevel-chart/report/?type=excel'),
                axios.get('http://213.199.53.33:8001/api/planning/thematic/wardlevelthemtic-chart/report/?type=excel'),
                axios.get('http://213.199.53.33:8001/api/planning/thematic/Wardrecommended-chart/report/?type=excel'),

                axios.get('http://213.199.53.33:8001/api/planning/thematic/wardlevel-chart/report/?type=pdf'),
                axios.get('http://213.199.53.33:8001/api/planning/thematic/wardlevelthemtic-chart/report/?type=pdf'),
                axios.get('http://213.199.53.33:8001/api/planning/thematic/Wardrecommended-chart/report/?type=pdf'),
            ]);

            // Set Chart Data
            setWardRecommendedChart(wardRecommendedChartRes.data || []);
            setThematicChart(thematicChartRes.data || []);
            setThematicRecommendedChart(thematicRecommendedChartRes.data || []);

            // Set Excel Report Data
            setWardRecommendedReport(wardRecommendedReportRes.data || []);
            setThematicReport(thematicReportRes.data || []);
            setThematicRecommendedReport(thematicRecommendedReportRes.data || []);

            // Set PDF Report Data
            setWardRecommendedReportPDF(wardRecommendedReportPDFRes.data || []);
            setThematicReportPDF(thematicReportPDFRes.data || []);
            setThematicRecommendedReportPDF(thematicRecommendedReportPDFRes.data || []);
        } catch (err) {
            console.error(err);
            setError('वार्ड रिपोर्ट लोड गर्न असफल भयो।');
        } finally {
            setLoading(false);
        }
    };

    const downloadBlob = (blob: Blob, filename: string) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    };

    // Excel Downloads
    const downloadWardRecommendedExcel = async () => downloadFile('wardlevel-chart', 'excel', 'ward-level-report.xlsx');
    const downloadThematicExcel = async () => downloadFile('wardlevelthemtic-chart', 'excel', 'wardlevelthematic-report.xlsx');
    const downloadThematicRecommendedExcel = async () => downloadFile('Wardrecommended-chart', 'excel', 'Wardrecommended-report.xlsx');

    // PDF Downloads
    const downloadWardRecommendedPDF = async () => downloadFile('wardlevel-chart', 'pdf', 'ward-level-report.pdf');
    const downloadThematicPDF = async () => downloadFile('wardlevelthemtic-chart', 'pdf', 'ward-thematic-report.pdf');
    const downloadThematicRecommendedPDF = async () => downloadFile('Wardrecommended-chart', 'pdf', 'Wardrecommended.pdf');

    // Common File Download Function
    const downloadFile = async (endpoint: string, type: 'pdf' | 'excel', filename: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(
                `http://213.199.53.33:8001/api/planning/thematic/${endpoint}/report/?type=${type}`,
                { responseType: 'blob', timeout: 30000 }
            );
            downloadBlob(response.data, filename);
        } catch (err) {
            console.error(err);
            setError(`डाउनलोड गर्न असफल भयो (${filename})`);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchThematicReports();
    }, []);

    return {
        loading,
        error,

        // Charts
        wardRecommendedChart,
        thematicChart,
        thematicRecommendedChart,

        // Excel Reports
        wardRecommendedReport,
        thematicReport,
        thematicRecommendedReport,

        // PDF Reports
        wardRecommendedReportPDF,
        thematicReportPDF,
        thematicRecommendedReportPDF,

        downloadWardRecommendedExcel,
        downloadThematicExcel,
        downloadThematicRecommendedExcel,


        downloadWardRecommendedPDF,
        downloadThematicPDF,
        downloadThematicRecommendedPDF,

        // Fetch function
        fetchThematicReports,
    };
};

