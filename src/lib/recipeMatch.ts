import type { Recipe, RecipeIngredients } from "../types/game";
import { RECIPES, DEFAULT_RECIPE } from "../data/recipes";

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
  const selectedIngredients = [
    selected.ingredient1,
    selected.ingredient2,
    selected.ingredient3,
  ].sort();

  const expectedIngredients = [
    expected.ingredient1,
    expected.ingredient2,
    expected.ingredient3,
  ].sort();

  return (
    selectedIngredients[0] === expectedIngredients[0] &&
    selectedIngredients[1] === expectedIngredients[1] &&
    selectedIngredients[2] === expectedIngredients[2]
  );
}

/**
 * まともな具材かチェック
 * "none"や同じ具材3つなどの極端な組み合わせを除外
 */
function hasDecentIngredients(ingredients: RecipeIngredients, allowedList: string[]): boolean {
  const ing1 = ingredients.ingredient1;
  const ing2 = ingredients.ingredient2;
  const ing3 = ingredients.ingredient3;

  // "none"が含まれている場合は却下
  if (ing1 === "none" || ing2 === "none" || ing3 === "none") {
    return false;
  }

  // 全て許可リストに含まれているかチェック
  if (!allowedList.includes(ing1) || !allowedList.includes(ing2) || !allowedList.includes(ing3)) {
    return false;
  }

  // 同じ具材が3つ全て同じ場合は却下（コーン3つなど特殊レシピ以外）
  if (ing1 === ing2 && ing2 === ing3) {
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

// レシピデータから取得
const shoyuRamenRecipe = RECIPES.find((r) => r.id === "shoyu_ramen")!;
const shioRamenRecipe = RECIPES.find((r) => r.id === "shio_ramen")!;
const misoRamenRecipe = RECIPES.find((r) => r.id === "miso_ramen")!;
const tonkotsuRamenRecipe = RECIPES.find((r) => r.id === "tonkotsu_ramen")!;
const misoButterCornRamenRecipe = RECIPES.find((r) => r.id === "miso_butter_corn_ramen")!;
const spinachShoyuRamenRecipe = RECIPES.find((r) => r.id === "spinach_shoyu_ramen")!;
const tonkotsuShoyuRamenRecipe = RECIPES.find((r) => r.id === "tonkotsu_shoyu_ramen")!;
const badRamen1Recipe = RECIPES.find((r) => r.id === "bad_ramen_1")!;
const badRamen2Recipe = RECIPES.find((r) => r.id === "bad_ramen_2")!;
const mediocrRamenRecipe = RECIPES.find((r) => r.id === "mediocre_ramen")!;

// --- 特殊レシピ（完全一致のみ）---

const misoButterCornRamen: RamenMatcher = {
  match: (ingredients) => isExactMatch(ingredients, misoButterCornRamenRecipe.ingredients),
  recipe: misoButterCornRamenRecipe,
};

const spinachShoyuRamen: RamenMatcher = {
  match: (ingredients) => isExactMatch(ingredients, spinachShoyuRamenRecipe.ingredients),
  recipe: spinachShoyuRamenRecipe,
};

const tonkotsuShoyuRamen: RamenMatcher = {
  match: (ingredients) => isExactMatch(ingredients, tonkotsuShoyuRamenRecipe.ingredients),
  recipe: tonkotsuShoyuRamenRecipe,
};

// --- 失敗系レシピ（完全一致のみ）---

const badRamen1: RamenMatcher = {
  match: (ingredients) => isExactMatch(ingredients, badRamen1Recipe.ingredients),
  recipe: badRamen1Recipe,
};

const badRamen2: RamenMatcher = {
  match: (ingredients) => isExactMatch(ingredients, badRamen2Recipe.ingredients),
  recipe: badRamen2Recipe,
};

const mediocrRamen: RamenMatcher = {
  match: (ingredients) => isExactMatch(ingredients, mediocrRamenRecipe.ingredients),
  recipe: mediocrRamenRecipe,
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
  recipe: shoyuRamenRecipe,
};

const shioRamen: RamenMatcher = {
  match: (ingredients) => {
    return (
      ingredients.soup === "shio_soup" &&
      ingredients.noodle === "thin_noodle" &&
      hasDecentIngredients(ingredients, SHIO_DECENT_INGREDIENTS)
    );
  },
  recipe: shioRamenRecipe,
};

const misoRamen: RamenMatcher = {
  match: (ingredients) => {
    return (
      ingredients.soup === "miso_soup" &&
      ingredients.noodle === "curly_noodle" &&
      hasDecentIngredients(ingredients, MISO_DECENT_INGREDIENTS)
    );
  },
  recipe: misoRamenRecipe,
};

const tonkotsuRamen: RamenMatcher = {
  match: (ingredients) => {
    return (
      ingredients.soup === "tonkotsu_soup" &&
      ingredients.noodle === "thin_noodle" &&
      hasDecentIngredients(ingredients, TONKOTSU_DECENT_INGREDIENTS)
    );
  },
  recipe: tonkotsuRamenRecipe,
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
