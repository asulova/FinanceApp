# Milestone 1: Project Initialization

## Backend Setup
- Set up .NET 10 solution and created core projects:
  - FinanceApp.Api (Web API)
  - FinanceApp.Application (CQRS, MediatR handlers, validators)
  - FinanceApp.Domain (Entities, value objects)
  - FinanceApp.Infrastructure (EF Core, DB config)
  - FinanceApp.Tests (unit/integration tests)
- Configured Entity Framework Core and initial database context.
- Implemented basic authentication endpoints (register, login) with JWT support.
- Added MediatR and CQRS pattern for command/query separation.
- Set up FluentValidation for request validation.

## Frontend Setup
- Initialized React app (FinanceApp.UI) with Vite or Create React App.
- Set up project structure: components, pages, services, context, hooks, types.
- Added Material UI for styling.
- Implemented authentication pages (Login, Register) and API integration with Axios.
- Configured React Router for navigation.

## General
- Added README.md with project overview and tech stack.
- Set up initial folder structure for scalability.
- Added basic unit tests for backend and frontend components.
