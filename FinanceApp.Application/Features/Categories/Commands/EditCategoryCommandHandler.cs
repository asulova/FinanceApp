using FinanceApp.Domain.Interfaces;
using MediatR;
using FinanceApp.Application.Common.Models;

namespace FinanceApp.Application.Features.Categories.Commands;

public class EditCategoryCommandHandler : IRequestHandler<EditCategoryCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;

    public EditCategoryCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<bool>> Handle(EditCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _unitOfWork.Categories.GetByIdAsync(request.CategoryId, cancellationToken);
        if (category == null)
            return Result<bool>.Failure("Category not found.");

        category.Description = request.Description ?? string.Empty;
        await _unitOfWork.Categories.UpdateAsync(category, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);
        return Result<bool>.SuccessResult(true, "Category updated successfully.");
    }
}
