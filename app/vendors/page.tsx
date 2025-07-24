import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../../lib/auth';
import { getVendorsAction } from 'actions';
import { VendorsContent } from 'components/vendors';
import { Layout } from 'components/common/Layout';

export default async function VendorsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }
  
  const result = await getVendorsAction();

  return (
    <Layout title="Vendors">
      <VendorsContent initialData={result} />
    </Layout>
  );
} 