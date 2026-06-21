// ===== Peças do Mendelito em camadas SVG =====
// Mesmo viewBox (0 0 200 220), centralizadas. Cada peça lê só uma prop,
// para a troca por sprites do jogador ser trivial.

import { useId } from "react";
import type { Phenotype } from "../../engine/types";
import { PALETTE } from "../../data/genes";

function shade(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255,
    g = (n >> 8) & 255,
    b = n & 255;
  const f = amt < 0 ? 1 + amt : 1 - amt;
  if (amt < 0) {
    // clarear
    r = Math.round(r + (255 - r) * -amt);
    g = Math.round(g + (255 - g) * -amt);
    b = Math.round(b + (255 - b) * -amt);
  } else {
    r = Math.round(r * f);
    g = Math.round(g * f);
    b = Math.round(b * f);
  }
  return `rgb(${r},${g},${b})`;
}
const darken = (hex: string, amt = 0.18) => shade(hex, amt);

// Caminho de uma espiral de Arquimedes (raio cresce com o ângulo), defasada por `phase`.
function spiralPath(cx: number, cy: number, turns: number, rMax: number, phase: number): string {
  const steps = 90;
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const ang = phase + t * turns * 2 * Math.PI;
    const r = 3 + t * rMax;
    const x = cx + r * Math.cos(ang);
    const y = cy + r * Math.sin(ang);
    pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return pts.join(" ");
}

export function Ears({ type, color }: { type: Phenotype["orelhas"]; color: string }) {
  const dark = darken(color);
  const inner = PALETTE.pink;
  if (type === "longas") {
    return (
      <g>
        <ellipse cx="64" cy="56" rx="14" ry="44" fill={color} stroke={dark} strokeWidth="3" transform="rotate(-14 64 56)" />
        <ellipse cx="136" cy="56" rx="14" ry="44" fill={color} stroke={dark} strokeWidth="3" transform="rotate(14 136 56)" />
        <ellipse cx="64" cy="66" rx="6" ry="26" fill={inner} opacity="0.5" transform="rotate(-14 64 66)" />
        <ellipse cx="136" cy="66" rx="6" ry="26" fill={inner} opacity="0.5" transform="rotate(14 136 66)" />
      </g>
    );
  }
  return (
    <g>
      <ellipse cx="70" cy="72" rx="17" ry="19" fill={color} stroke={dark} strokeWidth="3" />
      <ellipse cx="130" cy="72" rx="17" ry="19" fill={color} stroke={dark} strokeWidth="3" />
      <ellipse cx="70" cy="74" rx="7" ry="9" fill={inner} opacity="0.5" />
      <ellipse cx="130" cy="74" rx="7" ry="9" fill={inner} opacity="0.5" />
    </g>
  );
}

export function Body({ color, gradId }: { color: string; gradId: string }) {
  const dark = darken(color);
  const light = shade(color, -0.22);
  return (
    <g>
      <defs>
        <radialGradient id={gradId} cx="38%" cy="30%" r="80%">
          <stop offset="0%" stopColor={light} />
          <stop offset="100%" stopColor={color} />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="136" rx="63" ry="61" fill={`url(#${gradId})`} stroke={dark} strokeWidth="3.5" />
      {/* barriga clara */}
      <ellipse cx="100" cy="150" rx="40" ry="40" fill="#ffffff" opacity="0.4" />
      {/* patinhas */}
      <ellipse cx="74" cy="191" rx="16" ry="11" fill={color} stroke={dark} strokeWidth="3" />
      <ellipse cx="126" cy="191" rx="16" ry="11" fill={color} stroke={dark} strokeWidth="3" />
      {/* brilho */}
      <ellipse cx="76" cy="106" rx="15" ry="11" fill="#ffffff" opacity="0.55" />
    </g>
  );
}

export function Pattern({ type, color }: { type: Phenotype["padrao"]; color: string }) {
  if (type !== "manchado") return null;
  const dark = darken(color, 0.28);
  return (
    <g opacity="0.85">
      <ellipse cx="72" cy="122" rx="13" ry="11" fill={dark} />
      <ellipse cx="128" cy="150" rx="16" ry="13" fill={dark} />
      <ellipse cx="110" cy="108" rx="9" ry="8" fill={dark} />
      <ellipse cx="90" cy="172" rx="10" ry="8" fill={dark} />
    </g>
  );
}

