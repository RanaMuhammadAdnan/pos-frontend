import { NextRequest, NextResponse } from 'next/server';
import Expense from 'lib/models/expense';
import 'lib/models'; // Ensure associations are loaded

export async function GET() {
  try {
    const expenses = await Expense.findAll({ order: [['date', 'DESC']] });
    return NextResponse.json({ success: true, data: expenses });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { description, amount, date } = await req.json();
    if (!description || !amount || !date) {
      return NextResponse.json({ success: false, error: 'Description, amount, and date are required' }, { status: 400 });
    }
    const expense = await Expense.create({ description, amount, date });
    return NextResponse.json({ success: true, data: expense }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create expense' }, { status: 500 });
  }
} 