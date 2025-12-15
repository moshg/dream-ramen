import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { GameState } from "../types/game";
import { INGREDIENTS } from "../data/ingredients";
import { RECIPES } from "../data/recipes";

interface CollectionScreenProps {
  gameState: GameState;
  onUnlockIngredient: (ingredientId: string, cost: number) => boolean;
}

export function CollectionScreen({ gameState, onUnlockIngredient }: CollectionScreenProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"recipes" | "ingredients">("recipes");

  // 星の表示
  const renderStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  // 食材解放処理
  const handleUnlock = (ingredientId: string, cost: number, name: string) => {
    const confirmed = window.confirm(`${name}を${cost}ptで解放しますか？`);
    if (confirmed) {
      const success = onUnlockIngredient(ingredientId, cost);
      if (!success) {
        alert("ポイントが不足しています");
      }
    }
  };

  // カテゴリ別に食材を分類
  const soups = INGREDIENTS.filter((ing) => ing.category === "soup");
  const noodles = INGREDIENTS.filter((ing) => ing.category === "noodle");
  const toppings = INGREDIENTS.filter((ing) => ing.category === "topping");

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        {/* ヘッダー */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-center text-orange-600 mb-4">食材図鑑</h1>
          <div className="text-center text-lg text-gray-700">
            所持ポイント: <span className="font-bold text-orange-600">{gameState.points}pt</span>
          </div>
        </div>

        {/* タブ */}
        <div className="flex mb-6 border-b-2 border-gray-200">
          <button
            onClick={() => setActiveTab("recipes")}
            className={`flex-1 py-3 font-bold text-lg transition-colors ${
              activeTab === "recipes"
                ? "text-orange-600 border-b-4 border-orange-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            ラーメン図鑑
          </button>
          <button
            onClick={() => setActiveTab("ingredients")}
            className={`flex-1 py-3 font-bold text-lg transition-colors ${
              activeTab === "ingredients"
                ? "text-orange-600 border-b-4 border-orange-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            食材一覧
          </button>
        </div>

        {/* コンテンツエリア */}
        <div className="mb-6 max-h-96 overflow-y-auto">
          {activeTab === "recipes" ? (
            // ラーメン図鑑タブ
            <div>
              <div className="mb-4 text-center text-gray-700">
                発見:{" "}
                <span className="font-bold text-orange-600">
                  {gameState.discoveredRecipes.length}/{RECIPES.length}
                </span>
              </div>
              <div className="space-y-4">
                {RECIPES.map((recipe, index) => {
                  const discovered = gameState.discoveredRecipes.includes(recipe.id);
                  const count = gameState.createdCount[recipe.id] || 0;

                  return (
                    <div
                      key={recipe.id}
                      className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200"
                    >
                      {discovered ? (
                        <>
                          <div className="font-bold text-lg text-gray-800 mb-2">
                            {index + 1}. {recipe.name}
                          </div>
                          <div className="text-yellow-500 mb-1">
                            {renderStars(recipe.rating)} / {recipe.points}pt
                          </div>
                          <div className="text-gray-600 text-sm">作成回数: {count}回</div>
                        </>
                      ) : (
                        <div className="text-gray-400">{index + 1}. 🔒 未発見</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            // 食材一覧タブ
            <div className="space-y-6">
              {/* スープ */}
              <div>
                <h3 className="font-bold text-lg text-gray-700 mb-3 border-b-2 border-orange-200 pb-2">
                  === スープ ===
                </h3>
                <div className="space-y-2">
                  {soups.map((soup) => {
                    const unlocked = gameState.unlockedIngredients.includes(soup.id);
                    return (
                      <div
                        key={soup.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{unlocked ? "✓" : "🔒"}</span>
                          <span className="text-gray-700">{soup.name}</span>
                        </div>
                        {!unlocked && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">{soup.cost}pt</span>
                            <button
                              onClick={() => handleUnlock(soup.id, soup.cost, soup.name)}
                              disabled={gameState.points < soup.cost}
                              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                gameState.points >= soup.cost
                                  ? "bg-orange-500 hover:bg-orange-600 text-white"
                                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                              }`}
                            >
                              解放
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 麺 */}
              <div>
                <h3 className="font-bold text-lg text-gray-700 mb-3 border-b-2 border-orange-200 pb-2">
                  === 麺 ===
                </h3>
                <div className="space-y-2">
                  {noodles.map((noodle) => {
                    const unlocked = gameState.unlockedIngredients.includes(noodle.id);
                    return (
                      <div
                        key={noodle.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{unlocked ? "✓" : "🔒"}</span>
                          <span className="text-gray-700">{noodle.name}</span>
                        </div>
                        {!unlocked && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">{noodle.cost}pt</span>
                            <button
                              onClick={() => handleUnlock(noodle.id, noodle.cost, noodle.name)}
                              disabled={gameState.points < noodle.cost}
                              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                gameState.points >= noodle.cost
                                  ? "bg-orange-500 hover:bg-orange-600 text-white"
                                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                              }`}
                            >
                              解放
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 具材 */}
              <div>
                <h3 className="font-bold text-lg text-gray-700 mb-3 border-b-2 border-orange-200 pb-2">
                  === 具材 ===
                </h3>
                <div className="space-y-2">
                  {toppings.map((topping) => {
                    const unlocked = gameState.unlockedIngredients.includes(topping.id);
                    return (
                      <div
                        key={topping.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{unlocked ? "✓" : "🔒"}</span>
                          <span className="text-gray-700">{topping.name}</span>
                        </div>
                        {!unlocked && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">{topping.cost}pt</span>
                            <button
                              onClick={() =>
                                handleUnlock(topping.id, topping.cost, topping.name)
                              }
                              disabled={gameState.points < topping.cost}
                              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                gameState.points >= topping.cost
                                  ? "bg-orange-500 hover:bg-orange-600 text-white"
                                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                              }`}
                            >
                              解放
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 戻るボタン */}
        <button
          onClick={() => navigate({ to: "/" })}
          className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-4 px-6 rounded-xl text-lg transition-colors"
        >
          戻る
        </button>
      </div>
    </div>
  );
}
