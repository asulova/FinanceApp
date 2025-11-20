using System.Threading;
using System.Threading.Tasks;
using FinanceApp.Domain.Interfaces;
using FinanceApp.Infrastructure.Data;
using FinanceApp.Infrastructure.Repositories;

namespace FinanceApp.Infrastructure.UnitOfWork;

// Unit of Work Pattern: Coordinates multiple repositories and manages transaction boundaries
// SRP: Handles only coordination of repositories and commits
// DIP: Implements IUnitOfWork abstraction
public class UnitOfWork : IUnitOfWork
{
    private readonly FinanceAppDbContext _context;
    public IUserRepository Users { get; }
    public ITransactionRepository Transactions { get; }
    public ICategoryRepository Categories { get; }
    public IBudgetRepository Budgets { get; } // Added for budget repository

    public UnitOfWork(FinanceAppDbContext context)
    {
        _context = context;
        Users = new UserRepository(_context);
        Transactions = new TransactionRepository(_context);
        Categories = new CategoryRepository(_context);
        Budgets = new BudgetRepository(_context); // Unit of Work manages BudgetRepository
    }

    public async Task<int> CommitAsync(CancellationToken cancellationToken = default)
        => await _context.SaveChangesAsync(cancellationToken);
}
