import type { Project, ProjectsApiResponse } from '../types/project';

const API_BASE_URL = 'http://213.199.53.33:81/api/projects';

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

export const projectApi = {
  // Get all projects
  getAll: async (params?: {
    page?: number;
    search?: string;
    area?: string;
    sub_area?: string;
    source?: string;
    status?: string;
  }): Promise<ProjectsApiResponse> => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.area) queryParams.append('area', params.area);
      if (params?.sub_area) queryParams.append('sub_area', params.sub_area);
      if (params?.source) queryParams.append('source', params.source);
      if (params?.status) queryParams.append('status', params.status);

      const url = `${API_BASE_URL}/projects/`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("projects", data)
      return data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  // Get single project
  getById: async (id: number): Promise<Project> => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}/`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error);
      throw error;
    }
  },

  // Create new project
  create: async (data: Partial<Project>): Promise<Project> => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, data: ${JSON.stringify(errorData)}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  // Update project
  update: async (id: number, data: Partial<Project>): Promise<Project> => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}/`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, data: ${JSON.stringify(errorData)}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error updating project ${id}:`, error);
      throw error;
    }
  },

  // Partial update
  patch: async (id: number, data: Partial<Project>): Promise<Project> => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}/`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, data: ${JSON.stringify(errorData)}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error patching project ${id}:`, error);
      throw error;
    }
  },

  // Delete project
  delete: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}/`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error deleting project ${id}:`, error);
      throw error;
    }
  }
};