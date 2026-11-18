import { useEffect, useState } from "react";

function useMedia(query: string, initial = false) {
  const [match, setMatch] = useState(() =>
    typeof window === "undefined" ? initial : window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return match;
}

export const useReducedMotion = () => useMedia("(prefers-reduced-motion: reduce)");
export const useIsMobile = () => useMedia("(max-width: 767px)");
export const useIsTablet = () => useMedia("(max-width: 1023px)");
