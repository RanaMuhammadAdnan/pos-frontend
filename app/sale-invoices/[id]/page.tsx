import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../../../lib/auth';
import { Layout } from 'components/common';
import { SaleInvoiceDetailClient } from 'components/sale-invoices';
import { getSaleInvoiceById } from 'actions';

interface SaleInvoiceDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function SaleInvoiceDetailPage({ params }: SaleInvoiceDetailPageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  try {
    console.log('Fetching sale invoice with ID:', id);
    const result = await getSaleInvoiceById(Number(id));
    console.log('API result:', result);
    
    if (result.success && result.data) {
      // Serialize the data to ensure it's properly passed to client component
      const serializedData = {
        ...result.data,
        id: Number(result.data.id),
        customerId: Number(result.data.customerId),
        subtotal: Number(result.data.subtotal),
        discountAmount: Number(result.data.discountAmount),
        netAmount: Number(result.data.netAmount),
        totalAmount: Number(result.data.totalAmount),
        remainingAmount: Number(result.data.remainingAmount),
        profit: Number(result.data.profit),
        status: result.data.status || 'pending',
        invoiceDate: result.data.invoiceDate,
        createdAt: result.data.createdAt,
        updatedAt: result.data.updatedAt,
        customer: result.data.customer ? {
          id: Number(result.data.customer.id),
          name: result.data.customer.name,
          email: result.data.customer.email,
          phone: result.data.customer.phone,
          address: result.data.customer.address || ''
        } : undefined,
        items: result.data.items ? result.data.items.map((item: any) => ({
          id: Number(item.id),
          saleInvoiceId: Number(item.saleInvoiceId),
          itemId: Number(item.itemId),
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
          discount: Number(item.discount),
          total: Number(item.total),
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          item: item.item ? {
            id: Number(item.item.id),
            name: item.item.name,
            sku: item.item.sku,
            description: item.item.description,
            grossPrice: Number(item.item.grossPrice || 0),
            tax: Number(item.item.tax || 0),
            discount: Number(item.item.discount || 0),
            netPrice: Number(item.item.netPrice || 0),
            sellingPrice: Number(item.item.sellingPrice || 0),
            minStockLevel: Number(item.item.minStockLevel || 0),
            currentStock: Number(item.item.currentStock || 0),
            vendorId: item.item.vendorId,
            isActive: item.item.isActive !== undefined ? item.item.isActive : true,
            vendor: item.item.vendor ? {
              id: Number(item.item.vendor.id),
              name: item.item.vendor.name,
              phone: item.item.vendor.phone || '',
              email: item.item.vendor.email
            } : undefined
          } : undefined
        })) : []
      };

      return (
        <Layout>
          <SaleInvoiceDetailClient saleInvoice={serializedData} />
        </Layout>
      );
    } else {
      redirect('/sale-invoices');
    }
  } catch (error) {
    redirect('/sale-invoices');
  }
} 