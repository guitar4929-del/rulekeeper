import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId");

  if (!sessionId) {
    // Return all sessions
    const sessions = await prisma.uploadSession.findMany({
      orderBy: { uploadedAt: "desc" },
      include: {
        _count: { select: { violations: true } },
        reports: true,
      },
    });
    return NextResponse.json(sessions);
  }

  const report = await prisma.report.findFirst({
    where: { sessionId },
    orderBy: { createdAt: "desc" },
  });

  if (!report) {
    return NextResponse.json({ error: "レポートが見つかりません" }, { status: 404 });
  }

  const violations = await prisma.violation.findMany({
    where: { sessionId },
    include: {
      trade: true,
      rule: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const trades = await prisma.trade.findMany({
    where: { sessionId },
    orderBy: { dateTime: "asc" },
  });

  return NextResponse.json({
    report: {
      ...report,
      content: JSON.parse(report.content),
    },
    violations: violations.map((v) => ({
      ...v,
      detail: v.detail ? JSON.parse(v.detail) : null,
      rule: { ...v.rule, params: JSON.parse(v.rule.params) },
    })),
    trades,
  });
}
