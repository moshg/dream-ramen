# アーキテクチャ概要

## ディレクトリ構成

```
src/
├── components/          # UIコンポーネント
│   ├── MainScreen.tsx      # メイン画面
│   ├── CookingScreen.tsx   # 調理画面
│   ├── ResultScreen.tsx    # 結果画面
│   └── CollectionScreen.tsx # 図鑑画面
├── contexts/            # React Context
│   └── GameStateContext.tsx # ゲーム状態の共有
├── data/                # マスターデータ
│   ├── ingredients.ts      # 食材データ
│   └── recipes.ts          # レシピデータ
├── hooks/               # カスタムフック
│   └── useGameState.ts     # ゲーム状態管理
├── lib/                 # ユーティリティ
│   ├── recipeMatch.ts      # レシピマッチングロジック
│   └── storage.ts          # LocalStorage操作
├── routes/              # ルート定義（TanStack Router）
│   ├── __root.tsx          # ルートレイアウト
│   ├── index.tsx           # / (メイン画面)
│   ├── cooking.tsx         # /cooking (調理画面)
│   ├── result.tsx          # /result (結果画面)
│   └── collection.tsx      # /collection (図鑑画面)
├── types/               # 型定義
│   └── game.ts             # ゲーム関連の型
├── main.tsx             # エントリーポイント
├── styles.css           # グローバルスタイル
└── routeTree.gen.ts     # 自動生成されるルートツリー
```

## データフロー

```
┌─────────────────────────────────────────────────────────────┐
│                    GameStateProvider                         │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                   useGameState                          ││
│  │  ┌─────────────┐    ┌──────────────┐    ┌───────────┐  ││
│  │  │  GameState  │◄───│ localStorage │◄───│  storage  │  ││
│  │  └─────────────┘    └──────────────┘    └───────────┘  ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
   ┌───────────┐       ┌───────────┐       ┌───────────┐
   │MainScreen │       │CookingScreen│     │CollectionScreen│
   └───────────┘       └───────────┘       └───────────┘
                              │
                              ▼
                       ┌───────────┐
                       │ResultScreen│
                       └───────────┘
```

## 状態管理

### GameState構造

```typescript
interface GameState {
  points: number;              // 所持ポイント
  unlockedIngredients: string[]; // アンロック済み食材ID
  discoveredRecipes: string[];   // 発見済みレシピID
  recipeCreationCount: Record<string, number>; // レシピ作成回数
}
```

### 状態の永続化

- `localStorage` キー: `ramenGameState`
- ページ読み込み時に自動復元
- 状態変更時に自動保存

## ルーティング

TanStack Routerを使用したファイルベースルーティング:

| パス          | コンポーネント   | 説明       |
| ------------- | ---------------- | ---------- |
| `/`           | MainScreen       | メイン画面 |
| `/cooking`    | CookingScreen    | 調理画面   |
| `/result`     | ResultScreen     | 結果画面   |
| `/collection` | CollectionScreen | 図鑑画面   |

### ナビゲーションステート

結果画面から調理画面へ戻る際、前回選択した食材を`location.state`経由で渡すことで、選択状態を復元する。
