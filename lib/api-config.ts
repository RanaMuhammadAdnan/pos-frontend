// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Helper function to build API URLs
export const buildApiUrl = (endpoint: string, searchParams?: string) => {
  const baseUrl = API_BASE_URL.replace(/\/$/, ''); // Remove trailing slash
  const cleanEndpoint = endpoint.replace(/^\//, ''); // Remove leading slash
  const url = `${baseUrl}/${cleanEndpoint}`;
  return searchParams ? `${url}${searchParams}` : url;
}; 