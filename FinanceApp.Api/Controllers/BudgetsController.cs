using FinanceApp.Application.Features.Budgets.Commands;
using FinanceApp.Application.Features.Budgets.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using System;

namespace FinanceApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    // SRP: Single Responsibility Principle - This controller only handles budget-related API endpoints
    // DIP: Dependency Inversion Principle - Depends on IMediator abstraction for business logic
    // CQRS: Uses command for creation and query for retrieval
    // Result Pattern: Handles Result<T> responses for consistent API feedback
    public class BudgetsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public BudgetsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Creates a new budget for the current user.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateBudgetCommand command, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(command, cancellationToken);
            // Result Pattern: Return success or error based on Result<T>
            if (result.Success)
                return CreatedAtAction(nameof(Create), new { id = result.Data }, result);
            return BadRequest(result.Message);
        }

        /// <summary>
        /// Gets all budgets for the current user.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> Get(CancellationToken cancellationToken)
        {
            // Get userId from claims (assumes authentication is in place)
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }
            var query = new GetBudgetsByUserQuery(userId);
            var result = await _mediator.Send(query, cancellationToken);
            // Result Pattern: Return success or error based on Result<T>
            if (result.Success)
                return Ok(result.Data);
            return NotFound(result.Message);
        }

        /// <summary>
        /// Gets a single budget by ID.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(new GetBudgetByIdQuery(id), cancellationToken);
            // Result Pattern: Return success or error based on Result<T>
            if (result.Success)
                return Ok(result.Data);
            return NotFound(result.Message);
        }
    }
}
