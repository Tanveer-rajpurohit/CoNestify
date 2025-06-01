import { prisma } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";
export const GET = async (req: NextRequest): Promise<NextResponse> => {
  const { workspaceId } = await req.json();
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }
  try {
    const [docs, canvases, lists, files] = await Promise.all([
      prisma.doc.findMany({
        where: { workspaceId },
        select: {
          id: true,
          title: true,
          createdAt: true,
        },
      }),
      prisma.canvasDoc.findMany({
        where: { workspaceId },
        select: {
          id: true,
          title: true,
          createdAt: true,
        },
      }),
      prisma.list.findMany({
        where: { workspaceId },
        select: {
          id: true,
          title: true,
          createdAt: true,
        },
      }),
      prisma.file.findMany({
        where: {
          channel: { workspaceId },
        },
        select: { id: true, name: true, createdAt: true, type: true },
      }),
    ]);

    const normalizedDocs = docs.map((d) => ({
      ...d,
      type: "doc",
      name: d.title,
    }));
    const normalizedCanvases = canvases.map((c) => ({
      ...c,
      type: "canvas",
      name: c.title,
    }));
    const normalizedLists = lists.map((l) => ({
      ...l,
      type: "list",
      name: l.title,
    }));
    const normalizedFiles = files.map((f) => ({
      ...f,
      type: f.type || "file",
      name: f.name,
    }));
    const data = [
      ...normalizedDocs,
      ...normalizedCanvases,
      ...normalizedLists,
      ...normalizedFiles,
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching files:", error);
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 }
    );
  }
};