// "Asas": par de asas fofas que saem por trás do corpo, com leve bater.
// Gene de dominância incompleta -> cor mistura (vermelha / rosa / branca).
export function Wings({ color }: { color: Phenotype["crista"] }) {
  const map = {
    vermelha: PALETTE.crestRed,
    rosa: PALETTE.crestPink,
    branca: "#FFFFFF",
  } as const;
  const c = map[color];
  const dark = darken(c === "#FFFFFF" ? "#E4DCF3" : c, 0.16);
  const sw = 2.5;

  return (
    <g>
      {/* asa esquerda (sai para fora do corpo) */}
      <g>
        <ellipse cx="50" cy="116" rx="13" ry="32" fill={c} stroke={dark} strokeWidth={sw} transform="rotate(-32 50 116)" />
        <ellipse cx="38" cy="134" rx="13" ry="34" fill={c} stroke={dark} strokeWidth={sw} transform="rotate(-54 38 134)" />
        <ellipse cx="34" cy="154" rx="11" ry="27" fill={c} stroke={dark} strokeWidth={sw} transform="rotate(-74 34 154)" />
        <animateTransform attributeName="transform" type="rotate"
          values="3 60 140; -6 60 140; 3 60 140" dur="2.6s" repeatCount="indefinite" />
      </g>
      {/* asa direita */}
      <g>
        <ellipse cx="150" cy="116" rx="13" ry="32" fill={c} stroke={dark} strokeWidth={sw} transform="rotate(32 150 116)" />
        <ellipse cx="162" cy="134" rx="13" ry="34" fill={c} stroke={dark} strokeWidth={sw} transform="rotate(54 162 134)" />
        <ellipse cx="166" cy="154" rx="11" ry="27" fill={c} stroke={dark} strokeWidth={sw} transform="rotate(74 166 154)" />
        <animateTransform attributeName="transform" type="rotate"
          values="-3 140 140; 6 140 140; -3 140 140" dur="2.6s" repeatCount="indefinite" />
      </g>
    </g>
  );
}

// Escamas -> espiral na barriga. CODOMINÂNCIA (azul+vermelha): um braço de
// espiral de cada cor, entrelaçados — as DUAS cores aparecem inteiras, lado a
// lado, nunca borradas numa só. 1 alelo = 1 braço (AA: azul/azul, RR:
// vermelha/vermelha, AR: azul + vermelha).
export function Scales({ color }: { color: Phenotype["escamas"] }) {
  const blue = PALETTE.scaleBlue;
  const red = PALETTE.scaleRed;
  const gid = useId().replace(/:/g, "");
  const armA = color === "vermelha" ? red : blue;
  const armB = color === "azul" ? blue : red;
  const cx = 100;
  const cy = 152;
  const rMax = 30;
  const turns = 2.5;
  const sw = 6.5;
  return (
    <g opacity="0.96" strokeLinecap="round" fill="none">
      <defs>
        <clipPath id={`scaleclip-${gid}`}>
          <ellipse cx={cx} cy={cy} rx="34" ry="34" />
        </clipPath>
      </defs>
      {/* fundo claro para as duas cores contrastarem */}
      <ellipse cx={cx} cy={cy} rx="34" ry="34" fill="#ffffff" opacity="0.4" />
      <g clipPath={`url(#scaleclip-${gid})`}>
        <path d={spiralPath(cx, cy, turns, rMax, 0)} stroke={armA} strokeWidth={sw} />
        <path d={spiralPath(cx, cy, turns, rMax, Math.PI)} stroke={armB} strokeWidth={sw} />
        <animateTransform
          attributeName="transform"
          type="rotate"
          values={`0 ${cx} ${cy}; 360 ${cx} ${cy}`}
          dur="16s"
          repeatCount="indefinite"
        />
      </g>
      {/* brilho suave */}
      <ellipse cx="90" cy="142" rx="8" ry="5" fill="#ffffff" opacity="0.35" />
    </g>
  );
}

export function Eyes({ size, sex }: { size: Phenotype["olhos"]; sex: "XX" | "XY" }) {
  const r = size === "grandes" ? 15 : 8;
  const pupil = size === "grandes" ? 7 : 4;
  const ink = "#3E3360";
  return (
    <g>
      <ellipse cx="80" cy="120" rx={r} ry={r + 1} fill="#ffffff" stroke={ink} strokeWidth="2" />
      <ellipse cx="120" cy="120" rx={r} ry={r + 1} fill="#ffffff" stroke={ink} strokeWidth="2" />
      <circle cx="82" cy="122" r={pupil} fill={ink} />
      <circle cx="122" cy="122" r={pupil} fill={ink} />
      <circle cx="84.5" cy="119" r={pupil / 2.4} fill="#ffffff" />
      <circle cx="124.5" cy="119" r={pupil / 2.4} fill="#ffffff" />
      {/* bochechas */}
      <ellipse cx="64" cy="138" rx="9" ry="6" fill={PALETTE.pink} opacity="0.5" />
      <ellipse cx="136" cy="138" rx="9" ry="6" fill={PALETTE.pink} opacity="0.5" />
      {/* sorriso */}
      <path d="M90 140 Q100 150 110 140" stroke={ink} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* laço sutil para fêmeas */}
      {sex === "XX" && (
        <g transform="translate(150 86)">
          <path d="M0 0 l9 -6 l0 13 z M0 0 l-9 -6 l0 13 z" fill={PALETTE.pink} />
          <circle cx="0" cy="3" r="3" fill={darken(PALETTE.pink, 0.15)} />
        </g>
      )}
    </g>
  );
}
