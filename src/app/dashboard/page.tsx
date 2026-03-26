"use client";

import { useState, useEffect } from "react";

interface Session {
  id: string;
  fileName: string;
  uploadedAt: string;
  tradeCount: number;
  _count: { violations: number };
  reports: Array<{
    id: string;
    content: string;
    suggestions: string;
  }>;
}

export default function DashboardPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reports")
      .then((r) => r.json())
      .then(setSessions)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-center text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">ダッシュボード</h1>
      <p className="text-gray-600 mb-6">
        アップロード済みの分析結果を一覧表示します。
      </p>

      {sessions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border">
          <p className="text-4xl mb-4">&#x1F4CA;</p>
          <p className="text-gray-500 mb-4">まだ分析結果がありません</p>
          <a
            href="/upload"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors inline-block"
          >
            CSVをアップロードする
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => {
            const report = session.reports[0];
            const content = report ? JSON.parse(report.content) : null;

            return (
              <div key={session.id} className="bg-white border rounded-lg p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold">{session.fileName}</h3>
                    <p className="text-xs text-gray-400">
                      {new Date(session.uploadedAt).toLocaleString("ja-JP")}
                    </p>
                  </div>
                  <a
                    href={`/analysis?sessionId=${session.id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    詳細を見る →
                  </a>
                </div>

                {content && (
                  <div className="grid grid-cols-4 gap-3 text-center text-sm">
                    <div className="bg-gray-50 rounded p-2">
                      <p className="text-gray-500 text-xs">トレード数</p>
                      <p className="font-bold">{content.totalTrades}</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <p className="text-gray-500 text-xs">合計損益</p>
                      <p
                        className={`font-bold ${
                          content.totalPnl >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {content.totalPnl >= 0 ? "+" : ""}
                        {content.totalPnl}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <p className="text-gray-500 text-xs">勝率</p>
                      <p className="font-bold">{content.winRate}%</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <p className="text-gray-500 text-xs">逸脱</p>
                      <p
                        className={`font-bold ${
                          session._count.violations > 0
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {session._count.violations}件
                      </p>
                    </div>
                  </div>
                )}

                {report && report.suggestions && (
                  <div className="mt-3 p-3 bg-blue-50 rounded text-xs text-blue-800">
                    <p className="font-medium mb-1">改善提案:</p>
                    <p>{report.suggestions.split("\n")[0]}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
