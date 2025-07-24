import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sequelize from 'lib/database';
import User from 'lib/models/user';
import 'lib/models'; // Ensure associations are loaded

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    
    // Test database connection first
    await sequelize.authenticate();
    
    const user = await User.findOne({ where: { username } });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );
    
    return NextResponse.json({ token, user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ 
      error: 'Authentication failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 