import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

const isDbConfigured = () => {
  return !!process.env.DATABASE_URL && process.env.DATABASE_URL !== "";
};

const checkAuth = () => {
  const cookieStore = cookies();
  const token = cookieStore.get("session_token")?.value;
  return token === "authenticated_porto_admin_session_2026";
};

// GET: Fetch all experience records
export async function GET() {
  try {
    if (!isDbConfigured()) {
      console.warn("DATABASE_URL is not configured.");
      return NextResponse.json([]);
    }

    const experiences = await prisma.experience.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(experiences);
  } catch (error) {
    console.error("GET experience error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data pengalaman." },
      { status: 500 }
    );
  }
}

// POST: Create a new experience record
export async function POST(request) {
  try {
    if (!checkAuth()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isDbConfigured()) {
      return NextResponse.json({ error: "Database tidak dikonfigurasi." }, { status: 500 });
    }

    const body = await request.json();
    const { title, company, period, points } = body;

    if (!title || !company || !period || !Array.isArray(points)) {
      return NextResponse.json({ error: "Judul, perusahaan, periode, dan poin detail harus diisi." }, { status: 400 });
    }

    const newExp = await prisma.experience.create({
      data: { title, company, period, points },
    });

    return NextResponse.json(newExp, { status: 201 });
  } catch (error) {
    console.error("POST experience error:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan data pengalaman." },
      { status: 500 }
    );
  }
}

// PUT: Update an existing experience record
export async function PUT(request) {
  try {
    if (!checkAuth()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isDbConfigured()) {
      return NextResponse.json({ error: "Database tidak dikonfigurasi." }, { status: 500 });
    }

    const body = await request.json();
    const { id, title, company, period, points } = body;

    if (!id || !title || !company || !period || !Array.isArray(points)) {
      return NextResponse.json({ error: "ID, judul, perusahaan, periode, dan poin detail harus diisi." }, { status: 400 });
    }

    const updatedExp = await prisma.experience.update({
      where: { id },
      data: { title, company, period, points },
    });

    return NextResponse.json(updatedExp);
  } catch (error) {
    console.error("PUT experience error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui data pengalaman." },
      { status: 500 }
    );
  }
}

// DELETE: Remove an experience record
export async function DELETE(request) {
  try {
    if (!checkAuth()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isDbConfigured()) {
      return NextResponse.json({ error: "Database tidak dikonfigurasi." }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID harus disertakan." }, { status: 400 });
    }

    await prisma.experience.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Data pengalaman berhasil dihapus." });
  } catch (error) {
    console.error("DELETE experience error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus data pengalaman." },
      { status: 500 }
    );
  }
}
