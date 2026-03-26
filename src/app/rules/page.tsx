"use client";

import { useState, useEffect } from "react";

interface Rule {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  params: Record<string, number>;
}

const PARAM_LABELS: Record<string, Record<string, string>> = {
  max_loss: { maxLoss: "最大損失額" },
  max_lot: { maxLot: "最大ロット数" },
  cooldown: { consecutiveLosses: "連敗回数", cooldownMinutes: "クールダウン(分)" },
  no_averaging: { timeWindowMinutes: "判定時間(分)" },
  sl_modification: {},
  early_tp: { tpRatio: "利確達成率(0-1)" },
  consecutive_entry: { maxConsecutive: "最大連続回数" },
  no_reason: {},
};

export default function RulesPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/rules")
      .then((r) => r.json())
      .then(setRules)
      .finally(() => setLoading(false));
  }, []);

  const toggleRule = async (rule: Rule) => {
    setSaving(rule.id);
    const res = await fetch("/api/rules", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: rule.id, enabled: !rule.enabled }),
    });
    const updated = await res.json();
    setRules((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setSaving(null);
  };

  const updateParam = async (rule: Rule, key: string, value: number) => {
    setSaving(rule.id);
    const newParams = { ...rule.params, [key]: value };
    const res = await fetch("/api/rules", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: rule.id, params: newParams }),
    });
    const updated = await res.json();
    setRules((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setSaving(null);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-center text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">ルール設定</h1>
      <p className="text-gray-600 mb-6">
        トレードルールのON/OFFとパラメータを設定してください。
      </p>

      <div className="space-y-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`bg-white border rounded-lg p-5 transition-opacity ${
              !rule.enabled ? "opacity-60" : ""
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleRule(rule)}
                  disabled={saving === rule.id}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    rule.enabled ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      rule.enabled ? "left-6" : "left-0.5"
                    }`}
                  />
                </button>
                <h3 className="font-bold">{rule.name}</h3>
              </div>
              {saving === rule.id && (
                <span className="text-xs text-gray-400">保存中...</span>
              )}
            </div>

            {rule.enabled && Object.keys(PARAM_LABELS[rule.type] || {}).length > 0 && (
              <div className="flex flex-wrap gap-4 mt-2">
                {Object.entries(PARAM_LABELS[rule.type] || {}).map(
                  ([paramKey, paramLabel]) => (
                    <div key={paramKey} className="flex items-center gap-2">
                      <label className="text-sm text-gray-600">
                        {paramLabel}:
                      </label>
                      <input
                        type="number"
                        value={rule.params[paramKey] ?? ""}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val)) updateParam(rule, paramKey, val);
                        }}
                        className="w-24 border rounded px-2 py-1 text-sm"
                        step={paramKey.includes("Ratio") ? 0.1 : 1}
                      />
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-6 text-center">
        ※ルール設定を変更後、再度CSVを分析すると新しい設定が反映されます。
      </p>
    </div>
  );
}
