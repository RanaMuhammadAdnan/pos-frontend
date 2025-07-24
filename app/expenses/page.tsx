import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../../lib/auth';
import { Layout } from 'components/common/Layout';
import { ExpensesContent } from 'components/expenses';

export default async function ExpensesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  return (
    <Layout title="Expenses">
      <ExpensesContent />
    </Layout>
  );
} 