import { NextRequest, NextResponse } from 'next/server';
import { SaleInvoice } from 'lib/models/saleInvoice';
import PaymentHistory from 'lib/models/paymentHistory';
import 'lib/models'; // Ensure associations are loaded

export async function POST(req: NextRequest, context: Promise<{ params: { id: string } }>) {
  try {
    const { params } = await context;
    const invoice = await SaleInvoice.findByPk(params.id);
    if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    
    const { amount, paymentMethod, notes } = await req.json();
    
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid payment amount' }, { status: 400 });
    }
    
    if (amount > invoice.remainingAmount) {
      return NextResponse.json({ error: 'Payment amount exceeds remaining amount' }, { status: 400 });
    }
    
    // Create payment record
    await PaymentHistory.create({
      saleInvoiceId: invoice.id,
      amount,
      paymentMethod: paymentMethod || 'cash',
      paymentDate: new Date(),
      notes
    });
    
    // Update invoice remaining amount
    const newRemainingAmount = invoice.remainingAmount - amount;
    const newStatus = newRemainingAmount <= 0 ? 'complete' : 'pending';
    
    await invoice.update({
      remainingAmount: newRemainingAmount,
      status: newStatus
    });
    
    return NextResponse.json({ success: true, message: 'Payment recorded successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 