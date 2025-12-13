import { useNavigate } from "@tanstack/react-router";
import type { Recipe, RecipeIngredients } from "../types/game";

interface ResultScreenProps {
  recipe: Recipe;
  isFirstTime: boolean;
  selectedIngredients: RecipeIngredients;
}

export function ResultScreen({ recipe, isFirstTime, selectedIngredients }: ResultScreenProps) {
  const navigate = useNavigate();

  // 星の表示
  const renderStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        {/* ラーメンアイコン */}
        <div className="text-center mb-6">
          <div className="text-8xl mb-4">🍜</div>
          <h1 className="text-3xl font-bold text-orange-600 mb-4">{recipe.name}！</h1>
        </div>

        {/* 評価 */}
        <div className="text-center mb-6">
          <div className="text-4xl text-yellow-500 mb-2">{renderStars(recipe.rating)}</div>
        </div>

        {/* 獲得ポイント */}
        <div className="bg-green-50 rounded-lg p-6 mb-6">
          <p className="text-center text-2xl font-bold text-green-600">
            獲得ポイント: +{recipe.points}pt
          </p>
        </div>

        {/* コメント */}
        <div className="bg-orange-50 rounded-lg p-6 mb-6">
          <p className="text-center text-lg text-gray-700">「{recipe.comment}」</p>
        </div>

        {/* 初回登録通知 */}
        {isFirstTime && recipe.id !== "default" && (
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 mb-6">
            <p className="text-center text-lg font-bold text-purple-600">
              ✨ 図鑑に登録されました！
            </p>
          </div>
        )}

        {/* ボタン */}
        <div className="space-y-3">
          <button
            onClick={() =>
              navigate({
                to: "/cooking",
                state: { selectedIngredients } as any,
              })
            }
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-xl text-lg transition-colors shadow-lg hover:shadow-xl"
          >
            もう一度作る
          </button>
          <button
            onClick={() => navigate({ to: "/" })}
            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-4 px-6 rounded-xl text-lg transition-colors"
          >
            メインに戻る
          </button>
        </div>
      </div>
    </div>
  );
}
