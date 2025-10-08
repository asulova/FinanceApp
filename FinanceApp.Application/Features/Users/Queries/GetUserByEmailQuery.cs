using MediatR;
using FinanceApp.Application.Features.Dtos;

namespace FinanceApp.Application.Features.Users.Queries;

public record GetUserByEmailQuery(string Email) : IRequest<UserDto>;
