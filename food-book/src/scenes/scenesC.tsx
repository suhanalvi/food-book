import { useId } from "react";
import gsap from "gsap";
import { f1, rng, useScene, type SceneProps } from "./common";

const VB = "-40 -40 680 680";

/* ═════════════════════════ SANDWICH ═════════════════════════
   Bread slides in → fillings drop layer by layer → a knife cuts on the diagonal →
   halves part → toothpicks are dropped in. */
function SandwichStack() {
  return (
    <g>
      <g data-ing="bread">
        <rect className="s-bb" x="140" y="402" width="320" height="52" rx="18" fill="url(#gBread)" stroke="#8a5416" strokeWidth="3" />
      </g>
      <g data-ing="lettuce">
        <path className="s-let" d="M128 406Q140 376 160 392Q176 368 196 390Q214 366 236 388Q256 368 276 390Q296 366 316 388Q336 368 356 390Q376 366 396 388Q416 370 436 390Q454 376 472 406Z" fill="url(#gLettuce)" stroke="#4a8222" strokeWidth="1.5" strokeLinejoin="round" />
      </g>
      <g data-ing="tomato" className="s-tom">
        <rect x="138" y="372" width="324" height="16" rx="8" fill="url(#gTomato)" />
        {[170, 230, 300, 370, 430].map((x) => <circle key={x} cx={x} cy="380" r="2.6" fill="#ffd8a0" opacity=".8" />)}
      </g>
      <g data-ing="cheese">
        <path className="s-che" d="M124 358L476 358L470 374L130 374Z" fill="url(#gCheese)" />
      </g>
      <g data-ing="cucumber" className="s-cuc">
        <rect x="140" y="342" width="320" height="18" rx="9" fill="#a9d07e" stroke="#6d9f3f" strokeWidth="2.5" />
        {[170, 214, 258, 302, 346, 390, 430].map((x) => <circle key={x} cx={x} cy="351" r="3" fill="#d8ecb4" />)}
      </g>
      <g data-ing="bread">
        <g className="s-bt">
          <path d="M140 342Q140 288 190 286L410 286Q460 288 460 342Z" fill="url(#gBread)" stroke="#8a5416" strokeWidth="3" />
          {[190, 250, 310, 370].map((x) => <path key={x} d={`M${x} 296L${x + 36} 334`} stroke="#6b3a10" strokeWidth="6" strokeLinecap="round" opacity=".5" />)}
          <path d="M160 298Q300 280 440 298" stroke="#fff" strokeOpacity=".28" strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
      </g>
    </g>
  );
}
function Pick({ x, c }: { x: number; c: string }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <g className="s-pick">
        <line x1="0" y1="226" x2="0" y2="350" stroke="#e7c98f" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M0 226L22 218L16 236Z" fill={c} />
      </g>
    </g>
  );
}

