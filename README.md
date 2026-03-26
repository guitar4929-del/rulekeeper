# RuleKeeper - トレードルール逸脱検知ツール

CSVを読み込むだけで、あなたのトレードルール逸脱を検知し、改善提案を提示するツールです。

## セットアップ手順（1コマンド）

```bash
npm install && npx prisma generate && npx prisma db push && npm run dev
```

ブラウザで http://localhost:3000 にアクセスしてください。

## 個別コマンド

```bash
npm install            # 依存関係インストール
npx prisma generate    # Prismaクライアント生成
npx prisma db push     # データベース作成
npm run dev            # 開発サーバー起動
npm run build          # 本番ビルド
npm start              # 本番起動
```

## 使い方

1. http://localhost:3000/upload にアクセス
2. トレード履歴のCSVファイルをドラッグ&ドロップ（またはサンプルCSVをダウンロード）
3. 列マッピングを確認して「分析を実行する」をクリック
4. ルール逸脱の検知結果と改善提案を確認

## サンプルCSV

`public/samples/sample_trades.csv` にサンプルデータが含まれています。

| カラム名 | 説明 | 必須 |
|---------|------|------|
| 日時 | トレードの日時 | ○ |
| 通貨ペア | 通貨ペアや銘柄名 | ○ |
| 売買 | BUY/SELL | ○ |
| ロット | ロットサイズ | ○ |
| エントリー価格 | エントリー時の価格 | ○ |
| 決済価格 | 決済時の価格 | |
| 損切り価格 | ストップロス価格 | |
| 利確価格 | テイクプロフィット価格 | |
| 損益 | 金額ベースの損益 | |
| エントリー理由 | エントリーした根拠 | |
| メモ | 自由メモ | |
| 元の損切り | 変更前の損切り価格 | |

英語カラム名（datetime, symbol, side, lot, entry_price等）にも自動対応します。

## 検知ルール（8種）

1. **1トレード最大損失** - 1回のトレードで許容損失を超えた場合
2. **最大ロット** - 設定ロットを超えたトレード
3. **連敗後クールダウン** - 連敗後に休憩なくエントリー
4. **ナンピン禁止** - 損失中に同方向の追加エントリー
5. **損切り変更の警告** - 損切り価格を不利な方向に変更
6. **利確が早すぎる傾向** - 目標利幅に対して早期に利確
7. **同方向連続エントリー** - 同じ方向に連続してエントリー
8. **エントリー理由未記入** - 理由のないトレード

## 画面一覧

| パス | 画面名 |
|------|--------|
| `/` | トップページ（LP） |
| `/upload` | CSVアップロード・分析 |
| `/rules` | ルール設定 |
| `/dashboard` | ダッシュボード |
| `/analysis?sessionId=xxx` | 詳細分析結果 |
| `/reports?sessionId=xxx` | レポート（印刷対応） |
| `/pricing` | 料金ページ |
| `/terms` | 利用規約 |
| `/disclaimer` | 免責事項 |

## 技術スタック

- Next.js 16 (App Router) / TypeScript
- SQLite + Prisma ORM
- Tailwind CSS
- PapaParse (CSV解析)

## デプロイ手順

### Vercel（推奨）

1. GitHubにプッシュ
2. Vercelでインポート
3. 環境変数 `DATABASE_URL` を設定
4. デプロイ

※本番環境ではTurso（LibSQL）等のクラウドDBに切り替えてください。

### VPS

```bash
git clone <repository-url>
cd rulekeeper
npm install && npx prisma generate && npx prisma db push
npm run build && npm start
```

## 注意事項

- 本ツールは投資助言ではありません
- トレーダー自身の自己分析を支援するツールです
- 売買の推奨や利益の保証は一切行いません
