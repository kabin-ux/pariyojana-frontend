
export interface User {
  // user_id: number;
  id: number;
  full_name: string;
  // username: string;
  role: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

export interface Project {
    id: number;
  serial_number: number;
  project_name: string;
  area: number;
  sub_area: number;
  source: number;
  expenditure_center: number;
  budget: number;
  ward_no: number;
  status: string;
}

export interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

export interface GlobalState {
  auth: AuthState;
  projects: ProjectState;
}

