import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const response = await fetch(`${API_BASE_URL}/sale-invoices/stats`, {
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
    console.error('Error fetching sale invoice stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sale invoice statistics' },
      { status: 500 }
    );
  }
} 