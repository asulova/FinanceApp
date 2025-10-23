using FinanceApp.Domain.Entities;
using FinanceApp.Domain.Interfaces;
using FinanceApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace FinanceApp.Infrastructure.Repositories;

public class CategoryRepository : ICategoryRepository
{
    private readonly FinanceAppDbContext _context;

    public CategoryRepository(FinanceAppDbContext context)
    {
        _context = context;
    }

    public async Task<Category?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        => await _context.Categories.FindAsync(new object[] { id }, cancellationToken);

    public async Task<IEnumerable<Category>> GetAllAsync(CancellationToken cancellationToken = default)
        => await _context.Categories.ToListAsync(cancellationToken);

    public Task<Category> AddAsync(Category category, CancellationToken cancellationToken = default)
    {
        _context.Categories.Add(category);
        return Task.FromResult(category);
    }

    public Task UpdateAsync(Category category, CancellationToken cancellationToken = default)
    {
        _context.Categories.Update(category);
        return Task.CompletedTask;
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var category = await GetByIdAsync(id, cancellationToken);
        if (category is not null)
        {
            _context.Categories.Remove(category);
        }
    }

    public async Task<bool> ExistsByNameAsync(string name, CancellationToken cancellationToken = default)
        => await _context.Categories.AnyAsync(c => c.Name == name, cancellationToken);

    public async Task<bool> HasAssignedTransactionsAsync(int categoryId, CancellationToken cancellationToken = default)
        => await _context.Transactions.AnyAsync(t => t.CategoryId == categoryId, cancellationToken);
    
}
