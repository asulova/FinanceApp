using FinanceApp.Infrastructure.Data;
using FinanceApp.Infrastructure.Repositories;
using FinanceApp.Infrastructure.UnitOfWork;
using FinanceApp.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using FinanceApp.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using FinanceApp.Application.DependencyInjection;
using FinanceApp.Api.Middleware;
using FinanceApp.Application.Common.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Add DbContext (replace with your actual connection string)
builder.Services.AddDbContext<FinanceAppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register repositories and unit of work
// Register BudgetRepository for IBudgetRepository
// DIP: Dependency Inversion Principle - Register abstraction and implementation for DI

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IBudgetRepository, BudgetRepository>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// Register Application Layer services (MediatR, AutoMapper, etc.)
builder.Services.AddApplicationServices();

// Register JwtTokenService
builder.Services.AddSingleton<JwtTokenService>();

// Add Controllers
builder.Services.AddControllers();

// Register IHttpContextAccessor for accessing HttpContext in services
builder.Services.AddHttpContextAccessor();

// Register CurrentUserService for retrieving the current user's ID
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();

// Add CORS for React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",
            "https://localhost:3000",
            "http://localhost:65262",
            "https://localhost:65262"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

// Add Microsoft's built-in OpenAPI
builder.Services.AddOpenApi();

// JWT Authentication configuration
var jwtSettings = builder.Configuration.GetSection("Jwt");
var jwtKey = jwtSettings["Key"];
var jwtIssuer = jwtSettings["Issuer"];
var jwtAudience = jwtSettings["Audience"];

// Validate JWT configuration
if (string.IsNullOrEmpty(jwtKey))
    throw new InvalidOperationException("JWT Key is not configured in appsettings.json");
if (string.IsNullOrEmpty(jwtIssuer))
    throw new InvalidOperationException("JWT Issuer is not configured in appsettings.json");
if (string.IsNullOrEmpty(jwtAudience))
    throw new InvalidOperationException("JWT Audience is not configured in appsettings.json");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

var app = builder.Build();

// Use custom exception handling middleware
app.UseMiddleware<ExceptionHandlingMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // Use Microsoft's built-in OpenAPI endpoint
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// Use CORS before authentication
app.UseCors("ReactPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
