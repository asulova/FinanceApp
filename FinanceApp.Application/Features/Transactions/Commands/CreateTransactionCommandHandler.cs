
using FinanceApp.Domain.Entities;
using MediatR;
using FinanceApp.Domain.Interfaces;
using FinanceApp.Application.Common.Models;

namespace FinanceApp.Application.Features.Transactions.Commands
{
    public class CreateTransactionCommandHandler : IRequestHandler<CreateTransactionCommand, Result<int>>
    {
        private readonly IUnitOfWork _unitOfWork;

        public CreateTransactionCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<int>> Handle(CreateTransactionCommand request, CancellationToken cancellationToken)
        {
            var transaction = new Transaction
            {
                Amount = request.Amount,
                Date = request.Date,
                Description = request.Description,
                CategoryId = request.CategoryId,
                Type = request.Type
            };

            await _unitOfWork.Transactions.AddAsync(transaction, cancellationToken);
            var result = await _unitOfWork.CommitAsync(cancellationToken);
            if (result > 0)
                return Result<int>.SuccessResult(transaction.Id, "Transaction created successfully.");
            return Result<int>.Failure("Failed to create transaction.");
        }
    }
}
