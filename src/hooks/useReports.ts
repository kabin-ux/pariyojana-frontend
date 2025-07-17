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
        approvedChartRes
      ] = await Promise.all([
        axios.get('http://localhost:8000/api/planning/ward-office/wardlevel-chart/'),
        axios.get('http://localhost:8000/api/planning/ward-office/wardlevelthemtic-chart/'),
        axios.get('http://localhost:8000/api/planning/ward-office/municipalitylevel-chart/'),
        axios.get('http://localhost:8000/api/planning/ward-office/prioritizedward-chart/'),
        axios.get('http://localhost:8000/api/planning/ward-office/prioritizedwardthematic-chart/'),

        axios.get('http://localhost:8000/api/planning/thematic/wardlevel-chart/'),
        axios.get('http://localhost:8000/api/planning/thematic/wardlevelthematic-chart/'),
        axios.get('http://localhost:8000/api/planning/thematic/Wardrecommended-chart/'),

        axios.get('http://localhost:8000/api/planning/municipality-pride-project/entered-municipality-chart/'),
        axios.get('http://localhost:8000/api/planning/municipality-pride-project/submitted-budget-chart/'),

        axios.get('http://localhost:8000/api/planning/budget-committee/municipalitylevel-chart/'),
        axios.get('http://localhost:8000/api/planning/budget-committee/federalgov-chart/'),
        axios.get('http://localhost:8000/api/planning/budget-committee/municipalitypride-chart/'),
        axios.get('http://localhost:8000/api/planning/budget-committee/provinciallytransfer-chart/'),
        axios.get('http://localhost:8000/api/planning/budget-committee/thematic-committee-chart/'),
        axios.get('http://localhost:8000/api/planning/budget-committee/wardlevel-chart/'),

        axios.get('http://localhost:8000/api/planning/municipality-executive/preassembly-chart/'),
        axios.get('http://localhost:8000/api/planning/municipality-executive/councilsubmitted-chart/'),

        axios.get('http://localhost:8000/api/planning/municipal-assembly/submittedproject-chart/'),
        axios.get('http://localhost:8000/api/planning/municipal-assembly-edit/projectapprove-chart/')
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
    approvedChart
  };
};
