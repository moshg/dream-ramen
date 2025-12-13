import { Link } from "@tanstack/react-router";
import type { GameState } from "../types/game";
import { RECIPES } from "../data/recipes";

interface MainScreenProps {
  gameState: GameState;
}

export function MainScreen({ gameState }: MainScreenProps) {
  const totalRecipes = RECIPES.length;
  const discoveredCount = gameState.discoveredRecipes.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        {/* タイトル */}
        <h1 className="text-4xl font-bold text-center mb-8 text-orange-600">🍜 ラーメンマスター</h1>

        {/* ステータス表示 */}
        <div className="bg-orange-50 rounded-lg p-6 mb-8 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">所持ポイント:</span>
            <span className="text-2xl font-bold text-orange-600">{gameState.points}pt</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">発見したラーメン:</span>
            <span className="text-2xl font-bold text-orange-600">
              {discoveredCount}/{totalRecipes}
            </span>
          </div>
        </div>

        {/* メニューボタン */}
        <div className="space-y-4">
          <Link
            to="/cooking"
            className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-xl text-center text-lg transition-colors shadow-lg hover:shadow-xl"
          >
            ラーメンを作る
          </Link>
          <Link
            to="/collection"
            className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-xl text-center text-lg transition-colors shadow-lg hover:shadow-xl"
          >
            図鑑
          </Link>
        </div>
      </div>
    </div>
  );
}
