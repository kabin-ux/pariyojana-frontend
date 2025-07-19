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
                axios.get('http://localhost:8000/api/planning/municipality-executive/preassembly-chart/'),
                axios.get('http://localhost:8000/api/planning/municipality-executive/councilsubmitted-chart/'),

                axios.get('http://localhost:8000/api/planning/municipality-executive/preassembly/report/?type=excel'),
                axios.get('http://localhost:8000/api/planning/municipality-executive/councilsubmitted/report/?type=excel'),

                axios.get('http://localhost:8000/api/planning/municipality-executive/preassembly/report/?type=pdf'),
                axios.get('http://localhost:8000/api/planning/municipality-executive/councilsubmitted/report/?type=pdf'),
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

        // Fetch function
        fetchMunicipalExecutiveReports,
    };
};
