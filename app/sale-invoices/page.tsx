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

  return (
    <Layout>
      <SaleInvoicesContent initialData={initialData} />
    </Layout>
  );
} 