import { NextRequest, NextResponse } from 'next/server';
import Item from 'lib/models/item';
import 'lib/models'; // Ensure associations are loaded

export async function PATCH(req: NextRequest, context: Promise<{ params: { id: string } }>) {
  try {
    const { params } = await context;
    const item = await Item.findByPk(params.id);
    if (!item) return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
    
    const { operation, quantity } = await req.json();
    
    if (!['add', 'subtract', 'set'].includes(operation)) {
      return NextResponse.json({ success: false, error: "Invalid operation. Use: add, subtract, or set", received: operation }, { status: 400 });
    }
    
    if (!quantity || quantity < 0) {
      return NextResponse.json({ success: false, error: 'Invalid quantity' }, { status: 400 });
    }
    
    const previousStock = item.currentStock;
    let newStock = previousStock;
    
    if (operation === 'add') {
      newStock = previousStock + quantity;
    } else if (operation === 'subtract') {
      if (previousStock < quantity) {
        return NextResponse.json({ success: false, error: 'Insufficient stock' }, { status: 400 });
      }
      newStock = previousStock - quantity;
    } else if (operation === 'set') {
      newStock = quantity;
    }
    
    await item.update({ currentStock: newStock });
    
    return NextResponse.json({ success: true, data: { previousStock, newStock } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 