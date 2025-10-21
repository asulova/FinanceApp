using FinanceApp.Domain.Entities;
using FinanceApp.Domain.Interfaces;
using MediatR;

namespace FinanceApp.Application.Features.Categories.Commands;

public class CreateCategoryCommandHandler : IRequestHandler<CreateCategoryCommand, int>
{
    private readonly IUnitOfWork _unitOfWork;

    public CreateCategoryCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<int> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
    {
        // Optionally check for duplicates
        if (await _unitOfWork.Categories.ExistsByNameAsync(request.Name, cancellationToken))
            throw new InvalidOperationException($"Category with name '{request.Name}' already exists.");

        var category = new Category
        {
            Name = request.Name,
            Description = request.Description ?? string.Empty
        };
        await _unitOfWork.Categories.AddAsync(category, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);
        return category.Id;
    }
}
