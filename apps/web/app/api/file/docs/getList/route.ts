import { prisma } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const { workspaceId } = await req.json();
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
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

    const docsFile = await prisma.doc.findMany({
      where: {
        workspaceId: workspaceId,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
    return NextResponse.json(docsFile, { status: 200 });
  } catch (error) {
    console.error("Error fetching docs files:", error);
    return NextResponse.json(
      { error: "Failed to fetch docs files" },
      { status: 500 }
    );
  }
};
