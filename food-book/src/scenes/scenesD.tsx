import { useId } from "react";
import { f1, polar, rng, useScene, type SceneProps } from "./common";

const VB = "-40 -40 680 680";

function wobble(r0: number, amp: number, seed: number, n = 90) {
  let d = "";
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    const r = r0 + amp * Math.sin(a * 5 + seed) + amp * 0.5 * Math.sin(a * 9 + seed * 1.7);
    d += `${i ? "L" : "M"}${f1(r * Math.cos(a))} ${f1(r * Math.sin(a))}`;
  }
  return d + "Z";
}

/* ═════════════════════════ COOKIES ═════════════════════════
   Raw dough rounds drop onto the plate → chocolate chips pop in → the cookies bake
   (pale dough turns golden) → crumbs fall. */
const cookieSpots: [number, number, number][] = [[205, 232, 1], [398, 262, 2], [292, 410, 3]];
const chipsFor = (seed: number) => {
  const r = rng(seed * 13);
  return Array.from({ length: 10 }, () => {
    const [x, y] = polar(0, 0, Math.sqrt(r()) * 66, r() * 360);
    return { x: f1(x), y: f1(y), rot: Math.round(r() * 180), s: 0.8 + r() * 0.7 };
  });
};
const cookieCrumbs: [number, number][] = [[120, 380], [96, 430], [500, 420], [470, 500], [180, 520], [400, 520], [540, 330], [70, 300]];

