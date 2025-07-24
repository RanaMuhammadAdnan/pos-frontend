import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const backendUrl = `${API_BASE_URL}/vendors${url.search}`;
  const res = await fetch(backendUrl, { method: 'GET' });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const backendUrl = `${API_BASE_URL}/vendors`;
  const res = await fetch(backendUrl, { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
} 