import { NextRequest, NextResponse } from 'next/server';
import Customer from 'lib/models/customer';
import City from 'lib/models/city';
import 'lib/models'; // Ensure associations are loaded

export async function GET() {
  try {
    const customers = await Customer.findAll({
      include: [
        {
          model: City,
          as: 'city',
          attributes: ['id', 'name', 'state', 'country'],
        },
      ],
    });
    return NextResponse.json(customers);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const customer = await Customer.create(body);
    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
} 