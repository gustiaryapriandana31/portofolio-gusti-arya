import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";


const isDbConfigured = () => {
  return !!process.env.DATABASE_URL && process.env.DATABASE_URL !== "";
};

const checkAuth = () => {
  const cookieStore = cookies();
  const token = cookieStore.get("session_token")?.value;
  return token === "authenticated_porto_admin_session_2026";
};

// GET: Fetch all certifications and achievements
export async function GET() {
  try {
    if (!isDbConfigured()) {
      console.warn("DATABASE_URL is not configured.");
      return NextResponse.json({
        certifications: [],
        achievements: [],
      });
    }

    const [certifications, achievements] = await Promise.all([
      prisma.certification.findMany({
        orderBy: {
          createdAt: "asc",
        },
      }),
      prisma.achievement.findMany({
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    return NextResponse.json({
      certifications,
      achievements,
    });
  } catch (error) {
    console.error("GET certifications error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data sertifikasi & prestasi." },
      { status: 500 }
    );
  }
}

// POST: Create a new certification or achievement
export async function POST(request) {
  try {
    if (!checkAuth()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isDbConfigured()) {
      return NextResponse.json({ error: "Database tidak dikonfigurasi." }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "certification" | "achievement"

    const body = await request.json();

    if (type === "certification") {
      const { title, issuer, period, link, image } = body;
      if (!title || !issuer || !period || !link) {
        return NextResponse.json({ error: "Judul, penerbit, periode, dan link harus diisi." }, { status: 400 });
      }
      const newCert = await prisma.certification.create({
        data: { title, issuer, period, link, image },
      });
      return NextResponse.json(newCert, { status: 201 });
    }

    if (type === "achievement") {
      const { title, event, period, description, images, link } = body;
      if (!title || !event || !period || !description || !Array.isArray(images)) {
        return NextResponse.json({ error: "Judul, acara, periode, deskripsi, dan foto (images) harus diisi." }, { status: 400 });
      }
      const newAch = await prisma.achievement.create({
        data: { title, event, period, description, images, link: link || null },
      });
      return NextResponse.json(newAch, { status: 201 });
    }

    return NextResponse.json({ error: "Tipe operasi tidak valid." }, { status: 400 });
  } catch (error) {
    console.error("POST certifications error:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan data sertifikasi/prestasi." },
      { status: 500 }
    );
  }
}

// PUT: Update an existing certification or achievement
export async function PUT(request) {
  try {
    if (!checkAuth()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isDbConfigured()) {
      return NextResponse.json({ error: "Database tidak dikonfigurasi." }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "ID harus disertakan." }, { status: 400 });
    }

    if (type === "certification") {
      const { title, issuer, period, link, image } = body;
      if (!title || !issuer || !period || !link) {
        return NextResponse.json({ error: "Judul, penerbit, periode, dan link harus diisi." }, { status: 400 });
      }
      const updated = await prisma.certification.update({
        where: { id },
        data: { title, issuer, period, link, image },
      });
      return NextResponse.json(updated);
    }

    if (type === "achievement") {
      const { title, event, period, description, images, link } = body;
      if (!title || !event || !period || !description || !Array.isArray(images)) {
        return NextResponse.json({ error: "Judul, acara, periode, deskripsi, dan foto (images) harus diisi." }, { status: 400 });
      }
      const updated = await prisma.achievement.update({
        where: { id },
        data: { title, event, period, description, images, link: link || null },
      });
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: "Tipe operasi tidak valid." }, { status: 400 });
  } catch (error) {
    console.error("PUT certifications error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui data sertifikasi/prestasi." },
      { status: 500 }
    );
  }
}

// DELETE: Remove a certification or achievement
export async function DELETE(request) {
  try {
    if (!checkAuth()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isDbConfigured()) {
      return NextResponse.json({ error: "Database tidak dikonfigurasi." }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const id = searchParams.get("id");

    if (!id || !type) {
      return NextResponse.json({ error: "ID dan tipe harus disertakan." }, { status: 400 });
    }

    if (type === "certification") {
      await prisma.certification.delete({ where: { id } });
    } else if (type === "achievement") {
      await prisma.achievement.delete({ where: { id } });
    } else {
      return NextResponse.json({ error: "Tipe tidak valid." }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: `Data ${type} berhasil dihapus.` });
  } catch (error) {
    console.error("DELETE certifications error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus data sertifikasi/prestasi." },
      { status: 500 }
    );
  }
}
