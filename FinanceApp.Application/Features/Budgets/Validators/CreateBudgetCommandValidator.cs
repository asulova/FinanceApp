using FluentValidation;

namespace FinanceApp.Application.Features.Budgets.Validators
{
    // SRP: Only validates CreateBudgetCommand
    // OCP: Can be extended for new validation rules
    public class CreateBudgetCommandValidator : AbstractValidator<Commands.CreateBudgetCommand>
    {
        public CreateBudgetCommandValidator()
        {
            RuleFor(x => x.Amount)
                .GreaterThan(0).WithMessage("Budget amount must be greater than 0.");

            RuleFor(x => x.PeriodStart)
                .LessThan(x => x.PeriodEnd).WithMessage("PeriodStart must be before PeriodEnd.");
        }
    }
}
