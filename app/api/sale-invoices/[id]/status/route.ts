import { NextRequest, NextResponse } from 'next/server';
import { SaleInvoice } from 'lib/models/saleInvoice';
import 'lib/models'; // Ensure associations are loaded

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const invoice = await SaleInvoice.findByPk(id);
    if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    
    const { status } = await req.json();
    
    if (!['pending', 'complete', 'returned'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    
    await invoice.update({ status });
    
    return NextResponse.json({ success: true, message: 'Status updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 