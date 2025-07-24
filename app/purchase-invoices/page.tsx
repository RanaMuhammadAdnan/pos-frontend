import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../../lib/auth';
import { Layout } from 'components/common';
import { PurchaseInvoiceListClient } from 'components/purchase-invoices/PurchaseInvoiceListClient';

interface PurchaseInvoicesPageProps {
  searchParams: Promise<{
    vendorId?: string;
    vendorName?: string;
  }>;
}

export default async function PurchaseInvoicesPage({ searchParams }: PurchaseInvoicesPageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  const resolvedSearchParams = await searchParams;
  const vendorFilter = {
    vendorId: resolvedSearchParams?.vendorId,
    vendorName: resolvedSearchParams?.vendorName ? decodeURIComponent(resolvedSearchParams.vendorName) : undefined,
  };

  return (
    <Layout>
      <PurchaseInvoiceListClient vendorFilter={vendorFilter} />
    </Layout>
  );
} 