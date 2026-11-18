import { useId } from "react";
import gsap from "gsap";
import { polar, f1, rng, useScene, type SceneProps } from "./common";

const VB = "-40 -40 680 680";

/* ═════════════════════════ MILKSHAKE ═════════════════════════
   Glass appears → milk flows in → strawberries drop → blend & swirl (milk turns pink) →
   whipped cream builds → chocolate drizzle + strawberry on top. */
const GLASS = "M196 176L404 176L378 490Q300 512 222 490Z";
const GLASS_IN = "M205 182L395 182L371 482Q300 500 229 482Z";

export function Milkshake(p: SceneProps) {
  const id = useId().replace(/:/g, "");
  const ref = useScene((tl) => {
    tl.from(".ms-glass", { y: 60, opacity: 0, duration: 0.9, ease: "power3.out" }, 0);
    tl.fromTo(".ms-stream", { attr: { height: 0 } }, { attr: { height: 330 }, duration: 0.4, ease: "power1.in" }, 0.9);
    tl.from(".ms-milk", { scaleY: 0, svgOrigin: "300 500", duration: 1.5, ease: "power1.inOut" }, 1.2);
    tl.to(".ms-stream", { attr: { y: 210, height: 0 }, duration: 0.4, ease: "power1.out" }, 2.4);
    tl.fromTo(".ms-chunk", { y: -520, opacity: 1 }, { y: 20, opacity: 1, duration: 0.7, ease: "power2.in", stagger: 0.14 }, 2.8);
    tl.to(".ms-chunk", { opacity: 0, scale: 0.4, duration: 0.7, stagger: 0.1, svgOrigin: "300 320" }, 3.9);
    tl.from(".ms-pink", { opacity: 0, duration: 1.6, ease: "sine.inOut" }, 3.7);
    tl.fromTo(".ms-swirl", { x: -150, opacity: 0 }, { x: 0, opacity: 0.35, duration: 1.8, ease: "sine.inOut", stagger: 0.15 }, 3.6);
    tl.from(".ms-straw", { y: -420, opacity: 0, duration: 0.7, ease: "power2.out" }, 4.2);
    tl.from(".ms-cream", { scaleY: 0, scaleX: 0.5, transformOrigin: "50% 100%", duration: 0.8, ease: "back.out(1.7)", stagger: 0.22 }, 5.0);
    tl.fromTo(".ms-choc", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.0, ease: "power1.inOut", stagger: 0.15 }, 6.0);
    tl.from(".ms-top", { y: -420, opacity: 0, rotation: 90, duration: 1.0, ease: "bounce.out" }, 6.2);
  }, p);

  return (
    <svg ref={ref} className="scene-svg" viewBox={VB}>
      <defs>
        <clipPath id={`${id}g`}><path d={GLASS_IN} /></clipPath>
      </defs>
      <ellipse cx="300" cy="510" rx="190" ry="26" fill="url(#gShadow)" />
      <g className="ms-glass">
        <path d={GLASS} fill="#fff" fillOpacity=".12" />
        <g clipPath={`url(#${id}g)`}>
          <g data-ing="milk">
            <rect className="ms-milk" x="180" y="214" width="240" height="300" fill="url(#gMilk)" />
          </g>
          <g data-ing="strawberry">
            <rect className="ms-pink" x="180" y="214" width="240" height="300" fill="url(#gPink)" />
          </g>
          <g fill="none" stroke="#fff" strokeWidth="16" strokeLinecap="round" opacity=".35">
            {[260, 330, 400].map((y) => (
              <path key={y} className="ms-swirl" d={`M120 ${y}Q190 ${y - 30} 260 ${y}T400 ${y}T540 ${y}`} />
            ))}
          </g>
          <ellipse cx="300" cy="214" rx="96" ry="8" fill="#fff" opacity=".35" />
        </g>
        <g data-ing="strawberry">
          {[[255, 250], [305, 270], [345, 245], [280, 300], [330, 310]].map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y})`}>
              <g className="ms-chunk" opacity="0">
                <circle r="15" fill="#e0344d" />
                <circle cx="-4" cy="-4" r="3" fill="#ffd0d6" opacity=".6" />
              </g>
            </g>
          ))}
        </g>
        <g className="ms-straw">
          <line x1="372" y1="26" x2="334" y2="470" stroke="#fff" strokeWidth="13" strokeLinecap="round" />
          <line x1="372" y1="26" x2="334" y2="470" stroke="#e4547a" strokeWidth="13" strokeDasharray="14 14" />
          <line x1="366" y1="30" x2="329" y2="470" stroke="#fff" strokeWidth="2" opacity=".5" />
        </g>
        <path d={GLASS} fill="url(#gGlass)" stroke="#fff" strokeOpacity=".7" strokeWidth="2.5" />
        <path d="M222 490Q300 512 378 490L376 470Q300 490 224 470Z" fill="#fff" opacity=".35" />
        <ellipse cx="300" cy="176" rx="104" ry="11" fill="none" stroke="#fff" strokeOpacity=".85" strokeWidth="3" />
      </g>
      <rect className="ms-stream" x="292" y="-120" width="16" height="0" rx="8" fill="#fffaf0" />
      <g data-ing="cream">
        <ellipse className="ms-cream" cx="300" cy="170" rx="112" ry="30" fill="url(#gCream)" />
        <ellipse className="ms-cream" cx="300" cy="140" rx="84" ry="28" fill="url(#gCream)" />
        <ellipse className="ms-cream" cx="300" cy="112" rx="56" ry="24" fill="url(#gCream)" />
        <path className="ms-cream" d="M270 100Q300 40 332 96Q300 112 270 100Z" fill="url(#gCream)" />
        <path d="M206 172Q300 196 394 172M228 142Q300 164 372 142M252 114Q300 132 348 114" fill="none" stroke="#e9d6b4" strokeWidth="2" opacity=".7" />
      </g>
      <g data-ing="chocolate" fill="none" stroke="#3c1a0e" strokeWidth="7" strokeLinecap="round">
        <path className="ms-choc" d="M214 172Q250 196 280 160T350 176T392 164" pathLength={1} strokeDasharray="1" strokeDashoffset="0" />
        <path className="ms-choc" d="M238 138Q270 160 300 130T366 140" pathLength={1} strokeDasharray="1" strokeDashoffset="0" />
        <path className="ms-choc" d="M264 112Q290 128 316 108" pathLength={1} strokeDasharray="1" strokeDashoffset="0" />
      </g>
      <g transform="translate(300 78)" data-ing="strawberry">
        <g className="ms-top">
          <path d="M0 -18C20 -18 26 6 0 30C-26 6 -20 -18 0 -18Z" fill="#d92d45" />
          <path d="M-12 -18Q0 -34 12 -18Q0 -24 -12 -18Z" fill="#4c8a2a" />
          {[[-8, -4], [6, -6], [0, 6], [-4, 14], [9, 6]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r="1.8" fill="#ffe4a8" />)}
        </g>
      </g>
    </svg>
  );
}

/* ═════════════════════════ PASTRY (éclair) ═════════════════════════
   Shell glides in & turns slowly → cream is piped → top shell lowers →
   chocolate glaze flows over → pistachio is scattered. */
const pist = (() => {
  const r = rng(11);
  return Array.from({ length: 22 }, () => [150 + r() * 300, 292 + r() * 40, 2.5 + r() * 3] as [number, number, number]);
})();

export function Pastry(p: SceneProps) {
  const ref = useScene((tl) => {
    tl.from(".e-plate", { opacity: 0, scale: 0.8, svgOrigin: "300 450", duration: 0.8, ease: "power2.out" }, 0);
    tl.from(".e-bot", { x: -640, rotation: -40, opacity: 0, svgOrigin: "300 380", duration: 1.3, ease: "power3.out" }, 0.3);
    tl.fromTo(".e-all", { rotation: -7, svgOrigin: "300 380" }, { rotation: 0, svgOrigin: "300 380", duration: 5, ease: "sine.inOut" }, 0.9);
    tl.from(".e-cream", { scale: 0, svgOrigin: (_i: number, el: Element) => `${el.getAttribute("cx")} 352`, duration: 0.5, ease: "back.out(2)", stagger: 0.07 }, 1.8);
    tl.from(".e-top", { y: -190, opacity: 0, duration: 0.8, ease: "power2.in" }, 3.0);
    tl.from(".e-glaze", { scaleY: 0, transformOrigin: "50% 0%", duration: 1.5, ease: "power2.out" }, 3.9);
    tl.from(".e-pist", { scale: 0, y: -40, opacity: 0, duration: 0.5, ease: "back.out(2)", stagger: { each: 0.05, from: "random" } }, 5.1);
    tl.from(".e-shine", { opacity: 0, duration: 1.0 }, 5.8);
  }, p);

  return (
    <svg ref={ref} className="scene-svg" viewBox={VB}>
      <g className="e-plate">
        <ellipse cx="300" cy="460" rx="290" ry="78" fill="url(#gPlate)" />
        <ellipse cx="300" cy="460" rx="290" ry="78" fill="none" stroke="#d7cfc0" />
        <ellipse cx="300" cy="458" rx="218" ry="52" fill="none" stroke="#e1d9ca" />
      </g>
      <g transform="translate(0 52)">
      <ellipse cx="300" cy="432" rx="230" ry="24" fill="url(#gShadow)" />
      <g className="e-all">
        <g data-ing="shell">
          <path className="e-bot" d="M110 382Q110 352 150 350L450 350Q490 352 490 382Q490 412 450 414L150 414Q110 412 110 382Z" fill="url(#gGolden)" />
        </g>
        <g data-ing="cream">
          {Array.from({ length: 11 }, (_, i) => 150 + i * 30).map((x) => (
            <circle key={x} className="e-cream" cx={x} cy="352" r="23" fill="url(#gCream)" stroke="#e8d7b6" />
          ))}
        </g>
        <g className="e-top">
          <g data-ing="shell">
            <path d="M104 348Q104 278 160 274L440 274Q496 278 496 348Q496 358 470 358L130 358Q104 358 104 348Z" fill="url(#gGolden)" />
          </g>
          <g data-ing="glaze">
            <path className="e-glaze" d="M108 340Q108 286 160 282L440 282Q492 286 492 340Q492 352 470 350Q454 376 438 348Q422 342 406 366Q390 386 374 348L222 348Q206 370 190 346Q172 342 152 370Q134 376 126 348Q108 350 108 340Z" fill="url(#gChoc)" />
            <path className="e-shine" d="M150 296Q300 280 440 296" stroke="#fff" strokeOpacity=".4" strokeWidth="6" strokeLinecap="round" fill="none" />
          </g>
          <g data-ing="pistachio">
            {pist.map(([x, y, r], i) => (
              <circle key={i} className="e-pist" cx={f1(x)} cy={f1(y)} r={f1(r)} fill={i % 2 ? "#8db255" : "#6f9a3a"} />
            ))}
          </g>
        </g>
      </g></g>
    </svg>
  );
}

/* ═════════════════════════ CAKE ═════════════════════════
   Sponge layers drop in → cream between → ganache spreads & drips →
   strawberries + rosettes → a slice slides out to show the layers. */
const layers: { yt: number; yb: number; cream?: boolean }[] = [
  { yt: 384, yb: 440 }, { yt: 368, yb: 384, cream: true },
  { yt: 312, yb: 368 }, { yt: 296, yb: 312, cream: true },
  { yt: 240, yb: 296 },
];
const drips: [number, number][] = [[165, 36], [214, 60], [268, 28], [330, 50], [388, 66], [440, 32]];
const berries: [number, number][] = [[190, 250], [300, 212], [410, 252]];
const rosettes: [number, number][] = [[148, 238], [240, 270], [360, 270], [452, 238], [250, 214], [350, 214]];

function Strawberry({ s = 1 }: { s?: number }) {
  return (
    <g transform={`scale(${s})`}>
      <path d="M0 -16C22 -16 28 8 0 34C-28 8 -22 -16 0 -16Z" fill="#d92d45" />
      <path d="M-14 -16Q0 -34 14 -16Q0 -24 -14 -16Z" fill="#4c8a2a" />
      <ellipse cx="-8" cy="-2" rx="5" ry="9" fill="#fff" opacity=".18" />
      {[[-9, -2], [7, -5], [0, 8], [-4, 16], [10, 7]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r="1.9" fill="#ffe4a8" />)}
    </g>
  );
}

export function Cake(p: SceneProps) {
  const ref = useScene((tl) => {
    tl.from(".k-plate", { opacity: 0, scale: 0.8, svgOrigin: "300 470", duration: 0.7 }, 0);
    tl.from(".k-lay", { y: -420, opacity: 0, duration: 0.75, ease: "power2.in", stagger: 0.28 }, 0.4);
    tl.from(".k-topcap", { scale: 0, svgOrigin: "300 240", duration: 1.0, ease: "power2.out" }, 2.4);
    tl.from(".k-side", { scaleY: 0, transformOrigin: "50% 0%", duration: 0.8, ease: "power2.out" }, 2.8);
    tl.from(".k-drip", { scaleY: 0, transformOrigin: "50% 0%", duration: 1.0, ease: "power2.out", stagger: 0.1 }, 3.2);
    tl.from(".k-rose", { scale: 0, opacity: 0, y: -60, duration: 0.5, ease: "back.out(2)", stagger: 0.1 }, 4.0);
    tl.from(".k-berry", { y: -320, opacity: 0, duration: 0.8, ease: "bounce.out", stagger: 0.2 }, 4.5);
    tl.fromTo(".k-slice", { x: -170, y: -34 }, { x: 0, y: 0, duration: 1.4, ease: "power3.inOut" }, 5.8);
    tl.fromTo(".k-slice", { opacity: 0 }, { opacity: 1, duration: 0.25 }, 5.8);
  }, p);

  return (
    <svg ref={ref} className="scene-svg" viewBox={VB}>
      <g className="k-plate">
        <ellipse cx="310" cy="474" rx="290" ry="64" fill="url(#gPlate)" />
        <ellipse cx="310" cy="474" rx="290" ry="64" fill="none" stroke="#d7cfc0" />
      </g>
      <g transform="translate(-48 -18)">
        <ellipse cx="300" cy="450" rx="190" ry="40" fill="url(#gShadow)" />
        {layers.map((l, i) => (
          <g key={i} data-ing={l.cream ? "cream" : "sponge"}>
            <path className="k-lay" d={`M130 ${l.yt}L130 ${l.yb}A170 44 0 0 0 470 ${l.yb}L470 ${l.yt}Z`} fill={l.cream ? "url(#gCream)" : "url(#gSponge)"} />
          </g>
        ))}
        <g data-ing="ganache">
          <path className="k-side" d="M130 240A170 44 0 0 0 470 240L470 262A170 44 0 0 1 130 262Z" fill="url(#gChoc)" />
          {drips.map(([x, h], i) => {
            const ay = f1(240 + 44 * Math.sqrt(1 - ((x - 300) / 170) ** 2));
            return <path key={i} className="k-drip" d={`M${x - 10} ${ay}L${x - 10} ${ay + h}Q${x} ${ay + h + 14} ${x + 10} ${ay + h}L${x + 10} ${ay}Z`} fill="#3a1b0e" />;
          })}
          <ellipse className="k-topcap" cx="300" cy="240" rx="170" ry="44" fill="url(#gChoc)" />
          <ellipse className="k-topcap" cx="300" cy="236" rx="120" ry="26" fill="#fff" opacity=".08" />
        </g>
        <g data-ing="cream">
          {rosettes.map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y})`}>
              <g className="k-rose">
                <ellipse rx="15" ry="11" fill="url(#gCream)" stroke="#e8d7b6" />
                <path d="M-8 0Q0 -9 8 0Q0 5 -8 0Z" fill="#e8d7b6" />
              </g>
            </g>
          ))}
        </g>
        <g data-ing="strawberry">
          {berries.map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y - 16})`}>
              <g className="k-berry"><Strawberry /></g>
            </g>
          ))}
        </g>
      </g>
      <g transform="translate(402 372)">
        <g className="k-slice">
          <path d="M110 0L156 -24L156 76L110 108Z" fill="#2f1609" />
          <path d="M0 0L110 0L156 -24L44 -24Z" fill="url(#gChoc)" />
          <g data-ing="sponge"><rect x="0" y="0" width="110" height="108" fill="url(#gSponge)" /></g>
          <g data-ing="cream">
            <rect x="0" y="30" width="110" height="9" fill="url(#gCream)" />
            <rect x="0" y="69" width="110" height="9" fill="url(#gCream)" />
          </g>
          <g data-ing="ganache"><path d="M0 0L110 0L110 12Q96 22 90 12Q70 24 60 12Q34 22 20 12Q8 18 0 12Z" fill="#3a1b0e" /></g>
          <g transform="translate(62 -14)" data-ing="strawberry"><Strawberry s={0.9} /></g>
        </g>
      </g>
    </svg>
  );
}

/* ═════════════════════════ DONUT ═════════════════════════
   Donut spins into view → pink glaze flows over → chocolate stripes →
   sprinkles fall and settle. */
function wobblePath(r0: number, amp: number, seed: number, n = 120) {
  let d = "";
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    const r = r0 + amp * Math.sin(a * 7 + seed) + amp * 0.6 * Math.sin(a * 13 + seed * 2.1);
    d += `${i ? "L" : "M"}${f1(r * Math.cos(a))} ${f1(r * Math.sin(a))}`;
  }
  return d + "Z";
}
const glazeD = wobblePath(200, 7, 1) + wobblePath(76, 3, 2);
const ring = (ro: number, ri: number) => `M${-ro} 0A${ro} ${ro} 0 1 0 ${ro} 0A${ro} ${ro} 0 1 0 ${-ro} 0ZM${-ri} 0A${ri} ${ri} 0 1 0 ${ri} 0A${ri} ${ri} 0 1 0 ${-ri} 0Z`;
const sprinkles = (() => {
  const r = rng(5);
  const cols = ["#ffffff", "#f5c542", "#4fa3d9", "#7fb069", "#e8604f", "#8a5cc0"];
  return Array.from({ length: 52 }, (_, i) => {
    const [x, y] = polar(0, 0, 92 + r() * 90, r() * 360);
    return { x: f1(x), y: f1(y), rot: Math.round(r() * 180), c: cols[i % cols.length] };
  });
})();

export function Donut(p: SceneProps) {
  const id = useId().replace(/:/g, "");
  const ref = useScene((tl) => {
    tl.from(".d-shadow", { opacity: 0, duration: 1 }, 0);
    tl.from(".d-all", { x: -560, rotation: -240, scale: 0.55, opacity: 0, svgOrigin: "0 0", duration: 1.7, ease: "power3.out" }, 0);
    tl.from(".d-glaze", { scale: 0, opacity: 0, svgOrigin: "0 0", duration: 1.6, ease: "power2.out" }, 1.8);
    tl.fromTo(".d-choc", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.8, ease: "power1.inOut", stagger: 0.12 }, 3.3);
    tl.from(".d-spr", { y: -420, opacity: 0, rotation: () => gsap.utils.random(-300, 300), duration: 0.9, ease: "bounce.out", stagger: { each: 0.035, from: "random" } }, 4.1);
    tl.from(".d-shine", { opacity: 0, duration: 1 }, 5.6);
  }, p);

  return (
    <svg ref={ref} className="scene-svg" viewBox={VB}>
      <ellipse className="d-shadow" cx="300" cy="470" rx="250" ry="42" fill="url(#gShadow)" />
      <g transform="translate(300 300) scale(1 .82)">
        <g className="d-all">
          <path d={ring(214, 64)} transform="translate(0 38)" fill="#8f531f" fillRule="evenodd" />
          <g data-ing="dough">
            <path d={ring(214, 64)} fill="url(#gDonut)" fillRule="evenodd" />
            <path d={ring(214, 64)} fill="none" stroke="#a1612a" strokeWidth="2" strokeOpacity=".5" />
          </g>
          <clipPath id={`${id}c`}><path d={glazeD} clipRule="evenodd" /></clipPath>
          <g data-ing="glaze">
            <path className="d-glaze" d={glazeD} fill="url(#gPink)" fillRule="evenodd" />
            <path className="d-shine" d="M-150 -90Q-90 -150 -20 -150" stroke="#fff" strokeOpacity=".5" strokeWidth="14" strokeLinecap="round" fill="none" />
          </g>
          <g clipPath={`url(#${id}c)`} data-ing="chocolate" fill="none" stroke="#4a2212" strokeWidth="9" strokeLinecap="round">
            {[-150, -90, -30, 30, 90, 150].map((x, i) => (
              <path key={i} className="d-choc" d={`M${x - 70} -230L${x + 70} 230`} pathLength={1} strokeDasharray="1" strokeDashoffset="0" opacity=".9" />
            ))}
          </g>
          <g data-ing="sprinkles">
            {sprinkles.map((s, i) => (
              <g key={i} transform={`translate(${s.x} ${s.y}) rotate(${s.rot})`}>
                <rect className="d-spr" x="-9" y="-2.8" width="18" height="5.6" rx="2.8" fill={s.c} />
              </g>
            ))}
          </g>
        </g>
      </g>
    </svg>
  );
}
