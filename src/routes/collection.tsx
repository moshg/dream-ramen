import { createFileRoute } from "@tanstack/react-router";
import { CollectionScreen } from "../components/CollectionScreen";
import { useGameStore } from "../stores/gameStore";

export const Route = createFileRoute("/collection")({
  component: CollectionPage,
});

function CollectionPage() {
  const points = useGameStore((state) => state.points);
  const unlockedIngredients = useGameStore((state) => state.unlockedIngredients);
  const discoveredRecipes = useGameStore((state) => state.discoveredRecipes);
  const createdCount = useGameStore((state) => state.createdCount);
  const unlockIngredient = useGameStore((state) => state.unlockIngredient);

  const gameState = {
    points,
    unlockedIngredients,
    discoveredRecipes,
    createdCount,
  };

  return <CollectionScreen gameState={gameState} onUnlockIngredient={unlockIngredient} />;
}
