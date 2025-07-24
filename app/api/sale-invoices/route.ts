import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const params = new URLSearchParams();
    
    // Forward all query parameters
    for (const [key, value] of searchParams.entries()) {
      params.append(key, value);
    }

    const response = await fetch(`${API_BASE_URL}/sale-invoices?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${(session as any).accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching sale invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sale invoices' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

          const response = await fetch(`${API_BASE_URL}/sale-invoices`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${(session as any).accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating sale invoice:', error);
    return NextResponse.json(
      { error: 'Failed to create sale invoice' },
      { status: 500 }
    );
  }
} 