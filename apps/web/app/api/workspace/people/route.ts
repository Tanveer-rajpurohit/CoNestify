import { prisma } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req:NextRequest): Promise<NextResponse> => {
    const {workspaceId} = await req.json();
    const userId = req.headers.get("x-user-id");

     if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    try {

        const members = await prisma.workspaceMember.findMany({
            where: {
                workspaceId
            },
            select:{
                id:true,
                joinedAt:true,
                role:true,
                user:{
                    select:{
                        id:true,
                        name:true,
                        email:true,
                        image:true,
                    }
                }
            }
        });

        return NextResponse.json({
            members:members,
            currentUserId: userId
        });
        
    }catch (error) {
        console.error("Error fetching workspaces members:", error);
        return NextResponse.json({ error: "Failed to fetch workspaces members" }, { status: 500 });
    }

}