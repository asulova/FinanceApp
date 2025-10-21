
using FinanceApp.Domain.Entities;
using MediatR;
using FinanceApp.Domain.Interfaces;
using FinanceApp.Application.Common.Models;
using FinanceApp.Application.Common.Interfaces;

namespace FinanceApp.Application.Features.Transactions.Commands
{
    public class CreateTransactionCommandHandler : IRequestHandler<CreateTransactionCommand, Result<int>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUserService _currentUserService;

        public CreateTransactionCommandHandler(IUnitOfWork unitOfWork, ICurrentUserService currentUserService)
        {
            _unitOfWork = unitOfWork;
            _currentUserService = currentUserService;
        }

        public async Task<Result<int>> Handle(CreateTransactionCommand request, CancellationToken cancellationToken)
        {
            var userId = _currentUserService.UserId;
            if (userId == null)
                return Result<int>.Failure("User is not authenticated.");

            var transaction = new Transaction
            {
                Amount = request.Amount,
                Date = request.Date,
                Description = request.Description,
                CategoryId = request.CategoryId,
                Type = request.Type,
                UserId = userId.Value
            };

            await _unitOfWork.Transactions.AddAsync(transaction, cancellationToken);
            var result = await _unitOfWork.CommitAsync(cancellationToken);
            if (result > 0)
                return Result<int>.SuccessResult(transaction.Id, "Transaction created successfully.");
            return Result<int>.Failure("Failed to create transaction.");
        }
    }
}
