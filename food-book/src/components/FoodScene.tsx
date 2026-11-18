import { Suspense, useId } from "react";
import { scenes } from "../scenes";
import { items } from "../data/menu";

/** Generates ingredient-highlight CSS from the menu data (render once). */
export function HighlightStyles() {
  const ids = Array.from(new Set(items.flatMap((i) => i.ingredients.map((g) => g.id))));
  const css =
    `[data-hl]:not([data-hl=""]) [data-ing]{filter:grayscale(.85) opacity(.38);transition:filter .4s ease}` +
    ids
      .map(
        (id) =>
          `[data-hl="${id}"]:not([data-hl=""]) [data-ing="${id}"]{filter:drop-shadow(0 0 10px rgba(255,244,214,.95)) drop-shadow(0 0 22px rgba(255,214,140,.75)) saturate(1.25) brightness(1.1)}`,
      )
      .join("");
  return <style>{css}</style>;
}

type Props = {
  id: string;
  play?: boolean;
  animate?: boolean;
  highlight?: string | null;
  className?: string;
};

/**
 * Renders one dish composition. A shared "print finish" — fine grain and a soft
 * studio vignette — sits over every scene so the illustrations read as one
 * consistent, textured set rather than flat vector art.
 */
export default function FoodScene({ id, play = false, animate = true, highlight = null, className = "" }: Props) {
  const uid = useId().replace(/:/g, "");
  const Scene = scenes[id];
  if (!Scene) return null;
  return (
    <div className={`relative aspect-square w-full overflow-hidden ${className}`} data-hl={highlight ?? ""}>
      <Suspense fallback={<div className="h-full w-full animate-pulse rounded-full bg-black/5" />}>
        <Scene play={play} animate={animate} />
      </Suspense>

      {/* studio light falloff */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 48% 40%, rgba(255,250,236,0) 52%, rgba(56,32,16,.14) 88%, rgba(45,24,10,.22) 100%)" }}
      />
      {/* paper / print grain */}
      <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.14] mix-blend-multiply">
        <filter id={`${uid}g`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 .32  0 0 0 0 .23  0 0 0 0 .15  0 0 0 .55 0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${uid}g)`} />
      </svg>
    </div>
  );
}
