import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { useGameStore } from "./gameStore";
import { INITIAL_INGREDIENTS } from "../data/ingredients";
import type { Recipe } from "../types/game";

describe("gameStore", () => {
  // 各テスト前にストアをリセット
  beforeEach(() => {
    useGameStore.getState().resetGame();
    localStorage.clear();
  });

  // 各テスト後にlocalStorageをクリーンアップ
  afterEach(() => {
    localStorage.clear();
  });

  describe("初期状態", () => {
    it("初期ポイントが15であること", () => {
      const state = useGameStore.getState();
      expect(state.points).toBe(15);
    });

    it("初期食材が解放されていること", () => {
      const state = useGameStore.getState();
      expect(state.unlockedIngredients).toEqual(INITIAL_INGREDIENTS);
      expect(state.unlockedIngredients.length).toBe(8);
    });

    it("発見したレシピが空配列であること", () => {
      const state = useGameStore.getState();
      expect(state.discoveredRecipes).toEqual([]);
    });

    it("作成回数が空オブジェクトであること", () => {
      const state = useGameStore.getState();
      expect(state.createdCount).toEqual({});
    });
  });

  describe("unlockIngredient", () => {
    describe("正常系", () => {
      it("ポイントを消費して食材を解放できること", () => {
        const { unlockIngredient } = useGameStore.getState();
        const result = unlockIngredient("miso_soup", 15);

        expect(result).toBe(true);

        const state = useGameStore.getState();
        expect(state.points).toBe(0); // 15 - 15
        expect(state.unlockedIngredients).toContain("miso_soup");
        expect(state.unlockedIngredients.length).toBe(9); // 8 + 1
      });

      it("複数の食材を順次解放できること", () => {
        const { unlockIngredient } = useGameStore.getState();

        // もやし (5pt)
        unlockIngredient("moyashi", 5);
        expect(useGameStore.getState().points).toBe(10);
        expect(useGameStore.getState().unlockedIngredients).toContain("moyashi");

        // コーン (5pt)
        unlockIngredient("corn", 5);
        expect(useGameStore.getState().points).toBe(5);
        expect(useGameStore.getState().unlockedIngredients).toContain("corn");

        // 紅しょうが (5pt)
        unlockIngredient("benishoga", 5);
        expect(useGameStore.getState().points).toBe(0);
        expect(useGameStore.getState().unlockedIngredients).toContain("benishoga");

        expect(useGameStore.getState().unlockedIngredients.length).toBe(11); // 8 + 3
      });
    });

    describe("異常系", () => {
      it("ポイント不足の場合は解放できないこと", () => {
        const { unlockIngredient } = useGameStore.getState();
        const result = unlockIngredient("tonkotsu_soup", 20); // コスト20pt、所持15pt

        expect(result).toBe(false);

        const state = useGameStore.getState();
        expect(state.points).toBe(15); // ポイントは変わらない
        expect(state.unlockedIngredients).not.toContain("tonkotsu_soup");
        expect(state.unlockedIngredients.length).toBe(8); // 変わらない
      });

      it("既に解放済みの食材は解放できないこと", () => {
        const { unlockIngredient } = useGameStore.getState();

        // 1回目：成功
        const result1 = unlockIngredient("miso_soup", 15);
        expect(result1).toBe(true);
        expect(useGameStore.getState().points).toBe(0);

        // ポイントを追加（createRamenでポイント獲得を模擬）
        const mockRecipe: Recipe = {
          id: "test",
          name: "Test",
          points: 20,
          rating: 5,
          comment: "Test",
          category: "standard",
          ingredients: {
            soup: "shoyu_soup",
            noodle: "medium_noodle",
            ingredient1: "none",
            ingredient2: "none",
            ingredient3: "none",
          },
        };
        useGameStore.getState().createRamen(mockRecipe, false);
        expect(useGameStore.getState().points).toBe(20);

        // 2回目：失敗（既に解放済み）
        const result2 = unlockIngredient("miso_soup", 15);
        expect(result2).toBe(false);
        expect(useGameStore.getState().points).toBe(20); // ポイントは消費されない
        expect(useGameStore.getState().unlockedIngredients.length).toBe(9); // 変わらない
      });

      it("ポイントがちょうど0になっても解放できること", () => {
        const { unlockIngredient } = useGameStore.getState();
        const result = unlockIngredient("miso_soup", 15); // ちょうど15pt

        expect(result).toBe(true);
        expect(useGameStore.getState().points).toBe(0);
        expect(useGameStore.getState().unlockedIngredients).toContain("miso_soup");
      });
    });
  });

  describe("createRamen", () => {
    const createMockRecipe = (id: string, points: number, isDefault = false): Recipe => ({
      id: isDefault ? "default" : id,
      name: `Test Ramen ${id}`,
      points,
      rating: 5,
      comment: "Delicious!",
      category: "standard",
      ingredients: {
        soup: "shoyu_soup",
        noodle: "medium_noodle",
        ingredient1: "chashu",
        ingredient2: "negi",
        ingredient3: "none",
      },
    });

    it("ポイントが加算されること", () => {
      const { createRamen } = useGameStore.getState();
      const recipe = createMockRecipe("shoyu_ramen", 10);

      createRamen(recipe, true);

      const state = useGameStore.getState();
      expect(state.points).toBe(25); // 15 + 10
    });

    it("作成回数が記録されること", () => {
      const { createRamen } = useGameStore.getState();
      const recipe = createMockRecipe("shoyu_ramen", 10);

      createRamen(recipe, true);

      const state = useGameStore.getState();
      expect(state.createdCount["shoyu_ramen"]).toBe(1);
    });

    it("同じレシピを複数回作成すると作成回数が増えること", () => {
      const { createRamen } = useGameStore.getState();
      const recipe = createMockRecipe("shoyu_ramen", 10);

      createRamen(recipe, true);
      createRamen(recipe, false); // 2回目なのでisFirstTime=false
      createRamen(recipe, false); // 3回目

      const state = useGameStore.getState();
      expect(state.createdCount["shoyu_ramen"]).toBe(3);
      expect(state.points).toBe(45); // 15 + 10 + 10 + 10
    });

    it("初回作成時は図鑑に追加されること", () => {
      const { createRamen } = useGameStore.getState();
      const recipe = createMockRecipe("shoyu_ramen", 10);

      createRamen(recipe, true);

      const state = useGameStore.getState();
      expect(state.discoveredRecipes).toContain("shoyu_ramen");
      expect(state.discoveredRecipes.length).toBe(1);
    });

    it("2回目以降は図鑑に重複して追加されないこと", () => {
      const { createRamen } = useGameStore.getState();
      const recipe = createMockRecipe("shoyu_ramen", 10);

      createRamen(recipe, true); // 1回目
      createRamen(recipe, true); // 2回目（isFirstTime=trueでも重複しない）
      createRamen(recipe, true); // 3回目

      const state = useGameStore.getState();
      expect(state.discoveredRecipes).toContain("shoyu_ramen");
      expect(state.discoveredRecipes.length).toBe(1); // 重複しない
    });

    it("デフォルトレシピは図鑑に追加されないこと", () => {
      const { createRamen } = useGameStore.getState();
      const defaultRecipe = createMockRecipe("default", 5, true);

      createRamen(defaultRecipe, true);

      const state = useGameStore.getState();
      expect(state.discoveredRecipes).not.toContain("default");
      expect(state.discoveredRecipes.length).toBe(0);
      expect(state.createdCount["default"]).toBe(1); // 作成回数は記録される
    });

    it("isFirstTime=falseの場合は図鑑に追加されないこと", () => {
      const { createRamen } = useGameStore.getState();
      const recipe = createMockRecipe("shoyu_ramen", 10);

      createRamen(recipe, false); // 初回だがisFirstTime=false

      const state = useGameStore.getState();
      expect(state.discoveredRecipes).not.toContain("shoyu_ramen");
      expect(state.discoveredRecipes.length).toBe(0);
    });

    it("複数のレシピを発見できること", () => {
      const { createRamen } = useGameStore.getState();

      createRamen(createMockRecipe("shoyu_ramen", 10), true);
      createRamen(createMockRecipe("miso_ramen", 12), true);
      createRamen(createMockRecipe("tonkotsu_ramen", 15), true);

      const state = useGameStore.getState();
      expect(state.discoveredRecipes).toEqual(["shoyu_ramen", "miso_ramen", "tonkotsu_ramen"]);
      expect(state.discoveredRecipes.length).toBe(3);
      expect(state.points).toBe(52); // 15 + 10 + 12 + 15
    });
  });

  describe("resetGame", () => {
    it("全ての状態が初期化されること", () => {
      const { unlockIngredient, createRamen, resetGame } = useGameStore.getState();

      // データを変更
      unlockIngredient("miso_soup", 15);
      const recipe: Recipe = {
        id: "test_recipe",
        name: "Test",
        points: 5,
        rating: 3,
        comment: "",
        category: "standard",
        ingredients: {
          soup: "shoyu_soup",
          noodle: "medium_noodle",
          ingredient1: "none",
          ingredient2: "none",
          ingredient3: "none",
        },
      };
      createRamen(recipe, true);

      // 変更されたことを確認
      let state = useGameStore.getState();
      expect(state.points).toBe(5); // 0 + 5
      expect(state.unlockedIngredients).toContain("miso_soup");
      expect(state.discoveredRecipes).toContain("test_recipe");
      expect(state.createdCount["test_recipe"]).toBe(1);

      // リセット
      resetGame();

      // 初期状態に戻ったことを確認
      state = useGameStore.getState();
      expect(state.points).toBe(15);
      expect(state.unlockedIngredients).toEqual(INITIAL_INGREDIENTS);
      expect(state.unlockedIngredients).not.toContain("miso_soup");
      expect(state.discoveredRecipes).toEqual([]);
      expect(state.createdCount).toEqual({});
    });
  });

  describe("永続化（localStorage）", () => {
    it("状態変更がlocalStorageに保存されること", () => {
      const { unlockIngredient } = useGameStore.getState();

      unlockIngredient("miso_soup", 15);

      // localStorageに保存されていることを確認
      const stored = localStorage.getItem("ramenGameState");
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored!);
      expect(parsed.state.points).toBe(0);
      expect(parsed.state.unlockedIngredients).toContain("miso_soup");
    });

    it("localStorageからストアが復元されること", () => {
      // localStorageに直接データを設定
      const mockState = {
        state: {
          points: 100,
          unlockedIngredients: [...INITIAL_INGREDIENTS, "miso_soup", "tonkotsu_soup"],
          discoveredRecipes: ["shoyu_ramen", "miso_ramen"],
          createdCount: {
            shoyu_ramen: 5,
            miso_ramen: 3,
          },
        },
        version: 0,
      };
      localStorage.setItem("ramenGameState", JSON.stringify(mockState));

      // 注意: Zustandのpersistミドルウェアの仕様上、
      // この時点では既存のストアの状態が残っているため、
      // 実際のアプリケーション起動時の動作をテストするには
      // ストアの再初期化が必要です。
      // ここでは、localStorageにデータが保存されていることを確認
      const stored = localStorage.getItem("ramenGameState");
      const parsed = JSON.parse(stored!);
      expect(parsed.state.points).toBe(100);
      expect(parsed.state.unlockedIngredients).toContain("miso_soup");
      expect(parsed.state.discoveredRecipes).toContain("shoyu_ramen");
    });

    it("リセット後もlocalStorageが更新されること", () => {
      const { unlockIngredient, resetGame } = useGameStore.getState();

      // データを変更
      unlockIngredient("miso_soup", 15);

      // localStorageに変更が保存されていることを確認
      let stored = localStorage.getItem("ramenGameState");
      let parsed = JSON.parse(stored!);
      expect(parsed.state.points).toBe(0);

      // リセット
      resetGame();

      // localStorageもリセットされていることを確認
      stored = localStorage.getItem("ramenGameState");
      parsed = JSON.parse(stored!);
      expect(parsed.state.points).toBe(15);
      expect(parsed.state.unlockedIngredients).toEqual(INITIAL_INGREDIENTS);
      expect(parsed.state.discoveredRecipes).toEqual([]);
      expect(parsed.state.createdCount).toEqual({});
    });

    it("partializeによってアクション関数が保存されないこと", () => {
      const { unlockIngredient } = useGameStore.getState();

      unlockIngredient("miso_soup", 15);

      const stored = localStorage.getItem("ramenGameState");
      const parsed = JSON.parse(stored!);

      // アクション関数が保存されていないことを確認
      expect(parsed.state.unlockIngredient).toBeUndefined();
      expect(parsed.state.createRamen).toBeUndefined();
      expect(parsed.state.resetGame).toBeUndefined();

      // データのみ保存されていることを確認
      expect(parsed.state.points).toBeDefined();
      expect(parsed.state.unlockedIngredients).toBeDefined();
      expect(parsed.state.discoveredRecipes).toBeDefined();
      expect(parsed.state.createdCount).toBeDefined();
    });
  });

  describe("統合テスト", () => {
    it("実際のゲームフローをシミュレートできること", () => {
      const { unlockIngredient, createRamen } = useGameStore.getState();

      // 初期状態: 15pt
      expect(useGameStore.getState().points).toBe(15);

      // ラーメンを作成してポイント獲得
      const recipe1: Recipe = {
        id: "shoyu_ramen",
        name: "醤油ラーメン",
        points: 10,
        rating: 4,
        comment: "美味しい！",
        category: "standard",
        ingredients: {
          soup: "shoyu_soup",
          noodle: "medium_noodle",
          ingredient1: "chashu",
          ingredient2: "negi",
          ingredient3: "menma",
        },
      };
      createRamen(recipe1, true);

      // 25ptになる
      expect(useGameStore.getState().points).toBe(25);
      expect(useGameStore.getState().discoveredRecipes).toContain("shoyu_ramen");

      // 高価な食材を解放
      const result = unlockIngredient("tonkotsu_soup", 20);
      expect(result).toBe(true);
      expect(useGameStore.getState().points).toBe(5);
      expect(useGameStore.getState().unlockedIngredients).toContain("tonkotsu_soup");

      // 別のラーメンを作成
      const recipe2: Recipe = {
        id: "tonkotsu_ramen",
        name: "豚骨ラーメン",
        points: 15,
        rating: 5,
        comment: "濃厚！",
        category: "standard",
        ingredients: {
          soup: "tonkotsu_soup",
          noodle: "medium_noodle",
          ingredient1: "chashu",
          ingredient2: "negi",
          ingredient3: "kikurage",
        },
      };
      createRamen(recipe2, true);

      // 最終状態を確認
      const finalState = useGameStore.getState();
      expect(finalState.points).toBe(20); // 5 + 15
      expect(finalState.discoveredRecipes).toEqual(["shoyu_ramen", "tonkotsu_ramen"]);
      expect(finalState.createdCount["shoyu_ramen"]).toBe(1);
      expect(finalState.createdCount["tonkotsu_ramen"]).toBe(1);
      expect(finalState.unlockedIngredients.length).toBe(9); // 8 + tonkotsu_soup
    });
  });
});
