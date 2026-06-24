import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// In-memory mock store for demo fallback when DATABASE_URL is not set
let mockFeedbacks = [
  {
    id: "mock-1",
    name: "Arya Priandana (Demo)",
    comment: "Selamat datang di website portofolio saya! Ini adalah demo ulasan pertama. Silakan berikan rating dan support di form sebelah kiri.",
    rating: 5,
    likes: 12,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "mock-2",
    name: "Pengunjung Demo",
    comment: "Tampilan websitenya sangat premium dengan aksen neon hijau yang memukau! Transisinya halus sekali.",
    rating: 5,
    likes: 3,
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  }
];

// Helper to check if database url is configured
const isDbConfigured = () => {
  return !!process.env.DATABASE_URL && process.env.DATABASE_URL !== "";
};

// GET: Fetch all feedback comments
export async function GET() {
  try {
    if (!isDbConfigured()) {
      console.warn("DATABASE_URL is not configured. Falling back to Mock Memory Store.");
      // Sort mock feedbacks by date descending
      const sorted = [...mockFeedbacks].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      return NextResponse.json(sorted);
    }

    const feedbacks = await prisma.feedback.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(feedbacks);
  } catch (error) {
    console.error("GET feedback error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data testimoni." },
      { status: 500 }
    );
  }
}

// POST: Create a new feedback comment
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, comment, rating } = body;

    if (!name || !comment || typeof rating !== "number") {
      return NextResponse.json(
        { error: "Nama, komentar, dan rating diperlukan." },
        { status: 400 }
      );
    }

    if (!isDbConfigured()) {
      const newFeedback = {
        id: `mock-${Date.now()}`,
        name,
        comment,
        rating,
        likes: 0,
        createdAt: new Date().toISOString(),
      };
      mockFeedbacks.unshift(newFeedback);
      return NextResponse.json(newFeedback, { status: 201 });
    }

    const newFeedback = await prisma.feedback.create({
      data: {
        name,
        comment,
        rating,
      },
    });

    return NextResponse.json(newFeedback, { status: 201 });
  } catch (error) {
    console.error("POST feedback error:", error);
    return NextResponse.json(
      { error: "Gagal mengirim ulasan." },
      { status: 500 }
    );
  }
}

// PATCH: Increment likes for a feedback comment
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID testimoni diperlukan." },
        { status: 400 }
      );
    }

    if (!isDbConfigured()) {
      const fbIdx = mockFeedbacks.findIndex(item => item.id === id);
      if (fbIdx === -1) {
        return NextResponse.json({ error: "Ulasan tidak ditemukan." }, { status: 450 });
      }
      mockFeedbacks[fbIdx].likes += 1;
      return NextResponse.json(mockFeedbacks[fbIdx]);
    }

    const updated = await prisma.feedback.update({
      where: { id },
      data: {
        likes: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH feedback error:", error);
    return NextResponse.json(
      { error: "Gagal memberikan support." },
      { status: 500 }
    );
  }
}
