using MediatR;
using FinanceApp.Application.DTOs;
using System.Collections.Generic;
using FinanceApp.Application.Common.Models;

namespace FinanceApp.Application.Features.Budgets.Queries
{
    // CQRS Pattern: Query object for retrieving budgets by user
    // SRP: Only contains data for the query
    public class GetBudgetsByUserQuery : IRequest<Result<IEnumerable<BudgetDto>>>
    {
        public Guid UserId { get; }
        public GetBudgetsByUserQuery(Guid userId)
        {
            UserId = userId;
        }
    }
}
