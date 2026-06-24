import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files");

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada berkas yang diunggah." },
        { status: 400 }
      );
    }

    const uploadDir = join(process.cwd(), "public", "uploads");
    
    // Ensure upload directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // Directory might already exist
    }

    const filePaths = [];
    for (const file of files) {
      if (!file.name) continue; // Skip if not a valid file

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create a unique file name
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const uniqueName = `${Date.now()}-${cleanFileName}`;
      const filePath = join(uploadDir, uniqueName);

      await writeFile(filePath, buffer);
      filePaths.push(`/uploads/${uniqueName}`);
    }

    return NextResponse.json({ paths: filePaths });
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: "Gagal mengunggah berkas." },
      { status: 500 }
    );
  }
}
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
