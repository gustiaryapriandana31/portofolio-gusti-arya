import { NextResponse } from "next/server";

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

    const filePaths = [];
    for (const file of files) {
      if (!file.name) continue; // Skip if not a valid file

      let bytes;
      try {
        bytes = await file.arrayBuffer();
      } catch (bufErr) {
        throw new Error(`Gagal membaca buffer file ${file.name}: ${bufErr.message}`);
      }

      const buffer = Buffer.from(bytes);
      const base64String = buffer.toString("base64");
      const mimeType = file.type || "image/jpeg";
      
      // Store as Base64 Data URL
      filePaths.push(`data:${mimeType};base64,${base64String}`);
    }

    return NextResponse.json({ paths: filePaths });
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: `Gagal mengunggah berkas: ${error.message}` },
      { status: 500 }
    );
  }
}
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
