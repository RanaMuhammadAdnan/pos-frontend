import { NextResponse } from 'next/server';
import PaymentHistory from 'lib/models/paymentHistory';
import 'lib/models'; // Ensure associations are loaded
import { NextRequest } from 'next/server';

export async function GET(_req: NextRequest, context: Promise<{ params: { id: string } }>) {
  try {
    const { params } = await context;
    const payments = await PaymentHistory.findAll({
      where: { saleInvoiceId: params.id },
      order: [['paymentDate', 'DESC']]
    });
    return NextResponse.json({ success: true, data: payments });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 