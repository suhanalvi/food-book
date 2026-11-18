import { memo, useLayoutEffect, useRef, useState, type MutableRefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { items } from "../data/menu";
import { play as sfx } from "../audio/sfx";
import BookCover from "./BookCover";
import FoodPage from "./FoodPage";

gsap.registerPlugin(ScrollTrigger);

export type BookApi = { goTo: (index: number, smooth?: boolean) => void };
export type BookState = { active: number; inBook: boolean };

type Props = {
  reduce: boolean;
  mobile: boolean;
  apiRef: MutableRefObject<BookApi | null>;
  onState: (s: BookState) => void;
  onOpen: (id: string) => void;
  onNext: () => void;
};

const N = items.length + 1; // cover + food pages
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/**
 * PageTurnController — scroll progress drives a physical page-turn.
 * A tall wrapper + a sticky stage = pinned book. Each leaf hinges on its left
 * (spine) edge; progress p ∈ [0, N-1] maps to leaf rotation, shading, curl and
 * cast shadow. The raw scroll value is eased through a rAF lerp so wheel and
 * trackpad steps never snap, and everything stays perfectly reversible.
 * Page i rests flat for the first 22% of its scroll segment, then turns.
 */
function Book({ reduce, mobile, apiRef, onState, onOpen, onNext }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const leaves = useRef<(HTMLDivElement | null)[]>([]);
  const shades = useRef<(HTMLDivElement | null)[]>([]);
  const casts = useRef<(HTMLDivElement | null)[]>([]);
  const stRef = useRef<ScrollTrigger | null>(null);
  const [playing, setPlaying] = useState<boolean[]>(() => Array(N).fill(false));
  const [mounted, setMounted] = useState<number[]>([0, 1]);

  useLayoutEffect(() => {
    let lastActive = -1;
    let lastKey = "";
    let lastMount = "0,1";
    let lastIn: boolean | null = null;
    let lastSfx = 0;
    let target = 0;
    let cur = 0;
    let raf = 0;
    const mountedSet = new Set<number>([0, 1]);

    const computeIn = () => window.scrollY < (stRef.current?.end ?? Infinity) + window.innerHeight * 0.55;

    const apply = (p: number) => {
      const isActive = computeIn();
      const t = Array.from({ length: N }, (_, i) => (i === N - 1 ? 0 : clamp((p - i - 0.22) / 0.78)));
      const cur2 = Math.max(0, t.findIndex((v) => v < 1));
      const act = Math.max(0, t.findIndex((v) => v < 0.5));

      for (let i = 0; i < N; i++) {
        const leaf = leaves.current[i];
        if (!leaf) continue;
        const e = ease(t[i]);
        const curl = Math.sin(t[i] * Math.PI);
        if (reduce) {
          leaf.style.transform = "none";
          leaf.style.opacity = String(1 - e);
          leaf.style.setProperty("--turn", "0");
          leaf.style.setProperty("--curl", "0");
        } else {
          leaf.style.transform = `translate3d(${(-e * (mobile ? 26 : 0)).toFixed(1)}px,0,0) rotateY(${(-e * (mobile ? 78 : 100)).toFixed(2)}deg)`;
          leaf.style.opacity = String(t[i] > 0.9 ? 1 - (t[i] - 0.9) / 0.1 : 1);
          leaf.style.setProperty("--turn", e.toFixed(3));
          leaf.style.setProperty("--curl", curl.toFixed(3));
        }
        leaf.style.visibility = t[i] >= 1 || i > cur2 + 1 ? "hidden" : "visible";
        leaf.style.pointerEvents = i === act ? "auto" : "none";
        (leaf as HTMLElement & { inert: boolean }).inert = i !== act;

        const sh = shades.current[i];
        if (sh) sh.style.opacity = reduce ? "0" : (curl * (mobile ? 0.62 : 0.96)).toFixed(3);

        // shadow cast by the leaf that is currently turning over this page
        const cast = casts.current[i];
        if (cast) {
          const tp = t[i - 1] ?? 0;
          cast.style.opacity = reduce || i === 0 || tp <= 0.02 || tp >= 1 ? "0" : (0.9 * Math.sin(Math.min(1, tp) * Math.PI) ** 0.6).toFixed(3);
        }
      }

      const pl = Array.from({ length: N }, (_, i) => i > 0 && p > i - 0.5 && p < i + 0.85);
      const key = pl.map(Number).join("");
      if (key !== lastKey) {
        lastKey = key;
        setPlaying(pl);
      }
      for (let i = 0; i < N; i++) if (Math.abs(p - i) < 1.7) mountedSet.add(i);
      const mk = Array.from(mountedSet).sort((a, b) => a - b).join(",");
      if (mk !== lastMount) {
        lastMount = mk;
        setMounted(Array.from(mountedSet));
      }
      if (act !== lastActive || lastIn !== isActive) {
        if (act !== lastActive && performance.now() - lastSfx > 380) {
          lastSfx = performance.now();
          sfx("page");
        }
        lastActive = act;
        lastIn = isActive;
        onState({ active: act, inBook: isActive });
      }
    };

    /** eased scroll → visuals (skipped for reduced motion) */
    const tick = () => {
      const d = target - cur;
      if (Math.abs(d) < 0.0005) {
        cur = target;
        apply(cur);
        raf = 0;
        return;
      }
      cur += d * 0.17;
      apply(cur);
      raf = requestAnimationFrame(tick);
    };
    const setP = (p: number, instant = false) => {
      target = p;
      if (reduce || instant) {
        cur = p;
        apply(cur);
        return;
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const st = ScrollTrigger.create({
      trigger: wrap.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => setP(self.progress * (N - 1)),
      onRefresh: (self) => setP(self.progress * (N - 1), true),
    });
    stRef.current = st;
    const onScroll = () => {
      const inB = computeIn();
      if (inB !== lastIn) {
        lastIn = inB;
        onState({ active: Math.max(lastActive, 0), inBook: inB });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    setP(st.progress * (N - 1), true);

    apiRef.current = {
      goTo: (index, smooth = true) => {
        const seg = (st.end - st.start) / (N - 1);
        window.scrollTo({ top: st.start + clamp(index, 0, N - 1) * seg, behavior: smooth && !reduce ? "smooth" : "auto" });
      },
    };
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      st.kill();
      apiRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, mobile]);

  const mountedSet = new Set(mounted);

  return (
    <div ref={wrap} id="book" className="relative" style={{ height: `calc(${N} * 100svh)` }}>
      <div
        className="sticky top-0 h-[100svh] overflow-hidden"
        style={{ perspective: reduce ? "none" : mobile ? "1800px" : "2600px", perspectiveOrigin: "10% 50%", background: "#1a1411" }}
      >
        {Array.from({ length: N }, (_, i) => (
          <div
            key={i}
            ref={(el) => {
              leaves.current[i] = el;
            }}
            className="leaf absolute inset-0"
            style={{
              transformOrigin: "0% 50%",
              zIndex: N - i,
              backfaceVisibility: "hidden",
              willChange: "transform, opacity",
              visibility: i > 1 ? "hidden" : "visible",
              ["--turn" as string]: 0,
              ["--curl" as string]: 0,
            }}
          >
            {i === 0 ? (
              <BookCover mount={mountedSet.has(0)} animate={!reduce} onNext={onNext} />
            ) : (
              <FoodPage
                item={items[i - 1]}
                number={i}
                total={items.length}
                variant={i % 2 ? "left" : "right"}
                play={playing[i]}
                mount={mountedSet.has(i)}
                animate={!reduce}
                onOpen={onOpen}
              />
            )}
            {/* shadow the previous leaf casts across this page */}
            <div
              ref={(el) => {
                casts.current[i] = el;
              }}
              aria-hidden
              className="leaf-cast pointer-events-none absolute inset-0"
              style={{ opacity: 0 }}
            />
            {/* moving directional shading while the leaf rotates */}
            <div
              ref={(el) => {
                shades.current[i] = el;
              }}
              aria-hidden
              className="leaf-shade pointer-events-none absolute inset-0"
              style={{ opacity: 0 }}
            />
            {/* specular curl on the lifting edge */}
            <div aria-hidden className="leaf-curl pointer-events-none absolute inset-y-0 right-0" style={{ width: "calc(4% + var(--curl, 0) * 15%)" }} />
            {/* paper thickness */}
            <div aria-hidden className="leaf-edge pointer-events-none absolute inset-y-0 right-0" style={{ width: "calc(1px + var(--curl, 0) * 5px)" }} />
          </div>
        ))}
        {!mobile && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-[60] w-[7px]"
            style={{ background: "repeating-linear-gradient(90deg,#efe6d6 0 1px,#cbbca3 1px 2px)", boxShadow: "-2px 0 6px rgba(0,0,0,.25)" }}
          />
        )}
      </div>
    </div>
  );
}

export default memo(Book);
