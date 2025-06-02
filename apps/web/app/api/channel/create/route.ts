import { prisma } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

function generateInviteCode(length = 12) {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);

  return Array.from(array, (byte) => ("0" + (byte % 36).toString(36)).slice(-1))
    .join("")
    .toUpperCase();
}

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const { workspaceId, name, description } = await req.json();
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  if (!workspaceId || !name || !description) {
    return NextResponse.json(
      { error: "workspaceId and name is required" },
      { status: 400 }
    );
  }

  const inviteLink = generateInviteCode();

  try {
    const channel = await prisma.channel.create({
      data: {
        workspaceId,
        name,
        description,
        isPrivate: false,
        inviteLink,
      },
    });
    return NextResponse.json({ channel }, { status: 200 });
  } catch (error) {
    console.error("Error creating channel:", error);
    return NextResponse.json(
      { error: "Failed to create channel" },
      { status: 500 }
    );
  }
};
