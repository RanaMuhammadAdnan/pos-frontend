import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      message: 'Health check successful',
      note: 'This endpoint works without database connection'
    });
  } catch (error) {
    return NextResponse.json({ 
      status: 'error', 
      message: 'Health check failed' 
    }, { status: 500 });
  }
} 