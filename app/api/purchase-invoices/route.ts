import { NextRequest, NextResponse } from 'next/server';
import { buildApiUrl } from '../../../lib/api-config';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const backendUrl = buildApiUrl('purchase-invoices', url.search);
  const res = await fetch(backendUrl, { method: 'GET' });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const backendUrl = buildApiUrl('purchase-invoices');
  const res = await fetch(backendUrl, { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
} 