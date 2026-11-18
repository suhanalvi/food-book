export type Category = { id: string; label: string };

export type Ingredient = { id: string; label: string };

export type FoodItem = {
  id: string;
  name: string;
  category: string;
  price: number; // INR
  shortDescription: string;
  story: string;
  description: string;
  ingredients: Ingredient[];
  preparation: string;
  sizes?: { label: string; priceDelta: number }[];
  extras?: { label: string; price: number }[];
  /** Only shown when provided – never invented. */
  dietary?: string;
  allergens?: string;
  theme: "ivory" | "cream" | "dark";
  photo?: { id: number; credit: string; url: string };
};

export type CartLine = {
  key: string;
  itemId: string;
  size?: string;
  extras: string[];
  unitPrice: number;
  qty: number;
};
