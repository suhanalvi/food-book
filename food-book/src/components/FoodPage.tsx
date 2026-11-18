import { memo, useEffect, useState } from "react";
import type { FoodItem } from "../types";
import { categoryLabel, formatPrice, pad, photoSrc } from "../data/menu";
import { restaurant } from "../config/restaurant";
import { play as sfx } from "../audio/sfx";
import FoodScene from "./FoodScene";

type Props = {
  item: FoodItem;
  number: number;
  total: number;
  variant: "left" | "right";
  play: boolean;
  mount: boolean;
  animate: boolean;
  onOpen: (id: string) => void;
};

/** Which of the three editorial arrangements this page uses. */
const layoutOf = (n: number) => n % 3; // 0 standard · 1 oversize · 2 editorial

/** One page of the book = exactly one dish. */
function FoodPage({ item, number, total, variant, play, mount, animate, onOpen }: Props) {
  const [hl, setHl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [photoOk, setPhotoOk] = useState(true);

  useEffect(() => {
    if (!play) {
      setHl(null);
      setOpen(false);
    }
  }, [play]);

  /* soft food-preparation cue, only after the visitor has enabled sound */
  useEffect(() => {
    if (!play || !animate) return;
    const cat = item.category;
    const cue: "pour" | "crunch" | null = ["coffee", "tea", "cold-beverages", "milkshakes"].includes(cat)
      ? "pour"
      : ["patties", "snacks", "desserts"].includes(cat)
        ? "crunch"
        : null;
    if (!cue) return;
    const t = window.setTimeout(() => sfx(cue), cue === "pour" ? 1500 : 950);
    return () => window.clearTimeout(t);
  }, [play, animate, item.category]);

  const d = (ms: number) => ({ "--d": ms } as React.CSSProperties);
  const right = variant === "right";
  const layout = layoutOf(number);
  const plate = photoSrc(item, "plate");
  const artCol = layout === 1 ? "md:col-span-8" : layout === 2 ? "md:col-span-6" : "md:col-span-7";
  const textCol = layout === 1 ? "md:col-span-4" : layout === 2 ? "md:col-span-6" : "md:col-span-5";
  const titleSize =
    layout === 1 ? "md:text-[clamp(3.1rem,6.2vw,6.2rem)]" : layout === 2 ? "md:text-[clamp(2.8rem,4.9vw,4.9rem)]" : "md:text-[clamp(3rem,5.6vw,5.6rem)]";

  const story = (
    <p className="reveal serif mt-2 text-lg italic leading-snug md:mt-5 md:text-2xl" style={{ ...d(480), color: "var(--terracotta)" }}>
      “{item.story}”
    </p>
  );

  return (
    <article
      data-theme={item.theme}
      data-play={animate ? play : true}
      aria-label={`Page ${number} of ${total}: ${item.name}`}
      className="paper-grain gutter relative h-full w-full overflow-hidden"
      style={{ background: "var(--page-bg)", color: "var(--page-ink)" }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-3 border md:inset-6" style={{ borderColor: "var(--page-line)" }} />
      <span
        aria-hidden
        className="serif pointer-events-none absolute select-none leading-none"
        style={{ fontSize: "min(54vw, 70svh)", opacity: 0.06, bottom: "-6%", [right ? "left" : "right"]: "1%" }}
      >
        {pad(number)}
      </span>

      <div
        className={`relative mx-auto flex h-full max-w-[1500px] flex-col justify-center gap-3 px-6 pb-20 pt-16 md:grid md:grid-cols-12 md:items-center md:gap-6 md:px-20 md:pb-24 md:pt-24 ${
          layout === 1 ? "md:pb-20 md:pt-20" : ""
        }`}
      >
        {/* ── food composition + photographic plate ── */}
        <div className={`group relative flex items-center justify-center ${artCol} ${right ? "md:order-2" : ""}`}>
          <div className={`relative mx-auto w-[min(100%,34svh)] sm:w-[min(100%,38svh)] md:w-[min(100%,72svh)] ${layout === 1 ? "md:mt-[-2svh]" : layout === 2 ? "md:mt-[2svh]" : ""}`}>
            <div aria-hidden className="reveal medallion absolute inset-[3%] rounded-full" style={{ ...d(0), background: "var(--page-tint)" }} />
            <div aria-hidden className="reveal absolute -inset-[1%] rounded-full border" style={{ ...d(150), borderColor: "var(--page-line)" }} />

            <button
              type="button"
              onClick={() => onOpen(item.id)}
              aria-label={`Open full details for ${item.name}`}
              className="relative block w-full cursor-pointer rounded-full"
            >
              {mount && <FoodScene id={item.id} play={play} animate={animate} highlight={hl} />}
              <span className="label pointer-events-none absolute bottom-[2%] left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-full bg-[var(--ink)] px-4 py-2 text-[#f7f3eb] opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 md:block">
                View details
              </span>
            </button>

            {/* real photograph, pasted in like a print plate */}
            {plate && photoOk && (
              <figure
                className={`reveal pointer-events-none absolute hidden w-[30%] md:block ${right ? "left-[-5%]" : "right-[-5%]"} ${
                  layout === 2 ? "top-[2%]" : "bottom-[6%]"
                }`}
                style={d(950)}
              >
                <div className="photo-plate relative overflow-hidden rounded-full shadow-[0_18px_40px_rgba(28,14,6,.4)] ring-1 ring-black/10">
                  <img
                    src={plate}
                    alt={`Photograph of ${item.name}`}
                    loading="lazy"
                    decoding="async"
                    width={560}
                    height={560}
                    className="photo-grade aspect-square w-full object-cover"
                    onError={() => setPhotoOk(false)}
                  />
                </div>
                <figcaption className="label mt-1.5 text-center" style={{ fontSize: "0.5rem", color: "var(--page-muted)" }}>
                  Photograph
                </figcaption>
              </figure>
            )}
          </div>
        </div>

        {/* ── editorial copy ── */}
        <div className={`relative z-10 ${textCol} ${right ? "md:order-1" : ""}`}>
          <div className="reveal flex items-center gap-3" style={d(250)}>
            <span className="label" style={{ color: "var(--terracotta)" }}>No. {pad(number)}</span>
            <span aria-hidden className="h-px w-10" style={{ background: "var(--page-line)" }} />
            <span className="label" style={{ color: "var(--page-muted)" }}>{categoryLabel(item.category)}</span>
          </div>

          {layout === 2 && story}

          <h2 className={`reveal serif mt-2 text-[clamp(2.3rem,9vw,3.4rem)] font-medium leading-[0.95] tracking-tight md:mt-4 ${titleSize}`} style={d(350)}>
            {item.name}
          </h2>

          {layout !== 2 && story}

          <p className="reveal mt-2 line-clamp-2 max-w-md text-[0.8rem] leading-relaxed md:mt-4 md:line-clamp-none md:text-[0.95rem]" style={{ ...d(580), color: "var(--page-muted)" }}>
            {item.shortDescription}
          </p>

          <div className="reveal mt-3 flex items-baseline gap-3 md:mt-6" style={d(680)}>
            <span className="serif text-3xl font-semibold md:text-5xl">{formatPrice(item.price)}</span>
            {restaurant.isDemo && <span className="label" style={{ color: "var(--page-muted)", fontSize: "0.6rem" }}>Demo price</span>}
          </div>

          <div className="reveal mt-3 flex flex-wrap items-center gap-2 md:mt-6 md:gap-3" style={d(780)}>
            <button
              type="button"
              className="btn !px-4 !py-2.5 md:!px-5 md:!py-3"
              aria-expanded={open}
              aria-controls={`ing-${item.id}`}
              onClick={() => {
                setOpen((o) => !o);
                if (open) setHl(null);
              }}
            >
              Discover Ingredients <span aria-hidden>{open ? "−" : "+"}</span>
            </button>
            <button type="button" className="btn btn-solid !px-4 !py-2.5 md:!px-5 md:!py-3" onClick={() => onOpen(item.id)}>
              View details <span aria-hidden>→</span>
            </button>
          </div>

          <div id={`ing-${item.id}`} className={`grid transition-[grid-template-rows] duration-500 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
            <div className="overflow-hidden" {...({ inert: !open } as object)}>
              <div className="pt-3 md:pt-5">
                <p className="label mb-2 hidden md:block" style={{ color: "var(--page-muted)", fontSize: "0.6rem" }}>
                  Select an ingredient to find it on the plate
                </p>
                <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 md:flex-wrap md:overflow-visible">
                  {item.ingredients.map((g) => {
                    const on = hl === g.id;
                    return (
                      <button
                        key={g.id}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setHl(on ? null : g.id)}
                        className="shrink-0 rounded-full border px-3 py-1.5 text-[0.72rem] transition-all hover:-translate-y-px hover:border-[var(--terracotta)]"
                        style={{
                          borderColor: on ? "var(--terracotta)" : "var(--page-line)",
                          background: on ? "var(--terracotta)" : "transparent",
                          color: on ? "#fff" : "var(--page-ink)",
                        }}
                      >
                        {g.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div aria-hidden className="label pointer-events-none absolute inset-x-0 bottom-5 text-center opacity-50 md:bottom-9" style={{ fontSize: "0.6rem" }}>
        — {pad(number)} —
      </div>
    </article>
  );
}

export default memo(FoodPage);