export function Cookies(p: SceneProps) {
  const ref = useScene((tl) => {
    tl.from(".ck-plate", { opacity: 0, scale: 0.8, svgOrigin: "300 300", duration: 0.8, ease: "power3.out" }, 0);
    tl.from(".ck-c", { y: -560, opacity: 0, duration: 0.8, ease: "bounce.out", stagger: 0.28 }, 0.6);
    tl.from(".ck-chip", { scale: 0, y: -50, opacity: 0, duration: 0.45, ease: "back.out(2.4)", stagger: { each: 0.04, from: "random" } }, 2.0);
    tl.from(".ck-raw", { opacity: 1, duration: 2.0, ease: "sine.inOut" }, 3.2);
    tl.fromTo(".ck-body", { scale: 0.88 }, { scale: 1, duration: 2.0, ease: "power2.out" }, 3.2);
    tl.from(".ck-shine", { opacity: 0, duration: 1.0 }, 5.0);
    tl.from(".ck-crumb", { y: -500, opacity: 0, rotation: 200, duration: 0.9, ease: "bounce.out", stagger: 0.09 }, 4.4);
  }, p);

  return (
    <svg ref={ref} className="scene-svg" viewBox={VB}>
      <g className="ck-plate">
        <circle cx="300" cy="316" r="290" fill="url(#gShadow)" />
        <circle cx="300" cy="300" r="282" fill="url(#gPlate)" stroke="#d7cfc0" />
        <circle cx="300" cy="300" r="214" fill="none" stroke="#e0d8c9" strokeWidth="2" />
      </g>
      {cookieSpots.map(([x, y, s]) => (
        <g key={s} transform={`translate(${x} ${y})`}>
          <g className="ck-c">
            <path d={wobble(98, 4, s)} transform="translate(5 10)" fill="#2a160a" opacity=".3" />
            <g className="ck-body">
              <g data-ing="dough">
                <path d={wobble(96, 4, s)} fill="url(#gCookie)" />
                <path className="ck-raw" d={wobble(96, 4, s)} fill="#f3dfb0" opacity="0" />
                <path d={wobble(96, 4, s)} fill="none" stroke="#8a5420" strokeOpacity=".35" strokeWidth="3" />
                <path className="ck-shine" d="M-60 -40Q-30 -78 20 -78" stroke="#fff" strokeOpacity=".28" strokeWidth="7" strokeLinecap="round" fill="none" />
              </g>
              <g data-ing="chips">
                {chipsFor(s).map((c, i) => (
                  <g key={i} transform={`translate(${c.x} ${c.y}) rotate(${c.rot}) scale(${c.s})`}>
                    <g className="ck-chip">
                      <path d="M-11 -5L-2 -11L10 -6L11 4L1 10L-9 7Z" fill="#35190d" />
                      <path d="M-8 -4L-1 -8L5 -5" stroke="#8a5a3c" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                    </g>
                  </g>
                ))}
              </g>
            </g>
          </g>
        </g>
      ))}
      <g data-ing="dough" fill="#c68a45">
        {cookieCrumbs.map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${i * 40})`}>
            <path className="ck-crumb" d="M-7 -3L3 -7L8 1L-1 6Z" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/* ═════════════════════════ BROWNIES ═════════════════════════
   Batter pours into a tin → bakes & cracks → cut into squares that part →
   walnuts drop → sugar dusts → chocolate sauce is drizzled. */
const bpieces: [number, number][] = [[-100, -100], [100, -100], [-100, 100], [100, 100]];
const crackles = (seed: number) => {
  const r = rng(seed * 17);
  return Array.from({ length: 4 }, () => {
    const x = (r() - 0.5) * 130, y = (r() - 0.5) * 130;
    return `M${f1(x)} ${f1(y)}l${f1((r() - 0.5) * 50)} ${f1((r() - 0.5) * 50)}l${f1((r() - 0.5) * 40)} ${f1((r() - 0.5) * 40)}`;
  });
};
const sugar = (() => {
  const r = rng(77);
  return Array.from({ length: 70 }, () => {
    const px = bpieces[Math.floor(r() * 4)];
    return { x: f1(300 + px[0] + (r() - 0.5) * 150), y: f1(300 + px[1] + (r() - 0.5) * 150), s: f1(1.3 + r() * 1.7) };
  });
})();
const nuts: [number, number, number][] = [[-72, -84, 20], [128, -118, -30], [-124, 120, 50], [74, 84, 10], [-60, 90, -20], [110, -66, 80]];

export function Brownies(p: SceneProps) {
  const ref = useScene((tl) => {
    tl.from(".br-plate", { opacity: 0, scale: 0.8, svgOrigin: "300 300", duration: 0.8, ease: "power3.out" }, 0);
    tl.fromTo(".br-tin", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, svgOrigin: "300 300", duration: 0.7, ease: "power3.out" }, 0.4);
    tl.fromTo(".br-pour", { attr: { height: 0 } }, { attr: { height: 380 }, duration: 0.4, ease: "power1.in" }, 1.1);
    tl.fromTo(".br-batter", { scale: 0, opacity: 1 }, { scale: 1, opacity: 1, svgOrigin: "300 300", duration: 1.5, ease: "power2.out" }, 1.4);
    tl.to(".br-pour", { attr: { y: 300, height: 0 }, duration: 0.4 }, 2.3);
    tl.from(".br-crack", { strokeDashoffset: 1, opacity: 0, duration: 1.0, stagger: 0.05 }, 3.0);
    tl.fromTo(".br-cut", { strokeDashoffset: 1, opacity: 1 }, { strokeDashoffset: 0, duration: 0.7, stagger: 0.25, ease: "power1.inOut" }, 4.0);
    tl.to(".br-batter", { opacity: 0, duration: 0.01 }, 4.95);
    tl.to(".br-cut", { opacity: 0, duration: 0.2 }, 4.95);
    tl.from(".br-p", { opacity: 0, x: (i: number) => (i % 2 ? -14 : 14), y: (i: number) => (i < 2 ? 14 : -14), duration: 0.8, ease: "power3.out" }, 4.95);
    tl.to(".br-tin", { opacity: 0, duration: 0.6 }, 5.2);
    tl.from(".br-nut", { y: -460, opacity: 0, rotation: 160, duration: 0.8, ease: "bounce.out", stagger: 0.12 }, 5.8);
    tl.from(".br-sugar", { y: -420, opacity: 0, duration: 0.9, ease: "power1.in", stagger: { each: 0.015, from: "random" } }, 6.5);
    tl.fromTo(".br-sauce", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, ease: "power1.inOut", stagger: 0.25 }, 7.1);
  }, p);

  return (
    <svg ref={ref} className="scene-svg" viewBox={VB}>
      <g className="br-plate">
        <circle cx="300" cy="316" r="292" fill="url(#gShadow)" />
        <circle cx="300" cy="300" r="284" fill="url(#gPlate)" stroke="#d7cfc0" />
        <circle cx="300" cy="300" r="222" fill="none" stroke="#e0d8c9" strokeWidth="2" />
      </g>
      <g className="br-tin" opacity="0">
        <rect x="104" y="104" width="392" height="392" rx="22" fill="#5d5750" />
        <rect x="116" y="116" width="368" height="368" rx="14" fill="#3b3732" />
      </g>
      <g data-ing="chocolate">
        <rect className="br-batter" x="124" y="124" width="352" height="352" rx="14" fill="url(#gBrownie)" opacity="0" />
        {bpieces.map(([x, y], i) => (
          <g key={i} transform={`translate(${300 + x} ${300 + y})`}>
            <g className="br-p">
              <rect x="-88" y="-66" width="176" height="176" rx="18" fill="#1b0b04" />
              <rect x="-88" y="-88" width="176" height="176" rx="18" fill="url(#gBrownie)" />
              <rect x="-88" y="-88" width="176" height="176" rx="18" fill="none" stroke="#8a5a40" strokeOpacity=".35" strokeWidth="2" />
              <path d="M-70 -70L50 -74" stroke="#fff" strokeOpacity=".16" strokeWidth="6" strokeLinecap="round" />
              <g fill="none" stroke="#8a5a40" strokeOpacity=".55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {crackles(i + 1).map((d, k) => <path key={k} className="br-crack" d={d} pathLength={1} strokeDasharray="1" strokeDashoffset="0" />)}
              </g>
            </g>
          </g>
        ))}
        <g fill="none" stroke="#c9a88f" strokeWidth="3" strokeLinecap="round">
          <path className="br-cut" d="M120 300H480" pathLength={1} strokeDasharray="1" strokeDashoffset="1" opacity="0" />
          <path className="br-cut" d="M300 120V480" pathLength={1} strokeDasharray="1" strokeDashoffset="1" opacity="0" />
        </g>
      </g>
      <rect className="br-pour" x="292" y="-100" width="16" height="0" rx="8" fill="#3a1d0f" />
      <g data-ing="walnut">
        {nuts.map(([x, y, r], i) => (
          <g key={i} transform={`translate(${300 + x} ${300 + y}) rotate(${r})`}>
            <g className="br-nut">
              <path d="M-22 -4C-24 -22 -6 -26 4 -18C16 -26 28 -12 22 2C28 16 10 24 0 16C-12 24 -28 14 -22 -4Z" fill="#b98550" stroke="#7a5128" strokeWidth="2" />
              <path d="M-10 -8C-2 -2 -2 6 -8 10M6 -10C10 -2 10 4 6 10" stroke="#7a5128" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            </g>
          </g>
        ))}
      </g>
      <g data-ing="sugar" fill="#fffaf0">
        {sugar.map((s, i) => <circle key={i} className="br-sugar" cx={s.x} cy={s.y} r={s.s} opacity=".9" />)}
      </g>
      <g data-ing="sauce" fill="none" strokeLinecap="round" stroke="#4b2212" strokeWidth="7">
        <path className="br-sauce" d="M140 190Q220 150 300 196T460 170" pathLength={1} strokeDasharray="1" strokeDashoffset="0" />
        <path className="br-sauce" d="M140 316Q220 276 300 322T460 296" pathLength={1} strokeDasharray="1" strokeDashoffset="0" />
        <path className="br-sauce" d="M140 442Q220 402 300 448T460 422" pathLength={1} strokeDasharray="1" strokeDashoffset="0" />
      </g>
    </svg>
  );
}

/* ═════════════════════════ ICE CREAM ═════════════════════════
   Waffle cone rolls in → three scoops drop and squish → drips run down →
   chocolate sauce is poured → a cherry lands on top. */
const scoops = [
  { cls: "i-s1", cx: 300, cy: 300, r: 100, fill: "url(#gVanilla)", ing: "vanilla", spot: "#d4bb78" },
  { cls: "i-s2", cx: 300, cy: 204, r: 90, fill: "url(#gStraw)", ing: "strawberry", spot: "#d9486c" },
  { cls: "i-s3", cx: 300, cy: 124, r: 78, fill: "url(#gChocScoop)", ing: "chocolate", spot: "#2e150a" },
];
const ruffle = (cx: number, cy: number, r: number) =>
  Array.from({ length: 7 }, (_, i) => cx - r * 0.84 + (i * (r * 1.68)) / 6).map((x) => [x, cy + r * 0.72] as [number, number]);

export function IceCream(p: SceneProps) {
  const id = useId().replace(/:/g, "");
  const ref = useScene((tl) => {
    tl.from(".i-shadow", { opacity: 0, duration: 0.8 }, 0);
    tl.from(".i-cone", { x: 560, rotation: 80, opacity: 0, svgOrigin: "300 460", duration: 1.3, ease: "power3.out" }, 0.1);
    scoops.forEach((s, i) => {
      const t = 1.4 + i * 0.85;
      tl.from(`.${s.cls}`, { y: -640, opacity: 0, duration: 0.55, ease: "power2.in" }, t);
      tl.fromTo(`.${s.cls}`, { scaleX: 1, scaleY: 1, svgOrigin: `300 ${s.cy + s.r * 0.8}` }, { scaleX: 1.07, scaleY: 0.9, svgOrigin: `300 ${s.cy + s.r * 0.8}`, duration: 0.14, yoyo: true, repeat: 1, ease: "sine.inOut" }, t + 0.55);
    });
    tl.from(".i-drip", { scaleY: 0, transformOrigin: "50% 0%", duration: 1.3, ease: "power2.out", stagger: 0.25 }, 4.2);
    tl.fromTo(".i-sauce", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, ease: "power1.inOut" }, 5.1);
    tl.from(".i-cherry", { y: -560, opacity: 0, duration: 1.0, ease: "bounce.out" }, 6.0);
  }, p);

  return (
    <svg ref={ref} className="scene-svg" viewBox={VB}>
      <defs>
        <clipPath id={`${id}c`}><path d="M208 336L392 336L300 584Z" /></clipPath>
      </defs>
      <ellipse className="i-shadow" cx="300" cy="598" rx="130" ry="18" fill="url(#gShadow)" />
      <g data-ing="cone">
        <g className="i-cone">
          <path d="M206 334L394 334L300 588Z" fill="url(#gCone)" />
          <g clipPath={`url(#${id}c)`} stroke="#8a5416" strokeWidth="3" strokeOpacity=".5">
            {Array.from({ length: 9 }, (_, i) => (
              <g key={i}>
                <line x1={160 + i * 36} y1="320" x2={60 + i * 36} y2="620" />
                <line x1={440 - i * 36} y1="320" x2={540 - i * 36} y2="620" />
              </g>
            ))}
          </g>
          <path d="M200 330Q300 354 400 330L398 346Q300 372 202 346Z" fill="#d79a48" stroke="#a8691f" strokeWidth="2" />
        </g>
      </g>
      {scoops.map((s) => (
        <g key={s.cls} data-ing={s.ing}>
          <g className={s.cls}>
            {ruffle(s.cx, s.cy, s.r).map(([x, y], i) => <ellipse key={i} cx={f1(x)} cy={f1(y)} rx={s.r * 0.26} ry={s.r * 0.2} fill={s.fill} />)}
            <circle cx={s.cx} cy={s.cy} r={s.r} fill={s.fill} />
            <ellipse cx={s.cx - s.r * 0.35} cy={s.cy - s.r * 0.4} rx={s.r * 0.28} ry={s.r * 0.14} fill="#fff" opacity=".35" transform={`rotate(-35 ${s.cx - s.r * 0.35} ${s.cy - s.r * 0.4})`} />
            {Array.from({ length: 9 }, (_, k) => {
              const [x, y] = polar(s.cx, s.cy, s.r * (0.25 + ((k * 37) % 60) / 100), k * 83);
              return <circle key={k} cx={f1(x)} cy={f1(y)} r={s.ing === "chocolate" ? 2 : 3} fill={s.spot} opacity=".55" />;
            })}
          </g>
        </g>
      ))}
      <g data-ing="vanilla">
        <path className="i-drip" d="M214 336L246 336L246 384Q244 418 230 420Q216 418 214 384Z" fill="url(#gVanilla)" />
      </g>
      <g data-ing="strawberry">
        <path className="i-drip" d="M352 340L384 340Q384 386 372 392Q360 388 352 340Z" fill="url(#gStraw)" />
      </g>
      <g data-ing="chocolate" fill="none" strokeLinecap="round" stroke="#3a190c" strokeWidth="9">
        <path className="i-sauce" d="M236 126Q300 160 366 122M246 96Q300 118 356 94M222 156Q300 184 378 152" pathLength={1} strokeDasharray="1" strokeDashoffset="0" />
      </g>
      <g transform="translate(300 40)" data-ing="cherry">
        <g className="i-cherry">
          <path d="M0 -10C6 -34 20 -46 40 -52" stroke="#4c6a2a" strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle r="25" fill="#c8102e" />
          <circle r="25" fill="none" stroke="#7a0a1c" strokeWidth="2" />
          <ellipse cx="-8" cy="-9" rx="8" ry="5" fill="#fff" opacity=".45" transform="rotate(-30 -8 -9)" />
        </g>
      </g>
    </svg>
  );
}

/* ═════════════════════════ GARLIC BREAD ═════════════════════════
   Baguette is stacked at the centre → a knife sweeps across and the slices fan out →
   garlic butter melts across each slice → parsley falls → steam. */
const slicesX = [110, 205, 300, 395, 490];
const slicesRot = [-14, -7, 0, 7, 14];
const slicesY = [350, 332, 326, 332, 350];
const holes = [[-22, -40, 7, 4], [18, -10, 6, 4], [-16, 30, 8, 5], [24, 52, 5, 3], [-4, -70, 5, 3]];
const parsley = (() => {
  const r = rng(31);
  return slicesX.map(() => Array.from({ length: 7 }, () => ({ x: f1((r() - 0.5) * 80), y: f1((r() - 0.5) * 140), rot: Math.round(r() * 180) })));
})();

export function GarlicBread(p: SceneProps) {
  const ref = useScene((tl) => {
    tl.from(".gb-board", { opacity: 0, y: 40, duration: 0.7, ease: "power3.out" }, 0);
    tl.from(".gb-sl", { opacity: 0, scale: 0.7, svgOrigin: "300 330", duration: 0.7, ease: "back.out(1.6)" }, 0.5);
    tl.fromTo(".gb-knife", { x: 60, opacity: 1 }, { x: 540, duration: 1.3, ease: "power1.inOut" }, 1.5);
    tl.to(".gb-knife", { opacity: 0, duration: 0.3 }, 2.8);
    tl.from(".gb-sl", { x: (i: number) => (2 - i) * 95, duration: 1.2, ease: "power3.inOut", stagger: 0.05 }, 1.5);
    tl.from(".gb-butter", { opacity: 0, scale: 0.3, duration: 0.9, ease: "power2.out", stagger: 0.18 }, 3.0);
    tl.from(".gb-shine", { opacity: 0, duration: 0.8, stagger: 0.12 }, 3.8);
    tl.from(".gb-pars", { y: -460, opacity: 0, rotation: 200, duration: 0.8, ease: "power1.in", stagger: { each: 0.025, from: "random" } }, 4.2);
    tl.fromTo(".gb-steam", { opacity: 0, y: 12 }, { opacity: 0.55, y: -44, duration: 2.6, stagger: 0.45, repeat: -1, ease: "sine.inOut" }, 5.2);
  }, p);

  return (
    <svg ref={ref} className="scene-svg" viewBox={VB}>
      <g className="gb-board">
        <rect x="14" y="170" width="572" height="360" rx="40" fill="#6a4a2a" opacity=".25" transform="translate(6 14)" />
        <rect x="14" y="170" width="572" height="360" rx="40" fill="url(#gWood)" />
        <path d="M30 230H570M30 300H570M30 370H570M30 440H570" stroke="#8a6238" strokeOpacity=".3" strokeWidth="2" />
      </g>
      {slicesX.map((x, i) => (
        <g key={i} transform={`translate(${x} ${slicesY[i]})`}>
          <g className="gb-sl">
            <g transform={`rotate(${slicesRot[i]})`}>
              <ellipse cx="6" cy="10" rx="70" ry="106" fill="#2a160a" opacity=".22" />
              <g data-ing="bread">
                <ellipse rx="68" ry="104" fill="url(#gBread)" stroke="#8a5416" strokeWidth="3" />
                <ellipse rx="56" ry="92" fill="#f6e0ac" />
                {holes.map(([hx, hy, rx, ry], k) => <ellipse key={k} cx={hx} cy={hy} rx={rx} ry={ry} fill="#e4c27c" />)}
              </g>
              <g data-ing="butter">
                <ellipse className="gb-butter" rx="54" ry="90" fill="#f8d556" opacity=".62" />
                <path className="gb-shine" d="M-30 -50Q-34 -20 -22 10" stroke="#fff" strokeOpacity=".7" strokeWidth="6" strokeLinecap="round" fill="none" />
                {[[-14, 20], [20, -30], [6, 50], [-24, -18]].map(([gx, gy], k) => <ellipse key={k} className="gb-butter" cx={gx} cy={gy} rx="5" ry="3" fill="#fff6d0" />)}
              </g>
              <g data-ing="parsley" fill="#4c8a2a">
                {parsley[i].map((q, k) => (
                  <g key={k} transform={`translate(${q.x} ${q.y}) rotate(${q.rot})`}>
                    <rect className="gb-pars" x="-5" y="-2" width="10" height="4" rx="2" />
                  </g>
                ))}
              </g>
            </g>
          </g>
        </g>
      ))}
      <g className="gb-knife" opacity="0">
        <path d="M-8 190L8 190L8 440L-8 454Z" fill="url(#gSteel)" stroke="#8d8880" />
        <rect x="-9" y="100" width="18" height="90" rx="8" fill="#2d211c" />
      </g>
      <g fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" className="steam-blur">
        {[220, 300, 380].map((x) => <path key={x} className="gb-steam" style={{ opacity: 0.3 }} d={`M${x} 190C${x - 20} 160 ${x + 20} 130 ${x} 90`} />)}
      </g>
    </svg>
  );
}
