# ユビキタス言語レビュー

Date: 2025-12-15

## 概要

Dream Ramenプロジェクトの変数名・型名から、現在使用されているドメイン用語（ユビキタス言語）を抽出し、一貫性と明確性の観点からレビューを実施しました。

---

## 1. 現在のユビキタス言語マップ

### 1.1 コアドメイン概念

| 英語用語 | 日本語 | 定義 | 使用箇所 |
|---------|-------|------|---------|
| `Recipe` | レシピ | ラーメンの完成形。食材構成・評価・ポイントを含む | types/game.ts, recipes.ts |
| `Ingredient` | 食材 | ゲーム内で使用可能な材料（スープ、麺、具材すべて） | types/game.ts, ingredients.ts |
| `Ramen` | ラーメン | 作成されたラーメン製品（createRamen関数で使用） | gameStore.ts |

### 1.2 食材分類

| 英語用語 | 日本語 | 定義 | 問題点 |
|---------|-------|------|--------|
| `Category` | カテゴリ | 食材の種類："soup" / "noodle" / "ingredient" | - |
| `soup` | スープ | スープの種類 | - |
| `noodle` | 麺 | 麺の種類 | - |
| `ingredient` | 具材 | トッピング材料（チャーシュー、ネギなど） | ⚠️ `Ingredient`型と混同 |
| `topping` | 具材 | `ingredient`と同義（UI層で使用） | ⚠️ 用語が不統一 |

### 1.3 レシピ関連

| 英語用語 | 日本語 | 定義 |
|---------|-------|------|
| `RecipeCategory` | レシピカテゴリ | "standard" / "special" / "joke" |
| `RecipeIngredients` | レシピ構成 | レシピに必要な食材ID |
| `rating` | 評価 | 1-5の星評価 |
| `points` | ポイント | 獲得/消費ポイント |
| `comment` | コメント | レシピの評価コメント |

### 1.4 ゲーム状態

| 英語用語 | 日本語 | 定義 |
|---------|-------|------|
| `GameState` | ゲーム状態 | プレイヤーの進行状況 |
| `points` | 所持ポイント | 現在の所持ポイント |
| `unlockedIngredients` | 解放済み食材 | 使用可能な食材IDリスト |
| `discoveredRecipes` | 発見済みレシピ | 発見したレシピIDリスト |
| `createdCount` | 作成回数 | レシピ別の作成回数 |

### 1.5 アクション

| 英語用語 | 日本語 | 定義 |
|---------|-------|------|
| `unlockIngredient` | 食材を解放 | ポイントを消費して食材を購入 |
| `createRamen` | ラーメンを作る | レシピを実行してラーメンを作成 |
| `matchRecipe` | レシピマッチング | 選択食材からレシピを判定 |
| `resetGame` | ゲームリセット | 初期状態に戻す |

### 1.6 UI状態

| 英語用語 | 日本語 | 定義 |
|---------|-------|------|
| `selectedSoup` | 選択されたスープ | 調理画面で選択中のスープID |
| `selectedNoodle` | 選択された麺 | 調理画面で選択中の麺ID |
| `selectedToppings` | 選択された具材 | 調理画面で選択中の具材IDリスト |
| `selectedIngredients` | 選択された食材 | RecipeIngredients形式の選択状態 |
| `isFirstTime` | 初回フラグ | レシピ初発見かどうか |

---

## 2. 問題点と改善提案

### 🔴 重大な問題

#### 2.1 `ingredient`の二重の意味

**問題:**
- `Ingredient`型：全ての食材（スープ、麺、具材）を表す
- `Category`の`"ingredient"`：具材のみを表す

**影響箇所:**
```typescript
// types/game.ts:8
export type Category = "soup" | "noodle" | "ingredient";

// types/game.ts:13
export interface Ingredient {
  category: Category; // ここでIngredientとingredientが混在
}
```

**提案A（推奨）:** カテゴリ名を変更
```typescript
export type Category = "soup" | "noodle" | "topping";
```

**提案B:** 型名を変更
```typescript
export interface GameIngredient { /* ... */ }
// または
export interface FoodItem { /* ... */ }
```

