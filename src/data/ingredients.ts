import type { Ingredient } from "../types/game";

/**
 * 食材マスターデータ
 * 全18種類（初期所持8種 + 解放可能10種）
 */
export const INGREDIENTS: Ingredient[] = [
  // === スープ（4種） ===
  // 初期所持（2種）
  {
    id: "shoyu_soup",
    name: "醤油スープ",
    category: "soup",
    cost: 0,
  },
  {
    id: "shio_soup",
    name: "塩スープ",
    category: "soup",
    cost: 0,
  },
  // 解放可能（2種）
  {
    id: "miso_soup",
    name: "味噌スープ",
    category: "soup",
    cost: 15,
  },
  {
    id: "tonkotsu_soup",
    name: "豚骨スープ",
    category: "soup",
    cost: 20,
  },

  // === 麺（4種） ===
  // 初期所持（2種）
  {
    id: "medium_noodle",
    name: "中太麺",
    category: "noodle",
    cost: 0,
  },
  {
    id: "thin_noodle",
    name: "細麺",
    category: "noodle",
    cost: 0,
  },
  // 解放可能（2種）
  {
    id: "thick_noodle",
    name: "太麺",
    category: "noodle",
    cost: 10,
  },
  {
    id: "curly_noodle",
    name: "ちぢれ麺",
    category: "noodle",
    cost: 10,
  },

  // === 具材（10種） ===
  // 初期所持（4種）
  {
    id: "chashu",
    name: "チャーシュー",
    category: "ingredient",
    cost: 0,
  },
  {
    id: "negi",
    name: "ネギ",
    category: "ingredient",
    cost: 0,
  },
  {
    id: "menma",
    name: "メンマ",
    category: "ingredient",
    cost: 0,
  },
  {
    id: "nori",
    name: "のり",
    category: "ingredient",
    cost: 0,
  },
  // 解放可能（6種）
  {
    id: "boiled_egg",
    name: "煮卵",
    category: "ingredient",
    cost: 10,
  },
  {
    id: "moyashi",
    name: "もやし",
    category: "ingredient",
    cost: 5,
  },
  {
    id: "corn",
    name: "コーン",
    category: "ingredient",
    cost: 5,
  },
  {
    id: "kikurage",
    name: "キクラゲ",
    category: "ingredient",
    cost: 8,
  },
  {
    id: "beni_shoga",
    name: "紅しょうが",
    category: "ingredient",
    cost: 5,
  },
  {
    id: "spinach",
    name: "ほうれん草",
    category: "ingredient",
    cost: 8,
  },
];

/**
 * 初期所持食材のIDリスト
 */
export const INITIAL_INGREDIENTS = INGREDIENTS.filter((ing) => ing.cost === 0).map((ing) => ing.id);
