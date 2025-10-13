using FinanceApp.Application.Common.Models;
using FinanceApp.Application.Features.Dtos;
using MediatR;

namespace FinanceApp.Application.Features.Users.Queries;

public record GetUserByEmailQuery(string Email) : IRequest<Result<UserDto>>;
