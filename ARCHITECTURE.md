# Project Architecture

## Folder Structure

```
frontend/
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── common/            # Reusable UI components
│   ├── vendors/           # Feature-specific components
│   └── index.ts           # Barrel exports
├── actions/               # Server actions
│   ├── auth/              # Authentication actions
│   ├── vendor/            # Vendor actions
│   └── index.ts           # Barrel exports
├── types/                 # TypeScript type definitions
├── lib/                   # Utility functions and shared logic
├── atoms/                 # Global state management (Jotai)
├── hooks/                 # Custom React hooks (when needed)
└── ARCHITECTURE.md        # This file
```

## Design Principles

### 1. **Start Simple, Add Complexity When Needed**
- Use local state for component-specific data
- Only use atoms for truly global state
- Create hooks only when you see duplication
- Don't over-engineer solutions

### 2. **Component Organization**
- **common/**: Reusable UI components (buttons, forms, dialogs)
- **feature/**: Feature-specific components (vendors/, products/, etc.)
- Keep components small and focused
- Use barrel exports for clean imports

### 3. **State Management Strategy**
- **Local State**: Component-specific data, forms, UI state
- **Atoms**: Global state (auth, app settings, cart)
- **Server State**: Data fetched from API (use server actions)

### 4. **Code Reusability**
- **lib/**: Shared utilities (auth, API client)
- **hooks/**: Reusable logic (when needed)
- **common/**: Reusable UI components
- Avoid code duplication

## Decision Making

### When to Use Atoms
- ✅ User authentication state
- ✅ App-wide settings
- ✅ Global notifications
- ❌ Component-specific data
- ❌ Form state
- ❌ Page-specific filters

### When to Create Hooks
- ✅ Reusable API logic
- ✅ Complex state management
- ✅ Form validation logic
- ❌ Simple state management
- ❌ One-off utilities

### When to Create Components
- ✅ Reusable UI elements
- ✅ Complex UI logic
- ✅ Feature-specific components
- ❌ Simple JSX fragments

## Best Practices

1. **Server Components First**: Use server components when possible
2. **Client Components**: Only when you need interactivity
3. **Type Safety**: Use TypeScript interfaces for all data
4. **Error Handling**: Consistent error handling patterns
5. **Loading States**: Show loading indicators for async operations
6. **Validation**: Client and server-side validation
7. **Testing**: Write tests for critical functionality

## Future Considerations

- Add more atoms only when truly needed
- Create hooks when you see logic duplication
- Expand types as the application grows
- Consider adding a state management library only if atoms become insufficient 