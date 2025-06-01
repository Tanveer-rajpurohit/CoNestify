import { prisma } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req:NextRequest): Promise<NextResponse> =>{
    const {workspaceId} = await req.json();
    const userId = req.headers.get("x-user-id");
    

     if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    try{

        const listFile = await prisma.list.findMany({
            where:{
                userId: userId,
                workspaceId: workspaceId
            }
        })
        return NextResponse.json(listFile, { status: 200 });

    }catch (error) {
        console.error("Error fetching list files:", error);
        return NextResponse.json({ error: "Failed to fetch list files" }, { status: 500 });
    }
}