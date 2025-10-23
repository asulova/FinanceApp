namespace FinanceApp.Domain.Entities
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        // Optionally, add navigation property for transactions
        // public ICollection<Transaction> Transactions { get; set; }
    }
}
