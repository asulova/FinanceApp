using FinanceApp.Domain.Entities;
using FinanceApp.Domain.Interfaces;
using FinanceApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace FinanceApp.Infrastructure.Repositories
{
    public class TransactionRepository : ITransactionRepository
    {
        private readonly FinanceAppDbContext _context;

        public TransactionRepository(FinanceAppDbContext context)
        {
            _context = context;
        }

        public async Task<Transaction?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
            => await _context.Transactions.FindAsync(new object[] { id }, cancellationToken);

        public Task<Transaction> AddAsync(Transaction transaction, CancellationToken cancellationToken = default)
        {
            _context.Transactions.Add(transaction);
            return Task.FromResult(transaction);
        }

        public Task UpdateAsync(Transaction transaction, CancellationToken cancellationToken = default)
        {
            _context.Transactions.Update(transaction);
            return Task.CompletedTask;
        }

        public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
        {
            var transaction = await GetByIdAsync(id, cancellationToken);
            if (transaction is not null)
            {
                _context.Transactions.Remove(transaction);
            }
        }
        
        public async Task<List<Transaction>> GetPagedSortedAsync(Guid userId, int pageNumber, int pageSize, CancellationToken cancellationToken = default)
        {
            return await _context.Transactions
                .Include(t => t.Category)
                .Where(t => t.UserId == userId)
                .OrderByDescending(t => t.Date)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);
        }
        
        public async Task<int> CountByUserAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            return await _context.Transactions.CountAsync(t => t.UserId == userId, cancellationToken);
        }

        public async Task<Dictionary<int, decimal>> GetSpendingByCategoryAsync(Guid userId, DateTime periodStart, DateTime periodEnd, CancellationToken cancellationToken = default)
        {
            // Get all EXPENSE transactions for the user within the specified period
            // Group by CategoryId and sum the amounts
            return await _context.Transactions
                .AsNoTracking()
                .Where(t => t.UserId == userId 
                    && t.Type == Domain.Constants.TransactionTypes.EXPENSE
                    && t.Date >= periodStart 
                    && t.Date <= periodEnd)
                .GroupBy(t => t.CategoryId)
                .Select(g => new { CategoryId = g.Key, TotalAmount = g.Sum(t => t.Amount) })
                .ToDictionaryAsync(x => x.CategoryId, x => x.TotalAmount, cancellationToken);
        }
    }
}
