using MediatR;
using System;
using FinanceApp.Application.Common.Models;

namespace FinanceApp.Application.Features.Transactions.Commands
{
    public class CreateTransactionCommand : IRequest<Result<int>>
    {
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public string Type { get; set; } = string.Empty; // "Income" or "Expense"
    }
}
