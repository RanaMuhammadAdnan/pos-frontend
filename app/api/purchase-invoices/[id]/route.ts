import { NextRequest, NextResponse } from 'next/server';
import PurchaseInvoice from 'lib/models/purchaseInvoice';
import PurchaseInvoiceItem from 'lib/models/purchaseInvoiceItem';
import Vendor from 'lib/models/vendor';
import Item from 'lib/models/item';
import 'lib/models'; // Ensure associations are loaded

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const invoice = await PurchaseInvoice.findByPk(params.id, {
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

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const invoice = await PurchaseInvoice.findByPk(params.id);
    if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    
    const body = await req.json();
    await invoice.update(body);
    
    const result = await PurchaseInvoice.findByPk(params.id, {
      include: [
        { model: Vendor, as: 'vendor' },
        { model: PurchaseInvoiceItem, as: 'items', include: [{ model: Item, as: 'item' }] },
      ],
    });
    
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const invoice = await PurchaseInvoice.findByPk(params.id, {
      include: [PurchaseInvoiceItem],
    });
    if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    
    // Optionally, revert stock for each item
    const invoiceItems = (invoice as any).PurchaseInvoiceItems as PurchaseInvoiceItem[];
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