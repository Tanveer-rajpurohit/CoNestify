// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const token =
    req.headers.get("authorization")?.replace("Bearer ", "") ||
    req.cookies.get("authToken")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Not authorized, token failed" },
      { status: 401 }
    );
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    // Ensure payload has id and email
    const id = (payload as any).id;
    const email = (payload as any).email;

    if (!id || !email) {
      return NextResponse.json(
        { message: "Not authorized, token missing fields" },
        { status: 401 }
      );
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", id);
    requestHeaders.set("x-user-email", email);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (err) {
    console.error("JWT verification failed:", err);
    return NextResponse.json(
      { message: "Not authorized, token failed" },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: [
    "/api/workspace/:path*",
    "/api/user/:path*",
    "/api/message",
    "/api/file/:path*",
    "/api/channel/:path*",
  ],
};
