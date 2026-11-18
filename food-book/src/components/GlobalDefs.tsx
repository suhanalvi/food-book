/**
 * Shared gradients & filters referenced by every food scene via url(#id).
 * Rendered once, off-screen (NOT display:none, so references keep working).
 */
const lin = (id: string, stops: [string, string, number?][], x2 = 0, y2 = 1) => (
  <linearGradient key={id} id={id} x1="0" y1="0" x2={x2} y2={y2}>
    {stops.map(([c, o, op], i) => (
      <stop key={i} offset={o} stopColor={c} stopOpacity={op ?? 1} />
    ))}
  </linearGradient>
);
const rad = (id: string, stops: [string, string, number?][], cx = 0.4, cy = 0.35, r = 0.75) => (
  <radialGradient key={id} id={id} cx={cx} cy={cy} r={r}>
    {stops.map(([c, o, op], i) => (
      <stop key={i} offset={o} stopColor={c} stopOpacity={op ?? 1} />
    ))}
  </radialGradient>
);

export default function GlobalDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden focusable="false">
      <defs>
        {rad("gBunTop", [["#f6c06b", "0"], ["#dc8f3d", "0.55"], ["#a8591e", "1"]], 0.38, 0.25, 0.9)}
        {lin("gBunBot", [["#eaa955", "0"], ["#c27a2c", "1"]])}
        {lin("gCheese", [["#ffd84d", "0"], ["#f0a500", "1"]])}
        {lin("gPatty", [["#74402a", "0"], ["#35190d", "1"]])}
        {rad("gTomato", [["#ee5a46", "0"], ["#b61f18", "1"]], 0.5, 0.4, 0.8)}
        {lin("gLettuce", [["#b3dc6a", "0"], ["#5c9a2c", "1"]])}
        {lin("gCoffee", [["#6a3d27", "0"], ["#2a150b", "1"]])}
        {rad("gCrema", [["#e0b17a", "0"], ["#9a6137", "0.7"], ["#6b3d22", "1"]], 0.5, 0.45, 0.7)}
        {lin("gMilk", [["#fffaf0", "0"], ["#efe0c6", "1"]])}
        {lin("gCeramic", [["#d8d0c3", "0"], ["#ffffff", "0.35"], ["#f1ece2", "0.65"], ["#c9c0b1", "1"]], 1, 0)}
        {lin("gGlass", [["#ffffff", "0", 0.55], ["#ffffff", "0.18", 0.08], ["#ffffff", "0.8", 0.06], ["#ffffff", "1", 0.45]], 1, 0)}
        {rad("gCream", [["#fffefa", "0"], ["#f3e6cd", "1"]], 0.4, 0.3, 0.8)}
        {lin("gChoc", [["#6a3822", "0"], ["#2b130a", "1"]])}
        {rad("gDough", [["#f5d89a", "0"], ["#dca85b", "0.85"], ["#c68a3d", "1"]], 0.5, 0.5, 0.7)}
        {rad("gSauce", [["#e04a30", "0"], ["#a8231a", "1"]], 0.5, 0.5, 0.7)}
        {lin("gPink", [["#fbc3d2", "0"], ["#ec8fab", "1"]])}
        {lin("gGolden", [["#f7cd78", "0"], ["#d28a3a", "0.7"], ["#a9611d", "1"]])}
        {rad("gPlate", [["#ffffff", "0"], ["#e9e2d6", "1"]], 0.5, 0.4, 0.8)}
        {rad("gShadow", [["#2a160a", "0", 0.42], ["#2a160a", "1", 0]], 0.5, 0.5, 0.5)}
        {lin("gSponge", [["#6b3a24", "0"], ["#42200f", "1"]])}
        {rad("gDonut", [["#f0bd78", "0"], ["#cf8c45", "0.75"], ["#a8642a", "1"]], 0.5, 0.45, 0.7)}
        {lin("gBrownie", [["#5a2e1a", "0"], ["#28120a", "1"]])}
        {rad("gCookie", [["#e6b46c", "0"], ["#c58a45", "0.8"], ["#a56a2c", "1"]], 0.4, 0.35, 0.75)}
        {lin("gTea", [["#d28a3c", "0"], ["#8a4713", "1"]])}
        {lin("gWood", [["#c79a68", "0"], ["#a67a49", "1"]])}
        {lin("gFry", [["#ffe08a", "0"], ["#f2b940", "0.6"], ["#d6902a", "1"]], 1, 0)}
        {lin("gCarton", [["#e03a2e", "0"], ["#b02219", "1"]], 1, 0)}
        {lin("gSteel", [["#f3f1ee", "0"], ["#b7b2ab", "0.5"], ["#efede9", "1"]], 1, 0)}
        {lin("gBread", [["#e9b46a", "0"], ["#bf7b30", "1"]])}
        {lin("gCone", [["#e2a95a", "0"], ["#b9772d", "1"]], 1, 0.3)}
        {rad("gVanilla", [["#fffbe8", "0"], ["#f0e1b2", "1"]], 0.4, 0.3, 0.8)}
        {rad("gStraw", [["#ffc6d3", "0"], ["#f08aa4", "1"]], 0.4, 0.3, 0.8)}
        {rad("gChocScoop", [["#8b5236", "0"], ["#4e2814", "1"]], 0.4, 0.3, 0.8)}
        {lin("gHam", [["#f1a3a0", "0"], ["#d97c7a", "1"]])}
        <filter id="fSoft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id="fRough" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="4" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="9" />
        </filter>
        <filter id="fDrop" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="10" stdDeviation="9" floodColor="#2a160a" floodOpacity="0.35" />
        </filter>
      </defs>
    </svg>
  );
}
