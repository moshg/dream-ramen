import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { GameState, Recipe } from "../types/game";
import { INITIAL_INGREDIENTS } from "../data/ingredients";

/**
 * Game state interface with actions
 */
interface GameStore extends GameState {
  // Actions
  unlockIngredient: (ingredientId: string, cost: number) => boolean;
  createRamen: (recipe: Recipe, isFirstTime: boolean) => void;
  resetGame: () => void;
}

/**
 * Initial state
 */
const INITIAL_STATE: GameState = {
  points: 15,
  unlockedIngredients: [...INITIAL_INGREDIENTS],
  discoveredRecipes: [],
  createdCount: {},
};

/**
 * Zustand store with persist middleware
 */
export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      ...INITIAL_STATE,

      // Actions
      unlockIngredient: (ingredientId: string, cost: number): boolean => {
        const state = get();

        // Validation checks
        if (state.points < cost) return false;
        if (state.unlockedIngredients.includes(ingredientId)) return false;

        // Update state atomically
        set({
          points: state.points - cost,
          unlockedIngredients: [...state.unlockedIngredients, ingredientId],
        });

        return true;
      },

      createRamen: (recipe: Recipe, isFirstTime: boolean): void => {
        set((state) => {
          const newState: Partial<GameState> = {
            points: state.points + recipe.points,
            createdCount: {
              ...state.createdCount,
              [recipe.id]: (state.createdCount[recipe.id] || 0) + 1,
            },
          };

          // Add to discovered recipes if first time (excluding default)
          if (
            isFirstTime &&
            recipe.id !== "default" &&
            !state.discoveredRecipes.includes(recipe.id)
          ) {
            newState.discoveredRecipes = [...state.discoveredRecipes, recipe.id];
          }

          return newState;
        });
      },

      resetGame: (): void => {
        set(INITIAL_STATE);
      },
    }),
    {
      name: "ramenGameState", // localStorage key (same as current STORAGE_KEY)
      storage: createJSONStorage(() => localStorage),

      // Partition state: only persist GameState, not actions
      partialize: (state) => ({
        points: state.points,
        unlockedIngredients: state.unlockedIngredients,
        discoveredRecipes: state.discoveredRecipes,
        createdCount: state.createdCount,
      }),
    },
  ),
);

// Selectors for optimized re-renders (optional but recommended)
export const selectPoints = (state: GameStore) => state.points;
export const selectUnlockedIngredients = (state: GameStore) => state.unlockedIngredients;
export const selectDiscoveredRecipes = (state: GameStore) => state.discoveredRecipes;
export const selectCreatedCount = (state: GameStore) => state.createdCount;
