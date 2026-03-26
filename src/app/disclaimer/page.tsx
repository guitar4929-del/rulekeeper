export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-8">免責事項</h1>
      <div className="prose prose-sm max-w-none space-y-6 text-gray-700">
        <section>
          <h2 className="text-lg font-bold text-gray-900">投資助言に関する免責</h2>
          <p>
            RuleKeeper（以下「本サービス」）は、ユーザー自身のトレード履歴を分析し、
            ユーザーが設定したルールとの照合結果を表示する自己分析支援ツールです。
          </p>
          <p className="font-bold">
            本サービスは、金融商品取引法に定める投資助言・代理業には該当しません。
            本サービスが提供する情報は、売買の推奨や投資判断の助言ではありません。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">損害に関する免責</h2>
          <p>
            本サービスの分析結果・改善提案に基づいて行った投資判断により生じた損害について、
            運営者は一切の責任を負いません。すべての投資判断は、ユーザーの自己責任において
            行われるものとします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">分析精度に関する免責</h2>
          <p>
            本サービスの分析結果は、ユーザーがアップロードしたCSVデータの内容に依存します。
            データの不備・誤り・欠損がある場合、分析結果が正確でない場合があります。
            分析結果の正確性・完全性を保証するものではありません。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">サービスの提供に関する免責</h2>
          <p>
            運営者は、本サービスの継続的な提供を保証するものではありません。
            システム障害・メンテナンス等により、一時的にサービスを停止する場合があります。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900">データの取扱い</h2>
          <p>
            アップロードされたトレードデータは分析処理のために使用されます。
            第三者への提供は行いませんが、データの安全性を100%保証するものではありません。
            機密性の高いデータのアップロードはお控えください。
          </p>
        </section>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-8">
          <p className="text-sm font-bold text-yellow-800">
            重要: 投資にはリスクが伴います。本サービスの利用は、
            投資の利益を保証するものではありません。
            トレードに関する最終的な判断は、必ずご自身の責任において行ってください。
          </p>
        </div>

        <p className="text-xs text-gray-400 mt-8">
          制定日: 2026年3月26日
        </p>
      </div>
    </div>
  );
}
