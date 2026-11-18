import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export type SceneProps = {
  /** true while the page is on-screen → (re)starts the choreography */
  play: boolean;
  /** false → render the finished composition without any timeline */
  animate: boolean;
};

/**
 * Builds a paused GSAP timeline scoped to the scene's <svg>.
 * Timelines use `from` tweens, so the un-animated markup IS the final composition
 * (used for reduced motion and static thumbnails).
 */
export function useScene(build: (tl: gsap.core.Timeline, svg: SVGSVGElement) => void, { play, animate }: SceneProps) {
  const ref = useRef<SVGSVGElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    if (!animate || !ref.current) return;
    const svg = ref.current;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      build(tl, svg);
      // entry choreography runs ~40% faster so a page settles while it is being read
      tl.timeScale(1.4);
      tlRef.current = tl;
    }, svg);
    return () => {
      ctx.revert();
      tlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animate]);

  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;
    if (play) tl.restart();
    else tl.pause(0);
  }, [play, animate]);

  return ref;
}

/** deterministic pseudo-random so static + animated renders match */
export function rng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

export const polar = (cx: number, cy: number, r: number, deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
};

export const f1 = (n: number) => Math.round(n * 10) / 10;
