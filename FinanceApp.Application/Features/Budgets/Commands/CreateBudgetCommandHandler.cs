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
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUserService _currentUserService;
        public CreateBudgetCommandHandler(IUnitOfWork unitOfWork, ICurrentUserService currentUserService)
        {
            _unitOfWork = unitOfWork;
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

            await _unitOfWork.Budgets.AddAsync(budget, cancellationToken);
            await _unitOfWork.CommitAsync(cancellationToken);

            return budget.Id > 0
                ? Result<int>.SuccessResult(budget.Id, "Budget created successfully.")
                : Result<int>.Failure("Failed to create budget.");
        }
    }
}
