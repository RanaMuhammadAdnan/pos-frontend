import { NextResponse } from 'next/server';
import { Op } from 'sequelize';
import { SaleInvoice } from 'lib/models/saleInvoice';
import 'lib/models'; // Ensure associations are loaded

export async function GET() {
  try {
    const totalInvoices = await SaleInvoice.count();
    const pendingInvoices = await SaleInvoice.count({ where: { status: 'pending' } });
    const completedInvoices = await SaleInvoice.count({ where: { status: 'complete' } });
    const returnedInvoices = await SaleInvoice.count({ where: { status: 'returned' } });
    
    // Calculate total revenue
    const result = await SaleInvoice.sequelize?.query(
      'SELECT SUM("totalAmount") as totalRevenue, SUM("profit") as totalProfit FROM sale_invoices WHERE "status" = \'complete\'',
      { type: 'SELECT' }
    );
    const totalRevenue = (result?.[0]?.[0] as any)?.totalRevenue || 0;
    const totalProfit = (result?.[0]?.[0] as any)?.totalProfit || 0;
    
    // Calculate pending amount
    const pendingResult = await SaleInvoice.sequelize?.query(
      'SELECT SUM("remainingAmount") as pendingAmount FROM sale_invoices WHERE "status" = \'pending\'',
      { type: 'SELECT' }
    );
    const pendingAmount = (pendingResult?.[0]?.[0] as any)?.pendingAmount || 0;
    
    return NextResponse.json({
      totalInvoices,
      pendingInvoices,
      completedInvoices,
      returnedInvoices,
      totalRevenue: parseFloat(totalRevenue),
      totalProfit: parseFloat(totalProfit),
      pendingAmount: parseFloat(pendingAmount),
      completionRate: totalInvoices > 0 ? (completedInvoices / totalInvoices * 100).toFixed(2) : 0
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 