import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (username === "MyOwnPorto" && password === "Gusrary31") {
      // Create response object
      const response = NextResponse.json({ success: true, message: "Login berhasil!" });

      // Set cookie session_token
      response.cookies.set({
        name: "session_token",
        value: "authenticated_porto_admin_session_2026",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24, // 24 hours
      });

      return response;
    }

    return NextResponse.json(
      { error: "Username atau password salah." },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan sistem." },
      { status: 500 }
    );
  }
}
