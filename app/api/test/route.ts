import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({ 
      status: 'ok', 
      message: 'API is working correctly',
      timestamp: new Date().toISOString(),
      migration: 'successful',
      note: 'This endpoint works without database connection'
    });
  } catch (error) {
    return NextResponse.json({ 
      status: 'error', 
      message: 'API test failed' 
    }, { status: 500 });
  }
} 