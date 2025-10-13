using FinanceApp.Domain.Entities;
using FinanceApp.Domain.ValueObjects;
using FinanceApp.Domain.Interfaces;
using MediatR;

namespace FinanceApp.Application.Features.Users.Commands;

public class RegisterUserCommandHandler : IRequestHandler<RegisterUserCommand, Guid>
{
    private readonly IUnitOfWork _unitOfWork;

    public RegisterUserCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
    {
        var email = new Email(request.Email);
        var exists = await _unitOfWork.Users.ExistsAsync(email, cancellationToken);
        if (exists)
        {
            throw new Domain.Exceptions.DuplicateEmailException(request.Email);
        }

        var user = new User(
            email,
            request.FirstName,
            request.LastName,
            request.Password // In production, hash the password before storing!
        );

        await _unitOfWork.Users.AddAsync(user, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        return user.Id;
    }
}
