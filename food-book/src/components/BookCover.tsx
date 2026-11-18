import { restaurant } from "../config/restaurant";
import FoodScene from "./FoodScene";

type Props = { mount: boolean; animate: boolean; onNext: () => void };

/** The hardcover. Opens (turns) on the first scroll. */
export default function BookCover({ mount, onNext }: Props) {
  return (
    <section
      data-theme="dark"
      aria-label={`${restaurant.name} — cover`}
      className="paper-grain relative h-full w-full overflow-hidden"
      style={{
        color: "#f4ece0",
        background:
          "radial-gradient(ellipse at 28% 18%, #3d2e27 0%, #2a201c 45%, #1c1512 100%)",
      }}
    >
      {/* spine + cloth edge */}
      <div aria-hidden className="absolute inset-y-0 left-0 w-[clamp(18px,3.4vw,54px)]" style={{ background: "linear-gradient(90deg,#120c09,#2b201b 55%,#1d1511)", boxShadow: "inset -6px 0 14px rgba(0,0,0,.5)" }} />
      <div aria-hidden className="absolute inset-y-0 left-[clamp(18px,3.4vw,54px)] w-px" style={{ background: "rgba(244,236,224,.12)" }} />
      {/* double-rule frame */}
      <div aria-hidden className="pointer-events-none absolute inset-y-5 left-[calc(clamp(18px,3.4vw,54px)+18px)] right-5 border md:inset-y-8 md:right-8" style={{ borderColor: "rgba(182,106,75,.7)" }} />
      <div aria-hidden className="pointer-events-none absolute inset-y-[26px] left-[calc(clamp(18px,3.4vw,54px)+24px)] right-[26px] border md:inset-y-[38px] md:right-[38px]" style={{ borderColor: "rgba(182,106,75,.28)" }} />

      <div className="relative mx-auto flex h-full max-w-[1500px] flex-col items-center justify-center gap-4 px-10 pb-24 pt-14 md:grid md:grid-cols-12 md:gap-8 md:px-24 md:pb-20 md:pt-16">
        {/* artwork: three finished compositions on a plate-like medallion */}
        <div className="relative order-1 w-[min(78%,36svh)] md:order-2 md:col-span-6 md:w-[min(100%,66svh)] md:justify-self-center">
          <div aria-hidden className="absolute inset-[-4%] rounded-full border" style={{ borderColor: "rgba(244,236,224,.14)" }} />
          <div aria-hidden className="absolute inset-[3%] rounded-full" style={{ background: "radial-gradient(circle at 40% 35%, rgba(182,106,75,.45), rgba(182,106,75,.08) 70%)" }} />
          {mount && (
            <>
              <div className="relative">
                <FoodScene id="pizza" animate={false} />
              </div>
              <div className="absolute -bottom-[6%] -left-[14%] w-[48%] drop-shadow-[0_14px_20px_rgba(0,0,0,.45)]">
                <FoodScene id="coffee" animate={false} />
              </div>
              <div className="absolute -right-[10%] -top-[8%] w-[40%] drop-shadow-[0_14px_20px_rgba(0,0,0,.45)]">
                <FoodScene id="donut" animate={false} />
              </div>
            </>
          )}
        </div>

        <div className="relative order-2 text-center md:order-1 md:col-span-6 md:text-left">
          <p className="label" style={{ color: "var(--terracotta)" }}>
            Menu · Volume 01{restaurant.isDemo ? " · Demo" : ""}
          </p>
          <h1 className="serif mt-3 text-[clamp(2.8rem,11vw,4rem)] font-medium uppercase leading-[0.9] tracking-[0.04em] md:mt-6 md:text-[clamp(4rem,8.2vw,8.4rem)]" style={{ textShadow: "0 2px 0 rgba(0,0,0,.35)" }}>
            The Food
            <br />
            Book
          </h1>
          <div aria-hidden className="mx-auto mt-4 h-px w-24 md:mx-0 md:mt-7" style={{ background: "var(--terracotta)" }} />
          <p className="label mt-3 md:mt-5" style={{ letterSpacing: "0.38em" }}>
            {restaurant.tagline}
          </p>
          <p className="serif mt-3 text-lg italic md:mt-6 md:text-2xl" style={{ color: "rgba(244,236,224,.78)" }}>
            {restaurant.subtitle}
          </p>
          <button
            type="button"
            onClick={onNext}
            className="label group mt-5 inline-flex items-center gap-3 rounded-full border px-5 py-3 transition-colors hover:bg-[var(--terracotta)] md:mt-9"
            style={{ borderColor: "rgba(244,236,224,.45)" }}
          >
            Open the Menu
            <span aria-hidden className="bob inline-block">↓</span>
          </button>
        </div>
      </div>

      <div aria-hidden className="label pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center gap-2 opacity-60 md:bottom-10" style={{ fontSize: "0.6rem" }}>
        <span>Scroll to turn the page</span>
        <span className="h-8 w-px" style={{ background: "linear-gradient(#f4ece0,transparent)" }} />
      </div>
    </section>
  );
}
