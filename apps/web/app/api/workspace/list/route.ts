import { prisma } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
    const userId = req.headers.get("x-user-id");
    
    if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    try {
        const workspaces = await prisma.workspace.findMany({
        where: {
            members: {
            some: {
                userId: userId,
            },
            },
        },
        });

        return NextResponse.json(workspaces, { status: 200 });
    } catch (error) {
        console.error("Error fetching workspaces:", error);
        return NextResponse.json({ error: "Failed to fetch workspaces" }, { status: 500 });
    }
}