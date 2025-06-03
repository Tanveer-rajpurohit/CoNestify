import { prisma } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId");
  const fileId = searchParams.get("fileId");

  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  if (!fileId || !workspaceId) {
    return NextResponse.json(
      { error: "File ID & Workspace ID is required" },
      { status: 400 }
    );
  }

  try {
    const workspaceMember = await prisma.workspaceMember.findFirst({
      where: {
        userId,
        workspaceId,
      },
    });

    if (!workspaceMember) {
      // Redirect to /workspace if not a member
      return NextResponse.redirect(new URL("/workspace", req.url));
    }

    // If the user is a member, return the file data
    const fileData = await prisma.canvasDoc.findFirst({
      where: {
        id: fileId,
        workspaceId,
      },
    });
    return NextResponse.json(fileData);
  } catch (err) {
    console.error("Error fetching file data:", err);
    return NextResponse.json(
      { error: "Failed to fetch file data" },
      { status: 500 }
    );
  }
};
