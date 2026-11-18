import { useMemo, useState } from "react";
import { categories, items, formatPrice, photoSrc } from "../data/menu";
import type { FoodItem } from "../types";
import FoodScene from "./FoodScene";

type Props = { onOpen: (id: string) => void; onFind: (id: string) => void };

function Thumb({ item }: { item: FoodItem }) {
  const [failed, setFailed] = useState(false);
  const src = photoSrc(item, "thumb");
  return (
    <div className="h-[76px] w-[76px] shrink-0 overflow-hidden bg-[var(--cream)] md:h-[92px] md:w-[92px]">
      {src && !failed ? (
        <img src={src} alt="" loading="lazy" decoding="async" width={92} height={92} className="h-full w-full object-cover" onError={() => setFailed(true)} />
      ) : (
        <div className="h-full w-full scale-110"><FoodScene id={item.id} animate={false} /></div>
      )}
    </div>
  );
}

/** The final menu page — the only place where several dishes appear together. */
export default function MenuIndex({ onOpen, onFind }: Props) {
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");

  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return categories
      .filter((c) => cat === "all" || c.id === cat)
      .map((c) => ({
        c,
        list: items.filter(
          (i) =>
            i.category === c.id &&
            (!needle || i.name.toLowerCase().includes(needle) || i.ingredients.some((g) => g.label.toLowerCase().includes(needle)) || c.label.toLowerCase().includes(needle)),
        ),
      }))
      .filter((g) => g.list.length);
  }, [cat, q]);

  const count = groups.reduce((n, g) => n + g.list.length, 0);

  return (
    <section id="menu" aria-labelledby="menu-title" data-theme="ivory" className="paper-grain relative px-5 py-20 md:px-16 md:py-28" style={{ background: "var(--paper)", color: "var(--ink)" }}>
      <div className="mx-auto max-w-[1300px]">
        <div className="flex flex-col justify-between gap-6 border-b border-[var(--ink)]/25 pb-8 md:flex-row md:items-end">
          <div>
            <p className="label" style={{ color: "var(--terracotta)" }}>The Final Page · Index of the book</p>
            <h2 id="menu-title" className="serif mt-3 text-[clamp(3rem,8vw,7rem)] font-medium leading-[0.9]">The Full Menu</h2>
            <p className="serif mt-3 text-xl italic opacity-75">Every dish from the book, by category.</p>
          </div>
          <div className="w-full md:w-80">
            <label htmlFor="menu-search" className="label mb-2 block" style={{ fontSize: "0.62rem" }}>Search the menu</label>
            <input
              id="menu-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Dish, ingredient or category…"
              className="w-full border-b border-[var(--ink)]/40 bg-transparent py-2 text-base outline-none placeholder:opacity-50 focus:border-[var(--terracotta)]"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {[{ id: "all", label: "All" }, ...categories].map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={cat === c.id}
              onClick={() => setCat(c.id)}
              className="rounded-full border px-4 py-2 text-[0.68rem] uppercase tracking-[0.16em] transition-colors"
              style={{
                borderColor: cat === c.id ? "var(--ink)" : "rgba(45,33,28,.25)",
                background: cat === c.id ? "var(--ink)" : "transparent",
                color: cat === c.id ? "var(--paper)" : "var(--ink)",
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        <p className="sr-only" role="status">{count} dishes shown</p>

        {groups.length === 0 ? (
          <p className="serif py-24 text-center text-2xl italic opacity-70">No dishes match “{q}”. Try another word.</p>
        ) : (
          <div className="mt-10 grid gap-x-14 gap-y-12 md:grid-cols-2">
            {groups.map(({ c, list }) => (
              <div key={c.id}>
                <div className="flex items-baseline justify-between border-b border-[var(--ink)]/20 pb-2">
                  <h3 className="serif text-3xl">{c.label}</h3>
                  <span className="label opacity-55" style={{ fontSize: "0.6rem" }}>{String(list.length).padStart(2, "0")}</span>
                </div>
                <ul>
                  {list.map((it) => (
                    <li key={it.id} className="flex items-center gap-4 border-b border-[var(--ink)]/10 py-4">
                      <Thumb item={it} />
                      <div className="min-w-0 flex-1">
                        <p className="serif text-2xl leading-tight">{it.name}</p>
                        <p className="mt-0.5 text-sm tabular-nums opacity-75">{formatPrice(it.price)}</p>
                        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
                          <button type="button" className="label underline underline-offset-4 hover:text-[var(--terracotta)]" style={{ fontSize: "0.62rem" }} onClick={() => onOpen(it.id)}>
                            View details
                          </button>
                          <button type="button" className="label opacity-60 underline-offset-4 hover:underline" style={{ fontSize: "0.62rem" }} onClick={() => onFind(it.id)}>
                            Find in book ↑
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
