import { createContext, useContext, type ReactNode } from "react";
import { useGameState } from "../hooks/useGameState";
import type { GameState, Recipe } from "../types/game";

interface GameStateContextValue {
  gameState: GameState;
  unlockIngredient: (ingredientId: string, cost: number) => boolean;
  createRamen: (recipe: Recipe, isFirstTime: boolean) => void;
  resetGame: () => void;
}

const GameStateContext = createContext<GameStateContextValue | undefined>(undefined);

export function GameStateProvider({ children }: { children: ReactNode }) {
  const gameStateValue = useGameState();

  return <GameStateContext.Provider value={gameStateValue}>{children}</GameStateContext.Provider>;
}

export function useGameStateContext() {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error("useGameStateContext must be used within GameStateProvider");
  }
  return context;
}
