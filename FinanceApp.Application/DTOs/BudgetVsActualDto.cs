using System;
using System.Collections.Generic;

namespace FinanceApp.Application.DTOs
{
    // SRP: Single Responsibility Principle - Only data transfer for budget vs actual comparison
    // Used to display overall budget status and category-wise spending breakdown
    public class BudgetVsActualDto
    {
        public int? BudgetId { get; set; } // Nullable if no budget exists for the period
        public decimal BudgetAmount { get; set; }
        public decimal TotalSpending { get; set; }
        public decimal Variance { get; set; } // BudgetAmount - TotalSpending (positive = under budget, negative = over budget)
        public decimal PercentageUsed { get; set; } // (TotalSpending / BudgetAmount) * 100
        public string Status { get; set; } = string.Empty; // "Under Budget", "Approaching Budget", "Over Budget"
        public DateTime PeriodStart { get; set; }
        public DateTime PeriodEnd { get; set; }
        public List<CategorySpendingDto> CategoryBreakdown { get; set; } = new();
    }
}
