import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/auth';

// Define response types
interface User {
  id: string;
  username: string;
  role: string;
}

interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export const loginUser = async (
  email: string,
  password: string
): Promise<{ data: LoginResponse }> => {
  return axios.post(`${BASE_URL}/login/`, { email, password });
};

export const forgotPassword = async (
  email: string
): Promise<{ data: any }> => {
  return axios.post(`${BASE_URL}/forgot-password/`, { email });
};
