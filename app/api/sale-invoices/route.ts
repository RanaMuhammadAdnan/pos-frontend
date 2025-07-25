import { NextRequest, NextResponse } from 'next/server';
import { Op } from 'sequelize';
import { SaleInvoice } from 'lib/models/saleInvoice';
import { SaleInvoiceItem } from 'lib/models/saleInvoiceItem';
import Customer from 'lib/models/customer';
import Item from 'lib/models/item';
import 'lib/models'; // Ensure associations are loaded

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get('search');
    const customerId = url.searchParams.get('customerId');
    const status = url.searchParams.get('status');
    const page = url.searchParams.get('page') || '1';
    const limit = url.searchParams.get('limit') || '10';
    
    const where: any = {};
    if (customerId) where.customerId = Number(customerId);
    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { invoiceNumber: { [Op.iLike]: `%${search}%` } },
        { '$customer.name$': { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    const offset = (Number(page) - 1) * Number(limit);
    
    const { count, rows } = await SaleInvoice.findAndCountAll({
      where,
      include: [
        { model: Customer, as: 'customer' },
        { model: SaleInvoiceItem, as: 'items', include: [{ model: Item, as: 'item' }] }
      ],
      order: [['invoiceDate', 'DESC']],
      limit: Number(limit),
      offset,
    });
    
    const response = {
      success: true,
      data: {
        saleInvoices: rows,
        pagination: {
          total: count,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(count / Number(limit)),
        },
      },
    };
    
    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
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
    
    // Calculate totals
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
    
    const invoice = await SaleInvoice.create({
      invoiceNumber,
      customerId,
      invoiceDate: new Date(invoiceDate),
      subtotal,
      discountAmount: totalDiscount,
      netAmount,
      totalAmount,
      remainingAmount,
      profit: totalProfit,
      status: 'pending',
      notes
    });
    
    // Create invoice items
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
    
    const result = await SaleInvoice.findByPk(invoice.id, {
      include: [
        { model: Customer, as: 'customer' },
        { model: SaleInvoiceItem, as: 'items', include: [{ model: Item, as: 'item' }] },
      ],
    });
    
    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 