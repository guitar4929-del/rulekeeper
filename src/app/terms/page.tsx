export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-8">利用規約</h1>
      <div className="prose prose-sm max-w-none space-y-6 text-gray-700">
        <section>
          <h2 className="text-lg font-bold text-gray-900">第1条（適用）</h2>
          <p>
            本規約は、RuleKeeper（以下「本サービス」）の利用に関する条件を定めるものです。
            ユーザーは本サービスを利用することにより、本規約に同意したものとみなします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">第2条（サービス内容）</h2>
          <p>
            本サービスは、ユーザーがアップロードしたトレード履歴データ（CSV形式）に基づき、
            ユーザー自身が設定したルールとの照合結果を表示する自己分析支援ツールです。
          </p>
          <p>
            本サービスは、金融商品取引法に定める投資助言・代理業には該当しません。
            売買の推奨、投資判断の助言は一切行いません。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">第3条（禁止事項）</h2>
          <p>ユーザーは以下の行為をしてはなりません。</p>
          <ul className="list-disc list-inside space-y-1">
            <li>本サービスの不正利用・リバースエンジニアリング</li>
            <li>他のユーザーへの迷惑行為</li>
            <li>法令に違反する行為</li>
            <li>本サービスの分析結果を投資助言として第三者に提供する行為</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">第4条（免責）</h2>
          <p>
            本サービスの分析結果に基づく投資判断は、すべてユーザーの自己責任において行われるものとします。
            本サービスの利用により生じた損害について、運営者は一切の責任を負いません。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">第5条（データの取扱い）</h2>
          <p>
            アップロードされたCSVデータは分析処理のために一時的に保存されます。
            第三者への提供は行いません。ユーザーはいつでもデータの削除を要求できます。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">第6条（サービスの変更・終了）</h2>
          <p>
            運営者は、事前の通知なく本サービスの内容を変更、または提供を終了することがあります。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">第7条（規約の変更）</h2>
          <p>
            運営者は、本規約を変更する場合、変更後の規約を本サービス上に掲示した時点で
            効力が生じるものとします。
          </p>
        </section>

        <p className="text-xs text-gray-400 mt-8">
          制定日: 2026年3月26日
        </p>
      </div>
    </div>
  );
}
