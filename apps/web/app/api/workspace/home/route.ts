import { prisma } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req:NextRequest): Promise<NextResponse> => {
    const {workspaceId} = await req.json();
    const userId = req.headers.get("x-user-id");

     if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    try {

        const workspace = prisma.workspace.findMany({
            where: {
                id: workspaceId
            },
            select:{
                id:true,
                name:true,
                description:true,
                inviteLink:true,
                createdAt:true,
                channels:{
                    select:{
                        id:true,
                        name:true,
                        description:true,
                        isPrivate:true,
                    }
                },
                members:{
                    select:{
                        id:true,
                        user:{
                            select:{
                                id:true,
                                name:true,
                                email:true,
                            }
                        },
                        role:true,
                        joinedAt:true,
                    }
                }
            }
        });

        return NextResponse.json({
            workspace:workspace,
            currentUserId: userId
        });
        
    }catch (error) {
        console.error("Error fetching workspaces members:", error);
        return NextResponse.json({ error: "Failed to fetch workspaces members" }, { status: 500 });
    }

}