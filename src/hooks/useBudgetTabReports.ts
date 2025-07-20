import { useEffect, useState } from 'react';
import axios from 'axios';

export const useBudgetReports = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Chart States
    const [municipalityLevelBudgetChart, setMunicipalityLevelBudgetChart] = useState([]);
    const [federalGovernmentBudgetChart, setFederalGovernmentBudgetChart] = useState([]);
    const [municipalityPrideBudgetChart, setMunicipalityPrideBudgetChart] = useState([]);
    const [provincialGovernmentBudgetChart, setProvincialGovernmentBudgetChart] = useState([]);
    const [thematicBudgetChart, setThematicBudgetChart] = useState([]);
    const [wardLevelBudgetChart, setWardLevelBudgetChart] = useState([]);

    // Excel Report States
    const [municipalityLevelBudgetReport, setMunicipalityLevelBudgetReport] = useState([]);
    const [federalGovernmentBudgetReport, setFederalGovernmentBudgetReport] = useState([]);
    const [municipalityPrideBudgetReport, setMunicipalityPrideBudgetReport] = useState([]);
    const [provincialGovernmentBudgetReport, setProvincialGovernmentBudgetReport] = useState([]);
    const [thematicBudgetReport, setThematicBudgetReport] = useState([]);
    const [wardLevelBudgetReport, setWardLevelBudgetReport] = useState([]);

    // PDF Report States
    const [municipalityLevelBudgetReportPDF, setMunicipalityLevelBudgetReportPDF] = useState([]);
    const [federalGovernmentBudgetReportPDF, setFederalGovernmentBudgetReportPDF] = useState([]);
    const [municipalityPrideBudgetReportPDF, setMunicipalityPrideBudgetReportPDF] = useState([]);
    const [provincialGovernmentBudgetReportPDF, setProvincialGovernmentBudgetReportPDF] = useState([]);
    const [thematicBudgetReportPDF, setThematicBudgetReportPDF] = useState([]);
    const [wardLevelBudgetReportPDF, setWardLevelBudgetReportPDF] = useState([]);

    const fetchBudgetReports = async () => {
        setLoading(true);
        setError(null);
        try {
            const [
                municipalityLevelBudgetChartRes,
                federalGovernmentBudgetChartRes,
                municipalityPrideBudgetChartRes,
                provincialGovernmentBudgetChartRes,
                thematicBudgetChartRes,
                wardLevelBudgetChartRes,

                municipalityLevelBudgetReportRes,
                federalGovernmentBudgetReportRes,
                municipalityPrideBudgetReportRes,
                provincialGovernmentBudgetReportRes,
                thematicBudgetReportRes,
                wardLevelBudgetReportRes,

                municipalityLevelBudgetReportPDFRes,
                federalGovernmentBudgetReportPDFRes,
                municipalityPrideBudgetReportPDFRes,
                provincialGovernmentBudgetReportPDFRes,
                thematicBudgetReportPDFRes,
                wardLevelBudgetReportPDFRes,
            ] = await Promise.all([
                axios.get('http://localhost:8000/api/planning/budget-committee/municipalitylevel-chart/'),
                axios.get('http://localhost:8000/api/planning/budget-committee/federalgov-chart/'),
                axios.get('http://localhost:8000/api/planning/budget-committee/municipalitypride-chart/'),
                axios.get('http://localhost:8000/api/planning/budget-committee/provinciallytransfer-chart/'),
                axios.get('http://localhost:8000/api/planning/budget-committee/thematiccommittee-chart/'),
                axios.get('http://localhost:8000/api/planning/budget-committee/wardlevel-chart/'),

                axios.get('http://localhost:8000/api/planning/budget-committee/municipalitylevel/report/?type=excel'),
                axios.get('http://localhost:8000/api/planning/budget-committee/federalgov/report/?type=excel'),
                axios.get('http://localhost:8000/api/planning/budget-committee/municipalitypride/report/?type=excel'),
                axios.get('http://localhost:8000/api/planning/budget-committee/provinciallytransfer/report/?type=excel'),
                axios.get('http://localhost:8000/api/planning/budget-committee/thematiccommittee/report/?type=excel'),
                axios.get('http://localhost:8000/api/planning/budget-committee/wardlevel/report/?type=excel'),

                axios.get('http://localhost:8000/api/planning/budget-committee/municipalitylevel/report/?type=pdf'),
                axios.get('http://localhost:8000/api/planning/budget-committee/federalgov/report/?type=pdf'),
                axios.get('http://localhost:8000/api/planning/budget-committee/municipalitypride/report/?type=pdf'),
                axios.get('http://localhost:8000/api/planning/budget-committee/provinciallytransfer/report/?type=pdf'),
                axios.get('http://localhost:8000/api/planning/budget-committee/thematiccommittee/report/?type=pdf'),
                axios.get('http://localhost:8000/api/planning/budget-committee/wardlevel/report/?type=pdf'),
            ]);

            // Set Chart Data
            setMunicipalityLevelBudgetChart(municipalityLevelBudgetChartRes.data || []);
            setFederalGovernmentBudgetChart(federalGovernmentBudgetChartRes.data || []);
            setMunicipalityPrideBudgetChart(municipalityPrideBudgetChartRes.data || []);
            setProvincialGovernmentBudgetChart(provincialGovernmentBudgetChartRes.data || []);
            setThematicBudgetChart(thematicBudgetChartRes.data || []);
            setWardLevelBudgetChart(wardLevelBudgetChartRes.data || []);

            // Set Excel Report Data
            setMunicipalityLevelBudgetReport(municipalityLevelBudgetReportRes.data || []);
            setFederalGovernmentBudgetReport(federalGovernmentBudgetReportRes.data || []);
            setMunicipalityPrideBudgetReport(municipalityPrideBudgetReportRes.data || []);
            setProvincialGovernmentBudgetReport(provincialGovernmentBudgetReportRes.data || []);
            setThematicBudgetReport(thematicBudgetReportRes.data || []);
            setWardLevelBudgetReport(wardLevelBudgetReportRes.data || []);

            // Set PDF Report Data
            setMunicipalityLevelBudgetReportPDF(municipalityLevelBudgetReportPDFRes.data || []);
            setFederalGovernmentBudgetReportPDF(federalGovernmentBudgetReportPDFRes.data || []);
            setMunicipalityPrideBudgetReportPDF(municipalityPrideBudgetReportPDFRes.data || []);
            setProvincialGovernmentBudgetReportPDF(provincialGovernmentBudgetReportPDFRes.data || []);
            setThematicBudgetReportPDF(thematicBudgetReportPDFRes.data || []);
            setWardLevelBudgetReportPDF(wardLevelBudgetReportPDFRes.data || []);
        } catch (err) {
            console.error(err);
            setError('बजेट रिपोर्ट लोड गर्न असफल भयो।');
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
    const downloadMunicipalityLevelBudgetExcel = async () => downloadFile('municipality-level', 'excel', 'नगर स्तरीय कार्यक्रम.xlsx');
    const downloadFederalGovernmentBudgetExcel = async () => downloadFile('federalgov', 'excel', 'संघिय सरकारबाट हस्तान्तरित कार्यक्रम.xlsx');
    const downloadMunicipalityPrideBudgetExcel = async () => downloadFile('municipalitypride', 'excel', 'नगर गौरव आयोजना.xlsx');
    const downloadProvincialGovernmentBudgetExcel = async () => downloadFile('provinciallytransfer', 'excel', 'प्रदेश सरकारबाट हस्तान्तरित कार्यक्रम.xlsx');
    const downloadThematicBudgetExcel = async () => downloadFile('thematiccommittee', 'excel', 'विषयगत समितिको कार्यक्रम.xlsx');
    const downloadWardLevelBudgetExcel = async () => downloadFile('wardlevel', 'excel', 'वडा स्तरीय कार्यक्रम.xlsx');

    // PDF Downloads
    const downloadMunicipalityLevelBudgetPDF = async () => downloadFile('municipality-level', 'pdf', 'ward-level-report.pdf');
    const downloadFederalGovernmentBudgetPDF = async () => downloadFile('federalgov', 'pdf', 'संघिय सरकारबाट हस्तान्तरित कार्यक्रम.pdf');
    const downloadMunicipalityPrideBudgetPDF = async () => downloadFile('municipalitypride', 'pdf', 'नगर गौरव आयोजना.pdf');
    const downloadProvincialGovernmentBudgetPDF = async () => downloadFile('provinciallytransfer', 'pdf', 'प्रदेश सरकारबाट हस्तान्तरित कार्यक्रम.pdf');
    const downloadThematicBudgetPDF = async () => downloadFile('thematiccommittee', 'pdf', 'विषयगत समितिको कार्यक्रम.pdf');
    const downloadWardLevelBudgetPDF = async () => downloadFile('wardlevel', 'pdf', 'वडा स्तरीय कार्यक्रम.pdf');

    // Common File Download Function
    const downloadFile = async (endpoint: string, type: 'pdf' | 'excel', filename: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(
                `http://localhost:8000/api/planning/budget-committee/${endpoint}/report/?type=${type}`,
                { responseType: 'blob', timeout: 30000 }
            );
            downloadBlob(response.data, filename);
        } catch (err) {
            console.error(err);
            setError(`डाउनलोड गर्न असफल भयो (${filename})`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBudgetReports();
    }, []);

    return {
        loading,
        error,

        // Charts
        municipalityLevelBudgetChart,
        federalGovernmentBudgetChart,
        municipalityPrideBudgetChart,
        provincialGovernmentBudgetChart,
        thematicBudgetChart,
        wardLevelBudgetChart,

        // Excel Reports
        municipalityLevelBudgetReport,
        federalGovernmentBudgetReport,
        municipalityPrideBudgetReport,
        provincialGovernmentBudgetReport,
        thematicBudgetReport,
        wardLevelBudgetReport,

        // PDF Reports
        municipalityLevelBudgetReportPDF,
        federalGovernmentBudgetReportPDF,
        municipalityPrideBudgetReportPDF,
        provincialGovernmentBudgetReportPDF,
        thematicBudgetReportPDF,
        wardLevelBudgetReportPDF,

        downloadMunicipalityLevelBudgetExcel,
        downloadFederalGovernmentBudgetExcel,
        downloadMunicipalityPrideBudgetExcel,
        downloadProvincialGovernmentBudgetExcel,
        downloadThematicBudgetExcel,
        downloadWardLevelBudgetExcel,

        downloadMunicipalityLevelBudgetPDF,
        downloadFederalGovernmentBudgetPDF,
        downloadMunicipalityPrideBudgetPDF,
        downloadProvincialGovernmentBudgetPDF,
        downloadThematicBudgetPDF,
        downloadWardLevelBudgetPDF,

        // Fetch function
        fetchBudgetReports,
    };
};
