using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using FluentValidation;
using FinanceApp.Domain.Exceptions;

namespace FinanceApp.Api.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred.");
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            ProblemDetails problemDetails;
            int statusCode;

            switch (exception)
            {
                case ValidationException validationException:
                    statusCode = StatusCodes.Status400BadRequest;
                    problemDetails = new ValidationProblemDetails(
                        validationException.Errors
                            .GroupBy(e => e.PropertyName)
                            .ToDictionary(
                                g => g.Key,
                                g => g.Select(e => e.ErrorMessage).ToArray()
                            )
                    )
                    {
                        Title = "Validation failed",
                        Status = statusCode,
                        Type = "https://tools.ietf.org/html/rfc7231#section-6.5.1",
                        Detail = validationException.Message
                    };
                    break;
                case DomainException domainException:
                    statusCode = StatusCodes.Status409Conflict;
                    problemDetails = new ProblemDetails
                    {
                        Title = domainException.GetType().Name,
                        Status = statusCode,
                        Type = "https://tools.ietf.org/html/rfc7231#section-6.5.8",
                        Detail = domainException.Message
                    };
                    break;
                default:
                    statusCode = StatusCodes.Status500InternalServerError;
                    problemDetails = new ProblemDetails
                    {
                        Title = exception.GetType().Name,
                        Status = statusCode,
                        Type = "https://tools.ietf.org/html/rfc7231#section-6.6.1",
                        Detail = exception.Message
                    };
                    break;
            }

            var result = JsonSerializer.Serialize(problemDetails);
            context.Response.ContentType = "application/problem+json";
            context.Response.StatusCode = statusCode;
            return context.Response.WriteAsync(result);
        }
    }
}
