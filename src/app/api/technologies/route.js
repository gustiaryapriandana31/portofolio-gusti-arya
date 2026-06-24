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

// GET: Fetch all technologies
export async function GET() {
  try {
    if (!isDbConfigured()) {
      return NextResponse.json([]);
    }

    const technologies = await prisma.technology.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(technologies);
  } catch (error) {
    console.error("GET technologies error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data teknologi." },
      { status: 500 }
    );
  }
}

// POST: Create a new technology record
export async function POST(request) {
  try {
    if (!checkAuth()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isDbConfigured()) {
      return NextResponse.json({ error: "Database tidak dikonfigurasi." }, { status: 500 });
    }

    const body = await request.json();
    const { name, logo, category } = body;

    if (!name || !logo || !category) {
      return NextResponse.json({ error: "Nama, logo (class/URL), dan kategori harus diisi." }, { status: 400 });
    }

    const newTech = await prisma.technology.create({
      data: { name, logo, category },
    });

    return NextResponse.json(newTech, { status: 201 });
  } catch (error) {
    console.error("POST technologies error:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan data teknologi." },
      { status: 500 }
    );
  }
}

// PUT: Update an existing technology record
export async function PUT(request) {
  try {
    if (!checkAuth()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isDbConfigured()) {
      return NextResponse.json({ error: "Database tidak dikonfigurasi." }, { status: 500 });
    }

    const body = await request.json();
    const { id, name, logo, category } = body;

    if (!id || !name || !logo || !category) {
      return NextResponse.json({ error: "ID, nama, logo (class/URL), dan kategori harus diisi." }, { status: 400 });
    }

    const updatedTech = await prisma.technology.update({
      where: { id },
      data: { name, logo, category },
    });

    return NextResponse.json(updatedTech);
  } catch (error) {
    console.error("PUT technologies error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui data teknologi." },
      { status: 500 }
    );
  }
}

// DELETE: Remove a technology record
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

    await prisma.technology.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Data teknologi berhasil dihapus." });
  } catch (error) {
    console.error("DELETE technologies error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus data teknologi." },
      { status: 500 }
    );
  }
}
