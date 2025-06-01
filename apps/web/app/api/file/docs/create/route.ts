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

    try{

        const docs = await prisma.doc.create({
            data:{
                userId:userId,
                workspaceId: workspaceId,
                title:name,
                content:[]
            }
        })

        return NextResponse.json(docs, {status:200})

    }catch (error) {
        console.error("Error to creating docs:", error);
        return NextResponse.json({ error: "Failed to creating docs" }, { status: 500 });
    }
}