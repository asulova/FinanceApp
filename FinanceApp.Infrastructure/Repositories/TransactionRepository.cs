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

        public async Task<IEnumerable<Transaction>> GetAllAsync(CancellationToken cancellationToken = default)
            => await _context.Transactions.ToListAsync(cancellationToken);

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
    }
}
