import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import * as fs from "fs/promises";

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

      let bytes;
      try {
        bytes = await file.arrayBuffer();
      } catch (bufErr) {
        throw new Error(`Gagal membaca buffer file ${file.name}: ${bufErr.message}`);
      }

      const buffer = Buffer.from(bytes);

      // Create a unique file name and limit its length to avoid Windows MAX_PATH issues
      const originalName = file.name;
      const lastDot = originalName.lastIndexOf(".");
      const extension = lastDot !== -1 ? originalName.substring(lastDot + 1) : "";
      const baseName = lastDot !== -1 ? originalName.substring(0, lastDot) : originalName;
      
      const cleanBaseName = baseName.replace(/[^a-zA-Z0-9-]/g, "_").substring(0, 50);
      const uniqueName = `${Date.now()}-${cleanBaseName}${extension ? "." + extension : ""}`;
      const filePath = join(uploadDir, uniqueName);

      try {
        await writeFile(filePath, buffer);
      } catch (writeErr) {
        throw new Error(`Gagal menulis file ke ${filePath}: ${writeErr.message}`);
      }

      filePaths.push(`/uploads/${uniqueName}`);
    }

    return NextResponse.json({ paths: filePaths });
  } catch (error) {
    console.error("Upload API error:", error);
    
    // Write detailed log file for diagnostic purposes
    try {
      const errorLogPath = join(process.cwd(), "upload_error.log");
      const errorLogContent = `[${new Date().toISOString()}] Upload failed:\nMessage: ${error.message}\nStack: ${error.stack}\n\n`;
      await fs.appendFile(errorLogPath, errorLogContent);
    } catch (logErr) {
      console.error("Failed to write to upload_error.log:", logErr);
    }

    return NextResponse.json(
      { error: `Gagal mengunggah berkas: ${error.message}` },
      { status: 500 }
    );
  }
}
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
