import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../../lib/auth';
import { Layout } from 'components/common';
import { SaleInvoicesContent } from 'components/sale-invoices';
import { getSaleInvoices } from 'actions';

export default async function SaleInvoicesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  // Fetch initial data server-side
  const initialData = await getSaleInvoices({ page: 1, limit: 10 });

  // Create the expected data structure for SaleInvoicesContent
  const serializedData = {
    success: initialData.success,
    data: initialData.data ? {
      saleInvoices: initialData.data.saleInvoices?.map(invoice => ({
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        customerId: invoice.customerId,
        invoiceDate: invoice.invoiceDate,
        subtotal: Number(invoice.subtotal),
        discountAmount: Number(invoice.discountAmount),
        netAmount: Number(invoice.netAmount || 0),
        totalAmount: Number(invoice.totalAmount),
        remainingAmount: Number(invoice.remainingAmount || 0),
        profit: Number(invoice.profit || 0),
        status: invoice.status || 'pending',
        notes: invoice.notes,
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
        customer: invoice.customer ? {
          id: invoice.customer.id,
          name: invoice.customer.name,
          email: invoice.customer.email,
          phone: invoice.customer.phone,
          address: invoice.customer.address || ''
        } : undefined
      })) || [],
      pagination: initialData.data.pagination ? {
        total: Number(initialData.data.pagination.total),
        page: Number(initialData.data.pagination.page),
        limit: Number(initialData.data.pagination.limit),
        totalPages: Number(initialData.data.pagination.totalPages)
      } : { total: 0, page: 1, limit: 10, totalPages: 0 }
    } : undefined,
    error: initialData.error
  };

  return (
    <Layout>
      <SaleInvoicesContent initialData={serializedData} />
    </Layout>
  );
} 