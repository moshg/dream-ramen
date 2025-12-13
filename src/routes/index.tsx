import { createFileRoute } from "@tanstack/react-router";
import { MainScreen } from "../components/MainScreen";
import { useGameStateContext } from "../contexts/GameStateContext";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  const { gameState } = useGameStateContext();

  return <MainScreen gameState={gameState} />;
}
