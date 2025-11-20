using MediatR;
using FinanceApp.Application.DTOs;
using FinanceApp.Application.Common.Models;

namespace FinanceApp.Application.Features.Budgets.Queries
{
    // CQRS Pattern: Query object for retrieving a single budget by ID
    // SRP: Only contains data for the query
    public class GetBudgetByIdQuery : IRequest<Result<BudgetDto>>
    {
        public int BudgetId { get; }
        public GetBudgetByIdQuery(int budgetId)
        {
            BudgetId = budgetId;
        }
    }
}
