namespace FinanceApp.Domain.Exceptions;

public abstract class DomainException : Exception
{
    protected DomainException(string message) : base(message) { }
    protected DomainException(string message, Exception innerException) : base(message, innerException) { }
}

public class UserNotFoundException : DomainException
{
    public UserNotFoundException(Guid userId) : base($"User with ID {userId} was not found.") { }
    public UserNotFoundException(string email) : base($"User with email {email} was not found.") { }
}

public class DuplicateEmailException : DomainException
{
    public DuplicateEmailException(string email) : base($"User with email {email} already exists.") { }
}

public class InvalidUserOperationException : DomainException
{
    public InvalidUserOperationException(string message) : base(message) { }
}