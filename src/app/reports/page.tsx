"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ReportsContent() {
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
        <a href="/dashboard" className="text-blue-600 hover:underline text-sm">
          ダッシュボードへ
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
        <p className="text-gray-500">レポートがありません</p>
      </div>
    );
  }

  const report = data.report as Record<string, unknown>;
  const content = report.content as Record<string, unknown>;
  const suggestions = (report.suggestions as string).split("\n").filter(Boolean);
  const violations = data.violations as Array<Record<string, unknown>>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">レポート</h1>
        <button
          onClick={() => window.print()}
          className="text-sm border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 transition-colors"
        >
          印刷 / PDF保存
        </button>
      </div>

      {/* Report Header */}
      <div className="bg-white border rounded-lg p-6 print:shadow-none">
        <h2 className="text-lg font-bold mb-1">トレード分析レポート</h2>
        <p className="text-sm text-gray-500 mb-4">
          生成日: {new Date(report.createdAt as string).toLocaleString("ja-JP")}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded">
            <p className="text-2xl font-bold">{content.totalTrades as number}</p>
            <p className="text-xs text-gray-500">総トレード数</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded">
            <p
              className={`text-2xl font-bold ${
                (content.totalPnl as number) >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {(content.totalPnl as number) >= 0 ? "+" : ""}
              {content.totalPnl as number}
            </p>
            <p className="text-xs text-gray-500">合計損益</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded">
            <p className="text-2xl font-bold">{content.winRate as number}%</p>
            <p className="text-xs text-gray-500">勝率</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded">
            <p className="text-2xl font-bold text-red-600">
              {content.totalViolations as number}
            </p>
            <p className="text-xs text-gray-500">ルール逸脱</p>
          </div>
        </div>

        {/* Violation breakdown */}
        <h3 className="font-bold mb-2">逸脱内訳</h3>
        <div className="space-y-1 mb-6">
          {(content.violationsByRule as Array<Record<string, unknown>>).map(
            (vr, i) => (
              <div
                key={i}
                className="flex justify-between text-sm py-1 border-b border-gray-100"
              >
                <span>{vr.name as string}</span>
                <span className="font-bold">{vr.count as number}件</span>
              </div>
            )
          )}
        </div>

        {/* Suggestions */}
        <h3 className="font-bold mb-2">改善提案</h3>
        <div className="bg-blue-50 p-4 rounded">
          <ol className="space-y-2 list-decimal list-inside">
            {suggestions.map((s, i) => (
              <li key={i} className="text-sm text-blue-900">
                {s}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Full violation list */}
      <div className="bg-white border rounded-lg p-6 print:shadow-none">
        <h2 className="font-bold mb-3">全逸脱リスト</h2>
        <div className="space-y-2">
          {violations.map((v, i) => {
            const trade = v.trade as Record<string, unknown>;
            return (
              <div
                key={i}
                className={`p-3 rounded text-sm ${
                  v.severity === "high"
                    ? "bg-red-50"
                    : v.severity === "medium"
                    ? "bg-yellow-50"
                    : "bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span
                      className={`text-xs font-bold px-1.5 py-0.5 rounded mr-2 ${
                        v.severity === "high"
                          ? "bg-red-200 text-red-800"
                          : v.severity === "medium"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {v.severity === "high"
                        ? "重大"
                        : v.severity === "medium"
                        ? "注意"
                        : "軽微"}
                    </span>
                    <span className="font-medium">{v.message as string}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(trade.dateTime as string).toLocaleString("ja-JP")}{" "}
                  | {trade.symbol as string} | {trade.side as string} |{" "}
                  {trade.lotSize as number}ロット
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center print:hidden">
        ※本レポートは自己分析支援を目的としており、投資助言ではありません。
      </p>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-8 text-center text-gray-500">読み込み中...</div>}>
      <ReportsContent />
    </Suspense>
  );
}
