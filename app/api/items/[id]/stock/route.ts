import { NextRequest, NextResponse } from 'next/server';
import { buildApiUrl } from '../../../../../lib/api-config';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const backendUrl = buildApiUrl(`items/${params.id}/stock`);
  const res = await fetch(backendUrl, { 
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
} 