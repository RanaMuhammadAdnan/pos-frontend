import { NextRequest, NextResponse } from 'next/server';
import sequelize from 'lib/database';
import City from 'lib/models/city';
import 'lib/models'; // Ensure associations are loaded
import { Sequelize } from 'sequelize';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await sequelize.authenticate();
    const city = await City.findByPk(id);
    if (!city) return NextResponse.json({ success: false, error: 'City not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: city });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await sequelize.authenticate();
    const city = await City.findByPk(id);
    if (!city) return NextResponse.json({ success: false, error: 'City not found' }, { status: 404 });
    const body = await req.json();
    await city.update(body);
    return NextResponse.json({ success: true, data: city });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await sequelize.authenticate();
    const city = await City.findByPk(id);
    if (!city) return NextResponse.json({ success: false, error: 'City not found' }, { status: 404 });
    await city.destroy();
    return NextResponse.json({ success: true }); // Use 200 for JSON response
  } catch (error: any) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return NextResponse.json({ success: false, error: 'Cannot delete city: there are related customers or other records.' }, { status: 409 });
    }
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
} 