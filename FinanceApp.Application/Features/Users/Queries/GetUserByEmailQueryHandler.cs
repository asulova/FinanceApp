using FinanceApp.Application.Common.Models;
using FinanceApp.Application.Features.Dtos;
using FinanceApp.Domain.Interfaces;
using FinanceApp.Domain.ValueObjects;
using MediatR;

namespace FinanceApp.Application.Features.Users.Queries;

public class GetUserByEmailQueryHandler : IRequestHandler<GetUserByEmailQuery, Result<UserDto>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetUserByEmailQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<UserDto>> Handle(GetUserByEmailQuery request, CancellationToken cancellationToken)
    {
        var user = await _unitOfWork.Users.GetByEmailAsync(new Email(request.Email), cancellationToken);
        if (user == null) 
            return Result<UserDto>.Failure("User not found.");

        var userDto = new UserDto
        {
            Id = user.Id,
            Email = user.Email.Value,
            FirstName = user.FirstName,
            LastName = user.LastName,
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };

        return Result<UserDto>.SuccessResult(userDto, "User retrieved successfully.");
    }
}
