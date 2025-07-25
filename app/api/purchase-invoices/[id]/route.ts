import { NextRequest, NextResponse } from 'next/server';
import PurchaseInvoice from 'lib/models/purchaseInvoice';
import PurchaseInvoiceItem from 'lib/models/purchaseInvoiceItem';
import Vendor from 'lib/models/vendor';
import Item from 'lib/models/item';
import 'lib/models'; // Ensure associations are loaded

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const invoice = await PurchaseInvoice.findByPk(id, {
      include: [
        { model: Vendor, as: 'vendor' },
        { model: PurchaseInvoiceItem, as: 'items', include: [{ model: Item, as: 'item' }] },
      ],
    });
    if (!invoice) return NextResponse.json({ success: false, error: 'Invoice not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: invoice });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { invoiceNumber, vendorId, date, items } = await req.json() as {
      invoiceNumber: string;
      vendorId: number;
      date: string;
      items: Array<{ itemId: number; quantity: number }>;
    };
    
    const invoice = await PurchaseInvoice.findByPk(id, {
      include: [{ model: PurchaseInvoiceItem, as: 'items' }],
    });
    if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    
    // Validate vendor
    if (!vendorId) {
      return NextResponse.json({ error: 'Vendor is required' }, { status: 400 });
    }
    const vendor = await Vendor.findByPk(vendorId);
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 400 });
    }
    
    // Validate items
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'At least one item is required' }, { status: 400 });
    }
    
    // Revert stock for existing items
    const existingItems = (invoice as any).items as PurchaseInvoiceItem[];
    if (existingItems) {
      for (const item of existingItems) {
        const dbItem = await Item.findByPk(item.itemId);
        if (dbItem) {
          dbItem.currentStock -= Number(item.quantity);
          await dbItem.save();
        }
        await item.destroy();
      }
    }
    
    // Update basic invoice fields
    await invoice.update({ invoiceNumber, vendorId, date: new Date(date) });
    
    // Create new items
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
    
    // Update total
    await invoice.update({ total });
    
    // Return updated invoice with associations
    const result = await PurchaseInvoice.findByPk(id, {
      include: [
        { model: Vendor, as: 'vendor' },
        { model: PurchaseInvoiceItem, as: 'items', include: [{ model: Item, as: 'item' }] },
      ],
    });
    
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const invoice = await PurchaseInvoice.findByPk(id, {
      include: [{ model: PurchaseInvoiceItem, as: 'items' }],
    });
    if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    
    // Optionally, revert stock for each item
    const invoiceItems = (invoice as any).items as PurchaseInvoiceItem[];
    if (invoiceItems) {
      for (const item of invoiceItems) {
        const dbItem = await Item.findByPk(item.itemId);
        if (dbItem) {
          dbItem.currentStock -= Number(item.quantity);
          await dbItem.save();
        }
        await item.destroy();
      }
    }
    
    await invoice.destroy();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 