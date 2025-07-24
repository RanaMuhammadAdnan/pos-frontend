import { NextRequest, NextResponse } from 'next/server';
import sequelize from 'lib/database';
import Vendor from 'lib/models/vendor';
import 'lib/models'; // Ensure associations are loaded

export async function GET() {
  try {
    // Test database connection first
    await sequelize.authenticate();
    
    const vendors = await Vendor.findAll();
    return NextResponse.json(vendors);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ 
      error: 'Database connection failed', 
      details: error instanceof Error ? error.message : 'Unknown error',
      note: 'Please check your database configuration'
    }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Remove ID if present (should be auto-generated)
    const { id, ...vendorData } = body;
    
    const vendor = await Vendor.create(vendorData);
    
    return NextResponse.json({ success: true, data: vendor }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 