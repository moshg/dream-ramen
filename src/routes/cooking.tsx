import { createFileRoute } from "@tanstack/react-router";
import { CookingScreen } from "../components/CookingScreen";
import { useGameStateContext } from "../contexts/GameStateContext";

export const Route = createFileRoute("/cooking")({
  component: CookingPage,
});

function CookingPage() {
  const { gameState, createRamen } = useGameStateContext();

  return <CookingScreen gameState={gameState} onCreateRamen={createRamen} />;
}
