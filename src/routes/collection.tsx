import { createFileRoute } from "@tanstack/react-router";
import { CollectionScreen } from "../components/CollectionScreen";
import { useGameState } from "../hooks/useGameState";

export const Route = createFileRoute("/collection")({
  component: CollectionPage,
});

function CollectionPage() {
  const { gameState, unlockIngredient } = useGameState();

  return <CollectionScreen gameState={gameState} onUnlockIngredient={unlockIngredient} />;
}
