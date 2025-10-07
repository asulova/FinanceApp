using System.Threading;
using System.Threading.Tasks;

namespace FinanceApp.Domain.Interfaces;

public interface IUnitOfWork
{
    IUserRepository Users { get; }
    Task<int> CommitAsync(CancellationToken cancellationToken = default);
}
