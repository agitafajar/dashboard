import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (email === 'admin@example.com' && password === 'password123') {
      const user = { id: '1', name: 'Administrator', email };
      return NextResponse.json(
        { token: 'demo-token-123', user },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: 'Email atau password salah' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { message: 'Payload tidak valid' },
      { status: 400 }
    );
  }
}