import { useState, useEffect } from 'react';
import { projectDetailApi } from '../services/projectDetailApi';
import type {
  ProgramDetail,
  InitiationProcess,
  ConsumerCommitteeDetail,
  OfficialDetail,
  MonitoringCommittee,
  CostEstimateDetail,
  MapCostEstimate,
  ProjectAgreementDetail,
  Document
} from '../types/projectDetail';

export const useProjectDetail = (projectId: number) => {
  const [programDetails, setProgramDetails] = useState<ProgramDetail[]>([]);
  const [initiationProcess, setInitiationProcess] = useState<InitiationProcess[]>([]);
  const [consumerCommitteeDetails, setConsumerCommitteeDetails] = useState<ConsumerCommitteeDetail[]>([]);
  const [officialDetails, setOfficialDetails] = useState<OfficialDetail[]>([]);
  const [monitoringCommittee, setMonitoringCommittee] = useState<MonitoringCommittee[]>([]);
  const [costEstimateDetails, setCostEstimateDetails] = useState<CostEstimateDetail[]>([]);
  const [mapCostEstimate, setMapCostEstimate] = useState<MapCostEstimate[]>([]);
  const [projectAgreementDetails, setProjectAgreementDetails] = useState<ProjectAgreementDetail[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [otherdocuments, setOtherDocuments] = useState<Document[]>([]);

  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const setTabLoading = (tab: string, isLoading: boolean) => {
    setLoading(prev => ({ ...prev, [tab]: isLoading }));
  };

  const loadProgramDetails = async () => {
    setTabLoading('program', true);
    try {
      const data = await projectDetailApi.getProgramDetails(projectId);
      setProgramDetails(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setTabLoading('program', false);
    }
  };

  const loadInitiationProcess = async () => {
    setTabLoading('initiation', true);
    try {
      const data = await projectDetailApi.getInitiationProcess(projectId);
      setInitiationProcess(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setTabLoading('initiation', false);
    }
  };

  const loadConsumerCommitteeDetails = async () => {
    setTabLoading('committee', true);
    try {
      const [committeeDetails, officials, monitoring] = await Promise.all([
        projectDetailApi.getConsumerCommitteeDetails(projectId),
        projectDetailApi.getOfficialDetails(projectId),
        projectDetailApi.getMonitoringCommittee(projectId)
      ]);
      setConsumerCommitteeDetails(committeeDetails);
      setOfficialDetails(officials);
      setMonitoringCommittee(monitoring);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setTabLoading('committee', false);
    }
  };

  const loadCostEstimate = async () => {
    setTabLoading('cost', true);
    try {
      const [costDetails, mapEstimate] = await Promise.all([
        projectDetailApi.getCostEstimateDetails(projectId),
        projectDetailApi.getMapCostEstimate(projectId)
      ]);
      setCostEstimateDetails(costDetails);
      setMapCostEstimate(mapEstimate);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setTabLoading('cost', false);
    }
  };

  const loadProjectAgreement = async () => {
    setTabLoading('agreement', true);
    try {
      const data = await projectDetailApi.getProjectAgreementDetails(projectId);
      setProjectAgreementDetails(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setTabLoading('agreement', false);
    }
  };

  const loadDocuments = async (documentType?: string) => {
    setTabLoading('documents', true);
    try {
      const data = await projectDetailApi.getDocuments(projectId, documentType);
      setDocuments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setTabLoading('documents', false);
    }
  };

  const loadOtherDocuments = async (documentType?: string) => {
    setTabLoading('documents', true);
    try {
      const data = await projectDetailApi.getOtherDocuments(projectId, documentType);
      setOtherDocuments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setTabLoading('documents', false);
    }
  };

  const deleteOfficialDetail = async (id: number) => {
    try {
      await projectDetailApi.deleteOfficialDetail(id);
      await loadConsumerCommitteeDetails(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const deleteMonitoringCommittee = async (id: number) => {
    try {
      await projectDetailApi.deleteMonitoringCommittee(id);
      await loadConsumerCommitteeDetails(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const deleteDocument = async (id: number) => {
    try {
      await projectDetailApi.deleteDocument(id);
      await loadDocuments(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  return {
    // Data
    programDetails,
    initiationProcess,
    consumerCommitteeDetails,
    officialDetails,
    monitoringCommittee,
    costEstimateDetails,
    mapCostEstimate,
    projectAgreementDetails,
    documents,
    otherdocuments,
    // Loading states
    loading,
    error,

    // Load functions
    loadProgramDetails,
    loadInitiationProcess,
    loadConsumerCommitteeDetails,
    loadCostEstimate,
    loadProjectAgreement,
    loadDocuments,
    loadOtherDocuments,

    // Delete functions
    deleteOfficialDetail,
    deleteMonitoringCommittee,
    deleteDocument,
  };
};