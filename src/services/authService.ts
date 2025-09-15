import axios from 'axios';

// const BASE_URL = 'http://localhost:8000/api/auth';
const BASE_URL = 'http://www.bardagoriyapms.com/api/auth';



interface LoginResponse {
  access: string;
  refresh: string;
  user_id: number;
  full_name: string;
  role: 'admin' | 'engineer' | 'planning section' | 'ward/office seceratery' | 'ward engineer' | 'user committee' | 'Data Entry' | 'Department chief';
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
