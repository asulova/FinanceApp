using FinanceApp.Domain.Interfaces;
using MediatR;
using FinanceApp.Application.Common.Models;

namespace FinanceApp.Application.Features.Categories.Commands;

public class DeleteCategoryCommandHandler : IRequestHandler<DeleteCategoryCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;

    public DeleteCategoryCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<bool>> Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
    {
        // Check if category exists
        var category = await _unitOfWork.Categories.GetByIdAsync(request.CategoryId, cancellationToken);
        if (category == null)
            return Result<bool>.Failure("Category not found.");

        // Check if category has assigned transactions
        var hasTransactions = await _unitOfWork.Categories.HasAssignedTransactionsAsync(request.CategoryId, cancellationToken);
        if (hasTransactions)
            return Result<bool>.Failure("Category cannot be deleted because it has assigned transactions.");

        // Delete category
        await _unitOfWork.Categories.DeleteAsync(request.CategoryId, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);
        return Result<bool>.SuccessResult(true, "Category deleted successfully.");
    }
}
