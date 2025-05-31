import { prisma } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const { invitationId, workspaceId } = await req.json();

        if (!workspaceId || !invitationId) {
            return NextResponse.json({ error: "Workspace ID and Invitation ID are required" }, { status: 400 });
        }
    
        const userId = req.headers.get("x-user-id");
        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const invitation = await prisma.invitation.findUnique({
            where: {
                id: invitationId,
                workspaceId: workspaceId,
            },
        });
        if (!invitation) {
            return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
        }
        if (invitation.status === "ACCEPTED") {
            return NextResponse.json({ error: "Invitation already accepted" }, { status: 409 });
        }
       

        await prisma.workspace.update({
            where: {
            id: workspaceId,
            },
            data: {
            members: {
                create: {
                    userId: userId,
                    role: "MEMBER", 
                },
            },
            },
        });

         await prisma.invitation.update({
            where: {
                id: invitationId,
            },
            data: {
                status: "ACCEPTED",
            },
        });

        console.log(`Invitation accepted for workspace ID: ${workspaceId}`);

        return NextResponse.json({ message: "Invitation accepted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error accepting invitation:", error);
        return NextResponse.json({ error: "Failed to accept invitation" }, { status: 500 });
    }
} 