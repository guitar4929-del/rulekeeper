import Papa from "papaparse";

export interface RawTradeRow {
  [key: string]: string;
}

export interface ColumnMapping {
  dateTime: string;
  symbol: string;
  side: string;
  lotSize: string;
  entryPrice: string;
  exitPrice?: string;
  stopLoss?: string;
  takeProfit?: string;
  pnl?: string;
  reason?: string;
  memo?: string;
  originalSL?: string;
}

const COLUMN_ALIASES: Record<keyof ColumnMapping, string[]> = {
  dateTime: ["date", "datetime", "date_time", "time", "timestamp", "日時", "日付", "取引日時", "エントリー日時", "open_time", "opentime", "entry_time"],
  symbol: ["symbol", "pair", "currency", "通貨ペア", "銘柄", "通貨", "instrument", "ticker"],
  side: ["side", "type", "direction", "売買", "売買区分", "ポジション", "buy_sell", "action", "order_type"],
  lotSize: ["lot", "lots", "size", "volume", "quantity", "ロット", "数量", "取引量", "lot_size", "lotsize", "position_size"],
  entryPrice: ["entry", "entry_price", "open", "open_price", "エントリー価格", "約定価格", "建値"],
  exitPrice: ["exit", "exit_price", "close", "close_price", "決済価格", "クローズ価格"],
  stopLoss: ["sl", "stop_loss", "stoploss", "損切り", "ストップロス", "損切り価格"],
  takeProfit: ["tp", "take_profit", "takeprofit", "利確", "テイクプロフィット", "利確価格"],
  pnl: ["pnl", "profit", "pl", "profit_loss", "損益", "利益", "結果", "収益", "net_profit", "realized_pnl"],
  reason: ["reason", "理由", "エントリー理由", "根拠", "entry_reason", "setup"],
  memo: ["memo", "note", "notes", "メモ", "備考", "コメント", "comment"],
  originalSL: ["original_sl", "元の損切り", "初期SL", "original_stop_loss"],
};

export function guessColumnMapping(headers: string[]): Partial<ColumnMapping> {
  const mapping: Partial<ColumnMapping> = {};
  const lowerHeaders = headers.map((h) => h.toLowerCase().trim());

  for (const [field, aliases] of Object.entries(COLUMN_ALIASES)) {
    for (const alias of aliases) {
      const idx = lowerHeaders.findIndex(
        (h) => h === alias || h.replace(/[\s_-]/g, "") === alias.replace(/[\s_-]/g, "")
      );
      if (idx !== -1) {
        (mapping as Record<string, string>)[field] = headers[idx];
        break;
      }
    }
  }

  return mapping;
}

export function parseCSV(csvText: string): { headers: string[]; rows: RawTradeRow[] } {
  const result = Papa.parse<RawTradeRow>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h: string) => h.trim(),
  });

  return {
    headers: result.meta.fields || [],
    rows: result.data,
  };
}

export function parseNumber(val: string | undefined): number | null {
  if (!val || val.trim() === "") return null;
  const cleaned = val.replace(/[,¥$€£]/g, "").trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

export function parseDate(val: string | undefined): Date | null {
  if (!val || val.trim() === "") return null;
  const d = new Date(val.trim());
  return isNaN(d.getTime()) ? null : d;
}

export function parseSide(val: string | undefined): string | null {
  if (!val) return null;
  const v = val.trim().toUpperCase();
  if (["BUY", "LONG", "買", "買い", "B", "L"].includes(v)) return "BUY";
  if (["SELL", "SHORT", "売", "売り", "S"].includes(v)) return "SELL";
  return v;
}
