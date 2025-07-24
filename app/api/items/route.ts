import { NextRequest, NextResponse } from 'next/server';
import Item from 'lib/models/item';
import Vendor from 'lib/models/vendor';
import 'lib/models'; // Ensure associations are loaded

export async function GET() {
  try {
    const items = await Item.findAll({
      include: [
        {
          model: Vendor,
          as: 'vendor',
          attributes: ['id', 'name', 'email', 'phone'],
          required: false,
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    return NextResponse.json(items);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { grossPrice, tax, discount, ...rest } = body;
    const netPrice = Number(grossPrice) + Number(tax) - Number(discount);
    const item = await Item.create({ ...rest, grossPrice, tax, discount, netPrice });
    // Include vendor information if vendorId is provided
    if (item.vendorId) {
      const vendor = await Vendor.findByPk(item.vendorId);
      const itemWithVendor = item.toJSON() as any;
      itemWithVendor.vendor = vendor;
      return NextResponse.json(itemWithVendor, { status: 201 });
    }
    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    // Log the full error for debugging
    console.error('Item creation error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Validation error',
      details: error.errors || null,
      fullError: error // Add this line for full error inspection
    }, { status: 400 });
  }
} 