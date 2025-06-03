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

       const existinglist = await prisma.list.findFirst({
        where: {
            workspaceId: workspaceId,
            title: name,
            userId: userId
        }
    });
    if (existinglist) {
        return NextResponse.json({ error: "List with that name already exists in this workspace" }, { status: 400 });
    }

    try{

        const list = await prisma.list.create({
            data:{
                userId:userId,
                workspaceId: workspaceId,
                title:name,
            }
        })

        return NextResponse.json(list, {status:200})

    }catch (error) {
        console.error("Error to creating list:", error);
        return NextResponse.json({ error: "Failed to creating list" }, { status: 500 });
    }
}