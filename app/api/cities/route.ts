import { NextRequest, NextResponse } from 'next/server';
import City from 'lib/models/city';
import 'lib/models'; // Ensure associations are loaded

export async function GET() {
  try {
    const cities = await City.findAll();
    return NextResponse.json({ success: true, data: cities });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const city = await City.create(body);
    return NextResponse.json(city, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}