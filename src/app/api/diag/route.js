import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    env: {
      DATABASE_URL_DEFINED: !!process.env.DATABASE_URL,
      DATABASE_URL_LENGTH: process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 0,
      DATABASE_URL_MASKED: maskUrl(process.env.DATABASE_URL),
      DIRECT_URL_DEFINED: !!process.env.DIRECT_URL,
      DIRECT_URL_MASKED: maskUrl(process.env.DIRECT_URL),
    },
    connection: "Checking...",
    error: null,
    tables: {},
  };

  try {
    // 1. Check basic DB connection
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    diagnostics.connection = `Success (ping took ${Date.now() - start}ms)`;

    // 2. Count table records
    diagnostics.tables = {
      project: await prisma.project.count(),
      technology: await prisma.technology.count(),
      experience: await prisma.experience.count(),
      education: await prisma.education.count(),
      skill: await prisma.skill.count(),
      softSkill: await prisma.softSkill.count(),
      hobby: await prisma.hobby.count(),
      certification: await prisma.certification.count(),
      achievement: await prisma.achievement.count(),
      feedback: await prisma.feedback.count(),
    };
  } catch (err) {
    diagnostics.connection = "Failed";
    diagnostics.error = {
      message: err.message,
      code: err.code,
      meta: err.meta,
    };
  }

  return NextResponse.json(diagnostics);
}

function maskUrl(url) {
  if (!url) return "not set";
  try {
    const parsed = new URL(url.replace("postgresql://", "http://"));
    return `postgresql://***:***@${parsed.host}${parsed.pathname}`;
  } catch (e) {
    // Fallback simple mask
    return url.slice(0, 15) + "..." + url.slice(-10);
  }
}
