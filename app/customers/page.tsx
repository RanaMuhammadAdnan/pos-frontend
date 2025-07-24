import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../../lib/auth';
import { getCustomersAction } from 'actions';
import { CustomersContent } from 'components/customers';
import { Layout } from 'components/common/Layout';

export default async function CustomersPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  const result = await getCustomersAction();


  return (
    <Layout title="Customers">
      <CustomersContent initialData={result} />
    </Layout>
  );
} 