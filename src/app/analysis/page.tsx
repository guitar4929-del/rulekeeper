"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AnalysisContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;
    fetch(`/api/reports?sessionId=${sessionId}`)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (!sessionId) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">セッションIDが指定されていません。</p>
        <a href="/upload" className="text-blue-600 hover:underline text-sm">
          CSVをアップロードする
        </a>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-center text-gray-500">読み込み中...</p>
      </div>
    );
  }

  if (!data || data.error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">{(data?.error as string) || "データがありません"}</p>
        <a href="/upload" className="text-blue-600 hover:underline text-sm">
          CSVをアップロードする
        </a>
      </div>
    );
  }

  const report = data.report as Record<string, unknown>;
  const content = report.content as Record<string, unknown>;
  const violations = data.violations as Array<Record<string, unknown>>;
  const trades = data.trades as Array<Record<string, unknown>>;
  const suggestions = (report.suggestions as string).split("\n").filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">分析結果</h1>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <SummaryCard label="トレード数" value={String(content.totalTrades)} />
        <SummaryCard
          label="合計損益"
          value={`${Number(content.totalPnl) >= 0 ? "+" : ""}${content.totalPnl}`}
          color={Number(content.totalPnl) >= 0 ? "green" : "red"}
        />
        <SummaryCard label="勝率" value={`${content.winRate}%`} />
        <SummaryCard label="勝ち" value={String(content.winTrades)} color="green" />
        <SummaryCard label="負け" value={String(content.loseTrades)} color="red" />
      </div>

      {/* Violation severity breakdown */}
      <div className="bg-white border rounded-lg p-5">
        <h2 className="font-bold mb-3">逸脱レベル別</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-red-50 rounded p-3">
            <p className="text-2xl font-bold text-red-600">{content.highSeverity as number}</p>
            <p className="text-xs text-gray-500">重大</p>
          </div>
          <div className="bg-yellow-50 rounded p-3">
            <p className="text-2xl font-bold text-yellow-600">{content.mediumSeverity as number}</p>
            <p className="text-xs text-gray-500">注意</p>
          </div>
          <div className="bg-gray-50 rounded p-3">
            <p className="text-2xl font-bold text-gray-600">{content.lowSeverity as number}</p>
            <p className="text-xs text-gray-500">軽微</p>
          </div>
        </div>
      </div>

      {/* Rule breakdown */}
      {(content.violationsByRule as Array<Record<string, unknown>>).length > 0 && (
        <div className="bg-white border rounded-lg p-5">
          <h2 className="font-bold mb-3">ルール別逸脱回数</h2>
          <div className="space-y-2">
            {(content.violationsByRule as Array<Record<string, unknown>>).map(
              (vr, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-sm w-48 shrink-0">{vr.name as string}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        vr.severity === "high"
                          ? "bg-red-500"
                          : vr.severity === "medium"
                          ? "bg-yellow-500"
                          : "bg-gray-400"
                      }`}
                      style={{
                        width: `${Math.min(
                          ((vr.count as number) / (content.totalViolations as number)) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-bold w-10 text-right">
                    {vr.count as number}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Suggestions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
        <h2 className="font-bold text-blue-800 mb-3">改善提案</h2>
        <ul className="space-y-2">
          {suggestions.map((s, i) => (
            <li key={i} className="text-sm text-blue-900 flex items-start gap-2">
              <span>&#x1F4A1;</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Trade list with violations */}
      <div className="bg-white border rounded-lg p-5">
        <h2 className="font-bold mb-3">トレード一覧（逸脱あり）</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-2">日時</th>
                <th className="text-left p-2">通貨ペア</th>
                <th className="text-left p-2">売買</th>
                <th className="text-right p-2">ロット</th>
                <th className="text-right p-2">損益</th>
                <th className="text-left p-2">逸脱</th>
              </tr>
            </thead>
            <tbody>
              {trades
                .filter((t) =>
                  violations.some((v) => v.tradeId === t.id)
                )
                .map((t) => {
                  const tradeViolations = violations.filter(
                    (v) => v.tradeId === t.id
                  );
                  return (
                    <tr key={t.id as string} className="border-b hover:bg-gray-50">
                      <td className="p-2 whitespace-nowrap">
                        {new Date(t.dateTime as string).toLocaleString("ja-JP")}
                      </td>
                      <td className="p-2">{t.symbol as string}</td>
                      <td className="p-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-xs font-bold ${
                            t.side === "BUY"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {t.side as string}
                        </span>
                      </td>
                      <td className="p-2 text-right">{t.lotSize as number}</td>
                      <td
                        className={`p-2 text-right font-medium ${
                          (t.pnl as number) >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {t.pnl !== null
                          ? `${(t.pnl as number) >= 0 ? "+" : ""}${t.pnl}`
                          : "-"}
                      </td>
                      <td className="p-2">
                        {tradeViolations.map((v, i) => (
                          <span
                            key={i}
                            className={`inline-block mr-1 mb-1 px-1.5 py-0.5 rounded text-xs ${
                              v.severity === "high"
                                ? "bg-red-100 text-red-700"
                                : v.severity === "medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {(v.message as string).slice(0, 20)}...
                          </span>
                        ))}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center">
        ※本ツールは自己分析支援を目的としており、投資助言ではありません。投資判断は自己責任でお願いします。
      </p>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="bg-white p-3 rounded-lg shadow-sm border text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p
        className={`text-xl font-bold ${
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

export default function AnalysisPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-8 text-center text-gray-500">読み込み中...</div>}>
      <AnalysisContent />
    </Suspense>
  );
}
