using MediatR;

namespace FinanceApp.Application.Users.Commands;

public record RegisterUserCommand(string Email, string FirstName, string LastName, string Password) : IRequest<Guid>;
