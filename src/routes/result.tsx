import { createFileRoute, useLocation } from "@tanstack/react-router";
import { ResultScreen } from "../components/ResultScreen";
import type { Recipe, RecipeIngredients } from "../types/game";

interface ResultLocationState {
  recipe?: Recipe;
  isFirstTime?: boolean;
  selectedIngredients?: RecipeIngredients;
}

export const Route = createFileRoute("/result")({
  component: ResultPage,
});

function ResultPage() {
  const location = useLocation();
  const locationState = location.state as ResultLocationState | undefined;

  if (!locationState?.recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>エラー: レシピ情報が見つかりません</p>
      </div>
    );
  }

  return (
    <ResultScreen
      recipe={locationState.recipe}
      isFirstTime={locationState.isFirstTime ?? false}
      selectedIngredients={
        locationState.selectedIngredients ?? {
          soup: "",
          noodle: "",
          ingredient1: "none",
          ingredient2: "none",
          ingredient3: "none",
        }
      }
    />
  );
}
