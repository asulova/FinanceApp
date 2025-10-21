using FinanceApp.Application.Features.Users.Commands;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using FluentValidation;
using FinanceApp.Application.Common.Behaviors;
using MediatR;

namespace FinanceApp.Application.DependencyInjection
{
    public static class ApplicationServiceRegistration
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));

            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

            services.AddAutoMapper(cfg => { }, Assembly.GetExecutingAssembly());

            // Register MediatR pipeline behaviors
            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));

            return services;
        }
    }
}
