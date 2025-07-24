# Lib Folder

This folder contains utility functions and shared logic that can be reused across the application.

## Structure

- `auth.ts` - Authentication utilities (token management, validation)
- `api.ts` - Centralized API client with authentication and error handling

## Usage

These utilities are designed to eliminate code duplication and provide consistent behavior across the app.

### When to use:
- **auth.ts**: Any server action that needs to check authentication
- **api.ts**: Any server action that needs to make API calls

### When NOT to use:
- Component-specific logic (use local state instead)
- UI-specific utilities (put in components/common) 