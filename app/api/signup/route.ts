import { NextResponse } from 'next/server';
import { createUser, findUserByEmail } from '@/lib/userStore';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    console.log('Signup attempt:', email);

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password required' }, { status: 400 });
    }
    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }
    await createUser(name, email, password);
    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}