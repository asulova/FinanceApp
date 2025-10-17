# Milestone 3: Transaction Management

## Backend Tasks
- Design and implement the `Transaction` entity in the Domain project.
- Create database migrations for the `Transactions` table.
- Implement CQRS commands and queries for:
  - Creating a transaction
  - Updating a transaction
  - Deleting a transaction
  - Retrieving transactions (by user, by month, by category, etc.)
- Add MediatR handlers for transaction commands/queries.
- Add validation for transaction requests (FluentValidation).
- Implement API endpoints in the Controller for all transaction operations.
- Write unit and integration tests for transaction logic and endpoints.

## Frontend Tasks
- Design and implement UI components for listing, adding, editing, and deleting transactions.
- Integrate transaction API endpoints using Axios or the existing service layer.
- Add forms for creating and editing transactions with validation.
- Display transactions by month and category.
- Add loading states, error handling, and user feedback for transaction actions.
- Write unit and integration tests for transaction components and pages.

## General
- Update documentation to reflect new transaction features.
- Review and refactor code for maintainability and scalability.

---
This milestone focuses on building out full transaction management functionality in both the backend and frontend of FinanceApp.
