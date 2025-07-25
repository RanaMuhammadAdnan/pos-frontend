import { NextResponse } from 'next/server';
import PaymentHistory from 'lib/models/paymentHistory';
import 'lib/models'; // Ensure associations are loaded
import { NextRequest } from 'next/server';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const payments = await PaymentHistory.findAll({
      where: { saleInvoiceId: id },
      order: [['paymentDate', 'DESC']]
    });
    
    // Return the expected structure with invoice and paymentHistory
    return NextResponse.json({ 
      success: true, 
      data: {
        invoice: null, // We don't need invoice data here since it's passed separately
        paymentHistory: payments
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 