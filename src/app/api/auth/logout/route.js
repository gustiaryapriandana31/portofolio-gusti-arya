import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({ success: true, message: "Logout berhasil!" });

    // Clear session_token cookie by setting maxAge to 0
    response.cookies.set({
      name: "session_token",
      value: "",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("Logout API error:", error);
    return NextResponse.json(
      { error: "Gagal memproses logout." },
      { status: 500 }
    );
  }
}
