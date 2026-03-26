export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            CSVを読み込むだけで
            <br />
            あなたの悪癖が見える
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            トレード履歴から、ルール逸脱を自動検知。
            <br />
            損切りずらし、ロット暴走、感情トレードを可視化します。
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/upload"
              className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
            >
              無料で分析する
            </a>
            <a
              href="/pricing"
              className="border border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              料金を見る
            </a>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">
            こんな経験、ありませんか？
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "毎回同じミスで負けてしまう",
              "損切りをずらして大損した",
              "ロットを上げすぎて資金を飛ばした",
              "連敗後にムキになってエントリーした",
              "利確が早すぎて利益を逃している",
              "週末の振り返りが面倒で続かない",
            ].map((text, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 bg-red-50 rounded-lg"
              >
                <span className="text-red-500 text-lg mt-0.5">&#x2716;</span>
                <p className="text-gray-700">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">
            RuleKeeperが解決します
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "1. CSVをアップロード",
                desc: "取引所やMT4/MT5の履歴CSVをドラッグ&ドロップするだけ",
              },
              {
                title: "2. 自動でルール逸脱を検知",
                desc: "8種類のルールで、損切り変更・ロット暴走・連敗後エントリーなどを検出",
              },
              {
                title: "3. 改善提案を受け取る",
                desc: "あなたの最大の弱点と、具体的な改善ポイントが分かる",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-lg mb-2 text-blue-600">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">
            検知できるルール逸脱
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { rule: "1トレード最大損失の超過", severity: "重大" },
              { rule: "最大ロットの超過", severity: "重大" },
              { rule: "連敗後のクールダウン違反", severity: "重大" },
              { rule: "ナンピン（損失中の追加エントリー）", severity: "重大" },
              { rule: "損切り価格の変更（先延ばし）", severity: "重大" },
              { rule: "利確が早すぎる傾向", severity: "注意" },
              { rule: "同方向への連続エントリー", severity: "注意" },
              { rule: "エントリー理由の未記入", severity: "軽微" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 border rounded-lg"
              >
                <span
                  className={`text-xs font-bold px-2 py-1 rounded ${
                    item.severity === "重大"
                      ? "bg-red-100 text-red-700"
                      : item.severity === "注意"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {item.severity}
                </span>
                <span className="text-sm">{item.rule}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">
            まずは無料で、あなたのトレードを分析してみましょう
          </h2>
          <p className="text-blue-100 mb-8">
            本ツールは投資助言ではありません。トレーダー自身の自己分析を支援するツールです。
          </p>
          <a
            href="/upload"
            className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors inline-block"
          >
            CSVをアップロードして分析する
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>&copy; 2026 RuleKeeper</p>
          <div className="flex gap-6">
            <a href="/terms" className="hover:text-white">
              利用規約
            </a>
            <a href="/disclaimer" className="hover:text-white">
              免責事項
            </a>
            <a href="/pricing" className="hover:text-white">
              料金
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
