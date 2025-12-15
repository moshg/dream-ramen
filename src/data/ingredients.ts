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
    emoji: "🍶",
  },
  {
    id: "shio_soup",
    name: "塩スープ",
    category: "soup",
    cost: 0,
    emoji: "🧂",
  },
  // 解放可能（2種）
  {
    id: "miso_soup",
    name: "味噌スープ",
    category: "soup",
    cost: 15,
    emoji: "🫕",
  },
  {
    id: "tonkotsu_soup",
    name: "豚骨スープ",
    category: "soup",
    cost: 20,
    emoji: "🦴",
  },

  // === 麺（4種） ===
  // 初期所持（2種）
  {
    id: "medium_noodle",
    name: "中太麺",
    category: "noodle",
    cost: 0,
    emoji: "🍜",
  },
  {
    id: "thin_noodle",
    name: "細麺",
    category: "noodle",
    cost: 0,
    emoji: "🥢",
  },
  // 解放可能（2種）
  {
    id: "thick_noodle",
    name: "太麺",
    category: "noodle",
    cost: 10,
    emoji: "🍝",
  },
  {
    id: "curly_noodle",
    name: "ちぢれ麺",
    category: "noodle",
    cost: 10,
    emoji: "〰️",
  },

  // === 具材（10種） ===
  // 初期所持（4種）
  {
    id: "chashu",
    name: "チャーシュー",
    category: "topping",
    cost: 0,
    emoji: "🍖",
  },
  {
    id: "negi",
    name: "ネギ",
    category: "topping",
    cost: 0,
    emoji: "🧅",
  },
  {
    id: "menma",
    name: "メンマ",
    category: "topping",
    cost: 0,
    emoji: "🎋",
  },
  {
    id: "nori",
    name: "のり",
    category: "topping",
    cost: 0,
    emoji: "🟢",
  },
  // 解放可能（6種）
  {
    id: "boiled_egg",
    name: "煮卵",
    category: "topping",
    cost: 10,
    emoji: "🥚",
  },
  {
    id: "moyashi",
    name: "もやし",
    category: "topping",
    cost: 5,
    emoji: "🌱",
  },
  {
    id: "corn",
    name: "コーン",
    category: "topping",
    cost: 5,
    emoji: "🌽",
  },
  {
    id: "kikurage",
    name: "キクラゲ",
    category: "topping",
    cost: 8,
    emoji: "🍄",
  },
  {
    id: "beni_shoga",
    name: "紅しょうが",
    category: "topping",
    cost: 5,
    emoji: "🔴",
  },
  {
    id: "spinach",
    name: "ほうれん草",
    category: "topping",
    cost: 8,
    emoji: "🥬",
  },
];

/**
 * 初期所持食材のIDリスト
 */
export const INITIAL_INGREDIENTS = INGREDIENTS.filter((ing) => ing.cost === 0).map((ing) => ing.id);
