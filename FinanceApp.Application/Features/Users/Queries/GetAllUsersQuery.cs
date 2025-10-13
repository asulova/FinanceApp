using MediatR;
using System.Collections.Generic;
using FinanceApp.Application.Features.Dtos;
using FinanceApp.Application.Common.Models;

namespace FinanceApp.Application.Features.Users.Queries;

public record GetAllUsersQuery() : IRequest<Result<List<UserDto>>>;
