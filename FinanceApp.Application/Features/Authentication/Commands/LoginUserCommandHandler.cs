using FinanceApp.Domain.ValueObjects;
using FinanceApp.Domain.Interfaces;
using MediatR;

namespace FinanceApp.Application.Features.Authentication.Commands;

public class LoginUserCommandHandler : IRequestHandler<LoginUserCommand, Guid?>
{
    private readonly IUnitOfWork _unitOfWork;

    public LoginUserCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid?> Handle(LoginUserCommand request, CancellationToken cancellationToken)
    {
        var email = new Email(request.Email);
        var user = await _unitOfWork.Users.GetByEmailAsync(email, cancellationToken);
        if (user == null || user.PasswordHash != request.Password) // In production, use a password hasher!
            return null;
        return user.Id;
    }
}
