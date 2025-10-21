# Categories Management

This document outlines the requirements and user stories for the Categories Management feature in Milestone 3 of the FinanceApp project.

## Overview
Categories Management allows users to create, edit, delete, and view transaction categories. Categories help users organize their financial transactions for better tracking and reporting.

## Features
- Add new category
- Edit existing category
- Delete category
- List all categories
- Assign category to transactions

## User Stories

### 1. As a user, I want to add a new category so that I can organize my transactions.
- Acceptance Criteria:
  - User can enter a category name and description.
  - Category is saved and appears in the categories list.

### 2. As a user, I want to edit a category so that I can update its name or description.
- Acceptance Criteria:
  - User can modify category details.
  - Changes are saved and reflected in the categories list.

### 3. As a user, I want to delete a category so that I can remove unused or incorrect categories.
- Acceptance Criteria:
  - User can delete a category.
  - Category is removed from the categories list.
  - Transactions assigned to the deleted category are handled appropriately (e.g., reassigned or marked as uncategorized).

### 4. As a user, I want to view all categories so that I can manage and assign them to transactions.
- Acceptance Criteria:
  - User can see a list of all categories.
  - Categories are displayed with their names and descriptions.

### 5. As a user, I want to assign a category to a transaction so that my financial records are organized.
- Acceptance Criteria:
  - User can select a category when adding or editing a transaction.
  - The selected category is saved with the transaction.

## Notes
- Categories should be unique per user.
- Consider validation for duplicate category names.
- Provide user-friendly error messages for failed operations.
