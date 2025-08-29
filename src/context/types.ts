// types.ts
const roles = [
  'admin',
  'planning section',
  'ward/office seceratery',
  'engineer',
  'ward engineer',
  'user committee',
  'Data Entry',
  'Department chief',
] as const;

export type UserRole = typeof roles[number];

export interface User {
  user_id?: number;
  id: number; // For form operations
  full_name: string;
  last_name?: string;
  email?: string;
  phone?: string;
  role: UserRole;
  ward_no?: string;
  position?: string;
  department?: string;
  section?: string;
  administrative_level?: string;
  is_active?: boolean;
  isSelf?: boolean;
}

// Rest of your existing interfaces...

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
  ward_no: string[]; // Changed from string to string[]
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

