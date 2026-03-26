import { NextRequest, NextResponse } from "next/server";
import { parseCSV, guessColumnMapping } from "@/lib/csv-parser";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "ファイルがありません" }, { status: 400 });
    }

    const text = await file.text();
    const { headers, rows } = parseCSV(text);

    if (rows.length === 0) {
      return NextResponse.json({ error: "データが空です" }, { status: 400 });
    }

    const guessedMapping = guessColumnMapping(headers);

    return NextResponse.json({
      headers,
      rowCount: rows.length,
      preview: rows.slice(0, 5),
      guessedMapping,
    });
  } catch {
    return NextResponse.json({ error: "CSVの解析に失敗しました" }, { status: 500 });
  }
}
