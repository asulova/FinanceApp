using MediatR;
using FinanceApp.Domain.Entities;
using FinanceApp.Domain.Interfaces;
using FinanceApp.Application.Common.Models;
using System.Threading;
using System.Threading.Tasks;
using FinanceApp.Application.Common.Interfaces;

namespace FinanceApp.Application.Features.Budgets.Commands
{
    // SRP: Handles only budget creation logic
    // DIP: Depends on IBudgetRepository abstraction
    // OCP: Can be extended for new budget creation logic
    public class CreateBudgetCommandHandler : IRequestHandler<CreateBudgetCommand, Result<int>>
    {
        private readonly IBudgetRepository _budgetRepository;
        private readonly ICurrentUserService _currentUserService;
        public CreateBudgetCommandHandler(IBudgetRepository budgetRepository, ICurrentUserService currentUserService)
        {
            _budgetRepository = budgetRepository;
            _currentUserService = currentUserService;
        }

        public async Task<Result<int>> Handle(CreateBudgetCommand request, CancellationToken cancellationToken)
        {
            var userId = _currentUserService.UserId;
            if (userId == null)
                return Result<int>.Failure("Authenticated user not found.");
            var budget = new Budget
            {
                UserId = userId.Value,
                Amount = request.Amount,
                PeriodStart = request.PeriodStart,
                PeriodEnd = request.PeriodEnd
            };
            await _budgetRepository.AddAsync(budget);
            // Defensive: Check if Id is set, otherwise return failure
            return budget.Id > 0
                ? Result<int>.SuccessResult(budget.Id, "Budget created successfully.")
                : Result<int>.Failure("Failed to create budget.");
        }
    }
}
