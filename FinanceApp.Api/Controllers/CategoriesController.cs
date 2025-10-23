using FinanceApp.Application.Features.Categories.Commands;
using FinanceApp.Application.Features.Categories.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinanceApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CategoriesController : ControllerBase
{
    private readonly IMediator _mediator;

    public CategoriesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCategoryCommand command, CancellationToken cancellationToken)
    {
        var id = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(Create), new { id }, new { Id = id });
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var categories = await _mediator.Send(new GetAllCategoriesQuery(), cancellationToken);
        return Ok(categories);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new DeleteCategoryCommand(id), cancellationToken);
        if (result.Success && result.Data == true)
            return NoContent();
        if (result.Message == "Category not found.")
            return NotFound(new { message = result.Message });
        if (result.Message == "Category cannot be deleted because it has assigned transactions.")
            return Conflict(new { message = result.Message });
        return BadRequest(new { message = result.Message ?? "Failed to delete category." });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Edit(int id, [FromBody] EditCategoryCommand command, CancellationToken cancellationToken)
    {
        command.CategoryId = id;
        var result = await _mediator.Send(command, cancellationToken);
        if (result.Success && result.Data == true)
            return Ok(new { message = result.Message });
        if (result.Message == "Category not found.")
            return NotFound(new { message = result.Message });
        return BadRequest(new { message = result.Message ?? "Failed to update category." });
    }
}
