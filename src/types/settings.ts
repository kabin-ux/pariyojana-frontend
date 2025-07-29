// Settings data types for all tabs
export interface BaseSettingsItem {
  id: number;
  name: string;
  is_active: boolean; // Changed from 'status' to 'is_active'
  created_at?: string;
  updated_at?: string;
}

export interface ThematicArea extends BaseSettingsItem {
  committee_name: string; // Changed from 'committee' to 'committee_name'
}

export interface SubThematicArea extends BaseSettingsItem {
  id: number;
  name: string;
  thematic_area: number;
  thematic_area_name?: string;
}

export interface Group extends BaseSettingsItem {
  thematic_area: number;
  sub_area: number; // Changed from 'sub_thematic_area' to 'sub_area'
  sub_thematic_area_name?: string;
  thematic_area_name?: string;
}
export interface FiscalYear extends BaseSettingsItem {
  year: string; // or number, depending on your API
}


export interface ProjectLevel extends BaseSettingsItem { }

export interface ExpenditureTitle extends BaseSettingsItem { }

export interface ExpenditureCenter extends BaseSettingsItem { }

export interface Source extends BaseSettingsItem { }

export interface Unit extends BaseSettingsItem {
  short_name: string;
}

export interface PrideProjectTitle extends BaseSettingsItem { }

export interface FiscalYear extends BaseSettingsItem { }

export interface Bank extends BaseSettingsItem { }

export interface Template extends BaseSettingsItem {
  code: string;
  title: string;
}

export type SettingsItem =
  | ThematicArea
  | SubThematicArea
  | Group
  | ProjectLevel
  | ExpenditureTitle
  | ExpenditureCenter
  | Source
  | Unit
  | PrideProjectTitle
  | FiscalYear
  | Bank
  | Template;

export interface ApiResponse<T> {
  results: T[];   // ✅ paginated list
  count: number;
  next: string | null;
  previous: string | null;
  status: string;
  message?: string;
  data: T;       // 👈 this creates confusion, especially if T = T[]
}
