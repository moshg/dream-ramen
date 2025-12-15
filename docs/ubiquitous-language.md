# ユビキタス言語（Ubiquitous Language）

このドキュメントは、Dream Ramenプロジェクトで使用されるドメイン用語を定義します。チーム全体で共通の言語を使用することで、コミュニケーションの齟齬を防ぎ、コードの可読性と保守性を向上させます。

## 目次

- [コアドメイン概念](#コアドメイン概念)
- [食材関連](#食材関連)
- [レシピ関連](#レシピ関連)
- [ゲーム状態](#ゲーム状態)
- [アクション](#アクション)
- [UI状態](#ui状態)

---

## コアドメイン概念

### Recipe（レシピ）
ラーメンの完成形を表す。食材構成、評価、獲得ポイント、コメントなどの情報を含む。

**型定義:** `Recipe`
**ファイル:** `src/types/game.ts`

**プロパティ:**
- `id`: レシピの一意識別子
- `name`: レシピの表示名（例：「醤油ラーメン」）
- `ingredients`: 必要な食材構成（RecipeIngredients型）
- `points`: 作成時に獲得できるポイント数
- `rating`: 評価（1-5の星評価）
- `comment`: レシピの評価コメント
- `category`: レシピカテゴリ（standard / special / joke）

### Ingredient（食材）
ゲーム内で使用可能な材料全般を指す。スープ、麺、具材（トッピング）のすべてを包含する概念。

**型定義:** `Ingredient`
**ファイル:** `src/types/game.ts`, `src/data/ingredients.ts`

**プロパティ:**
- `id`: 食材の一意識別子
- `name`: 食材の表示名
- `category`: 食材カテゴリ（soup / noodle / topping）
- `cost`: 解放コスト（0は初期所持）
- `emoji`: 表示用の絵文字アイコン

### Ramen（ラーメン）
プレイヤーが実際に作成したラーメン製品。`createRamen`アクションによって生成される。

**使用箇所:** `src/stores/gameStore.ts`

---

## 食材関連

### Category（食材カテゴリ）
食材の種類を表す列挙型。

**型定義:** `Category = "soup" | "noodle" | "topping"`
**ファイル:** `src/types/game.ts`

#### soup（スープ）
ラーメンのスープベースを表す。

**例:** 醤油スープ、塩スープ、味噌スープ、豚骨スープ

#### noodle（麺）
ラーメンの麺を表す。

**例:** 中太麺、細麺、太麺、ちぢれ麺

#### topping（具材・トッピング）
ラーメンに乗せる具材を表す。最大3種類まで選択可能。

**例:** チャーシュー、ネギ、メンマ、のり、煮卵、もやし、コーン、キクラゲ、紅しょうが、ほうれん草

**注意:**
- 型名は `Ingredient`（全食材を指す）
- カテゴリ値は `"topping"`（具材のみを指す）
- この区別が重要

---

## レシピ関連

### RecipeIngredients（レシピ構成）
レシピに必要な食材IDの組み合わせを表す。

**型定義:** `RecipeIngredients`
**ファイル:** `src/types/game.ts`

**プロパティ:**
- `soup`: スープID（必須）
- `noodle`: 麺ID（必須）
- `topping1`: 具材1のID（"none"は「なし」）
- `topping2`: 具材2のID（"none"は「なし」）
- `topping3`: 具材3のID（"none"は「なし」）

**注意:** プロパティ名は `topping1`, `topping2`, `topping3` を使用（`ingredient1-3` ではない）

### RecipeCategory（レシピカテゴリ）
レシピの種類を表す列挙型。

**型定義:** `RecipeCategory = "standard" | "special" | "joke"`

- **standard（正統派）**: 基本的なラーメンレシピ（醤油、塩、味噌、豚骨）
- **special（応用）**: 特殊な組み合わせの高評価レシピ
- **joke（失敗系）**: 不適切な組み合わせや低評価レシピ

### rating（評価）
レシピの品質を示す星評価。1-5の整数値。

**表示:** ★★★★★（5つ星）〜★☆☆☆☆（1つ星）

### points（ポイント）
レシピ作成時に獲得できるポイント数、または食材解放に必要なコスト。

- 高評価レシピ: 25-30pt
- 標準レシピ: 20pt
- 低評価レシピ: 3-5pt

---

## ゲーム状態

### GameState（ゲーム状態）
プレイヤーの進行状況を表す状態オブジェクト。localStorageに永続化される。

**型定義:** `GameState`
**ファイル:** `src/types/game.ts`, `src/stores/gameStore.ts`

**プロパティ:**

#### points（所持ポイント）
プレイヤーが現在所持しているポイント数。

- 初期値: 15pt
- 用途: 食材の解放
- 獲得方法: レシピの作成

#### unlockedIngredients（解放済み食材）
プレイヤーが使用可能な食材IDの配列。

- 初期値: 8種類（スープ2、麺2、具材4）
- 追加方法: ポイント消費による解放

#### discoveredRecipes（発見済みレシピ）
プレイヤーが発見したレシピIDの配列。

- 初期値: 空配列
- 追加方法: レシピを初めて作成したとき

#### createdCount（作成回数）
レシピ別の作成回数を記録するオブジェクト。

**型:** `Record<string, number>`（キー: レシピID、値: 作成回数）

---

## アクション

### unlockIngredient（食材を解放）
ポイントを消費して新しい食材を使用可能にするアクション。

**シグネチャ:** `(ingredientId: string, cost: number) => boolean`

**戻り値:**
- `true`: 解放成功
- `false`: 解放失敗（ポイント不足または既に解放済み）

**副作用:**
- ポイントの減算
- `unlockedIngredients`への追加

### createRamen（ラーメンを作る）
選択した食材からラーメンを作成するアクション。

**シグネチャ:** `(recipe: Recipe, isFirstTime: boolean) => void`

**パラメータ:**
- `recipe`: マッチしたレシピ
- `isFirstTime`: 初めて作成するレシピかどうか

**副作用:**
- ポイントの加算
- `createdCount`の更新
- 初回作成時: `discoveredRecipes`への追加

### matchRecipe（レシピマッチング）
選択された食材構成から該当するレシピを判定する純粋関数。

**シグネチャ:** `(selectedIngredients: RecipeIngredients) => Recipe`

**ロジック:**
1. 特殊レシピ: 完全一致のみ
2. 基本レシピ: 柔軟マッチング（スープ+麺+まともな具材3つ）
3. 不一致: デフォルトレシピ（"イマイチなラーメン"）

**ファイル:** `src/lib/recipeMatch.ts`

### resetGame（ゲームリセット）
ゲーム状態を初期状態に戻すアクション。

**シグネチャ:** `() => void`

---

## UI状態

### selectedSoup（選択されたスープ）
調理画面で現在選択中のスープID。

**型:** `string | null`

### selectedNoodle（選択された麺）
調理画面で現在選択中の麺ID。

**型:** `string | null`

### selectedToppings（選択された具材）
調理画面で現在選択中の具材IDリスト。最大3つまで。

**型:** `string[]`

### selectedIngredients（選択された食材）
調理画面で選択された全食材を`RecipeIngredients`形式で表現したもの。

**型:** `RecipeIngredients`

### isFirstTime（初回フラグ）
レシピを初めて作成したかどうかを示すブール値。

**型:** `boolean`

**用途:**
- 図鑑登録通知の表示判定
- `discoveredRecipes`への追加判定

---

## 命名規則

### 一般規則

- **ブール値**: `is` / `has` プレフィックス（例：`isFirstTime`, `hasDecentIngredients`）
- **配列・リスト**: 複数形（例：`unlockedIngredients`, `discoveredRecipes`）
- **アクション**: 動詞形（例：`unlockIngredient`, `createRamen`, `matchRecipe`）
- **定数**: UPPER_SNAKE_CASE（例：`INITIAL_INGREDIENTS`, `SHOYU_RAMEN`）

### 避けるべき用語

❌ **ingredient**（カテゴリ値として）
理由: `Ingredient`型と混同される

✅ **topping**（カテゴリ値として）
理由: ラーメン文脈で自然、`Ingredient`型と区別できる

---

## 参考資料

- [ユビキタス言語レビュー](../ubiquitous-language-review.md) - 2025年12月15日実施のレビュー結果
- [型定義](../src/types/game.ts) - TypeScript型定義の実装
- [マスターデータ](../src/data/) - 食材とレシピのマスターデータ

---

**Last Updated:** 2025-12-15
**Version:** 1.0
