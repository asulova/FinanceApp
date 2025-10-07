using FinanceApp.Domain.ValueObjects;
using FinanceApp.Domain.Interfaces;
using MediatR;

namespace FinanceApp.Application.Users.Queries;

public class GetUserByEmailQueryHandler : IRequestHandler<GetUserByEmailQuery, Domain.Entities.User?>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetUserByEmailQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Domain.Entities.User?> Handle(GetUserByEmailQuery request, CancellationToken cancellationToken)
    {
        var email = new Email(request.Email);
        return await _unitOfWork.Users.GetByEmailAsync(email, cancellationToken);
    }
}
