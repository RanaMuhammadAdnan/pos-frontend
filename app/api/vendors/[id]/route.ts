import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const backendUrl = `${API_BASE_URL}/vendors/${params.id}`;
  const res = await fetch(backendUrl, { 
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const backendUrl = `${API_BASE_URL}/vendors/${params.id}`;
  const res = await fetch(backendUrl, { method: 'DELETE' });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
} 