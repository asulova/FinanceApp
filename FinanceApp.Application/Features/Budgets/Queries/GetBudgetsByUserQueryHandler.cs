using MediatR;
using FinanceApp.Application.DTOs;
using FinanceApp.Domain.Interfaces;
using FinanceApp.Application.Common.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace FinanceApp.Application.Features.Budgets.Queries
{
    // CQRS Pattern: Query handler for retrieving budgets by user
    // Result Pattern: Encapsulates response data and status
    // SRP: Handles only the logic for this query
    // DIP: Depends on IBudgetRepository abstraction
    public class GetBudgetsByUserQueryHandler : IRequestHandler<GetBudgetsByUserQuery, Result<IEnumerable<BudgetDto>>>
    {
        private readonly IBudgetRepository _budgetRepository;
        public GetBudgetsByUserQueryHandler(IBudgetRepository budgetRepository)
        {
            _budgetRepository = budgetRepository;
        }

        public async Task<Result<IEnumerable<BudgetDto>>> Handle(GetBudgetsByUserQuery request, CancellationToken cancellationToken)
        {
            var budgets = await _budgetRepository.GetByUserIdAsync(request.UserId, cancellationToken);
            if (budgets == null || !budgets.Any())
                return Result<IEnumerable<BudgetDto>>.SuccessResult(Enumerable.Empty<BudgetDto>(), "No budgets found for this user.");

            var budgetDtos = budgets.Select(b => new BudgetDto
            {
                Id = b.Id,
                UserId = b.UserId,
                Amount = b.Amount,
                PeriodStart = b.PeriodStart.ToString("yyyy-MM-dd"),
                PeriodEnd = b.PeriodEnd.ToString("yyyy-MM-dd")
            });

            return Result<IEnumerable<BudgetDto>>.SuccessResult(budgetDtos, "Budgets retrieved successfully.");
        }
    }
}