export function Sandwich(p: SceneProps) {
  const id = useId().replace(/:/g, "");
  const ref = useScene((tl) => {
    tl.from(".s-plate", { opacity: 0, scale: 0.8, svgOrigin: "300 480", duration: 0.7 }, 0);
    tl.from(".s-bb", { x: -560, opacity: 0, duration: 0.9, ease: "power3.out" }, 0.3);
    tl.from(".s-let", { y: -420, opacity: 0, duration: 0.8, ease: "bounce.out" }, 1.0);
    tl.from(".s-tom", { y: -420, opacity: 0, duration: 0.7, ease: "bounce.out" }, 1.5);
    tl.from(".s-che", { y: -420, opacity: 0, duration: 0.7, ease: "bounce.out" }, 1.95);
    tl.from(".s-cuc", { y: -420, opacity: 0, duration: 0.7, ease: "bounce.out" }, 2.4);
    tl.from(".s-bt", { y: -520, opacity: 0, duration: 0.9, ease: "bounce.out" }, 2.85);
    tl.fromTo(".s-knife", { y: -420, opacity: 1 }, { y: 0, duration: 0.7, ease: "power2.in" }, 4.1);
    tl.to(".s-knife", { y: -440, opacity: 0, duration: 0.6, ease: "power2.out" }, 5.0);
    tl.fromTo(".s-hl", { x: 34, rotation: 0, svgOrigin: "300 454" }, { x: 0, rotation: -3, svgOrigin: "300 454", duration: 0.9, ease: "power3.out" }, 4.9);
    tl.fromTo(".s-hr", { x: -34, rotation: 0, svgOrigin: "300 454" }, { x: 0, rotation: 3, svgOrigin: "300 454", duration: 0.9, ease: "power3.out" }, 4.9);
    tl.from(".s-pick", { y: -380, opacity: 0, rotation: 20, duration: 0.7, ease: "bounce.out", stagger: 0.2 }, 5.8);
  }, p);

  return (
    <svg ref={ref} className="scene-svg" viewBox={VB}>
      <defs>
        <clipPath id={`${id}l`}><path d="M-100 -100L330 -100L270 700L-100 700Z" /></clipPath>
        <clipPath id={`${id}r`}><path d="M330 -100L800 -100L800 700L270 700Z" /></clipPath>
      </defs>
      <g className="s-plate">
        <ellipse cx="300" cy="486" rx="290" ry="62" fill="url(#gPlate)" />
        <ellipse cx="300" cy="486" rx="290" ry="62" fill="none" stroke="#d7cfc0" />
      </g>
      <ellipse cx="300" cy="462" rx="190" ry="20" fill="url(#gShadow)" />
      <g transform="translate(0 12)">
        <g transform="translate(-34 0)">
          <g className="s-hl">
            <g clipPath={`url(#${id}l)`}><SandwichStack /></g>
            <Pick x={212} c="#d9382c" />
          </g>
        </g>
        <g transform="translate(34 0)">
          <g className="s-hr">
            <g clipPath={`url(#${id}r)`}><SandwichStack /></g>
            <Pick x={392} c="#4c8a2a" />
          </g>
        </g>
        <g transform="translate(295 370) rotate(4.3)">
          <g className="s-knife" opacity="0">
            <path d="M-7 -110L7 -110L7 86L-7 100Z" fill="url(#gSteel)" stroke="#8d8880" strokeWidth="1" />
            <rect x="-9" y="-196" width="18" height="86" rx="8" fill="#2d211c" />
            <circle cx="0" cy="-170" r="2.5" fill="#b8a898" />
          </g>
        </g>
      </g>
    </svg>
  );
}

/* ═════════════════════════ FRENCH FRIES ═════════════════════════
   Carton rises → fries burst up in a fan → salt rains down → ketchup dollop lands. */
const fries = Array.from({ length: 26 }, (_, i) => {
  const r = rng(i * 7 + 3);
  const x = 192 + (i / 25) * 216;
  return { x: f1(x), a: f1((x - 300) * 0.16 + (r() - 0.5) * 8), h: Math.round(210 + r() * 90 - Math.abs(x - 300) * 0.35), w: 15 + Math.round(r() * 3) };
});
const salt = (() => {
  const r = rng(21);
  return Array.from({ length: 40 }, () => ({ x: f1(185 + r() * 230), y: f1(120 + r() * 200), s: f1(1.6 + r() * 1.8) }));
})();

