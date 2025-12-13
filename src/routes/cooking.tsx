import { createFileRoute } from "@tanstack/react-router";
import { CookingScreen } from "../components/CookingScreen";
import { useGameState } from "../hooks/useGameState";

export const Route = createFileRoute("/cooking")({
  component: CookingPage,
});

function CookingPage() {
  const { gameState, createRamen } = useGameState();

  return <CookingScreen gameState={gameState} onCreateRamen={createRamen} />;
}
