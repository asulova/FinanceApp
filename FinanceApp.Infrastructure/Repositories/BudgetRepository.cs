using FinanceApp.Domain.Entities;
using FinanceApp.Domain.Interfaces;
using FinanceApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FinanceApp.Infrastructure.Repositories
{
    // Repository Pattern: Encapsulates data access for Budget entity
    // SRP: Handles only budget-related data operations
    // DIP: Implements IBudgetRepository abstraction
    public class BudgetRepository : IBudgetRepository
    {
        private readonly FinanceAppDbContext _context;
        public BudgetRepository(FinanceAppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Budget budget, CancellationToken cancellationToken = default)
        {
            await _context.Budgets.AddAsync(budget, cancellationToken);
        }

        public Task UpdateAsync(Budget budget, CancellationToken cancellationToken = default)
        {
            _context.Budgets.Update(budget);
            return Task.CompletedTask;
        }

        public async Task DeleteAsync(int budgetId, CancellationToken cancellationToken = default)
        {
            var budget = await _context.Budgets.FindAsync([budgetId], cancellationToken);
            if (budget != null)
            {
                _context.Budgets.Remove(budget);
            }
        }

        public async Task<Budget?> GetByIdAsync(int budgetId, CancellationToken cancellationToken = default)
        {
            return await _context.Budgets.FindAsync([budgetId], cancellationToken);
        }

        public async Task<IEnumerable<Budget>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            return await _context.Budgets
                .AsNoTracking()
                .Where(b => b.UserId == userId)
                .ToListAsync(cancellationToken);
        }
    }
}
