export interface Budget {
    id: number;
    userId: string;
    amount: number;
    periodStart: string; // formatted as "yyyy-MM-dd"
    periodEnd: string;   // formatted as "yyyy-MM-dd"
}

export interface CategorySpending {
    categoryId: number;
    categoryName: string;
    amount: number;
    percentageOfTotal: number;
}

export interface BudgetVsActual {
    budgetId?: number;
    budgetAmount: number;
    totalSpending: number;
    variance: number;
    percentageUsed: number;
    status: string; // "Under Budget", "Approaching Budget", "Over Budget"
    periodStart: string;
    periodEnd: string;
    categoryBreakdown: CategorySpending[];
}