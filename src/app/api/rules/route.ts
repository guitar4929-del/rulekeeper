import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { seedRulesIfEmpty } from "@/lib/seed-rules";

export async function GET() {
  try {
    await seedRulesIfEmpty();
    const rules = await prisma.rule.findMany({ orderBy: { createdAt: "asc" } });
    return NextResponse.json(
      rules.map((r) => ({ ...r, params: JSON.parse(r.params) }))
    );
  } catch (e) {
    console.error("Rules GET error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, enabled, params } = body;

    const rule = await prisma.rule.update({
      where: { id },
      data: {
        enabled: enabled !== undefined ? enabled : undefined,
        params: params ? JSON.stringify(params) : undefined,
      },
    });

    return NextResponse.json({ ...rule, params: JSON.parse(rule.params) });
  } catch (e) {
    console.error("Rules PUT error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
