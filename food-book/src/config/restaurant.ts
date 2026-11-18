/**
 * ─────────────────────────────────────────────────────────────
 *  BUSINESS CONFIGURATION
 *  Everything an owner needs to change lives here + in
 *  src/data/menu.json (food items, prices, ingredients, images).
 *
 *  All values below are DEMO placeholders. Replace them with real
 *  restaurant information. Empty strings are simply not displayed.
 * ─────────────────────────────────────────────────────────────
 */
export const restaurant = {
  /** Shows a "demo content" notice. Set to false once real content is in place. */
  isDemo: true,

  /** Restaurant / menu name used on the cover, HUD and footer. */
  name: "The Food Book",
  tagline: "A Journey Through Taste",
  subtitle: "Discover something delicious, one page at a time.",

  /** Optional logo image URL (e.g. "/logo.svg"). Leave empty to use the text mark. */
  logo: "",

  /** Brand colours – applied as CSS variables at start-up. */
  colors: {
    paper: "#F7F3EB",
    cream: "#EEE5D8",
    ink: "#2D211C",
    terracotta: "#B66A4B",
    sage: "#69765B",
    dark: "#25201D",
  },

  /** Contact details – leave blank to hide. NOT provided in the demo. */
  contact: {
    address: "",
    hours: [] as string[], // e.g. ["Mon–Fri · 8am – 10pm", "Sat–Sun · 9am – 11pm"]
    phone: "",
    email: "",
    instagram: "", // full URL
    mapUrl: "", // full URL to a map location
  },

  /**
   * Optional ordering module. Set `enabled: false` to remove the cart,
   * "Add to order" buttons and the order drawer completely.
   *
   * IMPORTANT: no ordering backend is connected. The demo can only build
   * an order summary (copy to clipboard) – it never claims an order was placed.
   * To connect a real channel, add e.g. a WhatsApp number (digits only,
   * with country code) and a "Send via WhatsApp" link will appear.
   */
  ordering: {
    enabled: true,
    whatsappNumber: "",
  },

  currency: "INR",
  locale: "en-IN",
};

export type Restaurant = typeof restaurant;
