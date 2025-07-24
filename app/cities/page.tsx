import { getCitiesAction } from 'actions';
import { CitiesContent } from 'components/cities';
import { Layout } from 'components/common/Layout';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../../lib/auth';
import { City } from 'types/city';

export default async function CitiesPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }

  const result = await getCitiesAction();
  // Now result is always a flat CityResponse
  const serializedData = result.success && Array.isArray(result.data)
    ? {
        success: true,
        data: result.data.map((city: City) => ({
          id: city.id,
          name: city.name,
          state: city.state,
          country: city.country,
          createdAt: city.createdAt,
          updatedAt: city.updatedAt,
        })),
      }
    : {
        success: false,
        error: result.error,
      };

  return (
    <Layout title="Cities">
      <CitiesContent initialData={serializedData} />
    </Layout>
  );
} 