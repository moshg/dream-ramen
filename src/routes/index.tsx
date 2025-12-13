import { createFileRoute } from "@tanstack/react-router";
import { MainScreen } from "../components/MainScreen";
import { useGameStore } from "../stores/gameStore";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  const points = useGameStore((state) => state.points);
  const unlockedIngredients = useGameStore((state) => state.unlockedIngredients);
  const discoveredRecipes = useGameStore((state) => state.discoveredRecipes);
  const createdCount = useGameStore((state) => state.createdCount);

  const gameState = {
    points,
    unlockedIngredients,
    discoveredRecipes,
    createdCount,
  };

  return <MainScreen gameState={gameState} />;
}
