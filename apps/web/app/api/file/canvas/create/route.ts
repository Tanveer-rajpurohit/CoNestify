import { prisma } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
    const { workspaceId,name} = await req.json();
    const userId = req.headers.get("x-user-id");

     if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    
    if(!workspaceId || !name){
        return NextResponse.json({ error: "workspaceId and name is required" }, { status: 400 });
    }
    //check if in that workspace file with that name already exists
    const existingCanvas = await prisma.canvasDoc.findFirst({
        where: {
            workspaceId: workspaceId,
            title: name,
            userId: userId
        }
    });
    if (existingCanvas) {
        return NextResponse.json({ error: "Canvas with that name already exists in this workspace" }, { status: 400 });
    }

    try{

        const canvas = await prisma.canvasDoc.create({
            data:{
                userId:userId,
                workspaceId: workspaceId,
                title:name,
                data:[]
            }
        })

        return NextResponse.json(canvas, {status:200})

    }catch (error) {
        console.error("Error to creating canvas:", error);
        return NextResponse.json({ error: "Failed to creating canvas" }, { status: 500 });
    }
}