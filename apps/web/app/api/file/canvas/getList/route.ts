import { prisma } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req:NextRequest): Promise<NextResponse> =>{
    const {workspaceId} = await req.json();
    const userId = req.headers.get("x-user-id");
    

     if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    try{

        const canvasFile = await prisma.canvasDoc.findMany({
            where:{
                userId: userId,
                workspaceId: workspaceId
            }
        })
        return NextResponse.json(canvasFile, { status: 200 });

    }catch (error) {
        console.error("Error fetching canvas files:", error);
        return NextResponse.json({ error: "Failed to fetch canvas files" }, { status: 500 });
    }
}