"use client";

import { useState, useCallback } from "react";
import type { ColumnMapping } from "@/lib/csv-parser";

type PreviewData = {
  headers: string[];
  rowCount: number;
  preview: Record<string, string>[];
  guessedMapping: Partial<ColumnMapping>;
};

const REQUIRED_FIELDS: { key: keyof ColumnMapping; label: string }[] = [
  { key: "dateTime", label: "日時" },
  { key: "symbol", label: "通貨ペア/銘柄" },
  { key: "side", label: "売買区分" },
  { key: "lotSize", label: "ロット/数量" },
  { key: "entryPrice", label: "エントリー価格" },
];

const OPTIONAL_FIELDS: { key: keyof ColumnMapping; label: string }[] = [
  { key: "exitPrice", label: "決済価格" },
  { key: "stopLoss", label: "損切り価格" },
  { key: "takeProfit", label: "利確価格" },
  { key: "pnl", label: "損益" },
  { key: "reason", label: "エントリー理由" },
  { key: "memo", label: "メモ" },
  { key: "originalSL", label: "変更前の損切り" },
];

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [mapping, setMapping] = useState<Partial<ColumnMapping>>({});
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    sessionId: string;
    tradeCount: number;
  } | null>(null);
  const [analysisResult, setAnalysisResult] = useState<Record<string, unknown> | null>(null);

  const handleFile = useCallback(async (f: File) => {
    setFile(f);
    setError("");
    setResult(null);
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append("file", f);

    try {
      setLoading(true);
      const res = await fetch("/api/upload/preview", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "プレビューに失敗しました");
        return;
      }

      setPreview(data);
      setMapping(data.guessedMapping);
    } catch {
      setError("ファイルの読み込みに失敗しました");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("mapping", JSON.stringify(mapping));

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "アップロードに失敗しました");
        return;
      }

      setResult(data);

      // Auto analyze
      setAnalyzing(true);
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: data.sessionId }),
      });
      const analyzeData = await analyzeRes.json();

      if (analyzeRes.ok) {
        setAnalysisResult(analyzeData);
      }
    } catch {
      setError("処理に失敗しました");
    } finally {
      setLoading(false);
      setAnalyzing(false);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const f = e.dataTransfer.files[0];
      if (f && (f.name.endsWith(".csv") || f.type === "text/csv")) {
        handleFile(f);
      } else {
        setError("CSVファイルをアップロードしてください");
      }
    },
    [handleFile]
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">CSV分析</h1>
      <p className="text-gray-600 mb-6">
        取引履歴のCSVをアップロードして、ルール逸脱を検知します。
      </p>

      {/* Drop Zone */}
      {!preview && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors cursor-pointer"
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
          <div className="text-4xl mb-4">&#x1F4C4;</div>
          <p className="text-lg font-medium mb-2">
            CSVファイルをドラッグ&ドロップ
          </p>
          <p className="text-sm text-gray-500">
            またはクリックしてファイルを選択
          </p>
          <p className="text-xs text-gray-400 mt-4">
            <a href="/samples/sample_trades.csv" download className="text-blue-500 hover:underline">
              サンプルCSVをダウンロード
            </a>
          </p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading && !analyzing && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg text-blue-700 text-center">
          読み込み中...
        </div>
      )}

      {/* Preview & Mapping */}
      {preview && !result && (
        <div className="mt-6 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">プレビュー</h2>
              <span className="text-sm text-gray-500">
                {file?.name} ({preview.rowCount}件)
              </span>
            </div>

            <div className="overflow-x-auto mb-6">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr>
                    {preview.headers.map((h) => (
                      <th
                        key={h}
                        className="border px-2 py-1 bg-gray-50 text-left whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.preview.map((row, i) => (
                    <tr key={i}>
                      {preview.headers.map((h) => (
                        <td
                          key={h}
                          className="border px-2 py-1 whitespace-nowrap"
                        >
                          {row[h]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="font-bold mb-3">列マッピング設定</h3>
            <p className="text-sm text-gray-500 mb-4">
              自動推定結果を確認し、必要に応じて修正してください。
            </p>

            <div className="grid md:grid-cols-2 gap-3">
              {[...REQUIRED_FIELDS, ...OPTIONAL_FIELDS].map(({ key, label }) => (
                <div key={key} className="flex items-center gap-2">
                  <label className="text-sm w-36 shrink-0">
                    {label}
                    {REQUIRED_FIELDS.find((f) => f.key === key) && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  <select
                    value={mapping[key] || ""}
                    onChange={(e) =>
                      setMapping((m) => ({ ...m, [key]: e.target.value || undefined }))
                    }
                    className="flex-1 border rounded px-2 py-1 text-sm bg-white"
                  >
                    <option value="">-- 未設定 --</option>
                    {preview.headers.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleUpload}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                分析を実行する
              </button>
              <button
                onClick={() => {
                  setPreview(null);
                  setFile(null);
                  setMapping({});
                }}
                className="border border-gray-300 px-6 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                やり直す
              </button>
            </div>
          </div>
        </div>
      )}

      {analyzing && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg text-blue-700 text-center">
          分析中...ルール逸脱を検知しています
        </div>
      )}

      {/* Analysis Result */}
      {analysisResult && (
        <div className="mt-6 space-y-6">
          <AnalysisResultView data={analysisResult} sessionId={result?.sessionId || ""} />
        </div>
      )}
    </div>
  );
}

function AnalysisResultView({
  data,
  sessionId,
}: {
  data: Record<string, unknown>;
  sessionId: string;
}) {
  const summary = data.summary as Record<string, unknown>;
  const violations = data.violations as Array<Record<string, unknown>>;
  const suggestions = data.suggestions as string[];

  return (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="総トレード数" value={String(summary.totalTrades)} />
        <StatCard
          label="合計損益"
          value={`${Number(summary.totalPnl) >= 0 ? "+" : ""}${summary.totalPnl}`}
          color={Number(summary.totalPnl) >= 0 ? "green" : "red"}
        />
        <StatCard label="勝率" value={`${summary.winRate}%`} />
        <StatCard
          label="ルール逸脱"
          value={String(summary.totalViolations)}
          color={Number(summary.totalViolations) > 0 ? "red" : "green"}
        />
      </div>

      {/* Suggestions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="font-bold text-lg mb-3 text-blue-800">改善提案</h2>
        <ul className="space-y-2">
          {suggestions.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-blue-900">
              <span className="mt-0.5">&#x1F4A1;</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Violations */}
      {violations.length > 0 && (
        <div className="bg-white border rounded-lg p-6">
          <h2 className="font-bold text-lg mb-4">逸脱一覧（{violations.length}件）</h2>
          <div className="space-y-2">
            {violations.map((v, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-3 rounded-lg text-sm ${
                  v.severity === "high"
                    ? "bg-red-50"
                    : v.severity === "medium"
                    ? "bg-yellow-50"
                    : "bg-gray-50"
                }`}
              >
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded shrink-0 ${
                    v.severity === "high"
                      ? "bg-red-200 text-red-800"
                      : v.severity === "medium"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {v.severity === "high" ? "重大" : v.severity === "medium" ? "注意" : "軽微"}
                </span>
                <div>
                  <p className="font-medium">{v.message as string}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    ルール: {v.ruleName as string}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <a
          href={`/analysis?sessionId=${sessionId}`}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
        >
          詳細分析を見る
        </a>
        <a
          href={`/reports?sessionId=${sessionId}`}
          className="border border-gray-300 px-6 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
        >
          レポートを見る
        </a>
        <button
          onClick={() => window.location.reload()}
          className="border border-gray-300 px-6 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
        >
          別のCSVを分析
        </button>
      </div>

      <p className="text-xs text-gray-400 text-center">
        ※本ツールは自己分析支援を目的としており、投資助言ではありません。
      </p>
    </>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p
        className={`text-2xl font-bold ${
          color === "green"
            ? "text-green-600"
            : color === "red"
            ? "text-red-600"
            : "text-gray-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
