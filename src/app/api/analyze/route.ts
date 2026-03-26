import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { seedRulesIfEmpty } from "@/lib/seed-rules";
import { detectViolations, generateSuggestions } from "@/lib/rule-engine";
import type { TradeData, RuleConfig } from "@/lib/rule-engine";

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: "sessionIdが必要です" }, { status: 400 });
    }

    await seedRulesIfEmpty();

    const trades = await prisma.trade.findMany({
      where: { sessionId },
      orderBy: { dateTime: "asc" },
    });

    if (trades.length === 0) {
      return NextResponse.json({ error: "トレードデータがありません" }, { status: 404 });
    }

    const rules = await prisma.rule.findMany({ where: { enabled: true } });

    const tradeData: TradeData[] = trades.map((t) => ({
      id: t.id,
      dateTime: t.dateTime,
      symbol: t.symbol,
      side: t.side,
      lotSize: t.lotSize,
      entryPrice: t.entryPrice,
      exitPrice: t.exitPrice,
      stopLoss: t.stopLoss,
      takeProfit: t.takeProfit,
      pnl: t.pnl,
      pnlPercent: t.pnlPercent,
      duration: t.duration,
      reason: t.reason,
      memo: t.memo,
      originalSL: t.originalSL,
    }));

    const ruleConfigs: RuleConfig[] = rules.map((r) => ({
      id: r.id,
      name: r.name,
      type: r.type,
      enabled: r.enabled,
      params: JSON.parse(r.params),
    }));

    const violations = detectViolations(tradeData, ruleConfigs);
    const suggestions = generateSuggestions(violations, tradeData);

    // Clear old violations for this session
    await prisma.violation.deleteMany({ where: { sessionId } });

    // Save violations
    if (violations.length > 0) {
      await prisma.violation.createMany({
        data: violations.map((v) => ({
          tradeId: v.tradeId,
          ruleId: v.ruleId,
          sessionId,
          severity: v.severity,
          message: v.message,
          detail: v.detail ? JSON.stringify(v.detail) : null,
        })),
      });
    }

    // Generate summary stats
    const totalPnl = tradeData.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const winTrades = tradeData.filter((t) => t.pnl !== null && t.pnl > 0);
    const loseTrades = tradeData.filter((t) => t.pnl !== null && t.pnl < 0);
    const winRate = tradeData.filter((t) => t.pnl !== null).length > 0
      ? (winTrades.length / tradeData.filter((t) => t.pnl !== null).length) * 100
      : 0;

    // Group violations by rule
    const violationsByRule: Record<string, { name: string; count: number; severity: string }> = {};
    for (const v of violations) {
      const rule = ruleConfigs.find((r) => r.id === v.ruleId);
      if (!violationsByRule[v.ruleId]) {
        violationsByRule[v.ruleId] = {
          name: rule?.name || "不明",
          count: 0,
          severity: v.severity,
        };
      }
      violationsByRule[v.ruleId].count++;
    }

    // Save report
    const reportContent = {
      totalTrades: tradeData.length,
      totalPnl: Math.round(totalPnl),
      winRate: Math.round(winRate * 10) / 10,
      winTrades: winTrades.length,
      loseTrades: loseTrades.length,
      totalViolations: violations.length,
      violationsByRule: Object.values(violationsByRule),
      highSeverity: violations.filter((v) => v.severity === "high").length,
      mediumSeverity: violations.filter((v) => v.severity === "medium").length,
      lowSeverity: violations.filter((v) => v.severity === "low").length,
    };

    await prisma.report.deleteMany({ where: { sessionId } });
    await prisma.report.create({
      data: {
        sessionId,
        type: "summary",
        date: new Date().toISOString().split("T")[0],
        content: JSON.stringify(reportContent),
        suggestions: suggestions.join("\n"),
      },
    });

    return NextResponse.json({
      sessionId,
      summary: reportContent,
      violations: violations.map((v) => ({
        ...v,
        ruleName: ruleConfigs.find((r) => r.id === v.ruleId)?.name,
      })),
      suggestions,
    });
  } catch (e) {
    console.error("Analyze error:", e);
    return NextResponse.json({ error: "分析処理でエラーが発生しました" }, { status: 500 });
  }
}
