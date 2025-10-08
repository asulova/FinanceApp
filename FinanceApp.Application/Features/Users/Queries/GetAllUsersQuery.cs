using MediatR;
using System.Collections.Generic;
using FinanceApp.Application.Features.Dtos;

namespace FinanceApp.Application.Features.Users.Queries;

public record GetAllUsersQuery() : IRequest<List<UserDto>>;
