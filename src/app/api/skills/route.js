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

// GET: Fetch all skills, soft skills, and hobbies
export async function GET() {
  try {
    if (!isDbConfigured()) {
      console.warn("DATABASE_URL is not configured.");
      return NextResponse.json({
        skills: [],
        softSkills: [],
        hobbies: [],
      });
    }

    const [skills, softSkills, hobbies] = await Promise.all([
      prisma.skill.findMany({
        orderBy: {
          level: "desc",
        },
      }),
      prisma.softSkill.findMany({
        orderBy: {
          createdAt: "asc",
        },
      }),
      prisma.hobby.findMany({
        orderBy: {
          createdAt: "asc",
        },
      }),
    ]);

    return NextResponse.json({
      skills,
      softSkills,
      hobbies,
    });
  } catch (error) {
    console.error("GET skills error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data keahlian." },
      { status: 500 }
    );
  }
}

// POST: Create new skill, soft skill, or hobby
export async function POST(request) {
  try {
    if (!checkAuth()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isDbConfigured()) {
      return NextResponse.json({ error: "Database tidak dikonfigurasi." }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "skill" | "softskill" | "hobby"

    const body = await request.json();

    if (type === "skill") {
      const { name, level, label, category } = body;
      if (!name || typeof level !== "number" || !label || !category) {
        return NextResponse.json({ error: "Nama, tingkat (level), label, dan kategori harus diisi." }, { status: 400 });
      }
      const newSkill = await prisma.skill.create({
        data: { name, level, label, category },
      });
      return NextResponse.json(newSkill, { status: 201 });
    }

    if (type === "softskill") {
      const { name } = body;
      if (!name) {
        return NextResponse.json({ error: "Nama soft skill harus diisi." }, { status: 400 });
      }
      const newSoft = await prisma.softSkill.create({
        data: { name },
      });
      return NextResponse.json(newSoft, { status: 201 });
    }

    if (type === "hobby") {
      const { name, icon } = body;
      if (!name || !icon) {
        return NextResponse.json({ error: "Nama hobi dan icon harus diisi." }, { status: 400 });
      }
      const newHobby = await prisma.hobby.create({
        data: { name, icon },
      });
      return NextResponse.json(newHobby, { status: 201 });
    }

    return NextResponse.json({ error: "Tipe operasi tidak valid." }, { status: 400 });
  } catch (error) {
    console.error("POST skills error:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan data keahlian." },
      { status: 500 }
    );
  }
}

// PUT: Update existing skill, soft skill, or hobby
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

    if (type === "skill") {
      const { name, level, label, category } = body;
      if (!name || typeof level !== "number" || !label || !category) {
        return NextResponse.json({ error: "Nama, tingkat (level), label, dan kategori harus diisi." }, { status: 400 });
      }
      const updated = await prisma.skill.update({
        where: { id },
        data: { name, level, label, category },
      });
      return NextResponse.json(updated);
    }

    if (type === "softskill") {
      const { name } = body;
      if (!name) {
        return NextResponse.json({ error: "Nama soft skill harus diisi." }, { status: 400 });
      }
      const updated = await prisma.softSkill.update({
        where: { id },
        data: { name },
      });
      return NextResponse.json(updated);
    }

    if (type === "hobby") {
      const { name, icon } = body;
      if (!name || !icon) {
        return NextResponse.json({ error: "Nama hobi dan icon harus diisi." }, { status: 400 });
      }
      const updated = await prisma.hobby.update({
        where: { id },
        data: { name, icon },
      });
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: "Tipe operasi tidak valid." }, { status: 400 });
  } catch (error) {
    console.error("PUT skills error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui data keahlian." },
      { status: 500 }
    );
  }
}

// DELETE: Remove a skill, soft skill, or hobby
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

    if (type === "skill") {
      await prisma.skill.delete({ where: { id } });
    } else if (type === "softskill") {
      await prisma.softSkill.delete({ where: { id } });
    } else if (type === "hobby") {
      await prisma.hobby.delete({ where: { id } });
    } else {
      return NextResponse.json({ error: "Tipe tidak valid." }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: `Data ${type} berhasil dihapus.` });
  } catch (error) {
    console.error("DELETE skills error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus data keahlian." },
      { status: 500 }
    );
  }
}
