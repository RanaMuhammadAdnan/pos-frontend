import { NextRequest, NextResponse } from 'next/server';
import sequelize from 'lib/database';
import Item from 'lib/models/item';
import Vendor from 'lib/models/vendor';
import 'lib/models'; // Ensure associations are loaded
import { Sequelize } from 'sequelize';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await sequelize.authenticate();
    const item = await Item.findByPk(id, {
      include: [
        {
          model: Vendor,
          as: 'vendor',
          attributes: ['id', 'name', 'email', 'phone'],
          required: false,
        }
      ]
    });
    if (!item) {
      return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await sequelize.authenticate();
    const item = await Item.findByPk(id);
    if (!item) {
      return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
    }
    const body = await req.json();
    const { grossPrice, tax, discount, ...rest } = body;
    const netPrice = Number(grossPrice) + Number(tax) - Number(discount);
    await item.update({ ...rest, grossPrice, tax, discount, netPrice });
    // Include vendor information if vendorId is provided
    if (item.vendorId) {
      const vendor = await Vendor.findByPk(item.vendorId);
      const itemWithVendor = item.toJSON() as any;
      itemWithVendor.vendor = vendor;
      return NextResponse.json({ success: true, data: itemWithVendor });
    }
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await sequelize.authenticate();
    const item = await Item.findByPk(id);
    if (!item) {
      return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
    }
    await item.destroy();
    return NextResponse.json({ success: true }); // Use 200 for JSON response
  } catch (error: any) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return NextResponse.json({ success: false, error: 'Cannot delete item: there are related invoices or other records.' }, { status: 409 });
    }
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
} 