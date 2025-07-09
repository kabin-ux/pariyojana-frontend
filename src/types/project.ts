export interface Project {
  id: number;
  project_name: string;
  area?: {
    id: number;
    name: string;
  };
  sub_area?: {
    id: number;
    name: string;
  };
  source?: {
    id: number;
    name: string;
  };
  expenditure_center?: {
    id: number;
    name: string;
  };
  budget?: number;
  ward_no?: number;
  status: string;
  fiscal_year?: {
    id: number;
    name: string;
  };
  project_level?: {
    id: number;
    name: string;
  };
  expenditure_title?: {
    id: number;
    name: string;
  };
  operation_location?: string;
  location_gps?: string;
  outcome?: string;
  unit?: {
    id: number;
    name: string;
  };
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectsApiResponse {
  results: Project[];
  count: number;
  next?: string;
  previous?: string;
}