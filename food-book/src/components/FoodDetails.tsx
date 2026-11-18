import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { categoryLabel, formatPrice, itemById, items, photoSrc } from "../data/menu";
import { play as sfx } from "../audio/sfx";
import { restaurant } from "../config/restaurant";
import Drawer from "./Drawer";
import FoodScene from "./FoodScene";
import { useCart } from "./OrderCart";

type Props = { id: string | null; onClose: () => void; onFind: (id: string) => void; onSwitch: (id: string) => void };

export default function FoodDetails({ id, onClose, onFind, onSwitch }: Props) {
  return (
    <Drawer open={!!id} onClose={onClose} label={id ? `${itemById(id).name} details` : "Details"} wide>
      {id && <Body key={id} id={id} onClose={onClose} onFind={onFind} onSwitch={onSwitch} />}
    </Drawer>
  );
}

function Body({ id, onClose, onFind, onSwitch }: { id: string; onClose: () => void; onFind: (id: string) => void; onSwitch: (id: string) => void }) {
  const item = itemById(id);
  const cart = useCart();
  const [size, setSize] = useState(item.sizes?.[0]?.label);
  const [extras, setExtras] = useState<string[]>([]);
  const [failed, setFailed] = useState(false);
  const [added, setAdded] = useState(false);
  const [hl, setHl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 45%");

  const related = useMemo(() => {
    const same = items.filter((i) => i.category === item.category && i.id !== item.id);
    const rest = items.filter((i) => i.category !== item.category && i.id !== item.id);
    return [...same, ...rest].slice(0, 3);
  }, [item]);

  const unit = useMemo(() => {
    const s = item.sizes?.find((x) => x.label === size)?.priceDelta ?? 0;
    const e = (item.extras ?? []).filter((x) => extras.includes(x.label)).reduce((n, x) => n + x.price, 0);
    return item.price + s + e;
  }, [item, size, extras]);

  const src = photoSrc(item);
  const scene = !src || failed;
  const sect = "border-t border-[var(--ink)]/15 py-5";

  return (
    <div data-theme="ivory">
      <div className="relative">
        {src && !failed ? (
          <motion.div
            className={`photo-zoom relative overflow-hidden ${zoom ? "is-zoom" : ""}`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 0.8, 0.2, 1] }}
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
            }}
          >
            <img
              src={src}
              alt={`${item.name} — illustrative photograph`}
              className="photo-grade h-[300px] w-full cursor-zoom-in object-cover md:h-[380px]"
              style={{ transformOrigin: origin, transform: zoom ? "scale(1.9)" : "scale(1)" }}
              onError={() => setFailed(true)}
            />
            <span className="label pointer-events-none absolute bottom-3 right-3 rounded-full bg-[var(--ink)]/70 px-3 py-1.5 text-[#f7f3eb] opacity-0 transition-opacity" style={{ fontSize: "0.55rem", opacity: zoom ? 0.9 : 0 }}>
              Hover to zoom
            </span>
          </motion.div>
        ) : (
          <div className="flex h-[300px] items-center justify-center bg-[var(--cream)] md:h-[360px]">
            <div className="h-full max-h-[300px] w-[300px] py-3">
              <FoodScene id={id} animate={false} highlight={hl} />
            </div>
          </div>
        )}
        <button type="button" data-autofocus onClick={onClose} aria-label="Close details" className="btn absolute right-4 top-4 !bg-[var(--paper)] !px-4 !py-2 !text-[var(--ink)] hover:!bg-[var(--terracotta)] hover:!text-white">
          ← Back to menu
        </button>
      </div>

      <div className="px-6 pb-10 pt-6 md:px-10">
        <p className="label" style={{ color: "var(--terracotta)" }}>{categoryLabel(item.category)}</p>
        <div className="mt-2 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="serif text-4xl font-medium leading-none md:text-5xl">{item.name}</h2>
          <p className="serif text-3xl">{formatPrice(unit)}</p>
        </div>
        <p className="serif mt-3 text-xl italic" style={{ color: "var(--terracotta)" }}>“{item.story}”</p>
        <p className="mt-4 text-[0.95rem] leading-relaxed opacity-85">{item.description}</p>

        <div className={`${sect} mt-6`}>
          <h3 className="label mb-3">Ingredients</h3>
          <div className="flex flex-wrap gap-2">
            {item.ingredients.map((g) =>
              scene ? (
                <button
                  key={g.id}
                  type="button"
                  aria-pressed={hl === g.id}
                  onClick={() => setHl(hl === g.id ? null : g.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs ${hl === g.id ? "border-[var(--terracotta)] bg-[var(--terracotta)] text-white" : "border-[var(--ink)]/25"}`}
                >
                  {g.label}
                </button>
              ) : (
                <span key={g.id} className="rounded-full border border-[var(--ink)]/25 px-3 py-1.5 text-xs">{g.label}</span>
              ),
            )}
          </div>
          {src && !failed && (
            <p className="mt-3 text-xs opacity-60">
              Ingredient highlighting lives on the animated plate in the book.{" "}
              <button type="button" className="underline underline-offset-2" onClick={() => { onClose(); onFind(id); }}>
                Find this dish in the book
              </button>
            </p>
          )}
        </div>

        <div className={sect}>
          <h3 className="label mb-2">Preparation style</h3>
          <p className="text-sm leading-relaxed opacity-85">{item.preparation}</p>
        </div>

        {item.sizes && (
          <div className={sect}>
            <h3 className="label mb-3">Available sizes</h3>
            <div role="radiogroup" aria-label="Size" className="flex flex-wrap gap-2">
              {item.sizes.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  role="radio"
                  aria-checked={size === s.label}
                  onClick={() => setSize(s.label)}
                  className={`rounded-full border px-4 py-2 text-xs ${size === s.label ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]" : "border-[var(--ink)]/25"}`}
                >
                  {s.label}
                  {s.priceDelta ? ` · +${formatPrice(s.priceDelta)}` : ""}
                </button>
              ))}
            </div>
          </div>
        )}

        {item.extras && (
          <div className={sect}>
            <h3 className="label mb-3">Customisation</h3>
            <div className="flex flex-wrap gap-2">
              {item.extras.map((x) => {
                const on = extras.includes(x.label);
                return (
                  <button
                    key={x.label}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setExtras((c) => (on ? c.filter((y) => y !== x.label) : [...c, x.label]))}
                    className={`rounded-full border px-4 py-2 text-xs ${on ? "border-[var(--sage)] bg-[var(--sage)] text-white" : "border-[var(--ink)]/25"}`}
                  >
                    {x.label} · +{formatPrice(x.price)}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className={sect}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <h3 className="label mb-2">Dietary information</h3>
              <p className="text-sm opacity-80">{item.dietary ?? "Not provided yet. Please ask the restaurant."}</p>
            </div>
            <div>
              <h3 className="label mb-2">Allergen information</h3>
              <p className="text-sm opacity-80">{item.allergens ?? "Not provided yet. Please ask the restaurant before ordering."}</p>
            </div>
          </div>
        </div>

        {cart.enabled && (
          <div className="sticky bottom-0 -mx-6 flex flex-wrap items-center gap-3 border-t border-[var(--ink)]/15 bg-[var(--paper)] px-6 py-4 md:-mx-10 md:px-10">
            <button
              type="button"
              className="btn btn-solid"
              onClick={() => {
                cart.add({ itemId: item.id, size, extras, unitPrice: unit });
                setAdded(true);
                sfx("chime");
              }}
            >
              Add to order · {formatPrice(unit)}
            </button>
            {added && (
              <span role="status" className="text-sm" style={{ color: "var(--sage)" }}>
                Added.{" "}
                <button type="button" className="underline underline-offset-2" onClick={() => { onClose(); setTimeout(() => cart.setOpen(true), 380); }}>
                  View order summary
                </button>
              </span>
            )}
          </div>
        )}

        <div className={`${sect} mt-6`}>
          <h3 className="label mb-3">More from the book</h3>
          <div className="grid grid-cols-3 gap-3">
            {related.map((r) => (
              <button key={r.id} type="button" onClick={() => onSwitch(r.id)} className="group text-left">
                <div className="overflow-hidden bg-[var(--cream)]">
                  <ThumbFor id={r.id} />
                </div>
                <p className="serif mt-1.5 text-sm leading-tight group-hover:text-[var(--terracotta)]">{r.name}</p>
                <p className="text-xs tabular-nums opacity-70">{formatPrice(r.price)}</p>
              </button>
            ))}
          </div>
        </div>

        <p className="mt-6 text-[0.7rem] leading-relaxed opacity-55">
          {restaurant.isDemo && "Demo content: prices, descriptions and ingredients are placeholders. "}
          {item.photo && !failed && (
            <>
              Photo: <a className="underline" href={item.photo.url} target="_blank" rel="noopener noreferrer">{item.photo.credit}</a>. Illustrative only.
            </>
          )}
        </p>
      </div>
    </div>
  );
}

/** Small lazy photo (or the dish illustration when no photograph exists). */
function ThumbFor({ id }: { id: string }) {
  const item = itemById(id);
  const [bad, setBad] = useState(false);
  const src = photoSrc(item, "thumb");
  if (!src || bad) return <div className="aspect-square w-full"><FoodScene id={id} animate={false} /></div>;
  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      width={240}
      height={240}
      className="photo-grade aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
      onError={() => setBad(true)}
    />
  );
}
