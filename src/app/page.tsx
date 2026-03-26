export default function Home() {
  return (
    <div>
      {/* Announcement Bar */}
      <div className="bg-blue-600 text-white text-center py-2.5 text-sm">
        CSV1つで分析完了 ── まず1週間分の履歴から、負けパターンを見つける
        <a href="/upload" className="underline font-semibold hover:text-blue-100">
          無料で始める →
        </a>
      </div>

      {/* Hero */}
      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-4 pt-20 pb-16">
          <div className="max-w-3xl">
            <p className="inline-block text-sm text-blue-600 border border-blue-200 bg-blue-50 rounded-full px-4 py-1.5 mb-6">
              FX・暗号資産・先物トレーダーの自己分析ツール
            </p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-gray-900">
              なぜ同じミスを
              <br />
              繰り返すのか──
              <br />
              <span className="text-blue-600">データが教えてくれる。</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-xl leading-relaxed">
              「なんとなく負けた」を終わりにする。CSVを読み込むだけで
              ルール逸脱を自動検知し、「何を直すべきか」を数字で整理します。
            </p>

            {/* Sample Analysis Box */}
            <div className="bg-gray-50 border rounded-xl p-5 mb-8 max-w-lg">
              <p className="text-xs text-gray-500 mb-3">分析レポート例（サンプル）</p>
              <div className="space-y-2.5">
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">&#x2714;</span>
                  <p className="text-sm text-gray-700">
                    負けトレードの<span className="font-bold text-red-600">67%</span>にルール逸脱
                    ── ルールを守るだけで勝率改善が期待できます
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">&#x2714;</span>
                  <p className="text-sm text-gray-700">
                    最多の逸脱は「<span className="font-bold">エントリー理由が未記入</span>」（9回）
                    ── 感情トレードの兆候
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">&#x2714;</span>
                  <p className="text-sm text-gray-700">
                    損切り拡大<span className="font-bold text-red-600">4回</span>検出
                    ── 損切りずらしが最大の損失原因
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <a
                href="/upload"
                className="bg-blue-600 text-white font-semibold px-8 py-3.5 rounded-lg hover:bg-blue-700 transition-colors text-center"
              >
                無料で分析する（30秒）
              </a>
              <a
                href="#features"
                className="border border-gray-300 text-gray-700 font-medium px-8 py-3.5 rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                機能を見る →
              </a>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-400">
              <span>&#x2714; 登録不要</span>
              <span>&#x2714; CSV読み込みだけで完結</span>
              <span>&#x2714; 月3回まで無料</span>
              <span>&#x2714; いつでも解約可</span>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Markets */}
      <section className="border-t border-b bg-white py-8">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-center text-sm text-gray-500 mb-5">
            あらゆるルールベースのトレードに対応
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {["FX・為替", "暗号資産", "日本株・米国株", "先物・商品", "CFD", "オプション"].map(
              (market) => (
                <span
                  key={market}
                  className="border rounded-full px-4 py-2 text-sm text-gray-600 bg-gray-50"
                >
                  {market}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
            負けた理由が曖昧なまま、次のトレードに入っていませんか
          </h2>
          <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
            勝てない原因は、手法そのものではなく、ルール破りや感情の乱れにあることが
            少なくありません。それでも多くのトレーダーは、結果だけを見て終わってしまいます。
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-10">
            {[
              "ルール通りだったのに負けたのか",
              "そもそもルールを破っていたのか",
              "どの時間帯で崩れやすいのか",
              "どの状況でミスが増えるのか",
            ].map((text, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-5 bg-red-50 rounded-xl"
              >
                <span className="text-red-400 text-lg shrink-0">&#x2753;</span>
                <p className="text-gray-700">{text}</p>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <p className="text-gray-500 mb-2">これが分からない限り、改善は積み上がりません。</p>
            <p className="font-bold text-lg text-gray-900">
              このサービスは、その曖昧さをなくすためのツールです。
            </p>
          </div>
        </div>
      </section>

      {/* Target Personas */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-center text-sm text-blue-600 mb-3">こんな方が使っています</p>
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            あなたはどれかに当てはまりますか？
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "&#x1F4C9;",
                title: "連敗で資金を飛ばした方",
                desc: "「ロットを上げてはいけない」と分かっているのに、連敗後に取り返そうとしてしまう",
              },
              {
                icon: "&#x1F4D3;",
                title: "日誌をつけているが活かせない方",
                desc: "記録はあるが、振り返りの仕方が分からず、同じミスを繰り返している",
              },
              {
                icon: "&#x1F525;",
                title: "ルール志向のトレーダー",
                desc: "「ルールは決めているのに、また同じところで違反してしまう」",
              },
              {
                icon: "&#x1F916;",
                title: "データで改善したい方",
                desc: "自分のトレードをもっと客観的に分析したいが、どこから始めればいいか分からない",
              },
            ].map((persona, i) => (
              <div key={i} className="bg-white border rounded-xl p-6">
                <span className="text-3xl" dangerouslySetInnerHTML={{ __html: persona.icon }} />
                <h3 className="font-bold mt-3 mb-2 text-gray-900">{persona.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{persona.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-blue-200 text-sm mb-3">ソリューション</p>
          <h2 className="text-3xl font-bold mb-4">
            記録だけでは終わらない。
            <br />
            改善まで回る設計
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto leading-relaxed">
            RuleKeeperは、CSVを保存するだけのツールではありません。
            ルール順守状況をひとつの流れで整理し、自分の勝ち方と負け方を振り返れるようにします。
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-center text-sm text-blue-600 mb-3">使い方</p>
          <h2 className="text-3xl font-bold text-center mb-14 text-gray-900">
            3ステップで、あなたの弱点が分かる
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "CSVをアップロード",
                desc: "MT4/MT5・bitFlyer・bybit等の取引履歴CSVをドラッグ&ドロップ。列名は自動推定されるので面倒な設定は不要。",
                color: "bg-blue-50 text-blue-600",
              },
              {
                step: "02",
                title: "8種のルールで自動検知",
                desc: "損切りずらし・ロット暴走・ナンピン・連敗後エントリーなど、よくある逸脱パターンを自動スキャン。",
                color: "bg-green-50 text-green-600",
              },
              {
                step: "03",
                title: "改善提案を受け取る",
                desc: "「負けトレードの67%にルール逸脱」「最大の弱点は損切りずらし」── 具体的な改善ポイントをレポート。",
                color: "bg-purple-50 text-purple-600",
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl text-xl font-bold mb-4 ${item.color}`}
                >
                  {item.step}
                </div>
                <h3 className="font-bold text-lg mb-3 text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Detail */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-center text-sm text-blue-600 mb-3">分析機能</p>
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
            検知できるルール逸脱
          </h2>
          <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
            トレーダーが実際に陥りやすい8種の逸脱パターンを、CSVデータから自動で検出します。
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                rule: "1トレード最大損失の超過",
                desc: "設定した許容損失額を超えたトレードを検出",
                severity: "重大",
              },
              {
                rule: "最大ロットの超過",
                desc: "ロットサイズが上限を超えたトレードを検出",
                severity: "重大",
              },
              {
                rule: "連敗後のクールダウン違反",
                desc: "N連敗後に休憩を取らずエントリーしたケース",
                severity: "重大",
              },
              {
                rule: "ナンピン（損失中の追加エントリー）",
                desc: "損失ポジション保有中に同方向の追加エントリー",
                severity: "重大",
              },
              {
                rule: "損切り価格の変更（先延ばし）",
                desc: "損切りを不利な方向にずらした形跡を検出",
                severity: "重大",
              },
              {
                rule: "利確が早すぎる傾向（チキン利食い）",
                desc: "目標利幅に対して大幅に手前で利確したケース",
                severity: "注意",
              },
              {
                rule: "同方向への連続エントリー",
                desc: "同じ銘柄・同方向に設定回数以上連続エントリー",
                severity: "注意",
              },
              {
                rule: "エントリー理由の未記入",
                desc: "理由なきトレード = 感情トレードの可能性",
                severity: "軽微",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-5 bg-white border rounded-xl"
              >
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded shrink-0 mt-0.5 ${
                    item.severity === "重大"
                      ? "bg-red-100 text-red-700"
                      : item.severity === "注意"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {item.severity}
                </span>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{item.rule}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Report */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-center text-sm text-blue-600 mb-3">レポート例</p>
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
            分析結果は、こんな形で届きます
          </h2>
          <p className="text-center text-gray-500 mb-10 max-w-xl mx-auto">
            サンプルCSV（25トレード）を分析した結果の一部です。
          </p>

          <div className="bg-gray-50 border rounded-2xl p-6 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "総トレード数", value: "25", color: "" },
                { label: "合計損益", value: "-46,650", color: "text-red-600" },
                { label: "勝率", value: "40%", color: "" },
                { label: "ルール逸脱", value: "35件", color: "text-red-600" },
              ].map((stat, i) => (
                <div key={i} className="text-center p-4 bg-white rounded-xl border">
                  <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color || "text-gray-900"}`}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-sm mb-3 text-gray-900">逸脱内訳</h3>
              <div className="space-y-2">
                {[
                  { name: "エントリー理由が未記入", count: 9, pct: 26 },
                  { name: "利確が早すぎる傾向", count: 8, pct: 23 },
                  { name: "最大ロットの超過", count: 4, pct: 11 },
                  { name: "ナンピン禁止", count: 4, pct: 11 },
                  { name: "損切り変更の警告", count: 4, pct: 11 },
                  { name: "同方向連続エントリー", count: 4, pct: 11 },
                  { name: "1トレード最大損失", count: 2, pct: 6 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs w-44 shrink-0 text-gray-600">{item.name}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold w-8 text-right text-gray-700">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
              <h3 className="font-bold text-sm mb-2 text-blue-800">改善提案</h3>
              <ul className="space-y-2">
                {[
                  "最も多い逸脱は「エントリー理由が未記入」（9回）。理由を書くことで感情トレードの抑制につながります。",
                  "重大な逸脱が14件あります。特にロット管理と損切りルールの徹底が必要です。",
                  "負けトレードの67%にルール逸脱があります。ルールを守るだけで勝率改善が期待できます。",
                ].map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-blue-900">
                    <span className="mt-0.5 shrink-0">&#x1F4A1;</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-center text-sm text-blue-600 mb-3">料金</p>
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
            まずは無料で試す。納得してから始める。
          </h2>
          <p className="text-center text-gray-500 mb-12">
            無料プランだけでも基本機能は使えます。
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "無料",
                price: "0",
                period: "",
                features: ["月3回CSV分析", "基本8ルール検知", "分析レポート"],
                cta: "無料で始める",
                href: "/upload",
                highlight: false,
              },
              {
                name: "スタンダード",
                price: "1,980",
                period: "/月",
                features: ["CSV分析 無制限", "詳細レポート", "分析履歴保存", "週次レポート"],
                cta: "スタンダードを始める",
                href: "/pricing",
                highlight: true,
              },
              {
                name: "プロ",
                price: "4,980",
                period: "/月",
                features: ["全機能", "カスタムルール", "複数口座対応", "優先サポート"],
                cta: "プロを始める",
                href: "/pricing",
                highlight: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 border-2 ${
                  plan.highlight
                    ? "border-blue-600 bg-blue-50 relative"
                    : "border-gray-200 bg-white"
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                    おすすめ
                  </span>
                )}
                <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">&yen;{plan.price}</span>
                  <span className="text-gray-500 text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <span className="text-green-500">&#x2714;</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={plan.href}
                  className={`block text-center py-2.5 rounded-lg font-medium transition-colors ${
                    plan.highlight
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-center text-sm text-blue-600 mb-3">FAQ</p>
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            よくある質問
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "どの取引所のCSVに対応していますか？",
                a: "列名を自動推定するため、日時・通貨ペア・売買・ロット・エントリー価格が含まれるCSVであれば対応可能です。MT4/MT5、bitFlyer、bybit等の一般的なフォーマットに対応しています。英語・日本語どちらの列名にも対応します。",
              },
              {
                q: "投資助言にあたりますか？",
                a: "いいえ。本ツールはトレーダー自身が設定したルールとの照合結果を表示する自己分析支援ツールです。売買の推奨や投資判断の助言は一切行いません。",
              },
              {
                q: "データは安全ですか？",
                a: "アップロードされたCSVデータは暗号化通信で処理されます。第三者へのデータ提供は行いません。",
              },
              {
                q: "解約はいつでもできますか？",
                a: "はい。月額プランはいつでも解約可能で、解約後も当月末まで利用できます。",
              },
              {
                q: "無料プランだけでも使えますか？",
                a: "はい。月3回までCSV分析が可能で、8種のルール検知・レポート・改善提案を受け取れます。まずは無料でお試しください。",
              },
            ].map((item, i) => (
              <div key={i} className="border rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">
            まずは1回、分析してみてください
          </h2>
          <p className="text-blue-100 mb-8 leading-relaxed">
            CSVをアップロードするだけで、あなたのトレードの「弱点」が数字で見えます。
            <br />
            改善すべきことが分かれば、次のトレードが変わります。
          </p>
          <a
            href="/upload"
            className="bg-white text-blue-600 font-semibold px-10 py-4 rounded-lg hover:bg-blue-50 transition-colors inline-block text-lg"
          >
            無料で分析する →
          </a>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-blue-200 mt-5">
            <span>&#x2714; 登録不要</span>
            <span>&#x2714; CSV読み込みだけ</span>
            <span>&#x2714; 30秒で結果が出る</span>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-gray-100">
        <div className="max-w-3xl mx-auto px-4 text-center text-xs text-gray-400 space-y-1">
          <p>
            ※本ツールは自己分析支援を目的としており、金融商品取引法に定める投資助言には該当しません。
          </p>
          <p>
            ※売買の推奨、利益の保証は一切行いません。投資判断は自己責任でお願いします。
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
            <div>
              <p className="text-white font-bold text-lg mb-2">RuleKeeper</p>
              <p className="text-sm">CSVを読み込むだけで、トレードの悪癖が見える。</p>
            </div>
            <div className="flex gap-8 text-sm">
              <div className="space-y-2">
                <p className="text-white font-medium">プロダクト</p>
                <a href="/upload" className="block hover:text-white">CSV分析</a>
                <a href="/rules" className="block hover:text-white">ルール設定</a>
                <a href="/dashboard" className="block hover:text-white">ダッシュボード</a>
                <a href="/pricing" className="block hover:text-white">料金</a>
              </div>
              <div className="space-y-2">
                <p className="text-white font-medium">サポート</p>
                <a href="/terms" className="block hover:text-white">利用規約</a>
                <a href="/disclaimer" className="block hover:text-white">免責事項</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-xs text-center">
            <p>&copy; 2026 RuleKeeper. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
