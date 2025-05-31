/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@repo/db";

function generateInviteCode(length = 12) {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);

  return Array.from(array, (byte) => ("0" + (byte % 36).toString(36)).slice(-1))
    .join("")
    .toUpperCase();
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.json();
  const { name, description, invitations } = body;

  const userId = req.headers.get("x-user-id");
  const userEmail = req.headers.get("x-user-email");

  if (!userId || !userEmail) {
    return NextResponse.json(
      { error: "User ID and email are required" },
      { status: 400 }
    );
  }

  if (!name || !description) {
    return NextResponse.json(
      { error: "Name and description are required" },
      { status: 400 }
    );
  }

  // Check if workspace with the same name already exists
  const existingWorkspace = await prisma.workspace.findFirst({
    where: { name },
  });

  if (existingWorkspace) {
    return NextResponse.json(
      { error: "Workspace with this name already exists" },
      { status: 409 }
    );
  }

  const inviteCode = generateInviteCode();
  const inviteCodeChannel = generateInviteCode();

  try {
    const workspace = await prisma.workspace.create({
      data: {
        name,
        description,
        inviteLink: inviteCode,
        members: {
          create: {
            userId: userId,
            role: "ADMIN",
          },
        },
        channels: {
          create: {
            name: `all ${name}`,
            description: "Your go-to channel for organizational resources",
            isPrivate: false,
            inviteLink: inviteCodeChannel,
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        channels: true,
      },
    });
    console.log(invitations);
    if (invitations && invitations.length > 0) {
      const Invitations = invitations.map((email: string) => ({
        email,
        workspaceId: workspace.id,
        inviteToEmail: email,
        status: "PENDING",
      }));

      await prisma.invitation.createMany({
        data: Invitations,
        skipDuplicates: true,
      });
    }

    return NextResponse.json(workspace, { status: 201 });
  } catch (error) {
    // console.error("Error creating workspace:", error);
    return NextResponse.json(
      { error: "Failed to create workspace" },
      { status: 500 }
    );
  }
}
