using MediatR;
using FinanceApp.Domain.Entities;

namespace FinanceApp.Application.Users.Queries;

public record GetUserByEmailQuery(string Email) : IRequest<User?>;