**理由:** カテゴリ名の変更（提案A）の方が影響範囲が小さく、`topping`という用語が既にUI層で使用されているため整合性が取れる。

---

### 🟡 軽度の問題

#### 2.2 `ingredient` vs `topping` の不統一

**問題:**
- CookingScreen.tsx:28 では `toppings` として扱う
- 型定義では `ingredient` として定義
- 同じ概念に2つの用語が存在

**影響箇所:**
```typescript
// CookingScreen.tsx:28
const toppings = unlockedIngredients.filter((ing) => ing.category === "ingredient");

// CookingScreen.tsx:36
const [selectedToppings, setSelectedToppings] = useState<string[]>([]);

// types/game.ts:27-29
ingredient1: string; // 具材1のID
ingredient2: string; // 具材2のID
ingredient3: string; // 具材3のID
```

**提案:** 用語を統一
- **Option 1:** すべて`topping`に統一（ラーメン文脈で自然）
- **Option 2:** すべて`ingredient`に統一（現在の型定義に合わせる）

推奨は**Option 1（topping）**：
- ラーメンのドメインでは「トッピング」が一般的
- UIテキストでも「具材」として表示されており、toppingの方が直感的

---

### 🟢 良好な点

#### 2.3 明確な命名規則

**評価:** ✅ 良好
- 状態管理のアクションが動詞形で明確（`unlockIngredient`, `createRamen`）
- ブール値に`is`プレフィックス（`isFirstTime`）
- 配列・リストに複数形の使用（`unlockedIngredients`, `discoveredRecipes`）

#### 2.4 カテゴリの明確な区分

**評価:** ✅ 良好
- レシピカテゴリ（`standard`, `special`, `joke`）が直感的
- ドメインロジックとUI層の責務が分離されている

---

## 3. 推奨改善アクション

### Phase 1: 即座に実施すべき変更

1. **`Category`型の`ingredient`を`topping`に変更**
   ```typescript
   export type Category = "soup" | "noodle" | "topping";
   ```

2. **`RecipeIngredients`のプロパティ名を変更**
   ```typescript
   export interface RecipeIngredients {
     soup: string;
     noodle: string;
     topping1: string; // ingredient1 → topping1
     topping2: string; // ingredient2 → topping2
     topping3: string; // ingredient3 → topping3
   }
   ```

3. **コード全体で`ingredient`→`topping`に統一**
   - 変数名: `selectedToppings` ✅（既に正しい）
   - フィルタリング: `ing.category === "topping"`

### Phase 2: 長期的な改善

4. **用語集ドキュメントの作成**
   - `docs/ubiquitous-language.md` として正式な用語集を作成
   - 新規メンバーのオンボーディングに活用

5. **JSDocコメントの追加**
   - 型定義にドメイン用語の説明を追加
   - 特に`Recipe`, `Ingredient`, `GameState`などのコアドメイン概念

---

## 4. 影響範囲分析

### 変更が必要なファイル（提案Aの場合）

```
src/
├── types/game.ts              [変更] Category型, RecipeIngredients型
├── data/ingredients.ts        [変更] category: "ingredient" → "topping"
├── data/recipes.ts            [変更] ingredient1-3 → topping1-3
├── stores/gameStore.ts        [影響なし]
├── lib/recipeMatch.ts         [変更] プロパティ名
├── components/
│   ├── CookingScreen.tsx     [変更] フィルタ条件, プロパティアクセス
│   ├── MainScreen.tsx        [影響なし]
│   ├── ResultScreen.tsx      [影響なし]
│   └── CollectionScreen.tsx  [変更] フィルタ条件
```

**推定作業量:** 2-3時間（テスト含む）

---

## 5. 結論

Dream Ramenプロジェクトのユビキタス言語は全体的に**良好な状態**ですが、`ingredient`の二重の意味と、`ingredient` vs `topping`の不統一という**2つの明確な改善点**が存在します。

**最優先推奨事項:**
1. `Category`の`"ingredient"`を`"topping"`に変更
2. `RecipeIngredients`の`ingredient1-3`を`topping1-3`に変更
3. プロジェクト全体で用語を統一

この変更により、コードの可読性と保守性が向上し、ドメインロジックがより明確になります。
