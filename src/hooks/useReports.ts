import axios from 'axios';
import { useEffect, useState } from 'react';

export const useReports = () => {
  // Ward tab
  const [wardLevelChart, setWardLevelChart] = useState([]);
  const [wardLevelThematicChart, setWardLevelThematicChart] = useState([]);
  const [municipalityLevelChart, setMunicipalityLevelChart] = useState([]);
  const [prioritizedWardChart, setPrioritizedWardChart] = useState([]);
  const [prioritizedWardThematicChart, setPrioritizedWardThematicChart] = useState([]);

  // Thematic tab
  const [wardRecommendedChart, setWardRecommendedChart] = useState([]);
  const [thematicChart, setThematicChart] = useState([]);
  const [thematicRecommendedChart, setThematicRecommendedChart] = useState([]);

  // Municipality Pride
  const [municipalityPrideChart, setMunicipalityPrideChart] = useState([]);
  const [municipalityPrideSubmitBudgetChart, setMunicipalityPrideSubmitBudgetChart] = useState([]);

  // Budget tab
  const [municipalityLevelBudgetChart, setMunicipalityLevelBudgetChart] = useState([]);
  const [federalGovernmentBudgetChart, setFederalGovernmentBudgetChart] = useState([]);
  const [municipalityPrideBudgetChart, setMunicipalityPrideBudgetChart] = useState([]);
  const [provincialGovernmentBudgetChart, setProvincialGovernmentBudgetChart] = useState([]);
  const [thematicBudgetChart, setThematicBudgetChart] = useState([]);
  const [wardLevelBudgetChart, setWardLevelBudgetChart] = useState([]);

  // Municipal Executive
  const [preAssemblyChart, setPreAssemblyChart] = useState([]);
  const [councilChart, setCouncilChart] = useState([]);

  // City Council
  const [submittedChart, setSubmittedChart] = useState([]);
  const [approvedChart, setApprovedChart] = useState([]);


  // REports Excel and PDF

  // Ward tab
  const [wardLevelReportPDF, setWardLevelReportPDF] = useState([]);
  const [wardLevelThematicReportPDF, setWardLevelThematicReportPDF] = useState([]);
  const [municipalityLevelReportPDF, setMunicipalityLevelReportPDF] = useState([]);
  const [prioritizedWardReportPDF, setPrioritizedWardReportPDF] = useState([]);
  const [prioritizedWardThematicReportPDF, setPrioritizedWardThematicReportPDF] = useState([]);

  const [wardLevelReport, setWardLevelReport] = useState([]);
  const [wardLevelThematicReport, setWardLevelThematicReport] = useState([]);
  const [municipalityLevelReport, setMunicipalityLevelReport] = useState([]);
  const [prioritizedWardReport, setPrioritizedWardReport] = useState([]);
  const [prioritizedWardThematicReport, setPrioritizedWardThematicReport] = useState([]);

  // Thematic tab
  const [wardRecommendedReport, setWardRecommendedReport] = useState([]);
  const [thematicReport, setThematicReport] = useState([]);
  const [thematicRecommendedReport, setThematicRecommendedReport] = useState([]);

  const [wardRecommendedReportPDF, setWardRecommendedReportPDF] = useState([]);
  const [thematicReportPDF, setThematicReportPDF] = useState([]);
  const [thematicRecommendedReportPDF, setThematicRecommendedReportPDF] = useState([]);

  // Municipality Pride
  const [municipalityPrideReport, setMunicipalityPrideReport] = useState([]);
  const [municipalityPrideSubmitBudgetReport, setMunicipalityPrideSubmitBudgetReport] = useState([]);

  const [municipalityPrideReportPDF, setMunicipalityPrideReportPDF] = useState([]);
  const [municipalityPrideSubmitBudgetReportPDF, setMunicipalityPrideSubmitBudgetReportPDF] = useState([]);

  // Budget tab
  const [municipalityLevelBudgetReport, setMunicipalityLevelBudgetReport] = useState([]);
  const [federalGovernmentBudgetReport, setFederalGovernmentBudgetReport] = useState([]);
  const [municipalityPrideBudgetReport, setMunicipalityPrideBudgetReport] = useState([]);
  const [provincialGovernmentBudgetReport, setProvincialGovernmentBudgetReport] = useState([]);
  const [thematicBudgetReport, setThematicBudgetReport] = useState([]);
  const [wardLevelBudgetReport, setWardLevelBudgetReport] = useState([]);

  const [municipalityLevelBudgetReportPDF, setMunicipalityLevelBudgetReportPDF] = useState([]);
  const [federalGovernmentBudgetReportPDF, setFederalGovernmentBudgetReportPDF] = useState([]);
  const [municipalityPrideBudgetReportPDF, setMunicipalityPrideBudgetReportPDF] = useState([]);
  const [provincialGovernmentBudgetReportPDF, setProvincialGovernmentBudgetReportPDF] = useState([]);
  const [thematicBudgetReportPDF, setThematicBudgetReportPDF] = useState([]);
  const [wardLevelBudgetReportPDF, setWardLevelBudgetReportPDF] = useState([]);

  // Municipal Executive
  const [preAssemblyReport, setPreAssemblyReport] = useState([]);
  const [councilReport, setCouncilReport] = useState([]);

  const [preAssemblyReportPDF, setPreAssemblyReportPDF] = useState([]);
  const [councilReportPDF, setCouncilReportPDF] = useState([]);

  // City Council
  const [submittedReport, setSubmittedReport] = useState([]);
  const [approvedReport, setApprovedReport] = useState([]);

  const [submittedReportPDF, setSubmittedReportPDF] = useState([]);
  const [approvedReportPDF, setApprovedReportPDF] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        wardLevelChartRes,
        wardLevelThematicChartRes,
        municipalityLevelChartRes,
        prioritizedWardChartRes,
        prioritizedWardThematicChartRes,

        wardRecommendedChartRes,
        thematicChartRes,
        thematicRecommendedChartRes,

        municipalityPrideChartRes,
        municipalityPrideSubmitBudgetChartRes,

        municipalityLevelBudgetChartRes,
        federalGovernmentBudgetChartRes,
        municipalityPrideBudgetChartRes,
        provincialGovernmentBudgetChartRes,
        thematicBudgetChartRes,
        wardLevelBudgetChartRes,

        preAssemblyChartRes,
        councilChartRes,

        submittedChartRes,
        approvedChartRes,

        wardLevelReportRes,
        wardLevelThematicReportRes,
        municipalityLevelReportRes,
        prioritizedWardReportRes,
        prioritizedWardThematicReportRes,

        wardRecommendedReportRes,
        thematicReportRes,
        thematicRecommendedReportRes,

        municipalityPrideReportRes,
        municipalityPrideSubmitBudgetReportRes,

        municipalityLevelBudgetReportRes,
        federalGovernmentBudgetReportRes,
        municipalityPrideBudgetReportRes,
        provincialGovernmentBudgetReportRes,
        thematicBudgetReportRes,
        wardLevelBudgetReportRes,

        preAssemblyReportRes,
        councilReportRes,

        submittedReportRes,
        approvedReportRes,

        wardLevelReportPDFRes,
        wardLevelThematicReportPDFRes,
        municipalityLevelReportPDFRes,
        prioritizedWardReportPDFRes,
        prioritizedWardThematicReportPDFRes,

        wardRecommendedReportPDFRes,
        thematicReportPDFRes,
        thematicRecommendedReportPDFRes,

        municipalityPrideReportPDFRes,
        municipalityPrideSubmitBudgetReportPDFRes,

        municipalityLevelBudgetReportPDFRes,
        federalGovernmentBudgetReportPDFRes,
        municipalityPrideBudgetReportPDFRes,
        provincialGovernmentBudgetReportPDFRes,
        thematicBudgetReportPDFRes,
        wardLevelBudgetReportPDFRes,

        preAssemblyReportPDFRes,
        councilReportPDFRes,

        submittedReportPDFRes,
        approvedReportPDFRes,
      ] = await Promise.all([
        axios.get('http://localhost:8000/api/planning/ward-office/wardlevel-chart/'),
        axios.get('http://localhost:8000/api/planning/ward-office/wardlevelthemtic-chart/'),
        axios.get('http://localhost:8000/api/planning/ward-office/municipalitylevel-chart/'),
        axios.get('http://localhost:8000/api/planning/ward-office/prioritizedward-chart/'),
        axios.get('http://localhost:8000/api/planning/ward-office/prioritizedwardthematic-chart/'),

        axios.get('http://localhost:8000/api/planning/thematic/wardlevel-chart/'),
        axios.get('http://localhost:8000/api/planning/thematic/wardlevelthemtic-chart/'),
        axios.get('http://localhost:8000/api/planning/thematic/Wardrecommended-chart/'),

        axios.get('http://localhost:8000/api/planning/municipality-pride-project/entered-municipality-chart/'),
        axios.get('http://localhost:8000/api/planning/municipality-pride-project/submitted-budget-chart/'),

        axios.get('http://localhost:8000/api/planning/budget-committee/municipalitylevel-chart/'),
        axios.get('http://localhost:8000/api/planning/budget-committee/federalgov-chart/'),
        axios.get('http://localhost:8000/api/planning/budget-committee/municipalitypride-chart/'),
        axios.get('http://localhost:8000/api/planning/budget-committee/provinciallytransfer-chart/'),
        axios.get('http://localhost:8000/api/planning/budget-committee/thematiccommittee-chart/'),
        axios.get('http://localhost:8000/api/planning/budget-committee/wardlevel-chart/'),

        axios.get('http://localhost:8000/api/planning/municipality-executive/preassembly-chart/'),
        axios.get('http://localhost:8000/api/planning/municipality-executive/councilsubmitted-chart/'),

        axios.get('http://localhost:8000/api/planning/municipal-assembly/submittedproject-chart/'),
        axios.get('http://localhost:8000/api/planning/municipal-assembly-edit/projectapprove-chart/'),



        axios.get('http://localhost:8000/api/planning/ward-office/ward-level/report/?type=excel'),
        axios.get('http://localhost:8000/api/planning/ward-office/ward-thematic/report/?type=excel'),
        axios.get('http://localhost:8000/api/planning/ward-office/municipality/report/?type=excel'),
        axios.get('http://localhost:8000/api/planning/ward-office/prioritized-ward/report/?type=excel'),
        axios.get('http://localhost:8000/api/planning/ward-office/prioritized-wardthematic/report/?type=excel'),

        axios.get('http://localhost:8000/api/planning/thematic/wardlevel-chart/report/?type=excel'),
        axios.get('http://localhost:8000/api/planning/thematic/wardlevelthemtic-chart/report/?type=excel'),
        axios.get('http://localhost:8000/api/planning/thematic/Wardrecommended-chart/report/?type=excel'),

        axios.get('http://localhost:8000/api/planning/municipality-pride-project/entered-municipality/report/?type=excel'),
        axios.get('http://localhost:8000/api/planning/municipality-pride-project/submitted-budget/report/?type=excel'),

        axios.get('http://localhost:8000/api/planning/budget-committee/municipalitylevel/report/?type=excel'),
        axios.get('http://localhost:8000/api/planning/budget-committee/federalgov/report/?type=excel'),
        axios.get('http://localhost:8000/api/planning/budget-committee/municipalitypride/report/?type=excel'),
        axios.get('http://localhost:8000/api/planning/budget-committee/provinciallytransfer/report/?type=excel'),
        axios.get('http://localhost:8000/api/planning/budget-committee/thematiccommittee/report/?type=excel'),
        axios.get('http://localhost:8000/api/planning/budget-committee/wardlevel/report/?type=excel'),

        axios.get('http://localhost:8000/api/planning/municipality-executive/preassembly/report/?type=excel'),
        axios.get('http://localhost:8000/api/planning/municipality-executive/councilsubmitted/report/?type=excel'),

        axios.get('http://localhost:8000/api/planning/municipal-assembly/submittedprojectt/report/?type=excel'),
        axios.get('http://localhost:8000/api/planning/municipal-assembly-edit/projectapprove/report/?type=excel'),


        axios.get('http://localhost:8000/api/planning/ward-office/ward-level/report/?type=pdf'),
        axios.get('http://localhost:8000/api/planning/ward-office/ward-thematic/report/?type=pdf'),
        axios.get('http://localhost:8000/api/planning/ward-office/municipality/report/?type=pdf'),
        axios.get('http://localhost:8000/api/planning/ward-office/prioritized-ward/report/?type=pdf'),
        axios.get('http://localhost:8000/api/planning/ward-office/prioritized-wardthematic/report/?type=pdf'),

        axios.get('http://localhost:8000/api/planning/thematic/wardlevel-chart/report/?type=pdf'),
        axios.get('http://localhost:8000/api/planning/thematic/wardlevelthemtic-chart/report/?type=pdf'),
        axios.get('http://localhost:8000/api/planning/thematic/Wardrecommended-chart/report/?type=pdf'),

        axios.get('http://localhost:8000/api/planning/municipality-pride-project/entered-municipality/report/?type=pdf'),
        axios.get('http://localhost:8000/api/planning/municipality-pride-project/submitted-budget/report/?type=pdf'),

        axios.get('http://localhost:8000/api/planning/budget-committee/municipalitylevel/report/?type=pdf'),
        axios.get('http://localhost:8000/api/planning/budget-committee/federalgov/report/?type=pdf'),
        axios.get('http://localhost:8000/api/planning/budget-committee/municipalitypride/report/?type=pdf'),
        axios.get('http://localhost:8000/api/planning/budget-committee/provinciallytransfer/report/?type=pdf'),
        axios.get('http://localhost:8000/api/planning/budget-committee/thematiccommittee/report/?type=pdf'),
        axios.get('http://localhost:8000/api/planning/budget-committee/wardlevel/report/?type=pdf'),

        axios.get('http://localhost:8000/api/planning/municipality-executive/preassembly/report/?type=pdf'),
        axios.get('http://localhost:8000/api/planning/municipality-executive/councilsubmitted/report/?type=pdf'),

        axios.get('http://localhost:8000/api/planning/municipal-assembly/submittedprojectt/report/?type=pdf'),
        axios.get('http://localhost:8000/api/planning/municipal-assembly-edit/projectapprove/report/?type=pdf')
      ]);

      // Ward
      setWardLevelChart(wardLevelChartRes.data || []);
      setWardLevelThematicChart(wardLevelThematicChartRes.data || []);
      setMunicipalityLevelChart(municipalityLevelChartRes.data || []);
      setPrioritizedWardChart(prioritizedWardChartRes.data || []);
      setPrioritizedWardThematicChart(prioritizedWardThematicChartRes.data || []);

      // Thematic
      setWardRecommendedChart(wardRecommendedChartRes.data || []);
      setThematicChart(thematicChartRes.data || []);
      setThematicRecommendedChart(thematicRecommendedChartRes.data || []);

      // Municipality Pride
      setMunicipalityPrideChart(municipalityPrideChartRes.data || []);
      setMunicipalityPrideSubmitBudgetChart(municipalityPrideSubmitBudgetChartRes.data || []);

      // Budget
      setMunicipalityLevelBudgetChart(municipalityLevelBudgetChartRes.data || []);
      setFederalGovernmentBudgetChart(federalGovernmentBudgetChartRes.data || []);
      setMunicipalityPrideBudgetChart(municipalityPrideBudgetChartRes.data || []);
      setProvincialGovernmentBudgetChart(provincialGovernmentBudgetChartRes.data || []);
      setThematicBudgetChart(thematicBudgetChartRes.data || []);
      setWardLevelBudgetChart(wardLevelBudgetChartRes.data || []);

      // Municipal Executive
      setPreAssemblyChart(preAssemblyChartRes.data || []);
      setCouncilChart(councilChartRes.data || []);

      // City Council
      setSubmittedChart(submittedChartRes.data || []);
      setApprovedChart(approvedChartRes.data || []);


      // Ward
      setWardLevelReport(wardLevelReportRes.data || []);
      setWardLevelThematicReport(wardLevelThematicReportRes.data || []);
      setMunicipalityLevelReport(municipalityLevelReportRes.data || []);
      setPrioritizedWardReport(prioritizedWardReportRes.data || []);
      setPrioritizedWardThematicReport(prioritizedWardThematicReportRes.data || []);

      // Thematic
      setWardRecommendedReport(wardRecommendedReportRes.data || []);
      setThematicReport(thematicReportRes.data || []);
      setThematicRecommendedReport(thematicRecommendedReportRes.data || []);

      // Municipality Pride
      setMunicipalityPrideReport(municipalityPrideReportRes.data || []);
      setMunicipalityPrideSubmitBudgetReport(municipalityPrideSubmitBudgetReportRes.data || []);

      // Budget
      setMunicipalityLevelBudgetReport(municipalityLevelBudgetReportRes.data || []);
      setFederalGovernmentBudgetReport(federalGovernmentBudgetReportRes.data || []);
      setMunicipalityPrideBudgetReport(municipalityPrideBudgetReportRes.data || []);
      setProvincialGovernmentBudgetReport(provincialGovernmentBudgetReportRes.data || []);
      setThematicBudgetReport(thematicBudgetReportRes.data || []);
      setWardLevelBudgetReport(wardLevelBudgetReportRes.data || []);

      // Municipal Executive
      setPreAssemblyReport(preAssemblyReportRes.data || []);
      setCouncilReport(councilReportRes.data || []);

      // City Council
      setSubmittedReport(submittedReportRes.data || []);
      setApprovedReport(approvedReportRes.data || []);

      // Ward
      setWardLevelReportPDF(wardLevelReportPDFRes.data || []);
      setWardLevelThematicReportPDF(wardLevelThematicReportPDFRes.data || []);
      setMunicipalityLevelReportPDF(municipalityLevelReportPDFRes.data || []);
      setPrioritizedWardReportPDF(prioritizedWardReportPDFRes.data || []);
      setPrioritizedWardThematicReportPDF(prioritizedWardThematicReportPDFRes.data || []);

      // Thematic
      setWardRecommendedReportPDF(wardRecommendedReportPDFRes.data || []);
      setThematicReportPDF(thematicReportPDFRes.data || []);
      setThematicRecommendedReportPDF(thematicRecommendedReportPDFRes.data || []);

      // Municipality Pride
      setMunicipalityPrideReportPDF(municipalityPrideReportPDFRes.data || []);
      setMunicipalityPrideSubmitBudgetReportPDF(municipalityPrideSubmitBudgetReportPDFRes.data || []);

      // Budget
      setMunicipalityLevelBudgetReportPDF(municipalityLevelBudgetReportPDFRes.data || []);
      setFederalGovernmentBudgetReportPDF(federalGovernmentBudgetReportPDFRes.data || []);
      setMunicipalityPrideBudgetReportPDF(municipalityPrideBudgetReportPDFRes.data || []);
      setProvincialGovernmentBudgetReportPDF(provincialGovernmentBudgetReportPDFRes.data || []);
      setThematicBudgetReportPDF(thematicBudgetReportPDFRes.data || []);
      setWardLevelBudgetReportPDF(wardLevelBudgetReportPDFRes.data || []);

      // Municipal Executive
      setPreAssemblyReportPDF(preAssemblyReportPDFRes.data || []);
      setCouncilReportPDF(councilReportPDFRes.data || []);

      // City Council
      setSubmittedReportPDF(submittedReportPDFRes.data || []);
      setApprovedReportPDF(approvedReportPDFRes.data || []);

    } catch (err) {
      console.error(err);
      setError('डेटा लोड गर्न असफल भयो।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    loading,
    error,
    // Ward
    wardLevelChart,
    wardLevelThematicChart,
    municipalityLevelChart,
    prioritizedWardChart,
    prioritizedWardThematicChart,
    // Thematic
    wardRecommendedChart,
    thematicChart,
    thematicRecommendedChart,
    // Municipality Pride
    municipalityPrideChart,
    municipalityPrideSubmitBudgetChart,
    // Budget
    municipalityLevelBudgetChart,
    federalGovernmentBudgetChart,
    municipalityPrideBudgetChart,
    provincialGovernmentBudgetChart,
    thematicBudgetChart,
    wardLevelBudgetChart,
    // Municipal Executive
    preAssemblyChart,
    councilChart,
    // City Council
    submittedChart,
    approvedChart,

    // Ward
    wardLevelReport,
    wardLevelThematicReport,
    municipalityLevelReport,
    prioritizedWardReport,
    prioritizedWardThematicReport,
    // Thematic
    wardRecommendedReport,
    thematicReport,
    thematicRecommendedReport,
    // Municipality Pride
    municipalityPrideReport,
    municipalityPrideSubmitBudgetReport,
    // Budget
    municipalityLevelBudgetReport,
    federalGovernmentBudgetReport,
    municipalityPrideBudgetReport,
    provincialGovernmentBudgetReport,
    thematicBudgetReport,
    wardLevelBudgetReport,
    // Municipal Executive
    preAssemblyReport,
    councilReport,
    // City Council
    submittedReport,
    approvedReport,

    // Ward
    wardLevelReportPDF,
    wardLevelThematicReportPDF,
    municipalityLevelReportPDF,
    prioritizedWardReportPDF,
    prioritizedWardThematicReportPDF,
    // Thematic
    wardRecommendedReportPDF,
    thematicReportPDF,
    thematicRecommendedReportPDF,
    // Municipality Pride
    municipalityPrideReportPDF,
    municipalityPrideSubmitBudgetReportPDF,
    // Budget
    municipalityLevelBudgetReportPDF,
    federalGovernmentBudgetReportPDF,
    municipalityPrideBudgetReportPDF,
    provincialGovernmentBudgetReportPDF,
    thematicBudgetReportPDF,
    wardLevelBudgetReportPDF,
    // Municipal Executive
    preAssemblyReportPDF,
    councilReportPDF,
    // City Council
    submittedReportPDF,
    approvedReportPDF
  };
};
