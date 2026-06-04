import { NextResponse } from 'next/server';
import { validateUser } from '@/lib/userStore';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const user = await validateUser(email, password);
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    return NextResponse.json({ email: user.email, name: user.name });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}