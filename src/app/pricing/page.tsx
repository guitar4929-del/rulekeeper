"use client";

import { usePaddleCheckout } from "@/components/PaddleCheckout";
import {
  PADDLE_STANDARD_PRICE_ID,
  PADDLE_PRO_PRICE_ID,
} from "@/lib/paddle";

type Plan = {
  name: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  href: string | null;
  priceId: string | null;
  highlight: boolean;
};

export default function PricingPage() {
  const { openCheckout } = usePaddleCheckout();

  const plans: Plan[] = [
    {
      name: "\u7121\u6599\u30D7\u30E9\u30F3",
      price: "0",
      period: "",
      features: [
        "\u6708\uFF13\u56DE\u307E\u3067CSV\u5206\u6790",
        "\u57FA\u672C\uFF18\u30EB\u30FC\u30EB\u691C\u77E5",
        "\u5206\u6790\u30EC\u30DD\u30FC\u30C8\u8868\u793A",
        "\u6539\u5584\u63D0\u6848\uFF08\u7C21\u6613\u7248\uFF09",
      ],
      cta: "\u7121\u6599\u3067\u59CB\u3081\u308B",
      href: "/upload",
      priceId: null,
      highlight: false,
    },
    {
      name: "\u30B9\u30BF\u30F3\u30C0\u30FC\u30C9",
      price: "1,980",
      period: "/\u6708",
      features: [
        "CSV\u5206\u6790 \u7121\u5236\u9650",
        "\u5168\u30EB\u30FC\u30EB\u691C\u77E5",
        "\u8A73\u7D30\u30EC\u30DD\u30FC\u30C8",
        "\u6539\u5584\u63D0\u6848\uFF08\u8A73\u7D30\u7248\uFF09",
        "\u5206\u6790\u5C65\u6B74\u4FDD\u5B58",
        "\u9031\u6B21\u30EC\u30DD\u30FC\u30C8\u81EA\u52D5\u751F\u6210",
      ],
      cta: "\u30B9\u30BF\u30F3\u30C0\u30FC\u30C9\u3092\u59CB\u3081\u308B",
      href: null,
      priceId: PADDLE_STANDARD_PRICE_ID,
      highlight: true,
    },
    {
      name: "\u30D7\u30ED",
      price: "4,980",
      period: "/\u6708",
      features: [
        "\u30B9\u30BF\u30F3\u30C0\u30FC\u30C9\u306E\u5168\u6A5F\u80FD",
        "\u30AB\u30B9\u30BF\u30E0\u30EB\u30FC\u30EB\u4F5C\u6210",
        "\u6708\u6B21\u30D1\u30D5\u30A9\u30FC\u30DE\u30F3\u30B9\u5206\u6790",
        "\u8907\u6570\u53E3\u5EA7\u5BFE\u5FDC",
        "CSV\u4E00\u62EC\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9",
        "\u512A\u5148\u30B5\u30DD\u30FC\u30C8",
      ],
      cta: "\u30D7\u30ED\u3092\u59CB\u3081\u308B",
      href: null,
      priceId: PADDLE_PRO_PRICE_ID,
      highlight: false,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-4">料金プラン</h1>
      <p className="text-center text-gray-600 mb-12">
        まずは無料で体験。あなたのトレードスタイルに合ったプランをお選びください。
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-lg p-6 border-2 ${
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
            <h3 className="font-bold text-lg mb-2">{plan.name}</h3>
            <div className="mb-4">
              <span className="text-3xl font-bold">
                &yen;{plan.price}
              </span>
              <span className="text-gray-500 text-sm">{plan.period}</span>
            </div>
            <ul className="space-y-2 mb-6">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-green-500 mt-0.5">&#x2714;</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            {plan.href ? (
              <a
                href={plan.href}
                className={`block text-center py-2 rounded-lg font-medium transition-colors ${
                  plan.highlight
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {plan.cta}
              </a>
            ) : (
              <button
                type="button"
                onClick={() => plan.priceId && openCheckout(plan.priceId)}
                className={`block w-full text-center py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                  plan.highlight
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {plan.cta}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">よくある質問</h2>
        <div className="space-y-4">
          {[
            {
              q: "どの取引所のCSVに対応していますか？",
              a: "カラム名の自動推定機能があるため、日時・通貨ペア・売買・ロット・エントリー価格が含まれるCSVであれば対応可能です。MT4/MT5、bitFlyer、bybitなどの一般的なフォーマットに対応しています。",
            },
            {
              q: "投資助言にあたりますか？",
              a: "いいえ。本ツールはトレーダー自身による自己分析を支援するものであり、売買の指示や推奨は一切行いません。",
            },
            {
              q: "データは安全ですか？",
              a: "アップロードされたCSVデータはお客様のブラウザとサーバー間で暗号化通信されます。第三者へのデータ提供は行いません。",
            },
            {
              q: "解約はいつでもできますか？",
              a: "はい。月額プランはいつでも解約可能で、解約後も当月末まで利用できます。",
            },
            {
              q: "返金保証はありますか？",
              a: "初回購入から7日以内であれば全額返金いたします。",
            },
          ].map((item, i) => (
            <div key={i} className="bg-white border rounded-lg p-5">
              <h3 className="font-bold mb-2">{item.q}</h3>
              <p className="text-sm text-gray-600">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center mt-8">
        ※料金は税込み表示です。※本ツールは投資助言ではありません。
      </p>
    </div>
  );
}
