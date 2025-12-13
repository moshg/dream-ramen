import { useState, useEffect, useCallback } from "react";
import type { GameState, Recipe } from "../types/game";
import { INITIAL_INGREDIENTS } from "../data/ingredients";
import { saveGameState, loadGameState, resetGameState as resetStorage } from "../lib/storage";

/**
 * 初期ゲームステート
 */
const INITIAL_STATE: GameState = {
  points: 15,
  unlockedIngredients: [...INITIAL_INGREDIENTS],
  discoveredRecipes: [],
  createdCount: {},
};

/**
 * ゲームステート管理カスタムフック
 */
export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);

  // 初回マウント時にLocalStorageからデータ読み込み
  useEffect(() => {
    const savedState = loadGameState();
    if (savedState) {
      setGameState(savedState);
    }
  }, []);

  // ゲームステートが変更されたらLocalStorageに保存
  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  /**
   * 食材を解放する
   * @param ingredientId - 解放する食材のID
   * @param cost - 解放コスト
   * @returns 解放成功したかどうか
   */
  const unlockIngredient = useCallback(
    (ingredientId: string, cost: number): boolean => {
      // ポイント不足チェック
      if (gameState.points < cost) {
        return false;
      }

      // 既に解放済みチェック
      if (gameState.unlockedIngredients.includes(ingredientId)) {
        return false;
      }

      // ポイントを消費して食材を解放
      setGameState((prev) => ({
        ...prev,
        points: prev.points - cost,
        unlockedIngredients: [...prev.unlockedIngredients, ingredientId],
      }));

      return true;
    },
    [gameState.points, gameState.unlockedIngredients],
  );

  /**
   * ラーメンを作成する
   * @param recipe - 作成したレシピ
   * @param isFirstTime - 初回作成かどうか
   */
  const createRamen = useCallback((recipe: Recipe, isFirstTime: boolean): void => {
    setGameState((prev) => {
      const newState = {
        ...prev,
        points: prev.points + recipe.points,
        createdCount: {
          ...prev.createdCount,
          [recipe.id]: (prev.createdCount[recipe.id] || 0) + 1,
        },
      };

      // 初回作成の場合は図鑑に追加
      if (isFirstTime && !prev.discoveredRecipes.includes(recipe.id)) {
        newState.discoveredRecipes = [...prev.discoveredRecipes, recipe.id];
      }

      return newState;
    });
  }, []);

  /**
   * ゲームをリセットする
   */
  const resetGame = useCallback((): void => {
    resetStorage();
    setGameState(INITIAL_STATE);
  }, []);

  return {
    gameState,
    unlockIngredient,
    createRamen,
    resetGame,
  };
}
