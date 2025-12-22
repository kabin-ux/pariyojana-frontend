import { useEffect, useState } from 'react';
import axios from 'axios';

export const useCityCouncilReports = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Chart States
    const [submittedChart, setSubmittedChart] = useState([]);
    const [approvedChart, setApprovedChart] = useState([]);

    // Excel Report States
    const [submittedReport, setSubmittedReport] = useState<Blob | null>(null);
    const [approvedReport, setApprovedReport] = useState<Blob | null>(null);

    // PDF Report States
    const [submittedReportPDF, setSubmittedReportPDF] = useState<Blob | null>(null);
    const [approvedReportPDF, setApprovedReportPDF] = useState<Blob | null>(null);

    const fetchCityCouncilReports = async () => {
        setLoading(true);
        setError(null);

        try {
            const [
                submittedChartRes,
                approvedChartRes,
                submittedReportRes,
                approvedReportRes,
                submittedReportPDFRes,
                approvedReportPDFRes,
            ] = await Promise.all([
                axios.get('http://213.199.53.33:81/api/planning/municipal-assembly/submittedproject-chart/'),
                axios.get('http://213.199.53.33:81/api/planning/municipal-assembly/projectapprove-chart/'),

                axios.get('http://213.199.53.33:81/api/planning/municipal-assembly/submittedproject/report/?type=excel', {
                    responseType: 'blob'
                }),
                axios.get('http://213.199.53.33:81/api/planning/municipal-assembly/projectapprove/report/?type=excel', {
                    responseType: 'blob'
                }),

                axios.get('http://213.199.53.33:81/api/planning/municipal-assembly/submittedproject/report/?type=pdf', {
                    responseType: 'blob'
                }),
                axios.get('http://213.199.53.33:81/api/planning/municipal-assembly/projectapprove/report/?type=pdf', {
                    responseType: 'blob'
                })
            ]);

            // Set Chart Data
            setSubmittedChart(submittedChartRes.data || []);
            setApprovedChart(approvedChartRes.data || []);

            // Set Excel Report Data
            setSubmittedReport(submittedReportRes.data || null);
            setApprovedReport(approvedReportRes.data || null);

            // Set PDF Report Data
            setSubmittedReportPDF(submittedReportPDFRes.data || null);
            setApprovedReportPDF(approvedReportPDFRes.data || null);

        } catch (err) {
            console.error(err);
            setError('रिपोर्ट लोड गर्न असफल भयो।');
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
    const downloadSubmittedExcel = async () => downloadFile('submittedproject', 'excel', 'सभामा पेश भएका परियोजना.xlsx');
    const downloadApprovedExcel = async () => downloadFile('projectapprove', 'excel', 'नगर सभाले स्वीकृत गरिएको परियोजना.xlsx');

    // PDF Downloads
    const downloadSubmittedPDF = async () => downloadFile('submittedproject', 'pdf', 'सभामा पेश भएका परियोजना.pdf');
    const downloadApprovedPDF = async () => downloadFile('projectapprove', 'pdf', 'नगर सभाले स्वीकृत गरिएको परियोजना.pdf');

    // Common File Download Function
    const downloadFile = async (endpoint: string, type: 'pdf' | 'excel', filename: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(
                `http://213.199.53.33:81/api/planning/municipal-assembly/${endpoint}/report/?type=${type}`,
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
        fetchCityCouncilReports();
    }, []);

    return {
        loading,
        error,

        // Charts
        submittedChart,
        approvedChart,

        // Excel Reports
        submittedReport,
        approvedReport,

        // PDF Reports
        submittedReportPDF,
        approvedReportPDF,

        downloadSubmittedExcel,
        downloadApprovedExcel,

        downloadSubmittedPDF,
        downloadApprovedPDF,

        // Fetch function
        fetchCityCouncilReports,
    };
};
