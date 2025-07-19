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
                axios.get('http://localhost:8000/api/planning/thematic/wardlevel-chart/'),
                axios.get('http://localhost:8000/api/planning/thematic/wardlevelthemtic-chart/'),
                axios.get('http://localhost:8000/api/planning/thematic/Wardrecommended-chart/'),

                axios.get('http://localhost:8000/api/planning/thematic/wardlevel-chart/report/?type=excel'),
                axios.get('http://localhost:8000/api/planning/thematic/wardlevelthemtic-chart/report/?type=excel'),
                axios.get('http://localhost:8000/api/planning/thematic/Wardrecommended-chart/report/?type=excel'),

                axios.get('http://localhost:8000/api/planning/thematic/wardlevel-chart/report/?type=pdf'),
                axios.get('http://localhost:8000/api/planning/thematic/wardlevelthemtic-chart/report/?type=pdf'),
                axios.get('http://localhost:8000/api/planning/thematic/Wardrecommended-chart/report/?type=pdf'),
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

        // Fetch function
        fetchThematicReports,
    };
};
