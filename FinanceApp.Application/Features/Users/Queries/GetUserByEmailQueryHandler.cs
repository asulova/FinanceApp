using MediatR;
using FinanceApp.Domain.Interfaces;
using System.Threading;
using System.Threading.Tasks;
using FinanceApp.Application.Features.Dtos;

namespace FinanceApp.Application.Features.Users.Queries;

public class GetUserByEmailQueryHandler : IRequestHandler<GetUserByEmailQuery, UserDto>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetUserByEmailQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<UserDto> Handle(GetUserByEmailQuery request, CancellationToken cancellationToken)
    {
        var user = await _unitOfWork.Users.GetByEmailAsync(new FinanceApp.Domain.ValueObjects.Email(request.Email), cancellationToken);
        if (user == null) return null;
        return new UserDto
        {
            Id = user.Id,
            Email = user.Email.Value,
            FirstName = user.FirstName,
            LastName = user.LastName,
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };
    }
}
