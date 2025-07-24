# Backend Migration to Next.js API Routes

## Overview
This migration moves the entire backend from a separate Express.js application to Next.js API routes, consolidating the application into a single repository for easier maintenance and deployment.

## What Was Migrated

### 1. Database Models
All Sequelize models have been migrated from `backend/src/models/` to `frontend/lib/models/`:
- User
- Vendor
- Item
- City
- Customer
- SaleInvoice & SaleInvoiceItem
- PurchaseInvoice & PurchaseInvoiceItem
- Expense
- PaymentHistory
- Return & ReturnItem

### 2. API Routes
All Express routes have been converted to Next.js API routes:

#### Core CRUD Endpoints
- `/api/vendors` - Vendor management
- `/api/items` - Item management with stock tracking
- `/api/cities` - City management
- `/api/customers` - Customer management
- `/api/expenses` - Expense tracking
- `/api/purchase-invoices` - Purchase invoice management
- `/api/sale-invoices` - Sale invoice management

#### Special Endpoints
- `/api/items/stock-alerts` - Low stock alerts
- `/api/items/stats` - Inventory statistics
- `/api/items/[id]/stock` - Stock updates
- `/api/sale-invoices/stats` - Sales statistics
- `/api/sale-invoices/[id]/status` - Status updates
- `/api/sale-invoices/[id]/payment` - Payment recording
- `/api/sale-invoices/[id]/payment-history` - Payment history

#### Authentication
- `/api/auth/login` - User login
- `/api/auth/register` - User registration

### 3. Business Logic
All controller logic has been preserved and migrated to API route handlers:
- CRUD operations
- Complex calculations (profit, stock updates, etc.)
- Data validation
- Error handling
- Database associations

## Key Features Preserved

### 1. Database Associations
All Sequelize associations are maintained:
- Vendor ↔ Items
- Customer ↔ SaleInvoices
- City ↔ Customers
- Items ↔ InvoiceItems
- PaymentHistory ↔ SaleInvoices

### 2. Business Logic
- Stock management with automatic updates
- Profit calculations
- Payment tracking
- Status management
- Inventory alerts

### 3. Error Handling
- Consistent error responses
- Proper HTTP status codes
- Detailed error messages

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env.local` file with your database configuration:
```env
DB_NAME=pos_db
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306
DB_DIALECT=mysql
JWT_SECRET=your_jwt_secret
```

### 3. Database Setup
The database will be automatically initialized when you start the development server. Tables will be created if they don't exist.

### 4. Start Development Server
```bash
npm run dev
```

### 5. Test the Migration
```bash
node scripts/test-migration.js
```

## API Usage

### Example: Creating a Vendor
```javascript
const response = await fetch('/api/vendors', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'ABC Suppliers',
    phone: '1234567890',
    address: '123 Main St',
    email: 'contact@abcsuppliers.com'
  })
});
```

### Example: Getting Items with Stock Alerts
```javascript
const response = await fetch('/api/items/stock-alerts');
const alerts = await response.json();
```

## Benefits of This Migration

### 1. Single Repository
- Easier maintenance
- Simplified deployment
- Better version control

### 2. Improved Performance
- No network overhead between frontend and backend
- Shared dependencies
- Optimized bundling

### 3. Better Developer Experience
- Single development server
- Unified debugging
- Consistent tooling

### 4. Deployment Simplification
- Single deployment target
- No need for separate backend hosting
- Reduced infrastructure costs

## Migration Checklist

- [x] Database models migrated
- [x] API routes created
- [x] Business logic preserved
- [x] Error handling maintained
- [x] Authentication endpoints created
- [x] Database associations preserved
- [x] Frontend actions updated
- [x] Health check endpoint added
- [x] Database initialization script created

## Next Steps

1. **Test thoroughly** - Verify all functionality works as expected
2. **Update documentation** - Update any external documentation
3. **Deploy** - Deploy the consolidated application
4. **Monitor** - Monitor performance and functionality
5. **Clean up** - Remove the old backend repository once confirmed working

## Troubleshooting

### Database Connection Issues
- Verify database credentials in `.env.local`
- Ensure database server is running
- Check database permissions

### API Route Issues
- Verify Next.js development server is running
- Check browser network tab for errors
- Review server logs for detailed error messages

### Model Import Issues
- Ensure all models are properly exported from `lib/models/index.ts`
- Check import paths in API routes
- Verify Sequelize associations are correctly defined 