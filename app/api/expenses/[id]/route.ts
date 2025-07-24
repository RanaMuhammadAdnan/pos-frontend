import { NextRequest, NextResponse } from 'next/server';
import Expense from 'lib/models/expense';
import 'lib/models'; // Ensure associations are loaded

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const expense = await Expense.findByPk(id);
    if (!expense) return NextResponse.json({ success: false, error: 'Expense not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: expense });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch expense' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const expense = await Expense.findByPk(id);
    if (!expense) return NextResponse.json({ success: false, error: 'Expense not found' }, { status: 404 });
    const { description, amount, date } = await req.json();
    await expense.update({ description, amount, date });
    return NextResponse.json({ success: true, data: expense });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update expense' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const expense = await Expense.findByPk(id);
    if (!expense) return NextResponse.json({ success: false, error: 'Expense not found' }, { status: 404 });
    await expense.destroy();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete expense' }, { status: 500 });
  }
} 