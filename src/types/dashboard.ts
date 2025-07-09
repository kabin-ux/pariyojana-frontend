export interface Summary {
    total_projects: number;
    completed_projects: number;
    in_progress_projects: number;
    not_started_projects: number;
}

export interface BudgetSummary {
    total_budget: number;
    expenditure_budget: number;
    remaining_budget: number;
}

export interface AreaDistribution {
    label: string;
    value: string;
}


export interface WardBudget {
    ward_no: string;
    total_budget: string
}


export interface BudgetArea {
    label: string;
    value: string;
}