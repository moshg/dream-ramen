import { createFileRoute } from "@tanstack/react-router";
import { CollectionScreen } from "../components/CollectionScreen";
import { useGameStateContext } from "../contexts/GameStateContext";

export const Route = createFileRoute("/collection")({
  component: CollectionPage,
});

function CollectionPage() {
  const { gameState, unlockIngredient } = useGameStateContext();

  return <CollectionScreen gameState={gameState} onUnlockIngredient={unlockIngredient} />;
}
