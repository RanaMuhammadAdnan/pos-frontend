import { NextRequest, NextResponse } from 'next/server';
import sequelize from 'lib/database';
import Vendor from 'lib/models/vendor';
import 'lib/models'; // Ensure associations are loaded
import { Sequelize } from 'sequelize';

export async function GET(_req: NextRequest, context: Promise<{ params: { id: string } }>) {
  const { params } = await context;
  try {
    await sequelize.authenticate();
    const vendor = await Vendor.findByPk(params.id);
    if (!vendor) return NextResponse.json({ success: false, error: 'Vendor not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: vendor });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: Promise<{ params: { id: string } }>) {
  const { params } = await context;
  try {
    await sequelize.authenticate();
    const vendor = await Vendor.findByPk(params.id);
    if (!vendor) return NextResponse.json({ success: false, error: 'Vendor not found' }, { status: 404 });
    const body = await req.json();
    await vendor.update(body);
    return NextResponse.json({ success: true, data: vendor });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, context: Promise<{ params: { id: string } }>) {
  const { params } = await context;
  try {
    await sequelize.authenticate();
    const vendor = await Vendor.findByPk(params.id);
    if (!vendor) return NextResponse.json({ success: false, error: 'Vendor not found' }, { status: 404 });
    await vendor.destroy();
    return NextResponse.json({ success: true }, { status: 204 });
  } catch (error: any) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return NextResponse.json({ success: false, error: 'Cannot delete vendor: there are related purchase invoices or other records.' }, { status: 409 });
    }
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
} 