import type { Recipe } from "../types/game";

/**
 * レシピマスターデータ
 * 全10種類（正統派4種 + 応用3種 + 失敗系3種）
 */

// ============================================
// 正統派レシピ（4種）
// ============================================

export const SHOYU_RAMEN: Recipe = {
  id: "shoyu_ramen",
  name: "醤油ラーメン",
  ingredients: {
    soup: "shoyu_soup",
    noodle: "medium_noodle",
    ingredient1: "chashu",
    ingredient2: "negi",
    ingredient3: "menma",
  },
  points: 20,
  rating: 4,
  comment: "王道の美味しさ！",
  category: "standard",
};

export const SHIO_RAMEN: Recipe = {
  id: "shio_ramen",
  name: "塩ラーメン",
  ingredients: {
    soup: "shio_soup",
    noodle: "thin_noodle",
    ingredient1: "chashu",
    ingredient2: "negi",
    ingredient3: "nori",
  },
  points: 20,
  rating: 4,
  comment: "あっさりして美味しい！",
  category: "standard",
};

export const MISO_RAMEN: Recipe = {
  id: "miso_ramen",
  name: "味噌ラーメン",
  ingredients: {
    soup: "miso_soup",
    noodle: "curly_noodle",
    ingredient1: "chashu",
    ingredient2: "moyashi",
    ingredient3: "corn",
  },
  points: 25,
  rating: 4,
  comment: "コクがあって美味しい！",
  category: "standard",
};

export const TONKOTSU_RAMEN: Recipe = {
  id: "tonkotsu_ramen",
  name: "豚骨ラーメン",
  ingredients: {
    soup: "tonkotsu_soup",
    noodle: "thin_noodle",
    ingredient1: "chashu",
    ingredient2: "kikurage",
    ingredient3: "beni_shoga",
  },
  points: 25,
  rating: 4,
  comment: "濃厚でクリーミー！",
  category: "standard",
};

// ============================================
// 応用レシピ（3種）
// ============================================

export const MISO_BUTTER_CORN_RAMEN: Recipe = {
  id: "miso_butter_corn_ramen",
  name: "味噌バターコーンラーメン",
  ingredients: {
    soup: "miso_soup",
    noodle: "curly_noodle",
    ingredient1: "corn",
    ingredient2: "corn",
    ingredient3: "corn",
  },
  points: 30,
  rating: 5,
  comment: "北海道の味！",
  category: "special",
};

export const SPINACH_SHOYU_RAMEN: Recipe = {
  id: "spinach_shoyu_ramen",
  name: "ほうれん草醤油ラーメン",
  ingredients: {
    soup: "shoyu_soup",
    noodle: "medium_noodle",
    ingredient1: "chashu",
    ingredient2: "spinach",
    ingredient3: "boiled_egg",
  },
  points: 28,
  rating: 4,
  comment: "栄養満点！",
  category: "special",
};

export const TONKOTSU_SHOYU_RAMEN: Recipe = {
  id: "tonkotsu_shoyu_ramen",
  name: "とんこつ醤油ラーメン",
  ingredients: {
    soup: "tonkotsu_soup",
    noodle: "thick_noodle",
    ingredient1: "chashu",
    ingredient2: "negi",
    ingredient3: "boiled_egg",
  },
  points: 30,
  rating: 5,
  comment: "濃厚なのに食べやすい！",
  category: "special",
};

// ============================================
// 失敗系レシピ（3種）
// ============================================

export const BAD_RAMEN_1: Recipe = {
  id: "bad_ramen_1",
  name: "イマイチなラーメン",
  ingredients: {
    soup: "shoyu_soup",
    noodle: "medium_noodle",
    ingredient1: "nori",
    ingredient2: "nori",
    ingredient3: "nori",
  },
  points: 3,
  rating: 1,
  comment: "のりが多すぎる...",
  category: "joke",
};

export const BAD_RAMEN_2: Recipe = {
  id: "bad_ramen_2",
  name: "イマイチなラーメン",
  ingredients: {
    soup: "shio_soup",
    noodle: "thick_noodle",
    ingredient1: "none",
    ingredient2: "none",
    ingredient3: "none",
  },
  points: 3,
  rating: 1,
  comment: "具がないと寂しい...",
  category: "joke",
};

export const MEDIOCRE_RAMEN: Recipe = {
  id: "mediocre_ramen",
  name: "もうちょっとなラーメン",
  ingredients: {
    soup: "miso_soup",
    noodle: "thin_noodle",
    ingredient1: "negi",
    ingredient2: "kikurage",
    ingredient3: "beni_shoga",
  },
  points: 5,
  rating: 2,
  comment: "組み合わせがイマイチ...",
  category: "joke",
};

// ============================================
// レシピ配列（個別定義から組み立て）
// ============================================

export const RECIPES: Recipe[] = [
  // 正統派
  SHOYU_RAMEN,
  SHIO_RAMEN,
  MISO_RAMEN,
  TONKOTSU_RAMEN,

  // 応用
  MISO_BUTTER_CORN_RAMEN,
  SPINACH_SHOYU_RAMEN,
  TONKOTSU_SHOYU_RAMEN,

  // 失敗系
  BAD_RAMEN_1,
  BAD_RAMEN_2,
  MEDIOCRE_RAMEN,
];

// ============================================
// デフォルトレシピ
// ============================================

export const DEFAULT_RECIPE: Recipe = {
  id: "default",
  name: "イマイチなラーメン",
  ingredients: {
    soup: "",
    noodle: "",
    ingredient1: "",
    ingredient2: "",
    ingredient3: "",
  },
  points: 3,
  rating: 1,
  comment: "うーん...微妙だ...",
  category: "joke",
};
