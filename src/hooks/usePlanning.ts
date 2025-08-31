import { useEffect, useState } from 'react';
import axios from 'axios';

export interface Project {
  id: number;
  title: string;
  date: string;
  [key: string]: any;
}

export const usePlanning = () => {
  const [wardProjects, setWardProjects] = useState<Project[]>([]);
  const [municipalityProjects, setMunicipalityProjects] = useState<Project[]>([]);
  const [wardThematicProjects, setWardThematicProjects] = useState<Project[]>([]);
  const [prioritizedWardProjects, setPrioritizedWardProjects] = useState<Project[]>([]);
  const [prioritizedWardThematicProjects, setPrioritizedWardThematicProjects] = useState<Project[]>([]);
  const [thematicProjects, setThematicProjects] = useState<Project[]>([]);
  const [prioritizedThematicProjects, setPrioritizedThematicProjects] = useState<Project[]>([]);
  const [municipalityPrideProjects, setMunicipalityPrideProjects] = useState<Project[]>([]);
  const [recommendedThematicWardProjects, setRecommendedThematicWardProjects] = useState<Project[]>([]);
  const [thematicBudget, setThematicBudget] = useState<Project[]>([]);
  const [municipalityPrideBudget, setMunicipalityPrideBudget] = useState<Project[]>([]);
  const [wardLevelBudget, setWardLevelBudget] = useState<Project[]>([]);
  const [municipalityLevelBudget, setMunicipalityLevelBudget] = useState<Project[]>([]);
  const [provincialGovernmentBudget, setProvincialGovernmentProject] = useState<Project[]>([]);
  const [federalGovernmentBudget, setFederalGovernmentProject] = useState<Project[]>([]);
  const [preAssemblyProjects, setPreAssemblyProjects] = useState<Project[]>([]);
  const [councilProjects, setCouncilProjects] = useState<Project[]>([]);
  const [submittedProjects, setSubmittedProjects] = useState<Project[]>([]);
  const [approvedProjects, setApprovedProjects] = useState<Project[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [wardRes, muniRes, wardThematicRes, prioritizedWardRes, prioritizedWardThematicRes, thematicRes, prioritizedThematicRes, municipalityPrideRes, recommendedThematicWardProjectsRes, thematicBudgetRes, municipalityPrideBudgetRes, wardLevelBudgetRes, municipalityLevelBudgetRes, provincialGovernmentBudgetRes, federalGovernmentBudgetRes, preAssemblyProjectsRes, councilProjectsRes, submittedProjectsRes, approvedProjectsRes] = await Promise.all([
        axios.get('http://43.205.239.123/api/planning/ward-office/ward-projects/'),
        axios.get('http://43.205.239.123/api/planning/ward-office/municipality-projects/'),
        axios.get('http://43.205.239.123/api/planning/ward-office/ward-thematic-projects/'),
        axios.get('http://43.205.239.123/api/planning/ward-office/prioritized-ward-projects/'),
        axios.get('http://43.205.239.123/api/planning/ward-office/prioritized-ward-thematic/'),
        axios.get('http://43.205.239.123/api/planning/thematic/thematic-plans/'),
        axios.get('http://43.205.239.123/api/planning/thematic/prioritized-plans/'),
        axios.get('http://43.205.239.123/api/planning/municipality-pride-project/municipality-pride-projects/'),
        axios.get('http://43.205.239.123/api/planning/thematic/wardrecommend-project/'),
        axios.get('http://43.205.239.123/api/planning/budget-committee/thematic-committee/'),
        axios.get('http://43.205.239.123/api/planning/budget-committee/municipality-pride/'),
        axios.get('http://43.205.239.123/api/planning/budget-committee/budget-ward-projects/'),
        axios.get('http://43.205.239.123/api/planning/budget-committee/municipality-programs/'),
        axios.get('http://43.205.239.123/api/planning/budget-committee/provience-transfer-projects/'),
        axios.get('http://43.205.239.123/api/planning/budget-committee/federal-gov-projects/'),
        axios.get('http://43.205.239.123/api/planning/municipality-executive/pre-assembly-projects/'),
        axios.get('http://43.205.239.123/api/planning/municipality-executive/council-submitted-projects/'),
        axios.get('http://43.205.239.123/api/planning/municipal-assembly/submitted-projects/'),
        axios.get('http://43.205.239.123/api/planning/municipal-assembly/approved-projects/')
      ]);

      setWardProjects(wardRes.data || []);
      setMunicipalityProjects(muniRes.data || []);
      setWardThematicProjects(wardThematicRes.data || []);
      setPrioritizedWardProjects(prioritizedWardRes.data || []);
      setPrioritizedWardThematicProjects(prioritizedWardThematicRes.data || []);
      setThematicProjects(thematicRes.data || []);
      setPrioritizedThematicProjects(prioritizedThematicRes.data || []);
      setMunicipalityPrideProjects(municipalityPrideRes.data || []);
      setRecommendedThematicWardProjects(recommendedThematicWardProjectsRes.data || []);
      setThematicBudget(thematicBudgetRes.data || []);
      setMunicipalityPrideBudget(municipalityPrideBudgetRes.data || []);
      setWardLevelBudget(wardLevelBudgetRes.data || []);
      setMunicipalityLevelBudget(municipalityLevelBudgetRes.data || []);
      setProvincialGovernmentProject(provincialGovernmentBudgetRes.data || []);
      setFederalGovernmentProject(federalGovernmentBudgetRes.data || []);
      setPreAssemblyProjects(preAssemblyProjectsRes.data || []);
      setCouncilProjects(councilProjectsRes.data || []);
      setSubmittedProjects(submittedProjectsRes.data || []);
      setApprovedProjects(approvedProjectsRes.data || []);
    } catch (err: any) {
      setError('डेटा लोड गर्न असफल भयो।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    wardProjects,
    municipalityProjects,
    wardThematicProjects,
    prioritizedWardProjects,
    prioritizedWardThematicProjects,
    thematicProjects,
    prioritizedThematicProjects,
    municipalityPrideProjects,
    recommendedThematicWardProjects,
    thematicBudget,
    municipalityPrideBudget,
    wardLevelBudget,
    municipalityLevelBudget,
    provincialGovernmentBudget,
    federalGovernmentBudget,
    preAssemblyProjects,
    councilProjects,
    submittedProjects,
    approvedProjects,
    loading,
    error,
    refetch: fetchData,
  };
};
