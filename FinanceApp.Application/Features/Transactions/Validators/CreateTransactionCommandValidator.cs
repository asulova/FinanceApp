using FinanceApp.Application.Features.Transactions.Commands;
using FluentValidation;

namespace FinanceApp.Application.Features.Transactions.Validators;

public class CreateTransactionCommandValidator : AbstractValidator<CreateTransactionCommand>
{
    public CreateTransactionCommandValidator()
    {
        RuleFor(x => x.Amount)
            .GreaterThan(0).WithMessage("Amount must be greater than zero.");
        RuleFor(x => x.Date)
            .NotEmpty().WithMessage("Date is required.");
        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required.")
            .MaximumLength(250).WithMessage("Description cannot exceed 250 characters.");
        RuleFor(x => x.CategoryId)
            .GreaterThan(0).WithMessage("CategoryId must be greater than zero.");

        RuleFor(x => x.Type)
            .NotEmpty().WithMessage("Type is required.")
            .Must(type => type == "INCOME" || type == "EXPENSE")
            .WithMessage("Type must be either 'INCOME' or 'EXPENSE'.");
    }
}
