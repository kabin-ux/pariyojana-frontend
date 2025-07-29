import axios from 'axios';

// const BASE_URL = 'http://localhost:8000/api/auth';
const BASE_URL = 'http://213.199.53.33:8000/api/auth';


// Define response types
interface User {
  id: number;
  full_name: string;
  username: string;
  role: string;
}

interface LoginResponse {
  user_id: number;
  full_name: string;
  role: string;
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
