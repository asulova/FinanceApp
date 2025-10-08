using MediatR;
using FinanceApp.Domain.Interfaces;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using FinanceApp.Application.Features.Dtos;

namespace FinanceApp.Application.Features.Users.Queries;

public class GetAllUsersQueryHandler : IRequestHandler<GetAllUsersQuery, List<UserDto>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetAllUsersQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<List<UserDto>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
    {
        var users = await _unitOfWork.Users.GetAllAsync(cancellationToken);
        return users.Select(u => new UserDto
        {
            Id = u.Id,
            Email = u.Email.Value,
            FirstName = u.FirstName,
            LastName = u.LastName,
            IsActive = u.IsActive,
            CreatedAt = u.CreatedAt,
            UpdatedAt = u.UpdatedAt
        }).ToList();
    }
}
