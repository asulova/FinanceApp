namespace FinanceApp.Application.DTOs
{
    // SRP: Single Responsibility Principle - Only data transfer for category spending breakdown
    // Used in Budget vs Actual feature to show spending per category
    public class CategorySpendingDto
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public decimal PercentageOfTotal { get; set; } // Percentage of total spending
    }
}
