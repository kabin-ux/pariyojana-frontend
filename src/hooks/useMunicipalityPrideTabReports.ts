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
                axios.get('http://43.205.239.123/api/planning/municipality-pride-project/entered-municipality-chart/'),
                axios.get('http://43.205.239.123/api/planning/municipality-pride-project/submitted-budget-chart/'),

                axios.get('http://43.205.239.123/api/planning/municipality-pride-project/entered-municipality/report/?type=excel'),
                axios.get('http://43.205.239.123/api/planning/municipality-pride-project/submitted-budget/report/?type=excel'),

                axios.get('http://43.205.239.123/api/planning/municipality-pride-project/entered-municipality/report/?type=pdf'),
                axios.get('http://43.205.239.123/api/planning/municipality-pride-project/submitted-budget/report/?type=pdf'),
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
    const downloadMunicipalityPrideExcel = async () => downloadFile('entered-municipality', 'excel', 'प्रविष्टी भएका नगर गौरव आयोजना.xlsx');
    const downloadMunicipalityPrideSubmitBudgetExcel = async () => downloadFile('submitted-budget', 'excel', 'बजेट तथा कार्यक्रम तर्जुमा समितिमा पेश गरिएको परियोजना.xlsx');

    // PDF Downloads
    const downloadMunicipalityPridePDF = async () => downloadFile('entered-municipality', 'pdf', 'प्रविष्टी भएका नगर गौरव आयोजना.pdf');
    const downloadMunicipalityPrideSubmitBudgetPDF = async () => downloadFile('submitted-budget', 'pdf', 'बजेट तथा कार्यक्रम तर्जुमा समितिमा पेश गरिएको परियोजना.pdf');

    // Common File Download Function
    const downloadFile = async (endpoint: string, type: 'pdf' | 'excel', filename: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(
                `http://43.205.239.123/api/planning/municipality-pride-project/${endpoint}/report/?type=${type}`,
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

        downloadMunicipalityPrideExcel,
        downloadMunicipalityPrideSubmitBudgetExcel,

        downloadMunicipalityPridePDF,
        downloadMunicipalityPrideSubmitBudgetPDF,

        // Fetch function
        fetchMunicipalityPrideReports,
    };
};
