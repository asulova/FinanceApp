using AutoMapper;
using FinanceApp.Application.Common.Models;
using FinanceApp.Application.Features.Dtos;
using FinanceApp.Domain.Entities;
using FinanceApp.Domain.Interfaces;
using MediatR;

namespace FinanceApp.Application.Features.Users.Queries;

public class GetAllUsersQueryHandler : IRequestHandler<GetAllUsersQuery, Result<List<UserDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetAllUsersQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<List<UserDto>>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
    {
        var result = await _unitOfWork.Users.GetAllAsync(cancellationToken);

        var userDtos = _mapper.Map<List<UserDto>>(result);
        return Result<List<UserDto>>.SuccessResult(userDtos, "Users retrieved successfully.");
    }
}
