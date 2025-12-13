# 開発環境

## 必要条件

- Node.js 18以上
- pnpm

## セットアップ

```bash
# 依存関係のインストール
pnpm install
```

## 開発サーバー

```bash
# 開発サーバーの起動 (http://localhost:3000)
pnpm dev
```

## ビルド

```bash
# プロダクションビルド
pnpm build

# ビルド結果のプレビュー
pnpm preview
```

## コード品質

```bash
# 全チェック実行（型チェック + リント + フォーマット）
pnpm check

# 型チェックのみ
pnpm check:type

# リントのみ (oxlint)
pnpm check:lint

# フォーマットチェックのみ (oxfmt)
pnpm check:format

# 自動フォーマット
pnpm format
```

## テスト

```bash
# テスト実行
pnpm test
```

## 使用ツール

### Vite

高速なビルドツール。HMR（Hot Module Replacement）による即時反映。

### TanStack Router

ファイルベースルーティング。`src/routes/`以下のファイルから自動的にルートを生成。

```bash
# ルートツリーの手動生成（通常は自動）
pnpx @tanstack/router-cli generate
```

### Tailwind CSS v4

ユーティリティファーストCSSフレームワーク。Viteプラグインで統合。

### oxlint / oxfmt

Rustベースの高速リンター・フォーマッター。ESLint/Prettierの代替として使用。

### Vitest

Viteネイティブのテストフレームワーク。
