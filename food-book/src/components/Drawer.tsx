import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

let locks = 0;

type Props = {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
  wide?: boolean;
};

/** Accessible side panel: focus trap, Esc to close, focus restore, scroll lock (position preserved). */
export default function Drawer({ open, onClose, label, children, wide }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <Panel key="panel" onClose={onClose} label={label} wide={wide}>
          {children}
        </Panel>
      )}
    </AnimatePresence>
  );
}

function Panel({ onClose, label, children, wide }: Omit<Props, "open">) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    locks++;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => ref.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus(), 60);
    return () => {
      window.clearTimeout(t);
      locks--;
      if (locks <= 0) document.body.style.overflow = "";
      prev?.focus?.({ preventScroll: true });
    };
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      onClose();
    }
    if (e.key === "Tab" && ref.current) {
      const f = ref.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100]" onKeyDown={onKey}>
      <motion.div
        className="absolute inset-0 bg-[#1a1411]/55 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        aria-hidden
      />
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={`panel-scroll absolute inset-y-0 right-0 flex w-full flex-col overflow-y-auto bg-[var(--paper)] text-[var(--ink)] shadow-[-30px_0_80px_rgba(0,0,0,.35)] ${wide ? "md:w-[680px]" : "md:w-[520px]"}`}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", ease: [0.22, 0.8, 0.2, 1], duration: 0.5 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
