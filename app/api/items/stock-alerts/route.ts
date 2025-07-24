import { NextResponse } from 'next/server';
import { Op } from 'sequelize';
import Item from 'lib/models/item';
import Vendor from 'lib/models/vendor';
import 'lib/models'; // Ensure associations are loaded

export async function GET() {
  try {
    const items = await Item.findAll({
      where: {
        currentStock: {
          [Op.lte]: { [Op.col]: 'minStockLevel' }
        },
        isActive: true
      },
      include: [
        {
          model: Vendor,
          as: 'vendor',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ],
      order: [['currentStock', 'ASC']]
    });
    
    return NextResponse.json({
      alerts: items.map(item => ({
        id: item.id,
        name: item.name,
        currentStock: item.currentStock,
        minStockLevel: item.minStockLevel,
        vendor: (item as any).vendor,
        needsRestock: item.currentStock === 0
      }))
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 