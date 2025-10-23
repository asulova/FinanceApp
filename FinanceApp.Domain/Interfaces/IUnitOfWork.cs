using System.Threading;
using System.Threading.Tasks;

namespace FinanceApp.Domain.Interfaces;

public interface IUnitOfWork
{
    IUserRepository Users { get; }
    ITransactionRepository Transactions { get; }
    ICategoryRepository Categories { get; }
    Task<int> CommitAsync(CancellationToken cancellationToken = default);
}
