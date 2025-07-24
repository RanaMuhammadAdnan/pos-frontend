# Atoms Folder

This folder contains global state management using Jotai atoms.

## Philosophy

**Only use atoms for truly global state that needs to be shared across multiple components/pages.**

## Current Atoms

- `authAtom.ts` - Authentication state (user, login status, etc.)

## When to Add New Atoms

### ✅ Good candidates for atoms:
- User authentication state
- App-wide settings/preferences
- Shopping cart (if applicable)
- Global notifications/alerts
- Theme/language preferences

### ❌ NOT good candidates for atoms:
- Component-specific data (use local state)
- Form data (use local state)
- Page-specific filters/search (use local state)
- Temporary UI state (use local state)

## Guidelines

1. **Start with local state** - Only move to atoms when you need to share state across components
2. **Keep atoms minimal** - Don't store everything globally
3. **Use computed atoms** - For derived state from other atoms
4. **Document purpose** - Each atom should have a clear reason for being global

## Example Usage

```typescript
// Good: Global auth state
const user = useAtom(userAtom);

// Bad: Local form state in global atom
const formData = useAtom(formDataAtom); // ❌ Use local state instead
``` 