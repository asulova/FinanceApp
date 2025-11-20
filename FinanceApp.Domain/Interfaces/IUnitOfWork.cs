using System.Threading;
using System.Threading.Tasks;

namespace FinanceApp.Domain.Interfaces;

// Unit of Work Pattern: Exposes repositories and commit method for transaction management
// SRP: Only coordinates repositories and commits
// DIP: Abstraction for UnitOfWork implementation
public interface IUnitOfWork
{
    IUserRepository Users { get; }
    ITransactionRepository Transactions { get; }
    ICategoryRepository Categories { get; }
    IBudgetRepository Budgets { get; } // Added for budget repository
    Task<int> CommitAsync(CancellationToken cancellationToken = default);
}
