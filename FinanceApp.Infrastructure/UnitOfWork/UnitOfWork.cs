using System.Threading;
using System.Threading.Tasks;
using FinanceApp.Domain.Interfaces;
using FinanceApp.Infrastructure.Data;
using FinanceApp.Infrastructure.Repositories;

namespace FinanceApp.Infrastructure.UnitOfWork;

public class UnitOfWork : IUnitOfWork
{
    private readonly FinanceAppDbContext _context;
    public IUserRepository Users { get; }
    public ITransactionRepository Transactions { get; }

    public UnitOfWork(FinanceAppDbContext context)
    {
        _context = context;
        Users = new UserRepository(_context);
        Transactions = new TransactionRepository(_context);
    }

    public async Task<int> CommitAsync(CancellationToken cancellationToken = default)
        => await _context.SaveChangesAsync(cancellationToken);
}
