using MediatR;
using FinanceApp.Application.Common.Models;
using System;

namespace FinanceApp.Application.Features.Budgets.Commands
{
    // SRP: Single Responsibility Principle - Only data for creating a budget
    // OCP: Open/Closed Principle - Can be extended for new budget creation scenarios
    public class CreateBudgetCommand : IRequest<Result<int>>
    {
        public decimal Amount { get; set; }
        public DateTime PeriodStart { get; set; }
        public DateTime PeriodEnd { get; set; }
    }
}
