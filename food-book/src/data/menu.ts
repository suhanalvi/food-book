import raw from "./menu.json";
import type { Category, FoodItem } from "../types";
import { restaurant } from "../config/restaurant";

export const categories = raw.categories as Category[];
export const items = raw.items as unknown as FoodItem[];

export const itemById = (id: string) => items.find((i) => i.id === id)!;
export const categoryLabel = (id: string) => categories.find((c) => c.id === id)?.label ?? id;

export const formatPrice = (n: number) =>
  new Intl.NumberFormat(restaurant.locale, {
    style: "currency",
    currency: restaurant.currency,
    maximumFractionDigits: 0,
  }).format(n);

/** Photo URL helper. Returns null when the item has no photograph. */
export const photoSrc = (item: FoodItem, size: "thumb" | "plate" | "large" = "large") => {
  if (!item.photo) return null;
  const { id } = item.photo;
  const base = `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb`;
  if (size === "thumb") return `${base}&w=240&h=240&fit=crop`;
  if (size === "plate") return `${base}&w=560&h=560&fit=crop`;
  return `${base}&w=1000`;
};

export const pad = (n: number) => String(n).padStart(2, "0");
