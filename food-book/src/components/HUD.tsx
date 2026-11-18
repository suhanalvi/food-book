import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { categories, items, pad } from "../data/menu";
import { restaurant } from "../config/restaurant";
import { useCart } from "./OrderCart";
import { initSound, play as sfx, setSound, subscribeSound } from "../audio/sfx";

type Props = {
  active: number; // 0 = cover, 1..n = food pages
  inBook: boolean;
  theme: string;
  onGo: (index: number) => void;
  onMenu: () => void;
};

/** Persistent page counter, compact category index, previous/next and cart. */
export default function HUD({ active, inBook, theme, onGo, onMenu }: Props) {
  const [indexOpen, setIndexOpen] = useState(false);
  const [sound, setSoundUi] = useState(false);
  const cart = useCart();

  useEffect(() => {
    setSoundUi(initSound());
    const un = subscribeSound(setSoundUi);
    return () => {
      un();
    };
  }, []);
  const btnRef = useRef<HTMLButtonElement>(null);
  const total = items.length;

  useEffect(() => {
    if (!inBook) setIndexOpen(false);
  }, [inBook]);

  useEffect(() => {
    if (!indexOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIndexOpen(false);
        btnRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [indexOpen]);

  const go = (i: number) => {
    setIndexOpen(false);
    onGo(i);
  };

  const circle =
    "pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-current transition-colors hover:bg-[var(--terracotta)] hover:border-[var(--terracotta)] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit disabled:hover:border-current";

  return (
    <div
      data-theme={theme}
      aria-hidden={!inBook}
      {...({ inert: !inBook } as object)}
      className="pointer-events-none fixed inset-0 z-40 transition-[opacity,color] duration-500"
      style={{ opacity: inBook ? 1 : 0, color: "var(--page-ink)" }}
    >
      {/* top bar */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between px-5 pt-4 md:px-12 md:pt-7">
        <button type="button" onClick={() => go(0)} className="pointer-events-auto flex items-center gap-2" aria-label={`${restaurant.name} — back to cover`}>
          {restaurant.logo ? (
            <img src={restaurant.logo} alt="" className="h-6 w-auto" />
          ) : (
            <span className="serif text-lg font-semibold uppercase tracking-[0.16em] md:text-xl">{restaurant.name.replace(/^The /i, "")}</span>
          )}
        </button>

        <div className="flex items-center gap-3 md:gap-5">
          <p className="label pointer-events-none flex items-baseline gap-1 tabular-nums" aria-live="polite" aria-label={active === 0 ? "Cover" : `Page ${active} of ${total}`}>
            <span className="roll text-[var(--page-ink)]">
              <AnimatePresence initial={false}>
                <motion.span
                  key={active}
                  initial={{ y: "-110%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "110%" }}
                  transition={{ duration: 0.32, ease: [0.22, 0.8, 0.2, 1] }}
                >
                  {pad(active)}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="opacity-50">/ {pad(total)}</span>
          </p>
          <button
            type="button"
            className="label pointer-events-auto flex items-center gap-1.5 underline-offset-4 hover:underline"
            aria-pressed={sound}
            aria-label={sound ? "Mute sound" : "Enable sound"}
            onClick={() => {
              const next = !sound;
              setSound(next);
              setSoundUi(next);
              if (next) sfx("open");
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M11 5 6 9H3v6h3l5 4z" />
              {sound ? (
                <>
                  <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                  <path d="M18.5 5.5a9 9 0 0 1 0 13" />
                </>
              ) : (
                <path d="m16 9 5 6M21 9l-5 6" />
              )}
            </svg>
            <span className="hidden md:inline">{sound ? "Sound on" : "Sound off"}</span>
          </button>
          <button ref={btnRef} type="button" className="label pointer-events-auto underline-offset-4 hover:underline" aria-expanded={indexOpen} aria-haspopup="dialog" onClick={() => setIndexOpen((o) => !o)}>
            Index
          </button>
          {cart.enabled && (
            <button type="button" className="label pointer-events-auto underline-offset-4 hover:underline" onClick={() => cart.setOpen(true)} aria-label={`Open order summary, ${cart.count} items`}>
              Order{cart.count > 0 && <span className="ml-1.5 rounded-full bg-[var(--terracotta)] px-1.5 py-0.5 text-[0.6rem] text-white">{cart.count}</span>}
            </button>
          )}
        </div>
      </div>

      {/* bottom controls */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-5 pb-4 md:px-12 md:pb-7">
        <p className="label pointer-events-none hidden items-center gap-3 opacity-70 md:flex" style={{ fontSize: "0.6rem" }}>
          <span className="bob inline-block" aria-hidden>↓</span> Scroll to continue
        </p>
        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <button type="button" className={circle} aria-label="Previous page" disabled={active === 0} onClick={() => go(active - 1)}>
            <span aria-hidden>←</span>
          </button>
          <button type="button" className={circle} aria-label={active === total ? "Go to the full menu" : "Next page"} onClick={() => (active === total ? onMenu() : go(active + 1))}>
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>

      {/* compact category index */}
      <AnimatePresence>
        {indexOpen && (
          <>
            <div className="pointer-events-auto fixed inset-0" onClick={() => setIndexOpen(false)} aria-hidden />
            <motion.div
              role="dialog"
              aria-label="Menu index"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="panel-scroll pointer-events-auto absolute right-4 top-14 max-h-[72svh] w-[min(340px,calc(100vw-2rem))] overflow-y-auto border bg-[var(--paper)] p-5 text-[var(--ink)] shadow-2xl md:right-12 md:top-16"
              style={{ borderColor: "rgba(45,33,28,.2)" }}
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="label" style={{ color: "var(--terracotta)" }}>Index</p>
                <button type="button" className="label" onClick={() => go(0)}>Cover</button>
              </div>
              {categories.map((c) => {
                const list = items.map((it, i) => ({ it, i: i + 1 })).filter((x) => x.it.category === c.id);
                if (!list.length) return null;
                return (
                  <div key={c.id} className="border-t border-[var(--ink)]/12 py-2.5">
                    <p className="label mb-1" style={{ fontSize: "0.6rem", opacity: 0.6 }}>{c.label}</p>
                    {list.map(({ it, i }) => (
                      <button
                        key={it.id}
                        type="button"
                        onClick={() => go(i)}
                        aria-current={active === i ? "page" : undefined}
                        className={`flex w-full items-baseline gap-3 py-1 text-left text-sm hover:text-[var(--terracotta)] ${active === i ? "font-semibold text-[var(--terracotta)]" : ""}`}
                      >
                        <span className="label w-6 tabular-nums opacity-60" style={{ fontSize: "0.6rem" }}>{pad(i)}</span>
                        <span className="serif text-lg leading-tight">{it.name}</span>
                      </button>
                    ))}
                  </div>
                );
              })}
              <button type="button" className="btn mt-3 w-full justify-center" onClick={() => { setIndexOpen(false); onMenu(); }}>
                Full menu overview ↓
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
