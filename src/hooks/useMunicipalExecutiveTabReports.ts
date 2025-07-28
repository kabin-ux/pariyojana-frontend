import { useEffect, useState } from 'react';
import axios from 'axios';

export const useMunicipalExecutiveReports = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Chart States
    const [preAssemblyChart, setPreAssemblyChart] = useState([]);
    const [councilChart, setCouncilChart] = useState([]);

    // Excel Report States
    const [preAssemblyReport, setPreAssemblyReport] = useState([]);
    const [councilReport, setCouncilReport] = useState([]);

    // PDF Report States
    const [preAssemblyReportPDF, setPreAssemblyReportPDF] = useState([]);
    const [councilReportPDF, setCouncilReportPDF] = useState([]);

    const fetchMunicipalExecutiveReports = async () => {
        setLoading(true);
        setError(null);

        try {
            const [
                preAssemblyChartRes,
                councilChartRes,

                preAssemblyReportRes,
                councilReportRes,

                preAssemblyReportPDFRes,
                councilReportPDFRes,
            ] = await Promise.all([
                axios.get('http://213.199.53.33:8000/api/planning/municipality-executive/preassembly-chart/'),
                axios.get('http://213.199.53.33:8000/api/planning/municipality-executive/councilsubmitted-chart/'),

                axios.get('http://213.199.53.33:8000/api/planning/municipality-executive/preassembly/report/?type=excel'),
                axios.get('http://213.199.53.33:8000/api/planning/municipality-executive/councilsubmitted/report/?type=excel'),

                axios.get('http://213.199.53.33:8000/api/planning/municipality-executive/preassembly/report/?type=pdf'),
                axios.get('http://213.199.53.33:8000/api/planning/municipality-executive/councilsubmitted/report/?type=pdf'),
            ]);

            // Set Chart Data
            setPreAssemblyChart(preAssemblyChartRes.data || []);
            setCouncilChart(councilChartRes.data || []);

            // Set Excel Report Data
            setPreAssemblyReport(preAssemblyReportRes.data || []);
            setCouncilReport(councilReportRes.data || []);

            // Set PDF Report Data
            setPreAssemblyReportPDF(preAssemblyReportPDFRes.data || []);
            setCouncilReportPDF(councilReportPDFRes.data || []);

        } catch (err) {
            console.error(err);
            setError('रिपोर्ट लोड गर्न असफल भयो।');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMunicipalExecutiveReports();
    }, []);

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
    const downloadPreAssemblyExcel = async () => downloadFile('preassembly', 'excel', 'नगर सभामा पेश गर्नु अघिको परियोजना.xlsx');
    const downloadCouncilExcel = async () => downloadFile('councilsubmitted', 'excel', 'नगर सभा पेश भएका परियोजना.xlsx');

    // PDF Downloads
    const downloadPreAssemblyPDF = async () => downloadFile('preassembly', 'pdf', 'नगर सभामा पेश गर्नु अघिको परियोजना.pdf');
    const downloadCouncilPDF = async () => downloadFile('councilsubmitted', 'pdf', 'नगर सभा पेश भएका परियोजना.pdf');

    // Common File Download Function
    const downloadFile = async (endpoint: string, type: 'pdf' | 'excel', filename: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(
                `http://213.199.53.33:8000/api/planning/municipality-executive/${endpoint}/report/?type=${type}`,
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

    return {
        loading,
        error,

        // Charts
        preAssemblyChart,
        councilChart,

        // Excel Reports
        preAssemblyReport,
        councilReport,

        // PDF Reports
        preAssemblyReportPDF,
        councilReportPDF,

        downloadPreAssemblyExcel,
        downloadCouncilExcel,

        downloadPreAssemblyPDF,
        downloadCouncilPDF,

        // Fetch function
        fetchMunicipalExecutiveReports,
    };
};
