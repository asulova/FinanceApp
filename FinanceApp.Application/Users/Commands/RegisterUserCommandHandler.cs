using FinanceApp.Domain.Entities;
using FinanceApp.Domain.ValueObjects;
using FinanceApp.Domain.Interfaces;
using MediatR;

namespace FinanceApp.Application.Users.Commands;

public class RegisterUserCommandHandler : IRequestHandler<RegisterUserCommand, Guid>
{
    private readonly IUnitOfWork _unitOfWork;

    public RegisterUserCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
    {
        var user = new User(
            new Email(request.Email),
            request.FirstName,
            request.LastName,
            request.Password // In production, hash the password before storing!
        );

        await _unitOfWork.Users.AddAsync(user, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        return user.Id;
    }
}
