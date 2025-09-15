import { useEffect, useState } from 'react';
import axios from 'axios';

export const useWardReports = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Charts
    const [wardLevelChart, setWardLevelChart] = useState([]);
    const [wardLevelThematicChart, setWardLevelThematicChart] = useState([]);
    const [municipalityLevelChart, setMunicipalityLevelChart] = useState([]);
    const [prioritizedWardChart, setPrioritizedWardChart] = useState([]);
    const [prioritizedWardThematicChart, setPrioritizedWardThematicChart] = useState([]);

    // Excel Reports
    const [wardLevelReport, setWardLevelReport] = useState([]);
    const [wardLevelThematicReport, setWardLevelThematicReport] = useState([]);
    const [municipalityLevelReport, setMunicipalityLevelReport] = useState([]);
    const [prioritizedWardReport, setPrioritizedWardReport] = useState([]);
    const [prioritizedWardThematicReport, setPrioritizedWardThematicReport] = useState([]);

    // PDF Reports
    const [wardLevelReportPDF, setWardLevelReportPDF] = useState([]);
    const [wardLevelThematicReportPDF, setWardLevelThematicReportPDF] = useState([]);
    const [municipalityLevelReportPDF, setMunicipalityLevelReportPDF] = useState([]);
    const [prioritizedWardReportPDF, setPrioritizedWardReportPDF] = useState([]);
    const [prioritizedWardThematicReportPDF, setPrioritizedWardThematicReportPDF] = useState([]);

    const fetchWardReports = async () => {
        setLoading(true);
        setError(null);
        try {
            const [
                wardLevelChartRes,
                wardLevelThematicChartRes,
                municipalityLevelChartRes,
                prioritizedWardChartRes,
                prioritizedWardThematicChartRes,

                wardLevelReportRes,
                wardLevelThematicReportRes,
                municipalityLevelReportRes,
                prioritizedWardReportRes,
                prioritizedWardThematicReportRes,

                wardLevelReportPDFRes,
                wardLevelThematicReportPDFRes,
                municipalityLevelReportPDFRes,
                prioritizedWardReportPDFRes,
                prioritizedWardThematicReportPDFRes,
            ] = await Promise.all([
                axios.get('http://www.bardagoriyapms.com/api/planning/ward-office/wardlevel-chart/'),
                axios.get('http://www.bardagoriyapms.com/api/planning/ward-office/wardlevelthemtic-chart/'),
                axios.get('http://www.bardagoriyapms.com/api/planning/ward-office/municipalitylevel-chart/'),
                axios.get('http://www.bardagoriyapms.com/api/planning/ward-office/prioritizedward-chart/'),
                axios.get('http://www.bardagoriyapms.com/api/planning/ward-office/prioritizedwardthematic-chart/'),

                axios.get('http://www.bardagoriyapms.com/api/planning/ward-office/ward-level/report/?type=excel', { responseType: 'blob' }),
                axios.get('http://www.bardagoriyapms.com/api/planning/ward-office/ward-thematic/report/?type=excel', { responseType: 'blob' }),
                axios.get('http://www.bardagoriyapms.com/api/planning/ward-office/municipality/report/?type=excel', { responseType: 'blob' }),
                axios.get('http://www.bardagoriyapms.com/api/planning/ward-office/prioritized-ward/report/?type=excel', { responseType: 'blob' }),
                axios.get('http://www.bardagoriyapms.com/api/planning/ward-office/prioritized-wardthematic/report/?type=excel', { responseType: 'blob' }),

                axios.get('http://www.bardagoriyapms.com/api/planning/ward-office/ward-level/report/?type=pdf', { responseType: 'blob' }),
                axios.get('http://www.bardagoriyapms.com/api/planning/ward-office/ward-thematic/report/?type=pdf', { responseType: 'blob' }),
                axios.get('http://www.bardagoriyapms.com/api/planning/ward-office/municipality/report/?type=pdf', { responseType: 'blob' }),
                axios.get('http://www.bardagoriyapms.com/api/planning/ward-office/prioritized-ward/report/?type=pdf', { responseType: 'blob' }),
                axios.get('http://www.bardagoriyapms.com/api/planning/ward-office/prioritized-wardthematic/report/?type=pdf', { responseType: 'blob' }),
            ]);

            // Set Chart Data
            setWardLevelChart(wardLevelChartRes.data || []);
            setWardLevelThematicChart(wardLevelThematicChartRes.data || []);
            setMunicipalityLevelChart(municipalityLevelChartRes.data || []);
            setPrioritizedWardChart(prioritizedWardChartRes.data || []);
            setPrioritizedWardThematicChart(prioritizedWardThematicChartRes.data || []);

            // Set Excel Report Data
            setWardLevelReport(wardLevelReportRes.data || []);
            setWardLevelThematicReport(wardLevelThematicReportRes.data || []);
            setMunicipalityLevelReport(municipalityLevelReportRes.data || []);
            setPrioritizedWardReport(prioritizedWardReportRes.data || []);
            setPrioritizedWardThematicReport(prioritizedWardThematicReportRes.data || []);

            // Set PDF Report Data
            setWardLevelReportPDF(wardLevelReportPDFRes.data || []);
            setWardLevelThematicReportPDF(wardLevelThematicReportPDFRes.data || []);
            setMunicipalityLevelReportPDF(municipalityLevelReportPDFRes.data || []);
            setPrioritizedWardReportPDF(prioritizedWardReportPDFRes.data || []);
            setPrioritizedWardThematicReportPDF(prioritizedWardThematicReportPDFRes.data || []);

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
    const downloadWardLevelExcel = async () => downloadFile('ward-level', 'excel', 'ward-level-report.xlsx');
    const downloadWardLevelThematicExcel = async () => downloadFile('ward-thematic', 'excel', 'ward-thematic-report.xlsx');
    const downloadMunicipalityLevelExcel = async () => downloadFile('municipality', 'excel', 'municipality-report.xlsx');
    const downloadPrioritizedWardExcel = async () => downloadFile('prioritized-ward', 'excel', 'prioritized-ward-report.xlsx');
    const downloadPrioritizedWardThematicExcel = async () => downloadFile('prioritized-wardthematic', 'excel', 'prioritized-ward-thematic-report.xlsx');

    // PDF Downloads
    const downloadWardLevelPDF = async () => downloadFile('ward-level', 'pdf', 'ward-level-report.pdf');
    const downloadWardLevelThematicPDF = async () => downloadFile('ward-thematic', 'pdf', 'ward-thematic-report.pdf');
    const downloadMunicipalityLevelPDF = async () => downloadFile('municipality', 'pdf', 'municipality-report.pdf');
    const downloadPrioritizedWardPDF = async () => downloadFile('prioritized-ward', 'pdf', 'prioritized-ward-report.pdf');
    const downloadPrioritizedWardThematicPDF = async () => downloadFile('prioritized-wardthematic', 'pdf', 'prioritized-ward-thematic-report.pdf');

    // Common File Download Function
    const downloadFile = async (endpoint: string, type: 'pdf' | 'excel', filename: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(
                `http://www.bardagoriyapms.com/api/planning/ward-office/${endpoint}/report/?type=${type}`,
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
        fetchWardReports();
    }, []);

    return {
        loading,
        error,

        // Chart Data
        wardLevelChart,
        wardLevelThematicChart,
        municipalityLevelChart,
        prioritizedWardChart,
        prioritizedWardThematicChart,

        // Excel Data
        wardLevelReport,
        wardLevelThematicReport,
        municipalityLevelReport,
        prioritizedWardReport,
        prioritizedWardThematicReport,

        // PDF Data
        wardLevelReportPDF,
        wardLevelThematicReportPDF,
        municipalityLevelReportPDF,
        prioritizedWardReportPDF,
        prioritizedWardThematicReportPDF,

        // Excel Downloaders
        downloadWardLevelExcel,
        downloadWardLevelThematicExcel,
        downloadMunicipalityLevelExcel,
        downloadPrioritizedWardExcel,
        downloadPrioritizedWardThematicExcel,

        // PDF Downloaders
        downloadWardLevelPDF,
        downloadWardLevelThematicPDF,
        downloadMunicipalityLevelPDF,
        downloadPrioritizedWardPDF,
        downloadPrioritizedWardThematicPDF,

        // Utility
        fetchWardReports,
    };
};
