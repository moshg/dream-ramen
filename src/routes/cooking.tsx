import { createFileRoute } from "@tanstack/react-router";
import { CookingScreen } from "../components/CookingScreen";
import { useGameStore } from "../stores/gameStore";

export const Route = createFileRoute("/cooking")({
  component: CookingPage,
});

function CookingPage() {
  const points = useGameStore((state) => state.points);
  const unlockedIngredients = useGameStore((state) => state.unlockedIngredients);
  const discoveredRecipes = useGameStore((state) => state.discoveredRecipes);
  const createdCount = useGameStore((state) => state.createdCount);
  const createRamen = useGameStore((state) => state.createRamen);

  const gameState = {
    points,
    unlockedIngredients,
    discoveredRecipes,
    createdCount,
  };

  return <CookingScreen gameState={gameState} onCreateRamen={createRamen} />;
}
