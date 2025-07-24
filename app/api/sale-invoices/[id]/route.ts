import { NextRequest, NextResponse } from 'next/server';
import { SaleInvoice } from 'lib/models/saleInvoice';
import { SaleInvoiceItem } from 'lib/models/saleInvoiceItem';
import Customer from 'lib/models/customer';
import Item from 'lib/models/item';
import 'lib/models'; // Ensure associations are loaded

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const invoice = await SaleInvoice.findByPk(id, {
      include: [
        { model: Customer, as: 'customer' },
        { model: SaleInvoiceItem, as: 'items', include: [{ model: Item, as: 'item' }] },
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
    const invoice = await SaleInvoice.findByPk(id, {
      include: [{ model: SaleInvoiceItem, as: 'items' }],
    });
    if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    
    const { invoiceNumber, customerId, invoiceDate, items, notes } = await req.json() as {
      invoiceNumber: string;
      customerId: number;
      invoiceDate: string;
      items: Array<{ itemId: number; quantity: number; discount?: number }>;
      notes?: string;
    };
    
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'At least one item is required' }, { status: 400 });
    }
    
    // Revert stock for existing items
    const existingItems = (invoice as any).items as SaleInvoiceItem[];
    if (existingItems) {
      for (const item of existingItems) {
        const dbItem = await Item.findByPk(item.itemId);
        if (dbItem) {
          dbItem.currentStock += Number(item.quantity);
          await dbItem.save();
        }
      }
    }
    
    // Delete existing invoice items
    await SaleInvoiceItem.destroy({ where: { saleInvoiceId: invoice.id } });
    
    // Calculate new totals
    let subtotal = 0;
    let totalProfit = 0;
    let totalDiscount = 0;
    
    for (const item of items) {
      const dbItem = await Item.findByPk(item.itemId);
      if (!dbItem) return NextResponse.json({ error: `Item ${item.itemId} not found` }, { status: 400 });
      if (dbItem.currentStock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for item ${dbItem.name}` }, { status: 400 });
      }
      
      const unitPrice = Number(dbItem.sellingPrice);
      const discountPerUnit = Number(item.discount || 0);
      const itemSubtotal = unitPrice * item.quantity;
      const itemDiscount = discountPerUnit * item.quantity;
      const itemTotal = itemSubtotal - itemDiscount;
      
      subtotal += itemSubtotal;
      totalDiscount += itemDiscount;
      
      // Calculate profit (selling price - net price)
      const profitPerUnit = unitPrice - Number(dbItem.netPrice);
      totalProfit += profitPerUnit * item.quantity;
      
      // Update stock
      dbItem.currentStock -= item.quantity;
      await dbItem.save();
    }
    
    const netAmount = subtotal - totalDiscount;
    const totalAmount = netAmount;
    const remainingAmount = totalAmount;
    
    // Update invoice
    await invoice.update({
      invoiceNumber,
      customerId,
      invoiceDate: new Date(invoiceDate),
      subtotal,
      discountAmount: totalDiscount,
      netAmount,
      totalAmount,
      remainingAmount,
      profit: totalProfit,
      notes
    });
    
    // Create new invoice items
    for (const item of items) {
      const dbItem = await Item.findByPk(item.itemId);
      const unitPrice = Number(dbItem!.sellingPrice);
      const discountPerUnit = Number(item.discount || 0);
      const itemSubtotal = unitPrice * item.quantity;
      const itemDiscount = discountPerUnit * item.quantity;
      const total = itemSubtotal - itemDiscount;
      
      await SaleInvoiceItem.create({
        saleInvoiceId: invoice.id,
        itemId: item.itemId,
        quantity: item.quantity,
        unitPrice,
        discount: itemDiscount,
        total
      });
    }
    
    const result = await SaleInvoice.findByPk(id, {
      include: [
        { model: Customer, as: 'customer' },
        { model: SaleInvoiceItem, as: 'items', include: [{ model: Item, as: 'item' }] },
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
    const invoice = await SaleInvoice.findByPk(id, {
      include: [{ model: SaleInvoiceItem, as: 'items' }],
    });
    if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    
    // Revert stock for each item
    const invoiceItems = (invoice as any).items as SaleInvoiceItem[];
    if (invoiceItems) {
      for (const item of invoiceItems) {
        const dbItem = await Item.findByPk(item.itemId);
        if (dbItem) {
          dbItem.currentStock += Number(item.quantity);
          await dbItem.save();
        }
        await item.destroy();
      }
    }
    
    await invoice.destroy();
    return NextResponse.json({ message: 'Sale invoice deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 