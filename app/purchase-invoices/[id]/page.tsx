import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../../../lib/auth';
import { Layout } from 'components/common';
import { PurchaseInvoiceDetailClient } from 'components/purchase-invoices/PurchaseInvoiceDetailClient';

export default async function PurchaseInvoiceDetailPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  return (
    <Layout>
      <PurchaseInvoiceDetailClient />
    </Layout>
  );
} 