using FinanceApp.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FinanceApp.Domain.Interfaces
{
    // ISP: Interface Segregation Principle - only budget-related methods are exposed
    // OCP: Open/Closed Principle - new methods for budget strategies can be added via extension, not modification
    // DIP: Dependency Inversion Principle - consumers depend on this abstraction, not concrete implementations
    public interface IBudgetRepository
    {
        Task AddAsync(Budget budget, CancellationToken cancellationToken = default); // SRP: Handles only adding a budget
        Task UpdateAsync(Budget budget, CancellationToken cancellationToken = default); // SRP: Handles only updating a budget
        Task DeleteAsync(int budgetId, CancellationToken cancellationToken = default); // SRP: Handles only deleting a budget
        Task<Budget?> GetByIdAsync(int budgetId, CancellationToken cancellationToken = default); // SRP: Handles only retrieving a budget by ID
        Task<IEnumerable<Budget>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default); // SRP: Handles only retrieving budgets for a user
    }
}
