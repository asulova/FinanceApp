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
        
        /// <summary>
        /// Gets spending grouped by category for a specific user and period.
        /// Only includes EXPENSE transactions.
        /// Returns a dictionary where key is CategoryId and value is the total amount spent.
        /// Used for Budget vs Actual feature to calculate category-wise spending.
        /// </summary>
        Task<Dictionary<int, decimal>> GetSpendingByCategoryAsync(Guid userId, DateTime periodStart, DateTime periodEnd, CancellationToken cancellationToken = default);
    }
}
