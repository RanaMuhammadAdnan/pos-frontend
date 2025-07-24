import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from 'lib/models/user';
import 'lib/models'; // Ensure associations are loaded

export async function POST(req: NextRequest) {
  try {
    const { username, email, password, role } = await req.json();
    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Username, email, and password are required' }, { status: 400 });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword, role: role || 'user' });
    
    return NextResponse.json({ 
      id: user.id, 
      username: user.username, 
      email: user.email, 
      role: user.role 
    }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
} 