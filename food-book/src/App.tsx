import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { restaurant } from "./config/restaurant";
import { items } from "./data/menu";
import { useIsTablet, useReducedMotion } from "./hooks/useEnv";
import GlobalDefs from "./components/GlobalDefs";
import { HighlightStyles } from "./components/FoodScene";
import Book, { type BookApi } from "./components/Book";
import HUD from "./components/HUD";
import MenuIndex from "./components/MenuIndex";
import FoodDetails from "./components/FoodDetails";
import Footer from "./components/Footer";
import { CartDrawer, CartProvider } from "./components/OrderCart";

export default function App() {
  const reduce = useReducedMotion();
  const light = useIsTablet(); // lighter 3D on tablet / mobile
  const apiRef = useRef<BookApi | null>(null);
  const [state, setState] = useState({ active: 0, inBook: true });
  const [detail, setDetail] = useState<string | null>(null);
  const total = items.length;

  // brand colours from config
  useLayoutEffect(() => {
    const r = document.documentElement.style;
    Object.entries(restaurant.colors).forEach(([k, v]) => r.setProperty(`--${k}`, v));
  }, []);

  /* ── details: pushes a history entry so the browser Back button closes it,
        and the scroll position is never touched (we return to the exact page) ── */
  const openDetail = useCallback((id: string) => {
    setDetail(id);
    history.pushState({ foodBook: id }, "", `#${id}`);
  }, []);
  const closeDetail = useCallback(() => {
    if (history.state?.foodBook) history.back();
    else setDetail(null);
  }, []);
  useEffect(() => {
    const onPop = () => setDetail(history.state?.foodBook ?? null);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  /** Switch dish inside the open panel without stacking history entries. */
  const switchDetail = useCallback((id: string) => {
    setDetail(id);
    history.replaceState({ foodBook: id }, "", `#${id}`);
  }, []);

  const goTo = useCallback((i: number) => {
    const from = state.active;
    apiRef.current?.goTo(i, Math.abs(i - from) <= 2);
  }, [state.active]);

  const toMenu = useCallback(() => {
    document.getElementById("menu")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, [reduce]);

  const findInBook = useCallback((id: string) => {
    const idx = items.findIndex((i) => i.id === id) + 1;
    apiRef.current?.goTo(idx, false);
  }, []);

  // keyboard: ←/→ turn pages while the book is on screen
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!state.inBook || detail || e.altKey || e.ctrlKey || e.metaKey) return;
      const t = e.target as HTMLElement;
      if (/INPUT|TEXTAREA|SELECT/.test(t.tagName) || document.querySelector('[role="dialog"]')) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        state.active === total ? toMenu() : goTo(state.active + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(Math.max(0, state.active - 1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state, detail, goTo, toMenu, total]);

  const theme = state.active === 0 ? "dark" : items[state.active - 1].theme;

  return (
    <CartProvider>
      <div className={reduce ? "reduce-motion" : ""}>
        <GlobalDefs />
        <HighlightStyles />
        <a
          href="#menu"
          className="fixed left-3 top-3 z-[120] -translate-y-20 rounded bg-[var(--ink)] px-4 py-2 text-sm text-[var(--paper)] focus:translate-y-0"
          onClick={(e) => {
            e.preventDefault();
            toMenu();
          }}
        >
          Skip to the full menu
        </a>

        <HUD active={state.active} inBook={state.inBook} theme={theme} onGo={goTo} onMenu={toMenu} />

        <main>
          <Book reduce={reduce} mobile={light} apiRef={apiRef} onState={setState} onOpen={openDetail} onNext={() => goTo(1)} />
          <MenuIndex onOpen={openDetail} onFind={findInBook} />
        </main>
        <Footer />

        <FoodDetails id={detail} onClose={closeDetail} onFind={findInBook} onSwitch={switchDetail} />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
