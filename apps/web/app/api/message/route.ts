import { prisma } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  const { workspaceId, reciverId } = await req.json();

  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {

    const message = prisma.message.findMany({
        where: {
            workspaceId,
            receiverId: reciverId || userId,
            senderId: userId || reciverId
        }
    })

    return NextResponse.json({
      message: await message,
      currentUserId: userId
    });

  } catch (error) {
    console.error("Error fetching message:", error);
    return NextResponse.json(
      { error: "Failed to fetch message" },
      { status: 500 }
    );
  }
};
