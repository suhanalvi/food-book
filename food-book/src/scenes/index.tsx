import { lazy, type ComponentType } from "react";
import type { SceneProps } from "./common";

/**
 * One animated scene per food id. Scenes are code-split in four chunks and
 * only mounted when the visitor is near their page.
 */
const pick = <K extends string>(loader: () => Promise<Record<string, unknown>>, key: K) =>
  lazy(() => loader().then((m) => ({ default: m[key] as ComponentType<SceneProps> })));

const A = () => import("./scenesA");
const B = () => import("./scenesB");
const C = () => import("./scenesC");
const D = () => import("./scenesD");

export const scenes: Record<string, ComponentType<SceneProps>> = {
  coffee: pick(A, "Coffee"),
  burger: pick(A, "Burger"),
  patties: pick(A, "Patties"),
  pizza: pick(A, "Pizza"),
  milkshake: pick(B, "Milkshake"),
  pastry: pick(B, "Pastry"),
  cake: pick(B, "Cake"),
  donut: pick(B, "Donut"),
  sandwich: pick(C, "Sandwich"),
  fries: pick(C, "Fries"),
  tea: pick(C, "Tea"),
  coldcoffee: pick(C, "ColdCoffee"),
  cookies: pick(D, "Cookies"),
  brownies: pick(D, "Brownies"),
  icecream: pick(D, "IceCream"),
  garlicbread: pick(D, "GarlicBread"),
};
