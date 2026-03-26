import { prisma } from "./prisma";

export const DEFAULT_RULES = [
  {
    name: "1トレード最大損失",
    type: "max_loss",
    params: { maxLoss: 10000 },
  },
  {
    name: "最大ロット",
    type: "max_lot",
    params: { maxLot: 1.0 },
  },
  {
    name: "連敗後クールダウン",
    type: "cooldown",
    params: { consecutiveLosses: 3, cooldownMinutes: 60 },
  },
  {
    name: "ナンピン禁止",
    type: "no_averaging",
    params: { timeWindowMinutes: 30 },
  },
  {
    name: "損切り変更の警告",
    type: "sl_modification",
    params: {},
  },
  {
    name: "利確が早すぎる傾向",
    type: "early_tp",
    params: { tpRatio: 0.5 },
  },
  {
    name: "同方向連続エントリー",
    type: "consecutive_entry",
    params: { maxConsecutive: 3 },
  },
  {
    name: "エントリー理由未記入",
    type: "no_reason",
    params: {},
  },
];

export async function seedRulesIfEmpty() {
  const count = await prisma.rule.count();
  if (count === 0) {
    for (const rule of DEFAULT_RULES) {
      await prisma.rule.create({
        data: {
          name: rule.name,
          type: rule.type,
          enabled: true,
          params: JSON.stringify(rule.params),
        },
      });
    }
  }
}
