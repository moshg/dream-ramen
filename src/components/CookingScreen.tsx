import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { GameState, RecipeIngredients } from "../types/game";
import { INGREDIENTS } from "../data/ingredients";
import { matchRecipe } from "../lib/recipeMatch";

interface CookingScreenProps {
  gameState: GameState;
  onCreateRamen: (recipe: any, isFirstTime: boolean) => void;
}

export function CookingScreen({ gameState, onCreateRamen }: CookingScreenProps) {
  const navigate = useNavigate();

  // 解放済み食材でフィルタリング
  const unlockedIngredients = INGREDIENTS.filter((ing) =>
    gameState.unlockedIngredients.includes(ing.id),
  );

  const soups = unlockedIngredients.filter((ing) => ing.category === "soup");
  const noodles = unlockedIngredients.filter((ing) => ing.category === "noodle");
  const ingredients = unlockedIngredients.filter((ing) => ing.category === "ingredient");

  // 選択状態
  const [selectedSoup, setSelectedSoup] = useState(soups[0]?.id || "");
  const [selectedNoodle, setSelectedNoodle] = useState(noodles[0]?.id || "");
  const [selectedIngredient1, setSelectedIngredient1] = useState("none");
  const [selectedIngredient2, setSelectedIngredient2] = useState("none");
  const [selectedIngredient3, setSelectedIngredient3] = useState("none");

  // 調理ボタン押下時の処理
  const handleCook = () => {
    const selectedIngredients: RecipeIngredients = {
      soup: selectedSoup,
      noodle: selectedNoodle,
      ingredient1: selectedIngredient1,
      ingredient2: selectedIngredient2,
      ingredient3: selectedIngredient3,
    };

    // レシピ判定
    const recipe = matchRecipe(selectedIngredients);

    // 初回作成かチェック
    const isFirstTime = !gameState.discoveredRecipes.includes(recipe.id);

    // レシピ作成処理
    onCreateRamen(recipe, isFirstTime);

    // 結果画面へ遷移
    navigate({
      to: "/result",
      state: {
        recipe,
        isFirstTime,
        selectedIngredients,
      } as any,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        {/* タイトル */}
        <h1 className="text-3xl font-bold text-center mb-8 text-orange-600">ラーメンを作る</h1>

        {/* 食材選択フォーム */}
        <div className="space-y-6 mb-8">
          {/* スープ選択 */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">スープ</label>
            <select
              value={selectedSoup}
              onChange={(e) => setSelectedSoup(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none text-lg"
            >
              {soups.map((soup) => (
                <option key={soup.id} value={soup.id}>
                  {soup.name}
                </option>
              ))}
            </select>
          </div>

          {/* 麺選択 */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">麺</label>
            <select
              value={selectedNoodle}
              onChange={(e) => setSelectedNoodle(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none text-lg"
            >
              {noodles.map((noodle) => (
                <option key={noodle.id} value={noodle.id}>
                  {noodle.name}
                </option>
              ))}
            </select>
          </div>

          {/* 具材1選択 */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">具材1</label>
            <select
              value={selectedIngredient1}
              onChange={(e) => setSelectedIngredient1(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none text-lg"
            >
              <option value="none">なし</option>
              {ingredients.map((ing) => (
                <option key={ing.id} value={ing.id}>
                  {ing.name}
                </option>
              ))}
            </select>
          </div>

          {/* 具材2選択 */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">具材2</label>
            <select
              value={selectedIngredient2}
              onChange={(e) => setSelectedIngredient2(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none text-lg"
            >
              <option value="none">なし</option>
              {ingredients.map((ing) => (
                <option key={ing.id} value={ing.id}>
                  {ing.name}
                </option>
              ))}
            </select>
          </div>

          {/* 具材3選択 */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">具材3</label>
            <select
              value={selectedIngredient3}
              onChange={(e) => setSelectedIngredient3(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none text-lg"
            >
              <option value="none">なし</option>
              {ingredients.map((ing) => (
                <option key={ing.id} value={ing.id}>
                  {ing.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ボタン */}
        <div className="space-y-3">
          <button
            onClick={handleCook}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-xl text-lg transition-colors shadow-lg hover:shadow-xl"
          >
            調理する！
          </button>
          <button
            onClick={() => navigate({ to: "/" })}
            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-4 px-6 rounded-xl text-lg transition-colors"
          >
            戻る
          </button>
        </div>
      </div>
    </div>
  );
}
