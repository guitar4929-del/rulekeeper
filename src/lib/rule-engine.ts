export interface TradeData {
  id: string;
  dateTime: Date;
  symbol: string;
  side: string;
  lotSize: number;
  entryPrice: number;
  exitPrice: number | null;
  stopLoss: number | null;
  takeProfit: number | null;
  pnl: number | null;
  pnlPercent: number | null;
  duration: number | null;
  reason: string | null;
  memo: string | null;
  originalSL: number | null;
}

export interface RuleConfig {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  params: Record<string, unknown>;
}

export interface ViolationResult {
  ruleId: string;
  tradeId: string;
  severity: "high" | "medium" | "low";
  message: string;
  detail?: Record<string, unknown>;
}

export function detectViolations(
  trades: TradeData[],
  rules: RuleConfig[]
): ViolationResult[] {
  const violations: ViolationResult[] = [];
  const sorted = [...trades].sort(
    (a, b) => a.dateTime.getTime() - b.dateTime.getTime()
  );

  for (const rule of rules) {
    if (!rule.enabled) continue;

    switch (rule.type) {
      case "max_loss":
        violations.push(...checkMaxLoss(sorted, rule));
        break;
      case "max_lot":
        violations.push(...checkMaxLot(sorted, rule));
        break;
      case "cooldown":
        violations.push(...checkCooldown(sorted, rule));
        break;
      case "no_averaging":
        violations.push(...checkNoAveraging(sorted, rule));
        break;
      case "sl_modification":
        violations.push(...checkSLModification(sorted, rule));
        break;
      case "early_tp":
        violations.push(...checkEarlyTP(sorted, rule));
        break;
      case "consecutive_entry":
        violations.push(...checkConsecutiveEntry(sorted, rule));
        break;
      case "no_reason":
        violations.push(...checkNoReason(sorted, rule));
        break;
    }
  }

  return violations;
}

function checkMaxLoss(trades: TradeData[], rule: RuleConfig): ViolationResult[] {
  const maxLoss = rule.params.maxLoss as number;
  return trades
    .filter((t) => t.pnl !== null && t.pnl < -Math.abs(maxLoss))
    .map((t) => ({
      ruleId: rule.id,
      tradeId: t.id,
      severity: "high" as const,
      message: `1トレード損失が上限 ${maxLoss} を超過（実損: ${t.pnl}）`,
      detail: { maxLoss, actualLoss: t.pnl },
    }));
}

function checkMaxLot(trades: TradeData[], rule: RuleConfig): ViolationResult[] {
  const maxLot = rule.params.maxLot as number;
  return trades
    .filter((t) => t.lotSize > maxLot)
    .map((t) => ({
      ruleId: rule.id,
      tradeId: t.id,
      severity: "high" as const,
      message: `ロットサイズが上限 ${maxLot} を超過（実際: ${t.lotSize}）`,
      detail: { maxLot, actualLot: t.lotSize },
    }));
}

function checkCooldown(trades: TradeData[], rule: RuleConfig): ViolationResult[] {
  const consecutiveLosses = (rule.params.consecutiveLosses as number) || 3;
  const cooldownMinutes = (rule.params.cooldownMinutes as number) || 60;
  const results: ViolationResult[] = [];
  let lossStreak = 0;
  let lastLossTime: Date | null = null;

  for (const t of trades) {
    if (t.pnl !== null && t.pnl < 0) {
      lossStreak++;
      lastLossTime = t.dateTime;
    } else {
      if (
        lossStreak >= consecutiveLosses &&
        lastLossTime &&
        (t.dateTime.getTime() - lastLossTime.getTime()) / 60000 < cooldownMinutes
      ) {
        results.push({
          ruleId: rule.id,
          tradeId: t.id,
          severity: "high",
          message: `${consecutiveLosses}連敗後、${cooldownMinutes}分以内にエントリー（経過: ${Math.round(
            (t.dateTime.getTime() - lastLossTime.getTime()) / 60000
          )}分）`,
          detail: { lossStreak, cooldownMinutes },
        });
      }
      lossStreak = t.pnl !== null && t.pnl < 0 ? 1 : 0;
      if (lossStreak === 0) lastLossTime = null;
    }
  }

  return results;
}

function checkNoAveraging(trades: TradeData[], rule: RuleConfig): ViolationResult[] {
  const results: ViolationResult[] = [];
  const timeWindowMinutes = (rule.params.timeWindowMinutes as number) || 30;

  for (let i = 1; i < trades.length; i++) {
    const curr = trades[i];
    const prev = trades[i - 1];

    if (
      curr.symbol === prev.symbol &&
      curr.side === prev.side &&
      prev.pnl !== null &&
      prev.pnl < 0 &&
      (curr.dateTime.getTime() - prev.dateTime.getTime()) / 60000 <= timeWindowMinutes
    ) {
      results.push({
        ruleId: rule.id,
        tradeId: curr.id,
        severity: "high",
        message: `${prev.symbol}で損失中に同方向追加エントリー（ナンピンの疑い）`,
        detail: { symbol: curr.symbol, side: curr.side },
      });
    }
  }

  return results;
}

