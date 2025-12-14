# 開発環境

## 必要条件

- Node.js 18以上
- pnpm
- Turbo

## セットアップ

```bash
# 依存関係のインストール
pnpm install
```

## 開発サーバー

```bash
# 開発サーバーの起動 (http://localhost:3000)
turbo dev
```

開発サーバー起動時、Turboが自動的にルート生成（`generate:routes`）を実行してから起動します。

## ビルド

```bash
# プロダクションビルド（型チェック付き）
turbo build

# ビルド結果のプレビュー
pnpm preview
```

## コード品質

このプロジェクトでは**Turborepo**を使用してタスクの依存関係を管理し、キャッシュによる高速化を実現しています。

```bash
# 全チェック実行（型チェック + リント + フォーマット）
turbo check

# 型チェックのみ（ルート生成も自動実行）
turbo check:type

# リントのみ (oxlint)
turbo check:lint

# フォーマットチェックのみ (oxfmt)
turbo check:format

# 自動フォーマット
pnpm format
```

## テスト

```bash
# テスト実行（型チェック付き）
turbo test
```

`turbo test`は自動的に型チェック（`check:type`）を実行してからテストを実行します。

## 使用ツール

### Vite

高速なビルドツール。HMR（Hot Module Replacement）による即時反映。

### TanStack Router

ファイルベースルーティング。`src/routes/`以下のファイルから自動的にルートを生成。

```bash
# ルートツリーの手動生成
turbo generate:routes
```

**Note**: Turboを使用する場合、`generate:routes`は自動的に実行されるため、通常は手動実行不要。

### Tailwind CSS v4

ユーティリティファーストCSSフレームワーク。Viteプラグインで統合。

### oxlint / oxfmt

Rustベースの高速リンター・フォーマッター。ESLint/Prettierの代替として使用。

### Vitest

Viteネイティブのテストフレームワーク。

### Turborepo

タスクランナー・ビルドシステム。シングルパッケージワークスペースとして使用。

- **タスク定義**: `turbo.json`で依存関係とキャッシュ設定を管理
- **依存関係グラフ**: タスク間の依存関係を自動解決し、正しい順序で実行
- **インテリジェントキャッシュ**: ファイルに変更がなければ前回の実行結果を再利用
- **並列実行**: 依存関係のないタスクを並列実行して高速化
