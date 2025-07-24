# Hooks Folder

This folder contains custom React hooks for reusable logic.

## Philosophy

**Create hooks when you have logic that can be reused across multiple components.**

## When to Create Hooks

### ✅ Good candidates for hooks:
- API calls with loading/error states
- Form validation logic
- Local storage operations
- Complex state management logic
- Reusable business logic

### ❌ NOT good candidates for hooks:
- Simple state management (use useState directly)
- Component-specific logic
- One-off utilities (put in lib/)

## Structure

```
hooks/
├── useApi.ts          # API call hooks (when needed)
├── useForm.ts         # Form management hooks (when needed)
├── useLocalStorage.ts # Local storage hooks (when needed)
└── README.md
```

## Guidelines

1. **Start simple** - Don't create hooks prematurely
2. **Extract when needed** - Only create hooks when you see duplication
3. **Keep focused** - Each hook should have a single responsibility
4. **Follow naming** - Use `use` prefix and descriptive names

## Example

```typescript
// Good: Reusable API hook
const useVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const fetchVendors = async () => {
    // Implementation
  };
  
  return { vendors, loading, fetchVendors };
};

// Bad: Simple state doesn't need a hook
const useCounter = () => {
  const [count, setCount] = useState(0);
  return { count, setCount }; // ❌ Just use useState directly
};
``` 