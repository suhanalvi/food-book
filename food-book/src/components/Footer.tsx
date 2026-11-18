import { restaurant } from "../config/restaurant";

/** Minimal footer. Only shows business details that were actually provided. */
export default function Footer() {
  const c = restaurant.contact;
  const hasAny = c.address || c.hours.length || c.phone || c.email || c.instagram || c.mapUrl;
  const link = "underline-offset-4 hover:underline";

  return (
    <footer data-theme="dark" className="px-5 py-14 md:px-16" style={{ background: "var(--dark)", color: "#f4ece0" }}>
      <div className="mx-auto grid max-w-[1300px] gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          {restaurant.logo ? (
            <img src={restaurant.logo} alt={restaurant.name} className="h-10 w-auto" />
          ) : (
            <p className="serif text-4xl uppercase tracking-[0.1em]">{restaurant.name}</p>
          )}
          <p className="label mt-3 opacity-60">{restaurant.tagline}</p>
        </div>

        <div className="space-y-2 text-sm leading-relaxed md:col-span-7 md:columns-2">
          {hasAny ? (
            <>
              {c.address && <p>{c.address}</p>}
              {c.hours.length > 0 && <p className="whitespace-pre-line">{c.hours.join("\n")}</p>}
              {c.phone && <p><a className={link} href={`tel:${c.phone}`}>{c.phone}</a></p>}
              {c.email && <p><a className={link} href={`mailto:${c.email}`}>{c.email}</a></p>}
              {c.instagram && <p><a className={link} href={c.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></p>}
              {c.mapUrl && <p><a className={link} href={c.mapUrl} target="_blank" rel="noopener noreferrer">Find us on the map</a></p>}
            </>
          ) : (
            <p className="opacity-70">
              Address, opening hours and contact details have not been provided. Add them in <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">src/config/restaurant.ts</code> and they will appear here.
            </p>
          )}
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-[1300px] flex-col gap-2 border-t border-white/15 pt-6 text-xs opacity-60 md:flex-row md:justify-between">
        <p>{restaurant.isDemo ? "Demo menu — all dishes, prices and descriptions are sample content." : `© ${new Date().getFullYear()} ${restaurant.name}`}</p>
        <p>Dish photographs from Pexels (credits in each dish’s details). Animated plates are illustrated compositions.</p>
      </div>
    </footer>
  );
}
