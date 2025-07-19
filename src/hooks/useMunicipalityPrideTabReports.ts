import { useEffect, useState } from 'react';
import axios from 'axios';

export const useMunicipalityPrideReports = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Municipality Pride Chart States
    const [municipalityPrideChart, setMunicipalityPrideChart] = useState([]);
    const [municipalityPrideSubmitBudgetChart, setMunicipalityPrideSubmitBudgetChart] = useState([]);

    // Excel Report States
    const [municipalityPrideReport, setMunicipalityPrideReport] = useState([]);
    const [municipalityPrideSubmitBudgetReport, setMunicipalityPrideSubmitBudgetReport] = useState([]);

    // PDF Report States
    const [municipalityPrideReportPDF, setMunicipalityPrideReportPDF] = useState([]);
    const [municipalityPrideSubmitBudgetReportPDF, setMunicipalityPrideSubmitBudgetReportPDF] = useState([]);

    const fetchMunicipalityPrideReports = async () => {
        setLoading(true);
        setError(null);

        try {
            const [
                municipalityPrideChartRes,
                municipalityPrideSubmitBudgetChartRes,

                municipalityPrideReportRes,
                municipalityPrideSubmitBudgetReportRes,

                municipalityPrideReportPDFRes,
                municipalityPrideSubmitBudgetReportPDFRes,
            ] = await Promise.all([
                axios.get('http://localhost:8000/api/planning/municipality-pride-project/entered-municipality-chart/'),
                axios.get('http://localhost:8000/api/planning/municipality-pride-project/submitted-budget-chart/'),

                axios.get('http://localhost:8000/api/planning/municipality-pride-project/entered-municipality/report/?type=excel'),
                axios.get('http://localhost:8000/api/planning/municipality-pride-project/submitted-budget/report/?type=excel'),

                axios.get('http://localhost:8000/api/planning/municipality-pride-project/entered-municipality/report/?type=pdf'),
                axios.get('http://localhost:8000/api/planning/municipality-pride-project/submitted-budget/report/?type=pdf'),
            ]);

            // Set Chart Data
            setMunicipalityPrideChart(municipalityPrideChartRes.data || []);
            setMunicipalityPrideSubmitBudgetChart(municipalityPrideSubmitBudgetChartRes.data || []);

            // Set Excel Report Data
            setMunicipalityPrideReport(municipalityPrideReportRes.data || []);
            setMunicipalityPrideSubmitBudgetReport(municipalityPrideSubmitBudgetReportRes.data || []);

            // Set PDF Report Data
            setMunicipalityPrideReportPDF(municipalityPrideReportPDFRes.data || []);
            setMunicipalityPrideSubmitBudgetReportPDF(municipalityPrideSubmitBudgetReportPDFRes.data || []);
        } catch (err) {
            console.error(err);
            setError('रिपोर्ट लोड गर्न असफल भयो।');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
    fetchMunicipalityPrideReports();
  }, []);

    return {
        loading,
        error,

        // Charts
        municipalityPrideChart,
        municipalityPrideSubmitBudgetChart,

        // Excel Reports
        municipalityPrideReport,
        municipalityPrideSubmitBudgetReport,

        // PDF Reports
        municipalityPrideReportPDF,
        municipalityPrideSubmitBudgetReportPDF,

        // Fetch function
        fetchMunicipalityPrideReports,
    };
};
