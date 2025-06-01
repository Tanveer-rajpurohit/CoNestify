import { prisma } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req:NextRequest): Promise<NextResponse> =>{
    const {workspaceId} = await req.json();
    const userId = req.headers.get("x-user-id");
    

     if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    try{

        const docsFile = await prisma.doc.findMany({
            where:{
                userId: userId,
                workspaceId: workspaceId
            }
        })
        return NextResponse.json(docsFile, { status: 200 });

    }catch (error) {
        console.error("Error fetching docs files:", error);
        return NextResponse.json({ error: "Failed to fetch docs files" }, { status: 500 });
    }
}