export function Fries(p: SceneProps) {
  const id = useId().replace(/:/g, "");
  const ref = useScene((tl) => {
    tl.from(".f-shadow", { opacity: 0, duration: 0.6 }, 0);
    tl.from(".f-carton", { y: 360, opacity: 0, duration: 1.0, ease: "power3.out" }, 0.1);
    tl.from(".f-fry", { y: 330, duration: 0.9, ease: "back.out(1.5)", stagger: { each: 0.045, from: "random" } }, 1.1);
    tl.from(".f-salt", { y: -480, opacity: 0, duration: 1.1, ease: "power1.in", stagger: { each: 0.03, from: "random" } }, 2.9);
    tl.from(".f-bowl", { x: -260, opacity: 0, duration: 0.8, ease: "power3.out" }, 3.6);
    tl.from(".f-ketchup", { scale: 0, svgOrigin: "108 506", duration: 0.9, ease: "elastic.out(1,0.5)" }, 4.3);
    tl.fromTo(".f-steam", { opacity: 0, y: 10 }, { opacity: 0.5, y: -44, duration: 2.6, stagger: 0.6, repeat: -1, ease: "sine.inOut" }, 4.2);
  }, p);

  return (
    <svg ref={ref} className="scene-svg" viewBox={VB}>
      <defs>
        <clipPath id={`${id}c`}><rect x="-100" y="-300" width="900" height="798" /></clipPath>
      </defs>
      <ellipse className="f-shadow" cx="300" cy="512" rx="270" ry="34" fill="url(#gShadow)" />
      <g className="f-carton">
        <path d="M178 330L422 330L404 496L196 496Z" fill="#8f1a12" />
        <g clipPath={`url(#${id}c)`} data-ing="potato">
          {fries.map((f, i) => (
            <g key={i} transform={`translate(${f.x} 420) rotate(${f.a})`}>
              <g className="f-fry">
                <rect x={-f.w / 2} y={-f.h} width={f.w} height={f.h + 40} rx="3" fill="url(#gFry)" />
                <rect x={-f.w / 2 + 2} y={-f.h + 2} width="2.5" height={f.h} fill="#fff" opacity=".35" />
              </g>
            </g>
          ))}
        </g>
        <g data-ing="salt" fill="#fff">
          {salt.map((s, i) => <circle key={i} className="f-salt" cx={s.x} cy={s.y} r={s.s} opacity=".95" />)}
        </g>
        <path d="M168 330L432 330L408 500L192 500Z" fill="url(#gCarton)" />
        <path d="M168 330L432 330L428 352L172 352Z" fill="#fff" opacity=".18" />
        <path d="M180 410L420 410L414 452L186 452Z" fill="#fff" opacity=".92" />
        <path d="M200 431Q250 414 300 431T400 431" stroke="#e03a2e" strokeWidth="6" fill="none" strokeLinecap="round" />
      </g>
      <g data-ing="ketchup">
        <g className="f-bowl">
          <ellipse cx="108" cy="516" rx="76" ry="18" fill="url(#gShadow)" />
          <path d="M44 498Q108 548 172 498Z" fill="url(#gPlate)" stroke="#d3cbbb" />
          <ellipse cx="108" cy="498" rx="64" ry="14" fill="#f4efe6" stroke="#d3cbbb" />
        </g>
        <g className="f-ketchup">
          <path d="M60 498Q60 470 108 466Q156 470 156 498Q108 514 60 498Z" fill="#c4261b" />
          <ellipse cx="96" cy="482" rx="18" ry="5" fill="#fff" opacity=".35" />
        </g>
      </g>
      <g fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" className="steam-blur">
        {[240, 300, 360].map((x) => <path key={x} className="f-steam" style={{ opacity: 0.3 }} d={`M${x} 140C${x - 20} 110 ${x + 20} 90 ${x} 50`} />)}
      </g>
    </svg>
  );
}

/* ═════════════════════════ TEA ═════════════════════════
   Glass appears → dry leaves fall in → hot water pours → leaves unfurl & the colour blooms →
   a lemon slice lands on the rim → steam. */
const TG = "M196 232L404 232L388 440Q300 466 212 440Z";
const TG_IN = "M205 240L395 240L381 432Q300 456 219 432Z";
const leaves = [[250, 330, 30], [300, 300, -40], [340, 350, 70], [270, 390, -10], [330, 405, 50], [230, 370, 110], [372, 320, -60], [300, 360, 15]];

