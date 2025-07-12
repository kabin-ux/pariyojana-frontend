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

const API_BASE_URL = 'http://localhost:8000/api/projects';

// Get auth token
const getAuthToken = () => localStorage.getItem('access_token');

// Create headers with auth
const getHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export const projectDetailApi = {
  // Program Details
  getProgramDetails: async (projectId: number): Promise<ProgramDetail[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/program-details/?project=${projectId}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.results || data || [];
    } catch (error) {
      console.error('Error fetching program details:', error);
      throw error;
    }
  },

  // Initiation Process
  getInitiationProcess: async (projectId: number): Promise<InitiationProcess[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/initiation-process/?project=${projectId}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.results || data || [];
    } catch (error) {
      console.error('Error fetching initiation process:', error);
      throw error;
    }
  },

  // Consumer Committee Details
  getConsumerCommitteeDetails: async (projectId: number): Promise<ConsumerCommitteeDetail[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${projectId}/consumer-committee-details/`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.results || data || [];
    } catch (error) {
      console.error('Error fetching consumer committee details:', error);
      throw error;
    }
  },

  // Official Details
  getOfficialDetails: async (projectId: number): Promise<OfficialDetail[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${projectId}/official-details/`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.results || data || [];
    } catch (error) {
      console.error('Error fetching official details:', error);
      throw error;
    }
  },

  // Monitoring Committee
  getMonitoringCommittee: async (projectId: number): Promise<MonitoringCommittee[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${projectId}/monitoring-committee/`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.results || data || [];
    } catch (error) {
      console.error('Error fetching monitoring committee:', error);
      throw error;
    }
  },

  // Cost Estimate Details
  getCostEstimateDetails: async (projectId: number): Promise<CostEstimateDetail[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${projectId}/cost-estimate-details/`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.results || data || [];
    } catch (error) {
      console.error('Error fetching cost estimate details:', error);
      throw error;
    }
  },

  // Map Cost Estimate
  getMapCostEstimate: async (projectId: number): Promise<MapCostEstimate[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${projectId}/map-cost-estimate/`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.results || data || [];
    } catch (error) {
      console.error('Error fetching map cost estimate:', error);
      throw error;
    }
  },

  // Project Agreement Details
  getProjectAgreementDetails: async (projectId: number): Promise<ProjectAgreementDetail[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${projectId}/project-agreement-details/`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.results || data || [];
    } catch (error) {
      console.error('Error fetching project agreement details:', error);
      throw error;
    }
  },

  // Documents
  getDocuments: async (projectId: number, documentType?: string): Promise<Document[]> => {
    try {
      let url = `${API_BASE_URL}/other-documents/${projectId}`;
      if (documentType) {
        url += `&document_type=${documentType}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.results || data || [];
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  },

  getOtherDocuments: async (projectId: number, documentType?: string): Promise<Document[]> => {
    try {
      let url = `${API_BASE_URL}/${projectId}/documents`;
      if (documentType) {
        url += `&document_type=${documentType}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.results || data || [];
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  },

  getOperationLocation: async (projectId: number, documentType?: string): Promise<Document[]> => {
    try {
      let url = `${API_BASE_URL}/${projectId}/operation-site-photos`;
      if (documentType) {
        url += `&document_type=${documentType}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.results || data || [];
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  },

  // Delete operations
  deleteOfficialDetail: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/official-details/${id}/`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting official detail:', error);
      throw error;
    }
  },

  deleteMonitoringCommittee: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/monitoring-committee/${id}/`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting monitoring committee member:', error);
      throw error;
    }
  },

  deleteDocument: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/${id}/`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }
};