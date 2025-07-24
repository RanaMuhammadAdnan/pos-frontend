import { NextResponse } from 'next/server';
import { Op } from 'sequelize';
import Item from 'lib/models/item';
import 'lib/models'; // Ensure associations are loaded

export async function GET() {
  try {
    const totalItems = await Item.count({ where: { isActive: true } });
    const lowStockItems = await Item.count({
      where: {
        currentStock: {
          [Op.lte]: { [Op.col]: 'minStockLevel' }
        },
        isActive: true
      }
    });
    const outOfStockItems = await Item.count({
      where: {
        currentStock: 0,
        isActive: true
      }
    });
    
    // Calculate total value using raw SQL
    const result = await Item.sequelize?.query(
      'SELECT SUM("currentStock" * "sellingPrice") as totalValue FROM items WHERE "isActive" = true',
      { type: 'SELECT' }
    );
    const totalValue = (result?.[0]?.[0] as any)?.totalValue || 0;
    
    return NextResponse.json({
      totalItems,
      lowStockItems,
      outOfStockItems,
      totalValue: parseFloat(totalValue),
      lowStockPercentage: totalItems > 0 ? (lowStockItems / totalItems * 100).toFixed(2) : 0
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 