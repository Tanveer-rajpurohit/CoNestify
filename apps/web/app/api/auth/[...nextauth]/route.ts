import { NextResponse } from 'next/server';
import { prisma } from '@repo/db';
import { SignJWT } from 'jose';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 400 });
    }

    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const googleId = payload['sub'];
    const email = payload['email'] || '';
    const name = payload['name'];
    const picture = payload['picture'] || '';

    let user = await prisma.user.findUnique({
      where: { googleId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          googleId,
          email,
          name,
          image: picture,
        },
      });
    }

   const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const jwtToken = await new SignJWT({ id: user.id, email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d')
      .sign(secret);


    return NextResponse.json({ jwt: jwtToken });
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  }
}