import { NextResponse } from "next/server";
// import { prisma } from "@repo/db";
// import "dotenv/config";

export async function GET() {
  // Fetch the environment variable from the Prisma client
  // const data = await prisma.user.create({
  //   data: {
  //     name: "John Doe 2 ",
  //     email: "a2@gmail.com",
  //   },
  // });
  return NextResponse.json({
    DATABASE_URL: process.env.DATABASE_URL,
  });
}
