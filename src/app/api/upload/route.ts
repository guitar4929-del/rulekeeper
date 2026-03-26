import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseCSV, guessColumnMapping, parseNumber, parseDate, parseSide } from "@/lib/csv-parser";
import type { ColumnMapping } from "@/lib/csv-parser";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const mappingStr = formData.get("mapping") as string | null;

    if (!file) {
      return NextResponse.json({ error: "ファイルがありません" }, { status: 400 });
    }

    const text = await file.text();
    const { headers, rows } = parseCSV(text);

    if (rows.length === 0) {
      return NextResponse.json({ error: "データが空です" }, { status: 400 });
    }

    let mapping: Partial<ColumnMapping>;
    if (mappingStr) {
      mapping = JSON.parse(mappingStr);
    } else {
      mapping = guessColumnMapping(headers);
    }

    if (!mapping.dateTime || !mapping.symbol || !mapping.side || !mapping.lotSize || !mapping.entryPrice) {
      return NextResponse.json(
        {
          error: "必須列のマッピングが不足しています",
          headers,
          guessedMapping: mapping,
          requiredFields: ["dateTime", "symbol", "side", "lotSize", "entryPrice"],
        },
        { status: 422 }
      );
    }

    const session = await prisma.uploadSession.create({
      data: {
        fileName: file.name,
        tradeCount: rows.length,
        columnMapping: JSON.stringify(mapping),
      },
    });

    const trades = [];
    for (const row of rows) {
      const dateTime = parseDate(row[mapping.dateTime!]);
      const side = parseSide(row[mapping.side!]);
      const lotSize = parseNumber(row[mapping.lotSize!]);
      const entryPrice = parseNumber(row[mapping.entryPrice!]);

      if (!dateTime || !side || lotSize === null || entryPrice === null) continue;

      trades.push({
        sessionId: session.id,
        dateTime,
        symbol: row[mapping.symbol!]?.trim() || "UNKNOWN",
        side,
        lotSize,
        entryPrice,
        exitPrice: mapping.exitPrice ? parseNumber(row[mapping.exitPrice]) : null,
        stopLoss: mapping.stopLoss ? parseNumber(row[mapping.stopLoss]) : null,
        takeProfit: mapping.takeProfit ? parseNumber(row[mapping.takeProfit]) : null,
        pnl: mapping.pnl ? parseNumber(row[mapping.pnl]) : null,
        reason: mapping.reason ? row[mapping.reason]?.trim() || null : null,
        memo: mapping.memo ? row[mapping.memo]?.trim() || null : null,
        originalSL: mapping.originalSL ? parseNumber(row[mapping.originalSL]) : null,
      });
    }

    if (trades.length === 0) {
      await prisma.uploadSession.delete({ where: { id: session.id } });
      return NextResponse.json({ error: "有効なトレードデータがありません" }, { status: 400 });
    }

    await prisma.trade.createMany({ data: trades });
    await prisma.uploadSession.update({
      where: { id: session.id },
      data: { tradeCount: trades.length },
    });

    return NextResponse.json({
      sessionId: session.id,
      tradeCount: trades.length,
      mapping,
    });
  } catch (e) {
    console.error("Upload error:", e);
    return NextResponse.json({ error: "アップロード処理でエラーが発生しました" }, { status: 500 });
  }
}
