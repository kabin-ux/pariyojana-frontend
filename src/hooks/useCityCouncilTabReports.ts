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
                axios.get('http://localhost:8000/api/planning/municipal-assembly/submittedproject-chart/'),
                axios.get('http://localhost:8000/api/planning/municipal-assembly-edit/projectapprove-chart/'),

                axios.get('http://localhost:8000/api/planning/municipal-assembly/submittedprojectt/report/?type=excel', {
                    responseType: 'blob'
                }),
                axios.get('http://localhost:8000/api/planning/municipal-assembly-edit/projectapprove/report/?type=excel', {
                    responseType: 'blob'
                }),

                axios.get('http://localhost:8000/api/planning/municipal-assembly/submittedprojectt/report/?type=pdf', {
                    responseType: 'blob'
                }),
                axios.get('http://localhost:8000/api/planning/municipal-assembly-edit/projectapprove/report/?type=pdf', {
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

        // Fetch function
        fetchCityCouncilReports,
    };
};
