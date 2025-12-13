import type { Recipe, RecipeIngredients } from "../types/game";
import { RECIPES, DEFAULT_RECIPE } from "../data/recipes";

/**
 * レシピ判定ロジック
 * 選択された食材とレシピの完全一致判定を行う
 * スロット順序は問わない
 */

/**
 * 2つの食材構成が一致するかチェック
 * 具材1-3の順序は問わない（セットとして比較）
 */
function isIngredientsMatch(selected: RecipeIngredients, recipe: RecipeIngredients): boolean {
  // スープと麺は完全一致
  if (selected.soup !== recipe.soup || selected.noodle !== recipe.noodle) {
    return false;
  }

  // 具材をソートして比較（順序を問わない）
  const selectedIngredients = [
    selected.ingredient1,
    selected.ingredient2,
    selected.ingredient3,
  ].sort();

  const recipeIngredients = [recipe.ingredient1, recipe.ingredient2, recipe.ingredient3].sort();

  // 配列の要素を1つずつ比較
  return (
    selectedIngredients[0] === recipeIngredients[0] &&
    selectedIngredients[1] === recipeIngredients[1] &&
    selectedIngredients[2] === recipeIngredients[2]
  );
}

/**
 * 選択された食材からレシピを判定する
 * @param selectedIngredients - 選択された食材
 * @returns マッチしたレシピ、またはデフォルトレシピ
 */
export function matchRecipe(selectedIngredients: RecipeIngredients): Recipe {
  // 登録済みレシピと完全一致をチェック
  const matchedRecipe = RECIPES.find((recipe) =>
    isIngredientsMatch(selectedIngredients, recipe.ingredients),
  );

  // 一致した場合はそのレシピを返す
  if (matchedRecipe) {
    return matchedRecipe;
  }

  // 一致しない場合はデフォルトレシピを返す
  return DEFAULT_RECIPE;
}
