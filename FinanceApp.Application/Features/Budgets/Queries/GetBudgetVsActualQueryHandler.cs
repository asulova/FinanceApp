using MediatR;
using FinanceApp.Domain.Interfaces;
using FinanceApp.Application.DTOs;
using FinanceApp.Application.Common.Models;
using FinanceApp.Application.Common.Interfaces;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;

namespace FinanceApp.Application.Features.Budgets.Queries
{
    // CQRS Pattern: Handler for GetBudgetVsActualQuery
    // SRP: Handles only the logic for retrieving and calculating budget vs actual data
    // DIP: Depends on IUnitOfWork and ICurrentUserService abstractions
    public class GetBudgetVsActualQueryHandler : IRequestHandler<GetBudgetVsActualQuery, Result<BudgetVsActualDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUserService _currentUserService;

        public GetBudgetVsActualQueryHandler(IUnitOfWork unitOfWork, ICurrentUserService currentUserService)
        {
            _unitOfWork = unitOfWork;
            _currentUserService = currentUserService;
        }

        public async Task<Result<BudgetVsActualDto>> Handle(GetBudgetVsActualQuery request, CancellationToken cancellationToken)
        {
            // Get authenticated user
            var userId = _currentUserService.UserId;
            if (userId == null)
                return Result<BudgetVsActualDto>.Failure("User is not authenticated.");

            // 1. Get budget by ID
            var budget = await _unitOfWork.Budgets.GetByIdAsync(request.BudgetId, cancellationToken);
            
            if (budget == null)
                return Result<BudgetVsActualDto>.Failure("Budget not found.");
            
            // Verify the budget belongs to the authenticated user
            if (budget.UserId != userId.Value)
                return Result<BudgetVsActualDto>.Failure("Unauthorized access to budget.");

            // 2. Get spending grouped by category for the budget's period
            var spendingByCategory = await _unitOfWork.Transactions.GetSpendingByCategoryAsync(
                userId.Value,
                budget.PeriodStart,
                budget.PeriodEnd,
                cancellationToken);

            // 3. Get all categories to map category names
            var allCategories = await _unitOfWork.Categories.GetAllAsync(cancellationToken);
            var categoryDict = allCategories.ToDictionary(c => c.Id, c => c.Name);

            // 4. Calculate total spending
            var totalSpending = spendingByCategory.Values.Sum();

            // 5. Build category breakdown list
            var categoryBreakdown = spendingByCategory
                .Select(kvp => new CategorySpendingDto
                {
                    CategoryId = kvp.Key,
                    CategoryName = categoryDict.ContainsKey(kvp.Key) ? categoryDict[kvp.Key] : "Unknown",
                    Amount = kvp.Value,
                    PercentageOfTotal = totalSpending > 0 ? (kvp.Value / totalSpending) * 100 : 0
                })
                .OrderByDescending(c => c.Amount)
                .ToList();

            // 6. Calculate variance and percentage used
            var budgetAmount = budget.Amount;
            var variance = budgetAmount - totalSpending;
            var percentageUsed = budgetAmount > 0 ? (totalSpending / budgetAmount) * 100 : 0;

            // 7. Determine status based on percentage used
            string status;
            if (percentageUsed < 90)
                status = "Under Budget";
            else if (percentageUsed <= 100)
                status = "Approaching Budget";
            else
                status = "Over Budget";

            // 8. Build result DTO with period dates from the budget entity
            var result = new BudgetVsActualDto
            {
                BudgetId = budget.Id,
                BudgetAmount = budgetAmount,
                TotalSpending = totalSpending,
                Variance = variance,
                PercentageUsed = percentageUsed,
                Status = status,
                PeriodStart = budget.PeriodStart,
                PeriodEnd = budget.PeriodEnd,
                CategoryBreakdown = categoryBreakdown
            };

            return Result<BudgetVsActualDto>.SuccessResult(result, "Budget vs Actual retrieved successfully.");
        }
    }
}