export function Tea(p: SceneProps) {
  const id = useId().replace(/:/g, "");
  const ref = useScene((tl) => {
    tl.from(".t-glass", { y: 70, opacity: 0, duration: 0.9, ease: "power3.out" }, 0);
    tl.from(".t-leaf", { y: -520, opacity: 0, rotation: () => gsap.utils.random(-240, 240), scale: 0.6, duration: 1.2, ease: "power1.in", stagger: 0.1 }, 0.9);
    tl.fromTo(".t-stream", { attr: { height: 0 } }, { attr: { height: 400 }, duration: 0.4, ease: "power1.in" }, 2.5);
    tl.from(".t-water", { scaleY: 0, svgOrigin: "300 460", duration: 1.8, ease: "power1.inOut" }, 2.8);
    tl.to(".t-stream", { attr: { y: 280, height: 0 }, duration: 0.4 }, 4.4);
    tl.from(".t-deep", { opacity: 0, duration: 2.4, ease: "sine.inOut" }, 4.0);
    tl.from(".t-plume", { scale: 0, opacity: 0, svgOrigin: "300 340", duration: 1.6, ease: "power2.out", stagger: 0.25 }, 4.0);
    tl.from(".t-lemon", { y: -480, rotation: 160, opacity: 0, duration: 1.0, ease: "bounce.out" }, 5.6);
    tl.fromTo(".t-steam", { opacity: 0, y: 14 }, { opacity: 0.55, y: -46, duration: 2.6, stagger: 0.5, repeat: -1, ease: "sine.inOut" }, 5.4);
  }, p);

  return (
    <svg ref={ref} className="scene-svg" viewBox={VB}>
      <defs>
        <clipPath id={`${id}g`}><path d={TG_IN} /></clipPath>
      </defs>
      <ellipse cx="300" cy="490" rx="260" ry="34" fill="url(#gShadow)" />
      <g className="t-glass">
        <ellipse cx="300" cy="462" rx="236" ry="38" fill="url(#gPlate)" />
        <ellipse cx="300" cy="458" rx="176" ry="26" fill="#e6dece" stroke="#fff" strokeOpacity=".7" />
        <path d="M398 266C482 258 478 390 384 398" stroke="#fff" strokeOpacity=".55" strokeWidth="14" fill="none" strokeLinecap="round" />
        <path d="M398 266C482 258 478 390 384 398" stroke="#cfd8d6" strokeOpacity=".5" strokeWidth="2" fill="none" />
        <path d={TG} fill="#fff" fillOpacity=".1" />
        <g clipPath={`url(#${id}g)`}>
          <g data-ing="water">
            <rect className="t-water" x="190" y="268" width="220" height="210" fill="url(#gTea)" opacity=".82" />
            <rect className="t-deep" x="190" y="268" width="220" height="210" fill="#6a3208" opacity=".38" />
          </g>
          <g data-ing="leaves" fill="#4a3a1a" opacity=".9">
            {leaves.map(([x, y, r], i) => (
              <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
                <g className="t-leaf">
                  <path d="M-16 0C-8 -10 8 -10 16 0C8 10 -8 10 -16 0Z" fill="#4f3e1c" />
                  <path d="M-14 0H14" stroke="#8b7a45" strokeWidth="1.4" />
                </g>
              </g>
            ))}
          </g>
          <g data-ing="water" fill="#7a3a0b" opacity=".35">
            {[[300, 340, 56], [262, 372, 40], [338, 378, 44]].map(([x, y, r], i) => (
              <circle key={i} className="t-plume" cx={x} cy={y} r={r} />
            ))}
          </g>
        </g>
        <path d={TG} fill="url(#gGlass)" stroke="#fff" strokeOpacity=".7" strokeWidth="2.5" />
        <ellipse cx="300" cy="232" rx="104" ry="10" fill="none" stroke="#fff" strokeOpacity=".85" strokeWidth="3" />
      </g>
      <rect className="t-stream" x="293" y="-120" width="14" height="0" rx="7" fill="#f1e2bf" opacity=".85" />
      <g transform="translate(398 222)" data-ing="lemon">
        <g className="t-lemon">
          <circle r="42" fill="#f3d03e" />
          <circle r="37" fill="#fff0a8" />
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return <path key={i} d={`M0 0L${f1(32 * Math.cos(a - 0.3))} ${f1(32 * Math.sin(a - 0.3))}A32 32 0 0 1 ${f1(32 * Math.cos(a + 0.3))} ${f1(32 * Math.sin(a + 0.3))}Z`} fill="#fbe36b" stroke="#fff6c8" strokeWidth="1.5" />;
          })}
        </g>
      </g>
      <g fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" className="steam-blur">
        {[250, 300, 350].map((x) => <path key={x} className="t-steam" style={{ opacity: 0.3 }} d={`M${x} 200C${x - 22} 165 ${x + 22} 140 ${x} 96`} />)}
      </g>
    </svg>
  );
}

/* ═════════════════════════ COLD COFFEE ═════════════════════════
   Tall glass → ice cubes tumble in → cold milk fills → coffee cascades through in layers →
   straw & cocoa dust → condensation beads form. */
const CG = "M212 130L388 130L374 490Q300 508 226 490Z";
const CG_IN = "M221 138L379 138L366 482Q300 498 234 482Z";
const cubes: [number, number, number][] = [[262, 230, -12], [336, 218, 14], [292, 296, 8], [346, 316, -18], [258, 352, 20]];
const cocoa = (() => {
  const r = rng(9);
  return Array.from({ length: 18 }, () => ({ x: f1(240 + r() * 120), y: f1(150 + r() * 40), s: f1(1.6 + r() * 1.6) }));
})();
const drops: [number, number, number][] = [[236, 300, 5], [358, 262, 4], [248, 410, 6], [352, 380, 4.5], [366, 440, 3.5], [240, 220, 3.5]];

