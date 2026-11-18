import { useId } from "react";
import gsap from "gsap";
import { polar, f1, useScene, type SceneProps } from "./common";

/* ═════════════════════════ COFFEE ═════════════════════════
   Beans fall → cup rises → espresso pours → milk streams in →
   latte-art swirl is drawn → steam rises. */
const spiral = (() => {
  let d = "";
  for (let i = 0; i <= 150; i++) {
    const t = i / 150;
    const a = t * Math.PI * 6;
    const r = 6 + t * 106;
    d += `${i ? "L" : "M"}${f1(300 + r * Math.cos(a))} ${f1(296 + r * 0.24 * Math.sin(a))} `;
  }
  return d;
})();

const beans: [number, number, number][] = [
  [64, 545, -30], [118, 560, 40], [176, 548, 10], [236, 566, -50],
  [372, 568, 25], [434, 550, -20], [494, 562, 55], [540, 520, -10],
  [52, 492, 70], [300, 575, 15],
];

export function Coffee(p: SceneProps) {
  const uid = useId().replace(/:/g, "");
  const ref = useScene((tl) => {
    tl.from(".c-bean", { y: -640, rotation: () => gsap.utils.random(-260, 260), opacity: 0, duration: 1.15, ease: "power2.in", stagger: 0.1 }, 0);
    tl.from(".c-cup", { y: 80, opacity: 0, scale: 0.9, svgOrigin: "300 480", duration: 1, ease: "power3.out" }, 1.0);
    // espresso pour
    tl.fromTo(".c-pour", { attr: { height: 0 } }, { attr: { height: 366 }, duration: 0.45, ease: "power1.in" }, 2.0);
    tl.from(".c-coffee", { scale: 0, opacity: 0, svgOrigin: "300 296", duration: 1.5, ease: "power2.out" }, 2.4);
    tl.fromTo(".c-ripple", { opacity: 0.7, scale: 0.15 }, { opacity: 0, scale: 1, svgOrigin: "300 296", duration: 1, stagger: 0.28, repeat: 2, ease: "power1.out" }, 2.5);
    tl.to(".c-pour", { attr: { y: 306, height: 0 }, duration: 0.45, ease: "power1.out" }, 3.5);
    tl.fromTo(".c-drop", { scale: 0, opacity: 0, y: 0 }, { scale: 1, opacity: 1, y: -17, duration: 0.3, stagger: 0.07, svgOrigin: "300 297" }, 2.35);
    tl.to(".c-drop", { opacity: 0, y: -36, duration: 0.4, stagger: 0.07 }, 2.78);
    tl.fromTo(".c-bub", { scale: 0, opacity: 0 }, { scale: 1, opacity: 0.9, duration: 0.25, stagger: 0.08, svgOrigin: "300 297" }, 2.6);
    tl.to(".c-bub", { scale: 0.3, opacity: 0, duration: 0.45, stagger: 0.08, svgOrigin: "300 297" }, 3.4);
    tl.to(".c-coffee", { scaleY: 1.06, duration: 0.4, yoyo: true, repeat: 2, svgOrigin: "300 297", ease: "sine.inOut" }, 4.0);
    // milk stream
    tl.fromTo(".c-milkstream", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6, ease: "power1.in" }, 3.7);
    tl.to(".c-milkstream", { strokeDashoffset: -1, duration: 0.6, ease: "power1.out" }, 4.5);
    // swirl
    tl.fromTo(".c-spiral", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.3, ease: "power1.inOut" }, 4.0);
    tl.fromTo(".c-pull", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, stagger: 0.12, ease: "power2.inOut" }, 5.2);
    // steam
    tl.fromTo(".c-steam", { opacity: 0, y: 14 }, { opacity: 0.55, y: -46, duration: 2.6, stagger: 0.5, repeat: -1, ease: "sine.inOut" }, 5.4);
  }, p);

  return (
    <svg ref={ref} className="scene-svg" viewBox="-40 -40 680 680">
      <ellipse cx="300" cy="510" rx="260" ry="36" fill="url(#gShadow)" />
      <g className="c-cup">
        <ellipse cx="300" cy="466" rx="238" ry="54" fill="url(#gPlate)" />
        <ellipse cx="300" cy="458" rx="182" ry="38" fill="#e6dece" stroke="#fff" strokeOpacity=".7" />
        <path d="M436 332C524 322 524 424 428 412" stroke="url(#gCeramic)" strokeWidth="24" fill="none" strokeLinecap="round" />
        <path d="M152 292C152 402 215 464 300 464C385 464 448 402 448 292Z" fill="url(#gCeramic)" />
        <ellipse cx="300" cy="292" rx="150" ry="40" fill="#fbf8f2" stroke="#d6cdbd" />
        <ellipse cx="300" cy="295" rx="134" ry="33" fill="#e4dbc9" />
        <g data-ing="espresso">
          <ellipse className="c-coffee" cx="300" cy="297" rx="127" ry="30" fill="url(#gCrema)" />
        </g>
        <g data-ing="milk" fill="none" strokeLinecap="round">
          <path className="c-spiral" d={spiral} pathLength={1} strokeDasharray="1" strokeDashoffset="0" stroke="#fff4e0" strokeWidth="7" opacity=".92" />
          {[[400, 296], [300, 320], [200, 296], [300, 272]].map(([x, y], i) => (
            <path key={i} className="c-pull" d={`M300 296L${x} ${y}`} pathLength={1} strokeDasharray="1" strokeDashoffset="0" stroke="#6b3d22" strokeWidth="3" opacity=".65" />
          ))}
        </g>
        <ellipse cx="300" cy="297" rx="127" ry="30" fill="none" stroke="#fff" strokeOpacity=".12" />
        {[0, 1, 2].map((i) => (
          <ellipse key={i} className="c-ripple" cx="300" cy="297" rx="120" ry="28" fill="none" stroke="#f0d0a0" strokeWidth="2" opacity="0" />
        ))}
        <g data-ing="espresso">
          {[[-28, -6], [20, -10], [6, 12]].map(([dx, dy], i) => (
            <ellipse key={i} className="c-drop" cx={300 + dx} cy={297 + dy} rx="5" ry="3.4" fill="#c98b52" opacity="0" />
          ))}
          {[[-44, 8], [-14, -8], [26, 10], [54, -4]].map(([dx, dy], i) => (
            <circle key={i} className="c-bub" cx={300 + dx} cy={297 + dy * 0.35} r={3 + (i % 2) * 1.6} fill="#f3d3a4" opacity="0" />
          ))}
        </g>
      </g>
      <path className="c-milkstream" d="M110 120C190 130 262 210 286 300" pathLength={1} strokeDasharray="1" strokeDashoffset="1" stroke="#fffaf0" strokeWidth="11" fill="none" strokeLinecap="round" />
      <defs>
        <clipPath id={`${uid}pc`}>
          <rect className="c-pour" x="284" y="-60" width="32" height="0" rx="16" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${uid}pc)`} data-ing="espresso">
        <path d="M296 -60C297 40 303 150 300 308" stroke="url(#gCoffee)" strokeWidth="17" fill="none" strokeLinecap="round" />
        <path d="M298 -60C299 40 304 150 301 308" stroke="#fff" strokeOpacity=".3" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M292 -60C293 40 300 150 297 308" stroke="#1d0d06" strokeOpacity=".3" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
      <g fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" className="steam-blur">
        {[250, 300, 350].map((x, i) => (
          <path key={i} className="c-steam" style={{ opacity: 0.35 }} d={`M${x} 250C${x - 22} 215 ${x + 22} 190 ${x} 150`} />
        ))}
      </g>
      <g data-ing="beans">
        {beans.map(([x, y, r], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
            <g className="c-bean">
              <ellipse rx="19" ry="12" fill="#4d2918" />
              <ellipse rx="19" ry="12" fill="none" stroke="#7a4a2c" strokeWidth="1.5" />
              <path d="M-17 -1C-8 -7 6 6 17 0" stroke="#1d0d06" strokeWidth="2.4" fill="none" strokeLinecap="round" />
              <ellipse cx="-7" cy="-5" rx="6" ry="2.4" fill="#fff" opacity=".18" />
            </g>
          </g>
        ))}
      </g>
    </svg>
  );
}

/* ═════════════════════════ BURGER ═════════════════════════
   Bottom bun → lettuce → tomato → patty → cheese melts & stretches →
   sauce flows → top bun lands. */
const sesame: [number, number, number][] = [
  [210, 282, -20], [262, 262, 15], [320, 256, -5], [376, 270, 25], [420, 304, 40], [236, 316, 10],
  [296, 300, -30], [352, 312, 5], [190, 336, -40], [398, 340, 30], [268, 342, 20], [326, 346, -15],
];

export function Burger(p: SceneProps) {
  const ref = useScene((tl) => {
    tl.from(".b-bot", { y: 340, opacity: 0, duration: 0.8, ease: "power3.out" }, 0);
    tl.from(".b-let", { y: -340, opacity: 0, duration: 0.9, ease: "bounce.out" }, 0.7);
    tl.from(".b-tom", { y: -300, opacity: 0, scale: 0.6, svgOrigin: "300 410", duration: 0.7, ease: "back.out(1.6)", stagger: 0.18 }, 1.45);
    tl.from(".b-patty", { x: 620, opacity: 0, rotation: 6, duration: 0.9, ease: "power3.out" }, 2.1);
    tl.from(".b-cheese", { y: -160, opacity: 0, duration: 0.7, ease: "power2.in" }, 3.0);
    tl.from(".b-drip", { scaleY: 0, transformOrigin: "50% 0%", duration: 1.6, ease: "elastic.out(1,0.35)", stagger: 0.12 }, 3.6);
    tl.from(".b-string", { scaleY: 0, transformOrigin: "50% 0%", duration: 1.4, ease: "power2.out" }, 3.9);
    tl.fromTo(".b-sauce", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1, ease: "power1.inOut" }, 4.4);
    tl.from(".b-sdrip", { scaleY: 0, transformOrigin: "50% 0%", duration: 1.1, ease: "power2.out", stagger: 0.2 }, 5.0);
    tl.from(".b-gloss", { opacity: 0, duration: 0.9, stagger: 0.15 }, 4.1);
    tl.from(".b-top", { y: -560, rotation: -4, svgOrigin: "300 360", duration: 1.0, ease: "bounce.out" }, 5.4);
    tl.fromTo(".b-all", { scale: 1 }, { scale: 1.025, svgOrigin: "300 380", duration: 0.6, yoyo: true, repeat: 1, ease: "sine.inOut" }, 6.3);
  }, p);

  return (
    <svg ref={ref} className="scene-svg" viewBox="-40 -40 680 680">
      <ellipse cx="300" cy="480" rx="250" ry="30" fill="url(#gShadow)" />
      <g transform="translate(0 -30)"><g className="b-all">
        <g data-ing="bun">
          <g className="b-bot">
            <path d="M138 442Q138 430 162 430L438 430Q462 430 462 442L462 462Q462 490 420 490L180 490Q138 490 138 462Z" fill="url(#gBunBot)" />
            <path d="M160 438H440" stroke="#fff" strokeOpacity=".22" strokeWidth="3" strokeLinecap="round" />
          </g>
        </g>
        <g data-ing="lettuce">
          <path className="b-let" d="M116 436Q128 400 150 422Q168 394 190 420Q212 392 234 418Q256 394 278 420Q300 392 322 418Q344 394 366 420Q388 392 410 418Q432 394 450 420Q472 404 484 436Z" fill="url(#gLettuce)" stroke="#4a8222" strokeWidth="1.5" strokeLinejoin="round" />
        </g>
        <g data-ing="tomato">
          {[196, 300, 404].map((x) => (
            <g key={x} className="b-tom">
              <ellipse cx={x} cy="414" rx="64" ry="14" fill="url(#gTomato)" />
              <ellipse cx={x} cy="412" rx="50" ry="8" fill="#f68a76" opacity=".5" />
              <ellipse cx={x} cy="411" rx="28" ry="4" fill="#ffd2c4" opacity=".35" />
            </g>
          ))}
        </g>
        <g data-ing="patty">
          <g className="b-patty">
            <rect x="130" y="372" width="340" height="48" rx="24" fill="url(#gPatty)" />
            {[170, 220, 270, 320, 370, 420].map((x) => (
              <path key={x} d={`M${x} 380L${x + 22} 412`} stroke="#1c0c05" strokeWidth="4" strokeLinecap="round" opacity=".55" />
            ))}
            <path d="M150 380H450" stroke="#a46a46" strokeOpacity=".45" strokeWidth="3" strokeLinecap="round" />
          </g>
        </g>
        <g data-ing="cheese">
          <g className="b-cheese">
            <path d="M116 366L484 366L478 380Q300 388 122 380Z" fill="url(#gCheese)" />
            <path d="M130 369H470" stroke="#fff6b0" strokeWidth="3" strokeLinecap="round" opacity=".7" />
            <path className="b-gloss" d="M156 374Q250 380 344 373" stroke="#fffbe0" strokeWidth="5" strokeLinecap="round" fill="none" opacity=".8" />
            <path className="b-gloss" d="M368 372Q420 376 458 371" stroke="#fffbe0" strokeWidth="4" strokeLinecap="round" fill="none" opacity=".7" />
          </g>
          <path className="b-drip" d="M118 372L156 372L156 394Q154 436 138 440Q122 436 120 396Z" fill="url(#gCheese)" />
          <path className="b-drip" d="M444 372L482 372L480 396Q478 424 462 428Q446 420 444 394Z" fill="url(#gCheese)" />
          <path className="b-drip" d="M274 378L328 378Q326 420 300 430Q276 420 274 378Z" fill="url(#gCheese)" />
          <path className="b-string" d="M300 424L300 478" stroke="#f6b81c" strokeWidth="4" strokeLinecap="round" />
          <path className="b-string" d="M196 402L196 456" stroke="#f6b81c" strokeWidth="3" strokeLinecap="round" />
          <path className="b-string" d="M410 400L410 448" stroke="#f0a91a" strokeWidth="3" strokeLinecap="round" />
        </g>
        <g data-ing="sauce" fill="none" strokeLinecap="round">
          <path className="b-sauce" d="M136 362Q180 352 220 364T300 362T380 364T464 360" pathLength={1} strokeDasharray="1" strokeDashoffset="0" stroke="#d5452a" strokeWidth="10" />
          <path className="b-sdrip" d="M180 366L180 392" stroke="#d5452a" strokeWidth="9" />
          <path className="b-sdrip" d="M382 368L382 400" stroke="#d5452a" strokeWidth="9" />
        </g>
        <g data-ing="bun">
          <g className="b-top">
            <path d="M126 360C126 236 474 236 474 360Q474 370 450 370L150 370Q126 370 126 360Z" fill="url(#gBunTop)" />
            <ellipse cx="236" cy="286" rx="70" ry="22" fill="#fff" opacity=".16" transform="rotate(-18 236 286)" />
            {sesame.map(([x, y, r], i) => (
              <ellipse key={i} cx={x} cy={y} rx="8" ry="3.8" fill="#fbebc8" transform={`rotate(${r} ${x} ${y})`} />
            ))}
          </g>
        </g>
      </g></g>
    </svg>
  );
}

/* ═════════════════════════ PATTIES ═════════════════════════
   Golden patty spins in → rotates slowly → flaky layers appear →
   breaks open to reveal filling → crumbs fall. */
function PattyArt() {
  return (
    <g>
      <path d="M96 372A204 196 0 0 1 504 372Q504 394 482 394L118 394Q96 394 96 372Z" fill="url(#gGolden)" />
      {[168, 138, 108].map((r, i) => (
        <path key={i} className="pt-flake" d={`M${300 - r - 6} 372A${r + 6} ${r * 0.96} 0 0 1 ${300 + r + 6} 372`} fill="none" stroke={i % 2 ? "#fbe2a4" : "#9a5718"} strokeOpacity=".5" strokeWidth="2.4" />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <path key={i} className="pt-flake" d={`M${150 + i * 90} ${250 - i * 4}Q${190 + i * 90} ${300} ${160 + i * 90} 360`} fill="none" stroke="#8c4f14" strokeOpacity=".28" strokeWidth="2" />
      ))}
      <path d="M104 384H496" stroke="#8f5314" strokeWidth="14" strokeDasharray="5 9" opacity=".55" />
      <ellipse cx="228" cy="252" rx="86" ry="22" fill="#fff" opacity=".24" transform="rotate(-26 228 252)" />
      <ellipse cx="400" cy="300" rx="40" ry="12" fill="#fff" opacity=".14" transform="rotate(30 400 300)" />
    </g>
  );
}
export function Patties(p: SceneProps) {
  const id = useId().replace(/:/g, "");
  const crumbs: [number, number, number][] = [[120, 468, 0], [170, 440, 40], [230, 478, 80], [372, 470, 20], [430, 446, 60], [492, 476, 100], [330, 490, 30], [78, 450, 70]];
  const ref = useScene((tl) => {
    tl.from(".pt-all", { x: 560, rotation: 120, scale: 0.6, opacity: 0, svgOrigin: "300 380", duration: 1.5, ease: "power3.out" }, 0);
    tl.to(".pt-all", { rotation: 6, svgOrigin: "300 380", duration: 1.8, ease: "sine.inOut" }, 1.5);
    tl.from(".pt-flake", { opacity: 0, duration: 0.8, stagger: 0.08 }, 1.7);
    tl.fromTo(".pt-l", { x: 44, rotation: 0, svgOrigin: "300 388" }, { x: 0, rotation: -13, svgOrigin: "300 388", duration: 1.0, ease: "power3.out" }, 3.4);
    tl.fromTo(".pt-r", { x: -44, rotation: 0, svgOrigin: "300 388" }, { x: 0, rotation: 13, svgOrigin: "300 388", duration: 1.0, ease: "power3.out" }, 3.4);
    tl.from(".pt-fill", { scale: 0.2, opacity: 0, svgOrigin: "300 380", duration: 0.9, ease: "back.out(1.5)" }, 3.6);
    tl.from(".pt-steam", { opacity: 0, y: 20, duration: 1.2, stagger: 0.3 }, 3.9);
    tl.from(".pt-crumb", { y: -260, opacity: 0, rotation: 180, duration: 1.0, ease: "bounce.out", stagger: 0.09 }, 3.5);
  }, p);
  return (
    <svg ref={ref} className="scene-svg" viewBox="-40 -40 680 680">
      <defs>
        <clipPath id={`${id}l`}><rect x="-200" y="0" width="500" height="700" /></clipPath>
        <clipPath id={`${id}r`}><rect x="300" y="0" width="500" height="700" /></clipPath>
      </defs>
      <ellipse cx="300" cy="448" rx="290" ry="74" fill="url(#gPlate)" />
      <ellipse cx="300" cy="448" rx="290" ry="74" fill="none" stroke="#d7cfc0" />
      <ellipse cx="300" cy="446" rx="226" ry="52" fill="none" stroke="#e1d9ca" />
      <g className="pt-all">
        <g data-ing="filling">
          <g className="pt-fill">
            <path d="M232 384C218 300 262 244 300 258C340 244 384 300 368 384Z" fill="#c8722a" />
            {[[270, 330, 28, "#a64f1a"], [326, 318, 30, "#e19a45"], [300, 362, 26, "#b8651f"], [262, 372, 16, "#e8a851"], [352, 366, 18, "#a64f1a"]].map(([x, y, r, c], i) => (
              <circle key={i} cx={x as number} cy={y as number} r={r as number} fill={c as string} />
            ))}
            {[[290, 300], [320, 340], [276, 352], [344, 308]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="7" fill="#6f9a3a" />
            ))}
          </g>
        </g>
        <g data-ing="pastry">
          <g transform="translate(-44 0)"><g className="pt-l" clipPath={`url(#${id}l)`}><PattyArt /></g></g>
          <g transform="translate(44 0)"><g className="pt-r" clipPath={`url(#${id}r)`}><PattyArt /></g></g>
        </g>
      </g>
      <g fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" className="steam-blur">
        {[270, 330].map((x) => (
          <path key={x} className="pt-steam" opacity=".4" d={`M${x} 230C${x - 18} 200 ${x + 18} 180 ${x} 140`} />
        ))}
      </g>
      <g data-ing="pastry">
        {crumbs.map(([x, y, r], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
            <path className="pt-crumb" d="M-7 -3L2 -7L8 0L0 6Z" fill="#d79a46" stroke="#a8601c" strokeWidth="1" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/* ═════════════════════════ PIZZA ═════════════════════════
   Base → sauce spreads → cheese covers → toppings fall →
   a slice lifts with stretching cheese → pizza rotates slightly. */
const WEDGE = "M300 300L403.5 -86.4L646.4 100Z";
const pep = [0, 60, 120, 180, 240, 300].map((a) => polar(300, 300, 125, a)).concat([30, 150, 270].map((a) => polar(300, 300, 52, a)));
const olv = [30, 90, 150, 210, 270, 330].map((a) => polar(300, 300, 182, a)).concat([[300, 228] as [number, number]]);
const bas = [polar(300, 300, 88, 0), polar(300, 300, 88, 120), polar(300, 300, 88, 240), polar(300, 300, 166, 120), polar(300, 300, 160, 345)];
const crustSpots = Array.from({ length: 22 }, (_, i) => polar(300, 300, 222 + (i % 3) * 5, i * (360 / 22) + (i % 2) * 5));
const strandPts: [number, number][] = [polar(300, 300, 85, -75), polar(300, 300, 145, -75), polar(300, 300, 205, -75), polar(300, 300, 110, -30), polar(300, 300, 175, -30)];
const SLICE = { x: 48, y: -62 };
const strandD = (s: number, [px, py]: [number, number]) => {
  const ex = px + SLICE.x * s, ey = py + SLICE.y * s;
  return `M${f1(px)} ${f1(py)}Q${f1((px + ex) / 2)} ${f1((py + ey) / 2 + 26 * s)} ${f1(ex)} ${f1(ey)}`;
};

function PizzaArt() {
  return (
    <g>
      <circle cx="300" cy="300" r="238" fill="url(#gDough)" />
      <circle cx="300" cy="300" r="238" fill="none" stroke="#a9692a" strokeOpacity=".5" strokeWidth="3" />
      <g data-ing="dough" fill="#8a4a16" opacity=".45">
        {crustSpots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3 + (i % 3)} />)}
      </g>
      <g data-ing="sauce"><circle className="pz-sauce" cx="300" cy="300" r="208" fill="url(#gSauce)" /></g>
      <g data-ing="cheese">
        <circle className="pz-cheese" cx="300" cy="300" r="198" fill="#f5d680" />
        {[...Array(14)].map((_, i) => {
          const [x, y] = polar(300, 300, 60 + (i % 4) * 36, i * 47);
          return <ellipse key={i} className="pz-cheese" cx={x} cy={y} rx="34" ry="22" fill={i % 2 ? "#fbe7a6" : "#e8b84c"} opacity=".55" transform={`rotate(${i * 31} ${x} ${y})`} />;
        })}
      </g>
      {pep.map(([x, y], i) => (
        <g key={i} transform={`translate(${f1(x)} ${f1(y)})`}>
          <g className="pz-top" data-ing="pepperoni">
            <circle r="29" fill="#b42a20" />
            <circle r="29" fill="none" stroke="#7d1810" strokeWidth="2" />
            {[[-10, -8], [8, -12], [12, 6], [-6, 11], [0, 0]].map(([a, b], k) => <circle key={k} cx={a} cy={b} r="3.2" fill="#8a1d14" />)}
            <ellipse cx="-9" cy="-14" rx="9" ry="4" fill="#fff" opacity=".2" />
          </g>
        </g>
      ))}
      {olv.map(([x, y], i) => (
        <g key={i} transform={`translate(${f1(x)} ${f1(y)})`}>
          <g className="pz-top" data-ing="olives">
            <circle r="11" fill="#2a2420" />
            <circle r="4.6" fill="#f5d680" />
          </g>
        </g>
      ))}
      {bas.map(([x, y], i) => (
        <g key={i} transform={`translate(${f1(x)} ${f1(y)}) rotate(${i * 67})`}>
          <g className="pz-top" data-ing="basil">
            <path d="M-20 0C-12 -22 12 -22 22 0C12 22 -12 22 -20 0Z" fill="#4c8a2a" />
            <path d="M-18 0H20" stroke="#8cc45a" strokeWidth="2" />
          </g>
        </g>
      ))}
    </g>
  );
}

export function Pizza(p: SceneProps) {
  const id = useId().replace(/:/g, "");
  const ref = useScene((tl, svg) => {
    const o = { s: 0 };
    const upd = () => {
      svg.querySelectorAll<SVGPathElement>(".pz-str").forEach((el, i) => {
        el.setAttribute("d", strandD(o.s, strandPts[i]));
        el.setAttribute("stroke-width", String(f1(6 - 3 * o.s)));
      });
    };
    tl.from(".pz-board", { scale: 0.7, opacity: 0, svgOrigin: "300 300", duration: 0.8, ease: "power3.out" }, 0);
    tl.from(".pz-base", { scale: 0.2, opacity: 0, rotation: -60, svgOrigin: "300 300", duration: 0.9, ease: "back.out(1.4)" }, 0.4);
    tl.from(".pz-sauce", { scale: 0, svgOrigin: "300 300", duration: 1.1, ease: "power2.out" }, 1.3);
    tl.from(".pz-cheese", { scale: 0.2, opacity: 0, svgOrigin: "300 300", duration: 1.0, ease: "power2.out", stagger: 0.02 }, 2.2);
    tl.from(".pz-top", { y: -180, opacity: 0, scale: 1.4, duration: 0.7, ease: "bounce.out", stagger: { each: 0.07, from: "random" } }, 3.1);
    tl.from(".pz-str", { opacity: 0, duration: 0.01 }, 5.0);
    tl.fromTo(o, { s: 0 }, { s: 1, duration: 1.5, ease: "power2.inOut", onUpdate: upd }, 5.0);
    tl.fromTo(".pz-slice", { x: 0, y: 0 }, { x: SLICE.x, y: SLICE.y, duration: 1.5, ease: "power2.inOut" }, 5.0);
    tl.fromTo(".pz-all", { rotation: -10, svgOrigin: "300 300" }, { rotation: 4, svgOrigin: "300 300", duration: 2.4, ease: "sine.inOut" }, 4.6);
    tl.fromTo(".pz-bake", { opacity: 0 }, { opacity: 0.34, duration: 1.3, ease: "sine.inOut" }, 4.3);
    tl.from(".pz-brown", { opacity: 0, scale: 0.4, duration: 0.7, stagger: { each: 0.06, from: "random" }, svgOrigin: "300 300" }, 4.5);
  }, p);

  return (
    <svg ref={ref} className="scene-svg" viewBox="-40 -40 680 680">
      <defs>
        <radialGradient id={`${id}bake`} cx="0.42" cy="0.34" r="0.78">
          <stop offset="0" stopColor="#ffcf7d" />
          <stop offset="0.55" stopColor="#ef9440" />
          <stop offset="1" stopColor="#a24c14" />
        </radialGradient>
        <clipPath id={`${id}m`} clipRule="evenodd">
          <path clipRule="evenodd" d={`M-300 -300H900V900H-300Z${WEDGE}`} />
        </clipPath>
        <clipPath id={`${id}w`}><path d={WEDGE} /></clipPath>
      </defs>
      <circle className="pz-board" cx="300" cy="300" r="286" fill="url(#gWood)" />
      <circle className="pz-board" cx="300" cy="300" r="270" fill="none" stroke="#8a6238" strokeOpacity=".4" strokeWidth="2" />
      <g className="pz-all">
        <g className="pz-base" filter="url(#fDrop)">
          <g clipPath={`url(#${id}m)`}><PizzaArt /></g>
        </g>
        <g data-ing="cheese" fill="none" stroke="#f3cf6a" strokeLinecap="round">
          {strandPts.map((pt, i) => (
            <path key={i} className="pz-str" d={strandD(1, pt)} strokeWidth="3" />
          ))}
        </g>
        <g className="pz-slice" transform={`translate(${SLICE.x} ${SLICE.y})`}>
          <g clipPath={`url(#${id}w)`}><PizzaArt /></g>
        </g>
        <g data-ing="cheese">
          {Array.from({ length: 12 }, (_, i) => {
            const [x, y] = polar(300, 300, 55 + ((i * 53) % 130), i * 67);
            return <ellipse key={i} className="pz-brown" cx={f1(x)} cy={f1(y)} rx={7 + (i % 3) * 3} ry={5 + (i % 2) * 2} fill="#c97b2c" opacity=".45" transform={`rotate(${i * 41} ${f1(x)} ${f1(y)})`} />;
          })}
        </g>
        <circle className="pz-bake" cx="300" cy="300" r="236" fill={`url(#${id}bake)`} opacity="0" style={{ mixBlendMode: "soft-light" }} pointerEvents="none" />
      </g>
    </svg>
  );
}
