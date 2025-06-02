import { prisma } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async(req:NextRequest) : Promise<NextResponse> =>{
    const {searchParams} = new URL(req.url);
    const channelId = searchParams.get("channelId");
    const workspaceId = searchParams.get("workspaceId");

    const userId = req.headers.get("x-user-id");

    if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    if (!channelId || !workspaceId) {
        return NextResponse.json({ error: "Channel ID & Workspace ID is required" }, { status: 400 });
    }

    try {
        const message = await prisma.message.findMany({
            where: {
                channelId,
                workspaceId,
            },
            include:{
                sender: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        email: true
                    }
                },
                canvas:{
                    select: {
                        id: true,
                        title: true,
                    }
                },
                list: {
                    select: {
                        id: true,
                        title: true,
                    }
                },
                doc: {
                    select: {
                        id: true,
                        title: true,
                    }
                }
            }
        });
        
        return NextResponse.json(message, { status: 200 });
    } catch (error) {
        console.error("Error fetching message:", error);
        return NextResponse.json({ error: "Failed to fetch message" }, { status: 500 });
    }

}