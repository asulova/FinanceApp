namespace FinanceApp.Domain.Entities
{
    // SRP: Single Responsibility Principle - Only budget data, no business logic
    // OCP: Open/Closed Principle - Can be extended for different budget strategies
    // LSP: Liskov Substitution Principle - Derived budget types can be used wherever Budget is expected
    public class Budget
    {
        public int Id { get; set; }
        public Guid UserId { get; set; }
        public decimal Amount { get; set; }
        public DateTime PeriodStart { get; set; }
        public DateTime PeriodEnd { get; set; }
    }
}
