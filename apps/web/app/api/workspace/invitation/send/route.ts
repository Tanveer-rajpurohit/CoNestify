import { prisma } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
    const { workspaceId, emails } = await req.json();
    const userId = req.headers.get("x-user-id");

    if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    if (!workspaceId || !emails) {
        return NextResponse.json({ error: "workspaceId and email is required" }, { status: 400 });
    }

    try {
         if (emails && emails.length > 0) {
              const Invitations = emails.map((email: string) => ({
                email,
                workspaceId,
                inviteToEmail: email,
                status: "PENDING",
              }));
        
              await prisma.invitation.createMany({
                data: Invitations,
                skipDuplicates: true,
              });
            }
        return NextResponse.json({ message: "Invitation sent successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error sending invitation:", error);
        return NextResponse.json({ error: "Failed to send invitation" }, { status: 500 });
    }
}