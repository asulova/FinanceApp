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

        public async Task AddAsync(Budget budget)
        {
            await _context.Budgets.AddAsync(budget);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Budget budget)
        {
            _context.Budgets.Update(budget);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int budgetId)
        {
            var budget = await _context.Budgets.FindAsync(budgetId);
            if (budget != null)
            {
                _context.Budgets.Remove(budget);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<Budget> GetByIdAsync(int budgetId)
        {
            return await _context.Budgets.FindAsync(budgetId);
        }

        public async Task<IEnumerable<Budget>> GetByUserIdAsync(Guid userId)
        {
            return await _context.Budgets
                .AsNoTracking()
                .Where(b => b.UserId == userId)
                .ToListAsync();
        }
    }
}
