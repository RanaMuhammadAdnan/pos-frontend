import { NextRequest, NextResponse } from 'next/server';
import { Op } from 'sequelize';
import PurchaseInvoice from 'lib/models/purchaseInvoice';
import PurchaseInvoiceItem from 'lib/models/purchaseInvoiceItem';
import Vendor from 'lib/models/vendor';
import Item from 'lib/models/item';
import 'lib/models'; // Ensure associations are loaded

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get('search');
    const vendorId = url.searchParams.get('vendorId');
    const page = url.searchParams.get('page') || '1';
    const limit = url.searchParams.get('limit') || '10';
    
    const where: any = {};
    if (vendorId) where.vendorId = Number(vendorId);
    if (search) {
      where[Op.or] = [
        { invoiceNumber: { [Op.iLike]: `%${search}%` } },
        { '$vendor.name$': { [Op.iLike]: `%${search}%` } }
      ];
    }
    const offset = (Number(page) - 1) * Number(limit);
    const { count, rows } = await PurchaseInvoice.findAndCountAll({
      where,
      include: [
        { model: Vendor, as: 'vendor' },
        { model: PurchaseInvoiceItem, as: 'items', include: [{ model: Item, as: 'item' }] }
      ],
      order: [['date', 'DESC']],
      limit: Number(limit),
      offset,
    });
    
    return NextResponse.json({
      success: true,
      data: {
        invoices: rows,
        pagination: {
          total: count,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(count / Number(limit)),
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { invoiceNumber, vendorId, date, items } = await req.json() as {
      invoiceNumber: string;
      vendorId: number;
      date: string;
      items: Array<{ itemId: number; quantity: number }>;
    };
    
    if (!vendorId) {
      return NextResponse.json({ error: 'Vendor is required' }, { status: 400 });
    }
    const vendor = await Vendor.findByPk(vendorId);
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found or not associated to PurchaseInvoice!' }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'At least one item is required' }, { status: 400 });
    }
    
    const invoice = await PurchaseInvoice.create({ invoiceNumber, vendorId, date: new Date(date) });
    let total = 0;
    
    for (const item of items) {
      const dbItem = await Item.findByPk(item.itemId);
      if (!dbItem) return NextResponse.json({ error: `Item ${item.itemId} not found` }, { status: 400 });
      const netPrice = Number(dbItem.netPrice);
      const price = netPrice * Number(item.quantity);
      await PurchaseInvoiceItem.create({ purchaseInvoiceId: invoice.id, itemId: item.itemId, quantity: item.quantity, price });
      total += price;
      // Update item stock
      dbItem.currentStock += Number(item.quantity);
      await dbItem.save();
    }
    
    await invoice.update({ total });
    const result = await PurchaseInvoice.findByPk(invoice.id, {
      include: [
        { model: Vendor, as: 'vendor' },
        { model: PurchaseInvoiceItem, include: [Item] },
      ],
    });
    
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 