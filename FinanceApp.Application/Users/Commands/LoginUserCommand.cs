using MediatR;

namespace FinanceApp.Application.Users.Commands;

public record LoginUserCommand(string Email, string Password) : IRequest<Guid?>;
