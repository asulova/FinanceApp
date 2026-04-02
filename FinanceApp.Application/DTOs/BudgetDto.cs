using System;

namespace FinanceApp.Application.DTOs
{
    // SRP: Single Responsibility Principle - Only data transfer for Budget
    // OCP: Open/Closed Principle - Can be extended for new budget DTOs
    public class BudgetDto
    {
        public int Id { get; set; }
        public Guid UserId { get; set; }
        public decimal Amount { get; set; }
        public string PeriodStart { get; set; } = string.Empty;
        public string PeriodEnd { get; set; } = string.Empty;
    }
}
