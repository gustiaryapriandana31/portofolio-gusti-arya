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

// GET: Fetch all education records
export async function GET() {
  try {
    if (!isDbConfigured()) {
      console.warn("DATABASE_URL is not configured.");
      return NextResponse.json([]);
    }

    const education = await prisma.education.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(education);
  } catch (error) {
    console.error("GET education error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data pendidikan." },
      { status: 500 }
    );
  }
}

// POST: Create a new education record
export async function POST(request) {
  try {
    if (!checkAuth()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isDbConfigured()) {
      return NextResponse.json({ error: "Database tidak dikonfigurasi." }, { status: 500 });
    }

    const body = await request.json();
    const { degree, institution, period } = body;

    if (!degree || !institution || !period) {
      return NextResponse.json({ error: "Gelar, institusi, dan periode harus diisi." }, { status: 400 });
    }

    const newEdu = await prisma.education.create({
      data: { degree, institution, period },
    });

    return NextResponse.json(newEdu, { status: 201 });
  } catch (error) {
    console.error("POST education error:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan data pendidikan." },
      { status: 500 }
    );
  }
}

// PUT: Update an existing education record
export async function PUT(request) {
  try {
    if (!checkAuth()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isDbConfigured()) {
      return NextResponse.json({ error: "Database tidak dikonfigurasi." }, { status: 500 });
    }

    const body = await request.json();
    const { id, degree, institution, period } = body;

    if (!id || !degree || !institution || !period) {
      return NextResponse.json({ error: "ID, gelar, institusi, dan periode harus diisi." }, { status: 400 });
    }

    const updatedEdu = await prisma.education.update({
      where: { id },
      data: { degree, institution, period },
    });

    return NextResponse.json(updatedEdu);
  } catch (error) {
    console.error("PUT education error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui data pendidikan." },
      { status: 500 }
    );
  }
}

// DELETE: Remove an education record
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

    await prisma.education.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Data pendidikan berhasil dihapus." });
  } catch (error) {
    console.error("DELETE education error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus data pendidikan." },
      { status: 500 }
    );
  }
}
