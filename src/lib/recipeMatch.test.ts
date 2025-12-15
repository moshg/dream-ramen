import { describe, test, expect } from "vitest";
import { matchRecipe } from "./recipeMatch";
import type { RecipeIngredients } from "../types/game";

describe("recipeMatch - 柔軟マッチング", () => {
  describe("醤油ラーメン", () => {
    test("完全一致: 醤油スープ + 中太麺 + チャーシュー + ネギ + メンマ", () => {
      const ingredients: RecipeIngredients = {
        soup: "shoyu_soup",
        noodle: "medium_noodle",
        topping1: "chashu",
        topping2: "negi",
        topping3: "menma",
      };
      const result = matchRecipe(ingredients);
      expect(result.id).toBe("shoyu_ramen");
      expect(result.name).toBe("醤油ラーメン");
      expect(result.points).toBe(20);
    });

    test("柔軟マッチ: 醤油スープ + 中太麺 + チャーシュー + ネギ + のり", () => {
      const ingredients: RecipeIngredients = {
        soup: "shoyu_soup",
        noodle: "medium_noodle",
        topping1: "chashu",
        topping2: "negi",
        topping3: "nori", // メンマ → のり
      };
      const result = matchRecipe(ingredients);
      expect(result.id).toBe("shoyu_ramen");
      expect(result.name).toBe("醤油ラーメン");
      expect(result.points).toBe(20); // 柔軟マッチでも同じ点数
    });

    test("柔軟マッチ: 醤油スープ + 中太麺 + 煮卵 + ほうれん草 + ネギ", () => {
      const ingredients: RecipeIngredients = {
        soup: "shoyu_soup",
        noodle: "medium_noodle",
        topping1: "boiled_egg",
        topping2: "spinach",
        topping3: "negi",
      };
      const result = matchRecipe(ingredients);
      expect(result.id).toBe("shoyu_ramen");
      expect(result.name).toBe("醤油ラーメン");
    });

    test("不一致: 醤油スープ + 細麺（麺が違う）", () => {
      const ingredients: RecipeIngredients = {
        soup: "shoyu_soup",
        noodle: "thin_noodle", // 中太麺ではない
        topping1: "chashu",
        topping2: "negi",
        topping3: "menma",
      };
      const result = matchRecipe(ingredients);
      expect(result.id).toBe("default"); // デフォルトレシピ
    });
  });

  describe("塩ラーメン", () => {
    test("完全一致: 塩スープ + 細麺 + チャーシュー + ネギ + のり", () => {
      const ingredients: RecipeIngredients = {
        soup: "shio_soup",
        noodle: "thin_noodle",
        topping1: "chashu",
        topping2: "negi",
        topping3: "nori",
      };
      const result = matchRecipe(ingredients);
      expect(result.id).toBe("shio_ramen");
      expect(result.name).toBe("塩ラーメン");
      expect(result.points).toBe(20);
    });

    test("柔軟マッチ: 塩スープ + 細麺 + チャーシュー + メンマ + のり", () => {
      const ingredients: RecipeIngredients = {
        soup: "shio_soup",
        noodle: "thin_noodle",
        topping1: "chashu",
        topping2: "menma", // ネギ → メンマ
        topping3: "nori",
      };
      const result = matchRecipe(ingredients);
      expect(result.id).toBe("shio_ramen");
      expect(result.name).toBe("塩ラーメン");
    });
  });

  describe("味噌ラーメン", () => {
    test("完全一致: 味噌スープ + ちぢれ麺 + チャーシュー + もやし + コーン", () => {
      const ingredients: RecipeIngredients = {
        soup: "miso_soup",
        noodle: "curly_noodle",
        topping1: "chashu",
        topping2: "moyashi",
        topping3: "corn",
      };
      const result = matchRecipe(ingredients);
      expect(result.id).toBe("miso_ramen");
      expect(result.name).toBe("味噌ラーメン");
      expect(result.points).toBe(25);
    });

    test("柔軟マッチ: 味噌スープ + ちぢれ麺 + チャーシュー + ネギ + コーン", () => {
      const ingredients: RecipeIngredients = {
        soup: "miso_soup",
        noodle: "curly_noodle",
        topping1: "chashu",
        topping2: "negi", // もやし → ネギ
        topping3: "corn",
      };
      const result = matchRecipe(ingredients);
      expect(result.id).toBe("miso_ramen");
      expect(result.name).toBe("味噌ラーメン");
    });
  });

  describe("豚骨ラーメン", () => {
    test("完全一致: 豚骨スープ + 細麺 + チャーシュー + キクラゲ + 紅しょうが", () => {
      const ingredients: RecipeIngredients = {
        soup: "tonkotsu_soup",
        noodle: "thin_noodle",
        topping1: "chashu",
        topping2: "kikurage",
        topping3: "beni_shoga",
      };
      const result = matchRecipe(ingredients);
      expect(result.id).toBe("tonkotsu_ramen");
      expect(result.name).toBe("豚骨ラーメン");
      expect(result.points).toBe(25);
    });

    test("柔軟マッチ: 豚骨スープ + 細麺 + チャーシュー + ネギ + もやし", () => {
      const ingredients: RecipeIngredients = {
        soup: "tonkotsu_soup",
        noodle: "thin_noodle",
        topping1: "chashu",
        topping2: "negi",
        topping3: "moyashi",
      };
      const result = matchRecipe(ingredients);
      expect(result.id).toBe("tonkotsu_ramen");
      expect(result.name).toBe("豚骨ラーメン");
    });
  });

  describe("特殊レシピ（完全一致のみ）", () => {
    test("味噌バターコーンラーメン: 完全一致", () => {
      const ingredients: RecipeIngredients = {
        soup: "miso_soup",
        noodle: "curly_noodle",
        topping1: "corn",
        topping2: "corn",
        topping3: "corn",
      };
      const result = matchRecipe(ingredients);
      expect(result.id).toBe("miso_butter_corn_ramen");
      expect(result.name).toBe("味噌バターコーンラーメン");
      expect(result.points).toBe(30);
    });

    test("ほうれん草醤油ラーメン: 完全一致", () => {
      const ingredients: RecipeIngredients = {
        soup: "shoyu_soup",
        noodle: "medium_noodle",
        topping1: "chashu",
        topping2: "spinach",
        topping3: "boiled_egg",
      };
      const result = matchRecipe(ingredients);
      expect(result.id).toBe("spinach_shoyu_ramen");
      expect(result.name).toBe("ほうれん草醤油ラーメン");
      expect(result.points).toBe(28);
    });

    test("とんこつ醤油ラーメン: 完全一致", () => {
      const ingredients: RecipeIngredients = {
        soup: "tonkotsu_soup",
        noodle: "thick_noodle",
        topping1: "chashu",
        topping2: "negi",
        topping3: "boiled_egg",
      };
      const result = matchRecipe(ingredients);
      expect(result.id).toBe("tonkotsu_shoyu_ramen");
      expect(result.name).toBe("とんこつ醤油ラーメン");
      expect(result.points).toBe(30);
    });
  });

  describe("失敗系レシピ", () => {
    test("のり3つ", () => {
      const ingredients: RecipeIngredients = {
        soup: "shoyu_soup",
        noodle: "medium_noodle",
        topping1: "nori",
        topping2: "nori",
        topping3: "nori",
      };
      const result = matchRecipe(ingredients);
      expect(result.id).toBe("bad_ramen_1");
      expect(result.points).toBe(3);
    });

    test("具材なし", () => {
      const ingredients: RecipeIngredients = {
        soup: "shio_soup",
        noodle: "thick_noodle",
        topping1: "none",
        topping2: "none",
        topping3: "none",
      };
      const result = matchRecipe(ingredients);
      expect(result.id).toBe("bad_ramen_2");
      expect(result.points).toBe(3);
    });
  });

  describe("デフォルトレシピ", () => {
    test("マッチしない組み合わせ", () => {
      const ingredients: RecipeIngredients = {
        soup: "shoyu_soup",
        noodle: "thick_noodle", // 醤油ラーメンは中太麺
        topping1: "chashu",
        topping2: "negi",
        topping3: "menma",
      };
      const result = matchRecipe(ingredients);
      expect(result.id).toBe("default");
      expect(result.name).toBe("イマイチなラーメン");
      expect(result.points).toBe(3);
    });

    test("許可されていない具材", () => {
      const ingredients: RecipeIngredients = {
        soup: "shoyu_soup",
        noodle: "medium_noodle",
        topping1: "beni_shoga", // 醤油ラーメンには合わない
        topping2: "corn",
        topping3: "kikurage",
      };
      const result = matchRecipe(ingredients);
      expect(result.id).toBe("default");
    });
  });

  describe("エッジケース", () => {
    test("具材の順序が異なっても柔軟マッチ", () => {
      const ingredients: RecipeIngredients = {
        soup: "shoyu_soup",
        noodle: "medium_noodle",
        topping1: "nori",
        topping2: "chashu",
        topping3: "negi",
      };
      const result = matchRecipe(ingredients);
      expect(result.id).toBe("shoyu_ramen");
    });

    test("同じ具材2つは却下される", () => {
      const ingredients: RecipeIngredients = {
        soup: "shoyu_soup",
        noodle: "medium_noodle",
        topping1: "chashu",
        topping2: "chashu", // 重複
        topping3: "negi",
      };
      const result = matchRecipe(ingredients);
      expect(result.id).toBe("default");
      expect(result.name).toBe("イマイチなラーメン");
    });
  });
});
