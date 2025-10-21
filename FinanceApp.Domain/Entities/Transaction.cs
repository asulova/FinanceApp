using System;

namespace FinanceApp.Domain.Entities
{
    public class Transaction
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public Category? Category { get; set; }
        public string Type { get; set; } = string.Empty; // Use TransactionTypes.INCOME or TransactionTypes.EXPENSE
        public Guid UserId { get; set; }
        public User? User { get; set; }
    }
}
