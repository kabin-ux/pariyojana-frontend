export interface Project {
  id?: number; // ID is not present in the response, mark optional if necessary
  serial_number: number;
  project_name: string;
  area: number;
  sub_area: number;
  source: number;
  expenditure_center: number;
  project_level: number;
  fiscal_year: number;
  unit: number;
  budget: number;
  ward_no: number[]; // Changed from string to string[]
  status: string;
  location: string | null;
  location_gps: string;
  outcome: string;
  is_active: boolean;
  is_deleted: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_by: number | null;

  // Display-only names from joins (optional depending on context)
  area_name?: string;
  sub_area_name?: string;
  source_name?: string;
  expenditure_title: number | null;
  description: string;
  operation_location: string;
  expenditure_center_name?: string;
  fiscal_year_name?: string;
  unit_name?: string;
  project_level_name?: string;
}


export interface ProjectsApiResponse {
  results: Project[];
  count: number;
  next?: string;
  previous?: string;
}


export interface ProjectSubmitPayload {
  project_name: string;
  area: number | null;
  sub_area: number | null;
  project_level: number | null;
  expenditure_title: number | null;
  expenditure_center: number | null;
  budget: number | null;
  source: number | null;
  operation_location: string;
  ward_no: number | null;
  location_gps: string;
  outcome: string;
  unit: number | null;
  description: string;
  fiscal_year: number | null;
  status: string;
}
