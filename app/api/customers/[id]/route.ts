import { NextRequest, NextResponse } from 'next/server';
import sequelize from 'lib/database';
import Customer from 'lib/models/customer';
import City from 'lib/models/city';
import 'lib/models'; // Ensure associations are loaded
import { Sequelize } from 'sequelize';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await sequelize.authenticate();
    const customer = await Customer.findByPk(id, {
      include: [
        {
          model: City,
          as: 'city',
          attributes: ['id', 'name', 'state', 'country'],
        },
      ],
    });
    if (!customer) return NextResponse.json({ success: false, error: 'Customer not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: customer });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await sequelize.authenticate();
    const customer = await Customer.findByPk(id);
    if (!customer) return NextResponse.json({ success: false, error: 'Customer not found' }, { status: 404 });
    const body = await req.json();
    await customer.update(body);
    return NextResponse.json({ success: true, data: customer });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await sequelize.authenticate();
    const customer = await Customer.findByPk(id);
    if (!customer) return NextResponse.json({ success: false, error: 'Customer not found' }, { status: 404 });
    await customer.destroy();
    return NextResponse.json({ success: true }); // Use 200 for JSON response
  } catch (error: any) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return NextResponse.json({ success: false, error: 'Cannot delete customer: there are related invoices or other records.' }, { status: 409 });
    }
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
} 