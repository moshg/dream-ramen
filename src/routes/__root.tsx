import { Outlet, createRootRoute } from "@tanstack/react-router";
import { GameStateProvider } from "../contexts/GameStateContext";

export const Route = createRootRoute({
  component: () => (
    <GameStateProvider>
      <Outlet />
    </GameStateProvider>
  ),
});