export function ColdCoffee(p: SceneProps) {
  const id = useId().replace(/:/g, "");
  const ref = useScene((tl) => {
    tl.from(".cc-glass", { y: 70, opacity: 0, duration: 0.9, ease: "power3.out" }, 0);
    tl.from(".cc-cube", { y: -560, rotation: () => gsap.utils.random(-120, 120), opacity: 0, duration: 0.9, ease: "bounce.out", stagger: 0.2 }, 0.9);
    tl.from(".cc-milk", { scaleY: 0, svgOrigin: "300 500", duration: 1.5, ease: "power1.inOut" }, 2.2);
    tl.from(".cc-coffee", { opacity: 0, duration: 1.2 }, 3.6);
    tl.from(".cc-tendril", { scaleY: 0, transformOrigin: "50% 0%", duration: 2.0, ease: "power2.out", stagger: 0.18 }, 3.6);
    tl.from(".cc-straw", { y: -480, opacity: 0, duration: 0.8, ease: "power2.out" }, 5.2);
    tl.from(".cc-cocoa", { y: -360, opacity: 0, duration: 0.8, ease: "power1.in", stagger: { each: 0.03, from: "random" } }, 5.6);
    tl.from(".cc-drop", { scale: 0, opacity: 0, duration: 0.6, ease: "back.out(2)", stagger: 0.15 }, 6.2);
  }, p);

  return (
    <svg ref={ref} className="scene-svg" viewBox={VB}>
      <defs>
        <clipPath id={`${id}g`}><path d={CG_IN} /></clipPath>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#35190b" stopOpacity=".96" />
          <stop offset=".55" stopColor="#6a3d27" stopOpacity=".85" />
          <stop offset="1" stopColor="#b98a5c" stopOpacity="0" />
        </linearGradient>
      </defs>
      <ellipse cx="300" cy="506" rx="200" ry="26" fill="url(#gShadow)" opacity=".8" />
      <g className="cc-glass">
        <path d={CG} fill="#fff" fillOpacity=".08" />
        <g clipPath={`url(#${id}g)`}>
          <g data-ing="milk"><rect className="cc-milk" x="200" y="214" width="200" height="300" fill="#efdcc0" /></g>
          <g data-ing="coffee">
            <rect className="cc-coffee" x="200" y="214" width="200" height="140" fill={`url(#${id}f)`} />
            {[[250, 46, 130], [292, 40, 190], [336, 44, 150], [270, 30, 230], [318, 34, 250]].map(([x, w, h], i) => (
              <rect key={i} className="cc-tendril" x={x - w / 2} y="214" width={w} height={h} rx={w / 2} fill="#3d2010" opacity=".75" />
            ))}
          </g>
        </g>
        <g data-ing="ice">
          {cubes.map(([x, y, r], i) => (
            <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
              <g className="cc-cube">
                <rect x="-30" y="-30" width="60" height="60" rx="10" fill="#fff" fillOpacity=".26" stroke="#fff" strokeOpacity=".75" strokeWidth="2" />
                <rect x="-22" y="-22" width="22" height="22" rx="6" fill="#fff" fillOpacity=".32" />
                <path d="M10 18L24 4" stroke="#fff" strokeOpacity=".6" strokeWidth="2" strokeLinecap="round" />
              </g>
            </g>
          ))}
        </g>
        <g className="cc-straw">
          <line x1="352" y1="40" x2="318" y2="470" stroke="#efe6d6" strokeWidth="12" strokeLinecap="round" />
          <line x1="352" y1="40" x2="318" y2="470" stroke="#b66a4b" strokeWidth="12" strokeDasharray="12 16" />
        </g>
        <g data-ing="cocoa" fill="#c68a58">
          {cocoa.map((c, i) => <circle key={i} className="cc-cocoa" cx={c.x} cy={c.y} r={c.s} />)}
        </g>
        <path d={CG} fill="url(#gGlass)" stroke="#fff" strokeOpacity=".7" strokeWidth="2.5" />
        <g fill="#fff" fillOpacity=".5">
          {drops.map(([x, y, r], i) => <ellipse key={i} className="cc-drop" cx={x} cy={y} rx={r} ry={r * 1.4} />)}
        </g>
        <ellipse cx="300" cy="130" rx="88" ry="9" fill="none" stroke="#fff" strokeOpacity=".85" strokeWidth="3" />
      </g>
    </svg>
  );
}
