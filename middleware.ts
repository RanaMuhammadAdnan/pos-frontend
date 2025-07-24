import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/((?!login|api/auth|api/health|api/test|api/vendors|api/items|api/cities|api/customers|api/expenses|api/purchase-invoices|api/sale-invoices).*)'],
}; 