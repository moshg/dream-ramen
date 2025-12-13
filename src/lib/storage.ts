import type { GameState } from "../types/game";

/**
 * LocalStorage操作ヘルパー
 */

const STORAGE_KEY = "ramenGameState";

/**
 * ゲームステートをLocalStorageに保存
 */
export function saveGameState(state: GameState): void {
  try {
    const json = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, json);
  } catch (error) {
    console.error("Failed to save game state:", error);
  }
}

/**
 * LocalStorageからゲームステートを読み込む
 * @returns 保存されたゲームステート、またはnull
 */
export function loadGameState(): GameState | null {
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    if (!json) {
      return null;
    }
    return JSON.parse(json) as GameState;
  } catch (error) {
    console.error("Failed to load game state:", error);
    return null;
  }
}

/**
 * ゲームステートをリセット（開発用）
 */
export function resetGameState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to reset game state:", error);
  }
}
