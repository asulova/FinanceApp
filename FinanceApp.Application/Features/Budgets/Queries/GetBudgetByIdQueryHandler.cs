using MediatR;
using FinanceApp.Application.DTOs;
using FinanceApp.Domain.Interfaces;
using FinanceApp.Application.Common.Models;
using System.Threading;
using System.Threading.Tasks;

namespace FinanceApp.Application.Features.Budgets.Queries
{
    // CQRS Pattern: Query handler for retrieving a single budget by ID
    // Result Pattern: Encapsulates response data and status
    // SRP: Handles only the logic for this query
    // DIP: Depends on IBudgetRepository abstraction
    public class GetBudgetByIdQueryHandler : IRequestHandler<GetBudgetByIdQuery, Result<BudgetDto>>
    {
        private readonly IBudgetRepository _budgetRepository;
        public GetBudgetByIdQueryHandler(IBudgetRepository budgetRepository)
        {
            _budgetRepository = budgetRepository;
        }

        public async Task<Result<BudgetDto>> Handle(GetBudgetByIdQuery request, CancellationToken cancellationToken)
        {
            var budget = await _budgetRepository.GetByIdAsync(request.BudgetId);
            if (budget == null)
                return Result<BudgetDto>.Failure("Budget not found.");

            var dto = new BudgetDto
            {
                Id = budget.Id,
                UserId = budget.UserId,
                Amount = budget.Amount,
                PeriodStart = budget.PeriodStart.ToString("yyyy-MM-dd"),
                PeriodEnd = budget.PeriodEnd.ToString("yyyy-MM-dd")
            };
            return Result<BudgetDto>.SuccessResult(dto, "Budget retrieved successfully.");
        }
    }
}
