using FinanceApp.Domain.Entities;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace FinanceApp.Domain.Interfaces
{
    public interface ITransactionRepository
    {
        Task<Transaction?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
        Task<IEnumerable<Transaction>> GetAllAsync(CancellationToken cancellationToken = default);
        Task<Transaction> AddAsync(Transaction transaction, CancellationToken cancellationToken = default);
        Task UpdateAsync(Transaction transaction, CancellationToken cancellationToken = default);
        Task DeleteAsync(int id, CancellationToken cancellationToken = default);
    }
}
