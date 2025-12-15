/**
 * ゲーム関連の型定義
 */

/**
 * 食材カテゴリ
 */
export type Category = "soup" | "noodle" | "topping";

/**
 * 食材データ
 */
export interface Ingredient {
  id: string; // 一意のID
  name: string; // 表示名
  category: Category; // カテゴリ（soup/noodle/ingredient）
  cost: number; // 解放コスト（0は初期所持）
  emoji: string; // 絵文字アイコン
}

/**
 * レシピの食材構成
 */
export interface RecipeIngredients {
  soup: string; // スープID
  noodle: string; // 麺ID
  topping1: string; // 具材1のID（"none"は「なし」）
  topping2: string; // 具材2のID（"none"は「なし」）
  topping3: string; // 具材3のID（"none"は「なし」）
}

/**
 * レシピカテゴリ
 */
export type RecipeCategory = "standard" | "special" | "joke";

/**
 * レシピデータ
 */
export interface Recipe {
  id: string; // 一意のID
  name: string; // 表示名
  ingredients: RecipeIngredients; // 必要な食材ID
  points: number; // 獲得ポイント
  rating: number; // 評価（1-5）
  comment: string; // コメント
  category: RecipeCategory; // カテゴリ
}

/**
 * ゲームステート
 */
export interface GameState {
  points: number; // 所持ポイント
  unlockedIngredients: string[]; // 解放済み食材ID配列
  discoveredRecipes: string[]; // 発見済みレシピID配列
  createdCount: Record<string, number>; // レシピ別作成回数
}
