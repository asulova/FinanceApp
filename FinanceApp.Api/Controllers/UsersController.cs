using FinanceApp.Application.Features.Users.Commands;
using FinanceApp.Application.Features.Users.Queries;
using FinanceApp.Application.Features.Authentication.Commands;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using FinanceApp.Api.Services;
using Microsoft.AspNetCore.Authorization;

namespace FinanceApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly JwtTokenService _jwtTokenService;

    public UsersController(IMediator mediator, JwtTokenService jwtTokenService)
    {
        _mediator = mediator;
        _jwtTokenService = jwtTokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterUserCommand command, CancellationToken cancellationToken)
    {
        var userId = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetByEmail), new { email = command.Email }, new { Id = userId });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginUserCommand command, CancellationToken cancellationToken)
    {
        var userId = await _mediator.Send(command, cancellationToken);
        if (userId == null)
            return Unauthorized("Invalid credentials.");
        var token = _jwtTokenService.GenerateToken(userId.Value, command.Email);
        return Ok(new { Token = token });
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetByEmail([FromQuery] string email, CancellationToken cancellationToken)
    {
        var user = await _mediator.Send(new GetUserByEmailQuery(email), cancellationToken);
        if (user == null)
            return NotFound();
        return Ok(user);
    }

    [AllowAnonymous]
    [HttpGet("list")]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var users = await _mediator.Send(new GetAllUsersQuery(), cancellationToken);
        // Project to only the fields needed by the UI
        var result = users.Select(u => new
        {
            u.Id,
            u.FirstName,
            u.LastName,
            u.Email
        });
        return Ok(result);
    }
}
