import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RuleKeeper - トレードルール逸脱検知ツール",
  description:
    "CSVを読み込むだけで、あなたのトレードルール逸脱を検知し、改善提案を提示します。FX・暗号資産・先物トレーダーのための自己分析支援ツール。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-blue-600">
              RuleKeeper
            </a>
            <div className="flex items-center gap-6 text-sm">
              <a href="/upload" className="hover:text-blue-600 transition-colors">
                CSV分析
              </a>
              <a href="/rules" className="hover:text-blue-600 transition-colors">
                ルール設定
              </a>
              <a href="/dashboard" className="hover:text-blue-600 transition-colors">
                ダッシュボード
              </a>
              <a href="/pricing" className="hover:text-blue-600 transition-colors">
                料金
              </a>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
