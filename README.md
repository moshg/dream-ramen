# 夢のラーメン

「コロッケ！ 夢のバンカーサバイバル！」 ([Wikipedia](https://ja.wikipedia.org/wiki/%E3%82%B3%E3%83%AD%E3%83%83%E3%82%B1!_%E5%A4%A2%E3%81%AE%E3%83%90%E3%83%B3%E3%82%AB%E3%83%BC%E3%82%B5%E3%83%90%E3%82%A4%E3%83%90%E3%83%AB!)) のカレーステージが好きだったのでファンゲームを作ってみた。

## 技術スタック

| カテゴリ       | 技術            |
| -------------- | --------------- |
| フレームワーク | React           |
| 言語           | TypeScript      |
| ビルドツール   | Vite            |
| ルーティング   | TanStack Router |
| スタイリング   | Tailwind CSS    |
| テスト         | Vitest          |
| リンター       | oxlint          |
| フォーマッター | oxfmt           |
| Git フック     | lefthook        |

## 必要条件

- Node.js 24以上
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
turbo format
```

## テスト

```bash
# テスト実行（型チェック付き）
turbo test
```
