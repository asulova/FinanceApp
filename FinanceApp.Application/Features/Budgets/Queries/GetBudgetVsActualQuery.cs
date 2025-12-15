using MediatR;
using FinanceApp.Application.DTOs;
using FinanceApp.Application.Common.Models;

namespace FinanceApp.Application.Features.Budgets.Queries
{
    // CQRS Pattern: Query object for retrieving budget vs actual comparison
    // SRP: Only contains data for the query
    // Updated to accept BudgetId - period dates are derived from the budget entity
    public class GetBudgetVsActualQuery : IRequest<Result<BudgetVsActualDto>>
    {
        public int BudgetId { get; set; }

        public GetBudgetVsActualQuery(int budgetId)
        {
            BudgetId = budgetId;
        }
    }
}
