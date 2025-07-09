// Types for Project Detail sections
export interface ProgramDetail {
  id: number;
  project: number;
  project_name: string;
  ward_no: number;
  fiscal_year?: {
    id: number;
    name: string;
  };
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
  outcome?: string;
  budget?: number;
  location_gps?: string;
  status: string;
  project_level?: {
    id: number;
    name: string;
  };
}

export interface InitiationProcess {
  id: number;
  project: number;
  title: string;
  date: string;
  status: string;
  file?: string;
}

export interface ConsumerCommitteeDetail {
  id: number;
  project: number;
  committee_name?: string;
  address?: string;
  formation_date?: string;
  representative_name?: string;
  representative_position?: string;
  contact_number?: string;
}

export interface OfficialDetail {
  id: number;
  project: number;
  post: string;
  full_name: string;
  address: string;
  contact_no: string;
  gender: string;
  citizenship_no: string;
  citizenship_front: string;
  citizenship_back: string;
}

export interface MonitoringCommittee {
  id: number;
  project: number;
  position: string;
  name: string;
  address: string;
  contact_number: string;
  gender: string;
  citizenship_number: string;
}

export interface CostEstimateDetail {
  id: number;
  project: number;
  cost_estimate?: number;
  contingency_percentage?: number;
  contingency_amount?: number;
  total_cost_estimate?: number;
}

export interface MapCostEstimate {
  id: number;
  project: number;
  title: string;
  date: string;
  status: string;
  file?: string;
}

export interface ProjectAgreementDetail {
  id: number;
  project: number;
  approved_cost_estimate?: number;
  contingency_percentage?: number;
  contingency_amount?: number;
  total_cost_estimate?: number;
  agreement_amount?: number;
  agreement_date?: string;
  consumer_contribution_amount?: number;
  consumer_contribution_percentage?: number;
  public_cooperation_amount?: number;
  public_cooperation_percentage?: number;
  work_start_date?: string;
  work_completion_date?: string;
}

export interface Document {
  id: number;
  project: number;
  title: string;
  date: string;
  status: string;
  file?: string;
  document_type: string;
}