import type { Recipe, RecipeIngredients } from "../types/game";
import {
  SHOYU_RAMEN,
  SHIO_RAMEN,
  MISO_RAMEN,
  TONKOTSU_RAMEN,
  MISO_BUTTER_CORN_RAMEN,
  SPINACH_SHOYU_RAMEN,
  TONKOTSU_SHOYU_RAMEN,
  BAD_RAMEN_1,
  BAD_RAMEN_2,
  MEDIOCRE_RAMEN,
  DEFAULT_RECIPE,
} from "../data/recipes";

/**
 * レシピ判定ロジック（改善版）
 * - 特殊レシピ: 完全一致のみ
 * - 基本レシピ: 柔軟マッチング（スープ+麺+まともな具材3つ）
 * - 配列の順序で優先度を制御
 */

/**
 * ラーメンマッチャーインターフェイス
 */
interface RamenMatcher {
  match(ingredients: RecipeIngredients): boolean;
  recipe: Recipe;
}

// ============================================
// ヘルパー関数
// ============================================

/**
 * 完全一致判定（順序を問わない）
 */
function isExactMatch(selected: RecipeIngredients, expected: RecipeIngredients): boolean {
  // スープと麺は完全一致
  if (selected.soup !== expected.soup || selected.noodle !== expected.noodle) {
    return false;
  }

  // 具材をソートして比較（順序を問わない）
  const selectedToppings = [
    selected.topping1,
    selected.topping2,
    selected.topping3,
  ].sort();

  const expectedToppings = [
    expected.topping1,
    expected.topping2,
    expected.topping3,
  ].sort();

  return (
    selectedToppings[0] === expectedToppings[0] &&
    selectedToppings[1] === expectedToppings[1] &&
    selectedToppings[2] === expectedToppings[2]
  );
}

/**
 * まともな具材かチェック
 * "none"や同じ具材2つ以上など不適切な組み合わせを除外
 */
function hasDecentIngredients(ingredients: RecipeIngredients, allowedList: string[]): boolean {
  const ing1 = ingredients.topping1;
  const ing2 = ingredients.topping2;
  const ing3 = ingredients.topping3;

  // "none"が含まれている場合は却下
  if (ing1 === "none" || ing2 === "none" || ing3 === "none") {
    return false;
  }

  // 全て許可リストに含まれているかチェック
  if (!allowedList.includes(ing1) || !allowedList.includes(ing2) || !allowedList.includes(ing3)) {
    return false;
  }

  // 全ての具材が異なる必要がある（同じ具材2つ以上は却下）
  const uniqueCount = new Set([ing1, ing2, ing3]).size;
  if (uniqueCount < 3) {
    return false;
  }

  return true;
}

// ============================================
// 各レシピのまともな具材リスト
// ============================================

const SHOYU_DECENT_INGREDIENTS = [
  "chashu",
  "negi",
  "menma",
  "nori",
  "boiled_egg",
  "spinach",
  "moyashi",
  "kikurage",
];

const SHIO_DECENT_INGREDIENTS = [
  "chashu",
  "negi",
  "nori",
  "menma",
  "boiled_egg",
  "spinach",
  "moyashi",
];

const MISO_DECENT_INGREDIENTS = [
  "chashu",
  "moyashi",
  "corn",
  "negi",
  "boiled_egg",
  "spinach",
  "kikurage",
  "menma",
];

const TONKOTSU_DECENT_INGREDIENTS = [
  "chashu",
  "kikurage",
  "beni_shoga",
  "negi",
  "moyashi",
  "boiled_egg",
  "menma",
];

// ============================================
// ラーメンマッチャー定義
// ============================================

// --- 特殊レシピ（完全一致のみ）---

const misoButterCornRamen: RamenMatcher = {
  match: (ingredients) => isExactMatch(ingredients, MISO_BUTTER_CORN_RAMEN.ingredients),
  recipe: MISO_BUTTER_CORN_RAMEN,
};

const spinachShoyuRamen: RamenMatcher = {
  match: (ingredients) => isExactMatch(ingredients, SPINACH_SHOYU_RAMEN.ingredients),
  recipe: SPINACH_SHOYU_RAMEN,
};

const tonkotsuShoyuRamen: RamenMatcher = {
  match: (ingredients) => isExactMatch(ingredients, TONKOTSU_SHOYU_RAMEN.ingredients),
  recipe: TONKOTSU_SHOYU_RAMEN,
};

// --- 失敗系レシピ（完全一致のみ）---

const badRamen1: RamenMatcher = {
  match: (ingredients) => isExactMatch(ingredients, BAD_RAMEN_1.ingredients),
  recipe: BAD_RAMEN_1,
};

const badRamen2: RamenMatcher = {
  match: (ingredients) => isExactMatch(ingredients, BAD_RAMEN_2.ingredients),
  recipe: BAD_RAMEN_2,
};

const mediocrRamen: RamenMatcher = {
  match: (ingredients) => isExactMatch(ingredients, MEDIOCRE_RAMEN.ingredients),
  recipe: MEDIOCRE_RAMEN,
};

// --- 基本レシピ（柔軟マッチング）---

const shoyuRamen: RamenMatcher = {
  match: (ingredients) => {
    return (
      ingredients.soup === "shoyu_soup" &&
      ingredients.noodle === "medium_noodle" &&
      hasDecentIngredients(ingredients, SHOYU_DECENT_INGREDIENTS)
    );
  },
  recipe: SHOYU_RAMEN,
};

const shioRamen: RamenMatcher = {
  match: (ingredients) => {
    return (
      ingredients.soup === "shio_soup" &&
      ingredients.noodle === "thin_noodle" &&
      hasDecentIngredients(ingredients, SHIO_DECENT_INGREDIENTS)
    );
  },
  recipe: SHIO_RAMEN,
};

const misoRamen: RamenMatcher = {
  match: (ingredients) => {
    return (
      ingredients.soup === "miso_soup" &&
      ingredients.noodle === "curly_noodle" &&
      hasDecentIngredients(ingredients, MISO_DECENT_INGREDIENTS)
    );
  },
  recipe: MISO_RAMEN,
};

const tonkotsuRamen: RamenMatcher = {
  match: (ingredients) => {
    return (
      ingredients.soup === "tonkotsu_soup" &&
      ingredients.noodle === "thin_noodle" &&
      hasDecentIngredients(ingredients, TONKOTSU_DECENT_INGREDIENTS)
    );
  },
  recipe: TONKOTSU_RAMEN,
};

// ============================================
// マッチャー配列（優先度順）
// ============================================

const RAMEN_MATCHERS: RamenMatcher[] = [
  // 1. 特殊レシピ（完全一致）
  misoButterCornRamen,
  spinachShoyuRamen,
  tonkotsuShoyuRamen,

  // 2. 失敗系レシピ（完全一致）
  badRamen1,
  badRamen2,
  mediocrRamen,

  // 3. 基本レシピ（柔軟マッチング）
  shoyuRamen,
  shioRamen,
  misoRamen,
  tonkotsuRamen,
];

// ============================================
// エクスポート関数
// ============================================

/**
 * 選択された食材からレシピを判定する
 * @param selectedIngredients - 選択された食材
 * @returns マッチしたレシピ、またはデフォルトレシピ
 */
export function matchRecipe(selectedIngredients: RecipeIngredients): Recipe {
  const matcher = RAMEN_MATCHERS.find((m) => m.match(selectedIngredients));
  return matcher?.recipe ?? DEFAULT_RECIPE;
}
