import { prisma } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const invitation = await prisma.user.findMany({
      where: {
        id: userId,
      },
      select: {
        invitations: {
          where: {
            status: "PENDING",
          },
          select: {
            id: true,
            email: true,
            inviteTo: true,
            workspace: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json(invitation[0]?.invitations ?? [], { status: 200 });
  } catch (error) {
    console.error("Error fetching invitations:", error);
    return NextResponse.json(
      { error: "Failed to fetch invitations" },
      { status: 500 }
    );
  }
};
