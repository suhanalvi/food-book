import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { CartLine } from "../types";
import { itemById, formatPrice } from "../data/menu";
import { restaurant } from "../config/restaurant";
import Drawer from "./Drawer";

/**
 * Optional ordering module (toggle: restaurant.ordering.enabled).
 * No backend is connected: this builds an order SUMMARY only and never
 * claims that an order was placed.
 */
type Ctx = {
  enabled: boolean;
  lines: CartLine[];
  count: number;
  total: number;
  open: boolean;
  setOpen: (o: boolean) => void;
  add: (l: Omit<CartLine, "key" | "qty">, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
};
const CartCtx = createContext<Ctx>(null!);
export const useCart = () => useContext(CartCtx);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);

  const add: Ctx["add"] = useCallback((l, qty = 1) => {
    const key = `${l.itemId}|${l.size ?? ""}|${[...l.extras].sort().join(",")}`;
    setLines((cur) => {
      const found = cur.find((x) => x.key === key);
      return found ? cur.map((x) => (x.key === key ? { ...x, qty: x.qty + qty } : x)) : [...cur, { ...l, key, qty }];
    });
  }, []);
  const setQty = useCallback((key: string, qty: number) => setLines((c) => (qty <= 0 ? c.filter((x) => x.key !== key) : c.map((x) => (x.key === key ? { ...x, qty } : x)))), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(
    () => ({
      enabled: restaurant.ordering.enabled,
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      total: lines.reduce((n, l) => n + l.qty * l.unitPrice, 0),
      open,
      setOpen,
      add,
      setQty,
      clear,
    }),
    [lines, open, add, setQty, clear],
  );
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function CartDrawer() {
  const cart = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState("");
  const [method, setMethod] = useState<"copy" | "whatsapp">("copy");
  const wa = restaurant.ordering.whatsappNumber.replace(/\D/g, "");

  if (!cart.enabled) return null;

  const summary = () =>
    [
      `Order request — ${restaurant.name}`,
      "",
      ...cart.lines.map((l) => {
        const it = itemById(l.itemId);
        const opts = [l.size, ...l.extras].filter(Boolean).join(", ");
        return `${l.qty} × ${it.name}${opts ? ` (${opts})` : ""} — ${formatPrice(l.qty * l.unitPrice)}`;
      }),
      "",
      `Total: ${formatPrice(cart.total)}`,
      name ? `Name: ${name}` : null,
      phone ? `Phone: ${phone}` : null,
      note ? `Notes: ${note}` : null,
    ]
      .filter((x): x is string => x !== null)
      .join("\n");

  const submit = async () => {
    const text = summary();
    if (method === "whatsapp" && wa) {
      window.open(`https://wa.me/${wa}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
      setMsg("WhatsApp opened with your summary. Your order is only placed once the restaurant confirms it.");
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setMsg("Order summary copied. Nothing has been sent or placed — share it with the restaurant to order.");
    } catch {
      setMsg("Could not access the clipboard. Please select and copy the summary manually.");
    }
  };

  const field = "w-full border-b border-[var(--ink)]/30 bg-transparent py-2 text-sm outline-none focus:border-[var(--terracotta)]";

  return (
    <Drawer open={cart.open} onClose={() => cart.setOpen(false)} label="Your order summary">
      <div className="flex items-center justify-between border-b border-[var(--ink)]/15 px-6 py-5">
        <div>
          <p className="label" style={{ color: "var(--terracotta)" }}>Your order</p>
          <h2 className="serif text-3xl">Order summary</h2>
        </div>
        <button type="button" data-autofocus onClick={() => cart.setOpen(false)} className="btn !px-4 !py-2" aria-label="Close order summary">
          Close
        </button>
      </div>

      <div className="mx-6 mt-5 border-l-2 border-[var(--terracotta)] bg-[var(--cream)] px-4 py-3 text-xs leading-relaxed">
        <strong>Ordering is not connected in this demo.</strong> You can build a summary and copy it to share with the restaurant — no payment is taken and no order is placed.
      </div>

      <div className="flex-1 px-6 py-5">
        {cart.lines.length === 0 ? (
          <p className="serif py-10 text-center text-xl italic opacity-70">Your order is empty. Open a dish and choose “Add to order”.</p>
        ) : (
          <ul className="divide-y divide-[var(--ink)]/12">
            {cart.lines.map((l) => {
              const it = itemById(l.itemId);
              const opts = [l.size, ...l.extras].filter(Boolean).join(" · ");
              return (
                <li key={l.key} className="flex items-center gap-4 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="serif truncate text-xl">{it.name}</p>
                    {opts && <p className="text-xs opacity-65">{opts}</p>}
                    <p className="mt-1 text-xs opacity-65">{formatPrice(l.unitPrice)} each</p>
                  </div>
                  <div className="flex items-center gap-2" role="group" aria-label={`Quantity for ${it.name}`}>
                    <button type="button" className="h-9 w-9 rounded-full border border-[var(--ink)]/40" aria-label={`Decrease ${it.name}`} onClick={() => cart.setQty(l.key, l.qty - 1)}>−</button>
                    <span className="w-5 text-center text-sm tabular-nums" aria-live="polite">{l.qty}</span>
                    <button type="button" className="h-9 w-9 rounded-full border border-[var(--ink)]/40" aria-label={`Increase ${it.name}`} onClick={() => cart.setQty(l.key, l.qty + 1)}>+</button>
                  </div>
                  <p className="w-20 text-right text-sm tabular-nums">{formatPrice(l.qty * l.unitPrice)}</p>
                </li>
              );
            })}
          </ul>
        )}

        {cart.lines.length > 0 && (
          <>
            <div className="mt-2 flex items-baseline justify-between border-t border-[var(--ink)] pt-4">
              <span className="label">Total</span>
              <span className="serif text-3xl">{formatPrice(cart.total)}</span>
            </div>

            <form
              className="mt-8 space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
            >
              <p className="label" style={{ color: "var(--terracotta)" }}>Customer details</p>
              <label className="block text-xs">
                Name
                <input className={field} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
              </label>
              <label className="block text-xs">
                Phone
                <input className={field} value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" autoComplete="tel" />
              </label>
              <label className="block text-xs">
                Notes
                <input className={field} value={note} onChange={(e) => setNote(e.target.value)} />
              </label>

              <fieldset>
                <legend className="label mb-2" style={{ color: "var(--terracotta)" }}>Ordering method</legend>
                <label className="flex items-center gap-3 py-1 text-sm">
                  <input type="radio" name="m" checked={method === "copy"} onChange={() => setMethod("copy")} /> Copy order summary
                </label>
                {wa ? (
                  <label className="flex items-center gap-3 py-1 text-sm">
                    <input type="radio" name="m" checked={method === "whatsapp"} onChange={() => setMethod("whatsapp")} /> Send via WhatsApp
                  </label>
                ) : (
                  <p className="py-1 text-xs opacity-60">Other ordering methods are not configured yet (see src/config/restaurant.ts).</p>
                )}
              </fieldset>

              <div className="flex flex-wrap gap-3">
                <button type="submit" className="btn btn-solid">
                  {method === "whatsapp" ? "Open WhatsApp" : "Copy summary"}
                </button>
                <button type="button" className="btn" onClick={() => { cart.clear(); setMsg(""); }}>
                  Clear
                </button>
              </div>
              {msg && <p role="status" className="text-sm leading-relaxed" style={{ color: "var(--sage)" }}>{msg}</p>}
            </form>
          </>
        )}
      </div>
    </Drawer>
  );
}
