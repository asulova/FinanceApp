using FinanceApp.Domain.Entities;
namespace FinanceApp.Domain.Interfaces
{
    public interface ITransactionRepository
    {
        Task<Transaction?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
        Task<Transaction> AddAsync(Transaction transaction, CancellationToken cancellationToken = default);
        Task UpdateAsync(Transaction transaction, CancellationToken cancellationToken = default);
        Task DeleteAsync(int id, CancellationToken cancellationToken = default);

        /// <summary>
        /// Gets a paginated and sorted list of transactions (most recent first) for a specific user.
        /// </summary>
        Task<List<Transaction>> GetPagedSortedAsync(Guid userId, int pageNumber, int pageSize, CancellationToken cancellationToken = default);
        
        /// <summary>
        /// Gets the total count of transactions for a specific user.
        /// </summary>
        Task<int> CountByUserAsync(Guid userId, CancellationToken cancellationToken = default);
    }
}