function checkSLModification(trades: TradeData[], rule: RuleConfig): ViolationResult[] {
  return trades
    .filter(
      (t) =>
        t.originalSL !== null &&
        t.stopLoss !== null &&
        t.originalSL !== t.stopLoss
    )
    .map((t) => {
      const widened =
        t.side === "BUY"
          ? (t.stopLoss ?? 0) < (t.originalSL ?? 0)
          : (t.stopLoss ?? 0) > (t.originalSL ?? 0);
      return {
        ruleId: rule.id,
        tradeId: t.id,
        severity: widened ? ("high" as const) : ("low" as const),
        message: widened
          ? `損切りを${t.originalSL}→${t.stopLoss}に拡大（損切り先延ばし）`
          : `損切りを${t.originalSL}→${t.stopLoss}に変更`,
        detail: {
          original: t.originalSL,
          modified: t.stopLoss,
          widened,
        },
      };
    });
}

function checkEarlyTP(trades: TradeData[], rule: RuleConfig): ViolationResult[] {
  const ratio = (rule.params.tpRatio as number) || 0.5;
  return trades
    .filter((t) => {
      if (t.takeProfit === null || t.exitPrice === null || t.pnl === null || t.pnl <= 0)
        return false;
      const targetProfit = Math.abs(t.takeProfit - t.entryPrice);
      const actualProfit = Math.abs(t.exitPrice - t.entryPrice);
      return targetProfit > 0 && actualProfit / targetProfit < ratio;
    })
    .map((t) => {
      const targetProfit = Math.abs((t.takeProfit ?? 0) - t.entryPrice);
      const actualProfit = Math.abs((t.exitPrice ?? 0) - t.entryPrice);
      return {
        ruleId: rule.id,
        tradeId: t.id,
        severity: "medium" as const,
        message: `利確が目標の${Math.round(
          (actualProfit / targetProfit) * 100
        )}%で早期決済（チキン利食い）`,
        detail: { targetProfit, actualProfit, ratio },
      };
    });
}

function checkConsecutiveEntry(trades: TradeData[], rule: RuleConfig): ViolationResult[] {
  const maxConsecutive = (rule.params.maxConsecutive as number) || 3;
  const results: ViolationResult[] = [];
  let streak = 1;

  for (let i = 1; i < trades.length; i++) {
    if (trades[i].symbol === trades[i - 1].symbol && trades[i].side === trades[i - 1].side) {
      streak++;
      if (streak > maxConsecutive) {
        results.push({
          ruleId: rule.id,
          tradeId: trades[i].id,
          severity: "medium",
          message: `${trades[i].symbol}で同方向${streak}連続エントリー`,
          detail: { symbol: trades[i].symbol, side: trades[i].side, streak },
        });
      }
    } else {
      streak = 1;
    }
  }

  return results;
}

function checkNoReason(trades: TradeData[], rule: RuleConfig): ViolationResult[] {
  return trades
    .filter((t) => !t.reason || t.reason.trim() === "")
    .map((t) => ({
      ruleId: rule.id,
      tradeId: t.id,
      severity: "low" as const,
      message: "エントリー理由が未記入",
      detail: {},
    }));
}

export function generateSuggestions(violations: ViolationResult[], trades: TradeData[]): string[] {
  const suggestions: string[] = [];
  const vCounts = new Map<string, number>();

  for (const v of violations) {
    const key = v.message.split("（")[0];
    vCounts.set(key, (vCounts.get(key) || 0) + 1);
  }

  const sorted = [...vCounts.entries()].sort((a, b) => b[1] - a[1]);

  if (sorted.length === 0) {
    suggestions.push("ルール逸脱は検出されませんでした。引き続きルールを遵守しましょう。");
    return suggestions;
  }

  suggestions.push(
    `最も多い逸脱: 「${sorted[0][0]}」（${sorted[0][1]}回）。このパターンを意識的に改善しましょう。`
  );

  const highSeverity = violations.filter((v) => v.severity === "high");
  if (highSeverity.length > 0) {
    suggestions.push(
      `重大な逸脱が${highSeverity.length}件あります。特にロット管理と損切りルールの徹底が必要です。`
    );
  }

  const lossTrades = trades.filter((t) => t.pnl !== null && t.pnl < 0);
  const lossWithViolation = lossTrades.filter((t) =>
    violations.some((v) => v.tradeId === t.id)
  );
  if (lossTrades.length > 0) {
    const pct = Math.round((lossWithViolation.length / lossTrades.length) * 100);
    suggestions.push(
      `負けトレードの${pct}%にルール逸脱があります。ルールを守るだけで勝率改善が期待できます。`
    );
  }

  const noReasonCount = violations.filter((v) => v.message === "エントリー理由が未記入").length;
  if (noReasonCount > trades.length * 0.3) {
    suggestions.push(
      "エントリー理由の記録率が低いです。理由を書くことで感情トレードの抑制につながります。"
    );
  }

  if (sorted.length >= 2) {
    suggestions.push(
      `次に改善すべきは「${sorted[1][0]}」（${sorted[1][1]}回）です。一つずつ悪癖を直していきましょう。`
    );
  }

  return suggestions;
}
