// Handles user login command
using MediatR;

namespace FinanceApp.Application.Features.Authentication.Commands;

public record LoginUserCommand(string Email, string Password) : IRequest<Guid?>;
