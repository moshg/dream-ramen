import { createFileRoute } from "@tanstack/react-router";
import { MainScreen } from "../components/MainScreen";
import { useGameState } from "../hooks/useGameState";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  const { gameState } = useGameState();

  return <MainScreen gameState={gameState} />;
}
