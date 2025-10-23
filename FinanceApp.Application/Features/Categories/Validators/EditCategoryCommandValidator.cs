using FluentValidation;
using FinanceApp.Application.Features.Categories.Commands;

namespace FinanceApp.Application.Features.Categories.Validators;

public class EditCategoryCommandValidator : AbstractValidator<EditCategoryCommand>
{
    public EditCategoryCommandValidator()
    {
        RuleFor(x => x.CategoryId)
            .GreaterThan(0).WithMessage("CategoryId must be greater than 0.");
        RuleFor(x => x.Description)
            .MaximumLength(200).WithMessage("Description must not exceed 200 characters.");
    }
}
