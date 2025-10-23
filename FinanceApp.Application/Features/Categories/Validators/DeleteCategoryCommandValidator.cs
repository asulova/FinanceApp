using FluentValidation;
using FinanceApp.Application.Features.Categories.Commands;

namespace FinanceApp.Application.Features.Categories.Validators;

public class DeleteCategoryCommandValidator : AbstractValidator<DeleteCategoryCommand>
{
    public DeleteCategoryCommandValidator()
    {
        RuleFor(x => x.CategoryId)
            .GreaterThan(0).WithMessage("CategoryId must be greater than 0.");
    }
}
