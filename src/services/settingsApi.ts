import axios from 'axios';
import type { SettingsItem, ApiResponse } from '../types/settings';

const API_BASE_URL = 'http://213.199.53.33:8000/api/settings';

// Get auth token
const getAuthToken = () => localStorage.getItem('access_token');

// Create axios instance with auth
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tab to endpoint mapping
const getEndpoint = (tab: string): string => {
  const endpoints: Record<string, string> = {
    'विषयगत क्षेत्र': 'thematic-area',
    'उप-क्षेत्र': 'sub-thematic-area',
    'समुह': 'group',
    'योजनाको स्तर': 'project-level',
    'खर्च शिर्षक': 'expenditure-title',
    'खर्च केन्द्र': 'expenditure-center',
    'स्रोत': 'source',
    'इकाई': 'unit',
    'नगर गौरव योजनाको शिर्षक': 'pride-project-title',
    'आर्थिक वर्ष': 'fiscal-year',
    'बैंकहरू': 'bank',
    'नमुनाहरु': 'template'
  };
  return endpoints[tab] || 'thematic-area';
};

// Generic CRUD operations
export const settingsApi = {
  // Get all items for a tab
  getAll: async (tab: string): Promise<SettingsItem[]> => {
    const endpoint = getEndpoint(tab);
    try {
      const response = await apiClient.get<ApiResponse<SettingsItem>>(`/${endpoint}/`);
      return response.data || response.data as any; // Handle both paginated and non-paginated responses
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  },

  // Get single item
  getById: async (tab: string, id: number): Promise<SettingsItem> => {
    const endpoint = getEndpoint(tab);
    const response = await apiClient.get<SettingsItem>(`/${endpoint}/${id}/`);
    return response.data;
  },

  // Create new item
  create: async (tab: string, data: Partial<SettingsItem>): Promise<SettingsItem> => {
    const endpoint = getEndpoint(tab);
    // Convert 'status' to 'is_active' if present
    const apiData = { ...data };
    if ('status' in apiData) {
      (apiData as any).is_active = apiData.is_active;
      delete (apiData as any).status;
    }
    const response = await apiClient.post<SettingsItem>(`/${endpoint}/`, apiData);
    console.log(response.data)
    return response.data;
  },

  // Update item
  update: async (tab: string, id: number, data: Partial<SettingsItem>): Promise<SettingsItem> => {
    const endpoint = getEndpoint(tab);
    // Convert 'status' to 'is_active' if present
    const apiData = { ...data };
    if ('status' in apiData) {
      (apiData as any).is_active = apiData.status;
      delete (apiData as any).status;
    }
    const response = await apiClient.put<SettingsItem>(`/${endpoint}/${id}/`, apiData);
    return response.data;
  },

  // Partial update
  patch: async (tab: string, id: number, data: Partial<SettingsItem>): Promise<SettingsItem> => {
    const endpoint = getEndpoint(tab);
    // Convert 'status' to 'is_active' if present
    const apiData = { ...data };
    if ('status' in apiData) {
      (apiData as any).is_active = apiData.status;
      delete (apiData as any).status;
    }
    const response = await apiClient.patch<SettingsItem>(`/${endpoint}/${id}/`, apiData);
    return response.data;
  },

  // Delete item
  delete: async (tab: string, id: number): Promise<void> => {
    const endpoint = getEndpoint(tab);
    await apiClient.delete(`/${endpoint}/${id}/`);
  },

  // Toggle status
  toggleStatus: async (tab: string, id: number, status: boolean): Promise<SettingsItem> => {
    const endpoint = getEndpoint(tab);
    const response = await apiClient.patch<SettingsItem>(`/${endpoint}/${id}/`, { is_active: status });
    return response.data;
  }
};

// Specific API calls for dependent data
export const dependentDataApi = {
  // Get thematic areas for sub-area dropdown
  getThematicAreas: async () => {
    try {
      const response = await apiClient.get<ApiResponse<any>>('/thematic-area/');
      return response.data.results || response.data as any;
    } catch (error) {
      console.error('Error fetching thematic areas:', error);
      return [];
    }
  },

  // Get sub-thematic areas for group dropdown
  getSubThematicAreas: async () => {
    try {
      const response = await apiClient.get<ApiResponse<any>>('/sub-thematic-area/');
      return response.data || response.data as any;
    } catch (error) {
      console.error('Error fetching sub-thematic areas:', error);
      return [];
    }
  }
};