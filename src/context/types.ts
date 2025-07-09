export interface User {
  id: string;
  username: string;
  full_name: string;
  role: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

export interface Project {
  id: string;
  title: string;
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
