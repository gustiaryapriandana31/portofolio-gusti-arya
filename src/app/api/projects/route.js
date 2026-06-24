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

// GET: Fetch all projects
export async function GET() {
  try {
    if (!isDbConfigured()) {
      console.warn("DATABASE_URL is not configured.");
      return NextResponse.json([]);
    }

    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // Fetch all technologies and map them
    const technologies = await prisma.technology.findMany();
    const techMap = new Map(technologies.map(t => [t.id, t]));

    // Map technology objects to their projects
    const projectsWithTech = projects.map((proj) => {
      const techObjects = (proj.techIds || []).map(id => techMap.get(id)).filter(Boolean);

      return {
        ...proj,
        techObjects,
        technologies: techObjects.map(t => t.name) // Synthetic backward compatibility
      };
    });

    return NextResponse.json(projectsWithTech);
  } catch (error) {
    console.error("GET projects error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data proyek." },
      { status: 500 }
    );
  }
}

// POST: Create a new project record
export async function POST(request) {
  try {
    if (!checkAuth()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isDbConfigured()) {
      return NextResponse.json({ error: "Database tidak dikonfigurasi." }, { status: 500 });
    }

    const body = await request.json();
    const { name, duration, description, link, purpose, images, techIds } = body;

    if (!name || !duration || !description || !purpose || !Array.isArray(images)) {
      return NextResponse.json({ error: "Nama, durasi, deskripsi, tujuan, dan gambar (images) harus diisi." }, { status: 400 });
    }

    const savedTechIds = Array.isArray(techIds) ? techIds : [];

    const newProject = await prisma.project.create({
      data: { 
        name, 
        duration, 
        description, 
        link, 
        purpose, 
        images,
        techIds: savedTechIds
      },
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("POST projects error:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan data proyek." },
      { status: 500 }
    );
  }
}

// PUT: Update an existing project record
export async function PUT(request) {
  try {
    if (!checkAuth()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isDbConfigured()) {
      return NextResponse.json({ error: "Database tidak dikonfigurasi." }, { status: 500 });
    }

    const body = await request.json();
    const { id, name, duration, description, link, purpose, images, techIds } = body;

    if (!id || !name || !duration || !description || !purpose || !Array.isArray(images)) {
      return NextResponse.json({ error: "ID, nama, durasi, deskripsi, tujuan, dan gambar (images) harus diisi." }, { status: 400 });
    }

    const savedTechIds = Array.isArray(techIds) ? techIds : [];

    const updatedProject = await prisma.project.update({
      where: { id },
      data: { 
        name, 
        duration, 
        description, 
        link, 
        purpose, 
        images,
        techIds: savedTechIds
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("PUT projects error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui data proyek." },
      { status: 500 }
    );
  }
}

// DELETE: Remove a project record
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

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Data proyek berhasil dihapus." });
  } catch (error) {
    console.error("DELETE projects error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus data proyek." },
      { status: 500 }
    );
  }
}
