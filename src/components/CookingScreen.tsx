import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import type { GameState, RecipeIngredients, Category, Ingredient } from "../types/game";
import { INGREDIENTS } from "../data/ingredients";
import { matchRecipe } from "../lib/recipeMatch";

interface CookingScreenProps {
  gameState: GameState;
  onCreateRamen: (recipe: any, isFirstTime: boolean) => void;
}

interface CookingLocationState {
  selectedIngredients?: RecipeIngredients;
}

export function CookingScreen({ gameState, onCreateRamen }: CookingScreenProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as CookingLocationState | undefined;

  // 解放済み食材でフィルタリング
  const unlockedIngredients = INGREDIENTS.filter((ing) =>
    gameState.unlockedIngredients.includes(ing.id),
  );

  const soups = unlockedIngredients.filter((ing) => ing.category === "soup");
  const noodles = unlockedIngredients.filter((ing) => ing.category === "noodle");
  const toppings = unlockedIngredients.filter((ing) => ing.category === "ingredient");

  // 前回の選択があればそれを使用
  const previousSelection = locationState?.selectedIngredients;

  // 状態管理（新しい形式）
  const [selectedSoup, setSelectedSoup] = useState<string | null>(null);
  const [selectedNoodle, setSelectedNoodle] = useState<string | null>(null);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);

  // 初期化・前回選択の復元
  useEffect(() => {
    if (previousSelection) {
      setSelectedSoup(previousSelection.soup || null);
      setSelectedNoodle(previousSelection.noodle || null);
      const toppings: string[] = [];
      if (previousSelection.ingredient1 && previousSelection.ingredient1 !== "none") {
        toppings.push(previousSelection.ingredient1);
      }
      if (previousSelection.ingredient2 && previousSelection.ingredient2 !== "none") {
        toppings.push(previousSelection.ingredient2);
      }
      if (previousSelection.ingredient3 && previousSelection.ingredient3 !== "none") {
        toppings.push(previousSelection.ingredient3);
      }
      setSelectedToppings(toppings);
    }
  }, [previousSelection]);

  // スープ選択
  const handleSoupSelect = (soupId: string) => {
    setSelectedSoup((prev) => (prev === soupId ? null : soupId));
  };

  // 麺選択
  const handleNoodleSelect = (noodleId: string) => {
    setSelectedNoodle((prev) => (prev === noodleId ? null : noodleId));
  };

  // 具材選択（最大3つ）
  const handleToppingSelect = (toppingId: string) => {
    setSelectedToppings((prev) => {
      if (prev.includes(toppingId)) {
        return prev.filter((id) => id !== toppingId);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, toppingId];
    });
  };

  // レシピプレビューからの削除
  const handleRemoveFromPreview = (ingredientId: string, category: Category) => {
    switch (category) {
      case "soup":
        setSelectedSoup(null);
        break;
      case "noodle":
        setSelectedNoodle(null);
        break;
      case "ingredient":
        setSelectedToppings((prev) => prev.filter((id) => id !== ingredientId));
        break;
    }
  };

  // 調理ボタン押下時の処理
  const handleCook = () => {
    if (!selectedSoup || !selectedNoodle) return;

    const selectedIngredients: RecipeIngredients = {
      soup: selectedSoup,
      noodle: selectedNoodle,
      ingredient1: selectedToppings[0] || "none",
      ingredient2: selectedToppings[1] || "none",
      ingredient3: selectedToppings[2] || "none",
    };

    const recipe = matchRecipe(selectedIngredients);
    const isFirstTime = !gameState.discoveredRecipes.includes(recipe.id);
    onCreateRamen(recipe, isFirstTime);

    navigate({
      to: "/result",
      state: {
        recipe,
        isFirstTime,
        selectedIngredients,
      } as any,
    });
  };

  // IDから具材データを取得
  const getIngredient = (id: string): Ingredient | undefined =>
    INGREDIENTS.find((ing) => ing.id === id);

  const selectedSoupData = selectedSoup ? getIngredient(selectedSoup) : null;
  const selectedNoodleData = selectedNoodle ? getIngredient(selectedNoodle) : null;
  const selectedToppingsData = selectedToppings
    .map((id) => getIngredient(id))
    .filter((ing): ing is Ingredient => ing !== undefined);

  const canCook = selectedSoup && selectedNoodle;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <h1 className="text-3xl font-bold text-center mb-6 text-orange-600">ラーメンを作る</h1>

        {/* メインコンテンツ */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 左側: 具材選択エリア */}
          <div className="flex-1 bg-white rounded-2xl shadow-xl p-6">
            {/* スープ選択 */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
                <span>🥣</span>
                <span>スープ</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {soups.map((soup) => (
                  <button
                    key={soup.id}
                    onClick={() => handleSoupSelect(soup.id)}
                    title={soup.name}
                    className={`
                      w-14 h-14 rounded-xl flex items-center justify-center text-3xl
                      transition-all duration-200 cursor-pointer
                      ${
                        selectedSoup === soup.id
                          ? "bg-orange-100 border-3 border-orange-500 shadow-md scale-105"
                          : "bg-gray-50 border-2 border-gray-200 hover:border-orange-300 hover:shadow-md"
                      }
                    `}
                  >
                    {soup.emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* 麺選択 */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
                <span>🍜</span>
                <span>麺</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {noodles.map((noodle) => (
                  <button
                    key={noodle.id}
                    onClick={() => handleNoodleSelect(noodle.id)}
                    title={noodle.name}
                    className={`
                      w-14 h-14 rounded-xl flex items-center justify-center text-3xl
                      transition-all duration-200 cursor-pointer
                      ${
                        selectedNoodle === noodle.id
                          ? "bg-orange-100 border-3 border-orange-500 shadow-md scale-105"
                          : "bg-gray-50 border-2 border-gray-200 hover:border-orange-300 hover:shadow-md"
                      }
                    `}
                  >
                    {noodle.emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* 具材選択 */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
                <span>🥢</span>
                <span>具材</span>
                <span className="text-sm font-normal text-gray-500">
                  ({selectedToppings.length}/3)
                </span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {toppings.map((topping) => {
                  const isSelected = selectedToppings.includes(topping.id);
                  const isDisabled = !isSelected && selectedToppings.length >= 3;
                  return (
                    <button
                      key={topping.id}
                      onClick={() => handleToppingSelect(topping.id)}
                      disabled={isDisabled}
                      title={topping.name}
                      className={`
                        w-14 h-14 rounded-xl flex items-center justify-center text-3xl
                        transition-all duration-200
                        ${
                          isSelected
                            ? "bg-orange-100 border-3 border-orange-500 shadow-md scale-105 cursor-pointer"
                            : isDisabled
                              ? "bg-gray-100 border-2 border-gray-200 opacity-40 cursor-not-allowed"
                              : "bg-gray-50 border-2 border-gray-200 hover:border-orange-300 hover:shadow-md cursor-pointer"
                        }
                      `}
                    >
                      {topping.emoji}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 右側: レシピプレビュー */}
          <div className="lg:w-80">
            <div className="bg-white rounded-2xl shadow-xl p-6 lg:sticky lg:top-4">
              {/* 現在のレシピ */}
              <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-200 mb-6">
                <h3 className="text-lg font-bold text-orange-600 mb-4 text-center">現在のレシピ</h3>

                {/* スープ */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-16 text-gray-600 font-medium">スープ:</span>
                  {selectedSoupData ? (
                    <button
                      onClick={() => handleRemoveFromPreview(selectedSoupData.id, "soup")}
                      className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-orange-300 text-sm hover:bg-red-50 hover:border-red-300 transition-colors"
                    >
                      <span>{selectedSoupData.emoji}</span>
                      <span>{selectedSoupData.name}</span>
                      <span className="text-red-400 ml-1">×</span>
                    </button>
                  ) : (
                    <span className="text-gray-400">未選択</span>
                  )}
                </div>

                {/* 麺 */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-16 text-gray-600 font-medium">麺:</span>
                  {selectedNoodleData ? (
                    <button
                      onClick={() => handleRemoveFromPreview(selectedNoodleData.id, "noodle")}
                      className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-orange-300 text-sm hover:bg-red-50 hover:border-red-300 transition-colors"
                    >
                      <span>{selectedNoodleData.emoji}</span>
                      <span>{selectedNoodleData.name}</span>
                      <span className="text-red-400 ml-1">×</span>
                    </button>
                  ) : (
                    <span className="text-gray-400">未選択</span>
                  )}
                </div>

                {/* 具材 */}
                <div className="flex items-start gap-2">
                  <span className="w-16 text-gray-600 font-medium shrink-0">具材:</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedToppingsData.length > 0 ? (
                      selectedToppingsData.map((topping) => (
                        <button
                          key={topping.id}
                          onClick={() => handleRemoveFromPreview(topping.id, "ingredient")}
                          className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-orange-300 text-sm hover:bg-red-50 hover:border-red-300 transition-colors"
                        >
                          <span>{topping.emoji}</span>
                          <span>{topping.name}</span>
                          <span className="text-red-400 ml-1">×</span>
                        </button>
                      ))
                    ) : (
                      <span className="text-gray-400">未選択</span>
                    )}
                  </div>
                </div>
              </div>

              {/* 調理ボタン */}
              <button
                onClick={handleCook}
                disabled={!canCook}
                className={`
                  w-full py-4 px-6 rounded-xl text-lg font-bold transition-all shadow-lg
                  ${
                    canCook
                      ? "bg-orange-500 hover:bg-orange-600 text-white hover:shadow-xl"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }
                `}
              >
                調理する！
              </button>

              <button
                onClick={() => navigate({ to: "/" })}
                className="w-full mt-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-xl transition-colors"
              >
                戻る
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
