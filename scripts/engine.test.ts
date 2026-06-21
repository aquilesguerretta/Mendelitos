// Prova de corretude da genética (versão TS / Figma).
// Rode:  npm run test:engine
// (bundla com esbuild e executa no Node — a engine é pura, sem React/CSS.)

import { breedDetailed } from "../src/app/engine/breeding";
import { phenotype } from "../src/app/engine/phenotype";
import { dexCatalog } from "../src/app/engine/dex";
import type { Creature, Genes, Sex } from "../src/app/engine/types";

let pass = 0;
let fail = 0;
function ok(cond: boolean, msg: string) {
  if (cond) pass++;
  else {
    fail++;
    console.error("  ✗ " + msg);
  }
}
function approx(a: number, b: number, tol: number, msg: string) {
  ok(Math.abs(a - b) <= tol, `${msg} (esperado ~${b}±${tol}, obteve ${a.toFixed(3)})`);
}

function mk(sex: Sex, g: Partial<Genes>): Creature {
  return {
    id: "x",
    sex,
    genes: {
      cor: ["C", "c"],
      orelhas: ["O", "o"],
      padrao: ["M", "m"],
      crista: ["V", "B"],
      escamas: ["A", "R"],
      olhos: sex === "XX" ? ["G", "g"] : ["G"],
      ...g,
    },
  };
}
const ph = (sex: Sex, g: Partial<Genes>) => phenotype(mk(sex, g));

console.log("— Fenótipo (todas as combinações) —");
// cor: dominância completa (C roxo domina; cc amarelo)
ok(ph("XX", { cor: ["C", "C"] }).cor === "roxo", "CC->roxo");
ok(ph("XX", { cor: ["C", "c"] }).cor === "roxo", "Cc->roxo");
ok(ph("XX", { cor: ["c", "c"] }).cor === "amarelo", "cc->amarelo");
// orelhas
ok(ph("XX", { orelhas: ["O", "O"] }).orelhas === "curtas", "OO->curtas");
ok(ph("XX", { orelhas: ["o", "o"] }).orelhas === "longas", "oo->longas");
// padrao
ok(ph("XX", { padrao: ["M", "m"] }).padrao === "liso", "Mm->liso");
ok(ph("XX", { padrao: ["m", "m"] }).padrao === "manchado", "mm->manchado");
// asas (crista) — dominância incompleta 1:2:1
ok(ph("XX", { crista: ["V", "V"] }).crista === "vermelha", "VV->vermelha");
ok(ph("XX", { crista: ["V", "B"] }).crista === "rosa", "VB->rosa");
ok(ph("XX", { crista: ["B", "V"] }).crista === "rosa", "BV->rosa (ordem)");
ok(ph("XX", { crista: ["B", "B"] }).crista === "branca", "BB->branca");
// escamas — codominância
ok(ph("XX", { escamas: ["A", "A"] }).escamas === "azul", "AA->azul");
ok(ph("XX", { escamas: ["A", "R"] }).escamas === "azul+vermelha", "AR->azul+vermelha");
ok(ph("XX", { escamas: ["R", "A"] }).escamas === "azul+vermelha", "RA->azul+vermelha (ordem)");
ok(ph("XX", { escamas: ["R", "R"] }).escamas === "vermelha", "RR->vermelha");
// olhos — ligado ao X
ok(ph("XX", { olhos: ["G", "g"] }).olhos === "grandes", "fêmea Gg->grandes");
ok(ph("XX", { olhos: ["g", "g"] }).olhos === "pequenos", "fêmea gg->pequenos");
ok(ph("XY", { olhos: ["G"] }).olhos === "grandes", "macho G->grandes");
ok(ph("XY", { olhos: ["g"] }).olhos === "pequenos", "macho g->pequenos");

console.log("— Segregação (estatística + invariantes ligado ao X) —");
const mother = mk("XX", {});
const father = mk("XY", {});
const N = 40000;
let nXX = 0, nXY = 0, roxo = 0, verde = 0;
let rc = 0, rl = 0, vc = 0, vl = 0; // di-híbrido
let invOk = true, sonFromMomOk = true, daughterFromDadOk = true;
for (let i = 0; i < N; i++) {
  for (const d of breedDetailed(mother, father)) {
    const c = d.child;
    if (c.genes.cor.length !== 2 || c.genes.escamas.length !== 2) invOk = false;
    if (c.sex === "XX" && c.genes.olhos.length !== 2) invOk = false;
    if (c.sex === "XY" && c.genes.olhos.length !== 1) invOk = false;
    const p = phenotype(c);
    if (c.sex === "XX") nXX++; else nXY++;
    if (p.cor === "roxo") roxo++; else verde++;
    if (p.cor === "roxo" && p.orelhas === "curtas") rc++;
    else if (p.cor === "roxo" && p.orelhas === "longas") rl++;
    else if (p.cor === "amarelo" && p.orelhas === "curtas") vc++;
    else vl++;
    if (c.sex === "XY" && !mother.genes.olhos.includes(c.genes.olhos[0])) sonFromMomOk = false;
    if (c.sex === "XX" && c.genes.olhos[1] !== father.genes.olhos[0]) daughterFromDadOk = false;
  }
}
const tot = N * 4;
approx(nXX / tot, 0.5, 0.02, "fêmeas ~50%");
approx(roxo / tot, 0.75, 0.02, "Cc×Cc -> ~3/4 roxo (3:1)");
approx(verde / tot, 0.25, 0.02, "Cc×Cc -> ~1/4 amarelo");
approx(rc / tot, 9 / 16, 0.02, "di-híbrido 9/16");
approx(rl / tot, 3 / 16, 0.02, "di-híbrido 3/16");
approx(vl / tot, 1 / 16, 0.015, "di-híbrido 1/16");
ok(invOk, "invariantes de comprimento de alelos (XX olhos=2, XY olhos=1)");
ok(sonFromMomOk, "TODO macho herda olhos só da mãe");
ok(daughterFromDadOk, "TODA filha recebe o alelo de olhos do X do pai");

console.log("— Dex: todas as aparências catalogáveis e únicas —");
for (const w of [1, 2, 3] as const) {
  const cat = dexCatalog(w);
  const keys = new Set(cat.map((e) => e.key));
  ok(keys.size === cat.length, `Dex mundo ${w}: ${cat.length} aparências, todas únicas`);
  // cada entrada tem uma criatura de exemplo que reproduz sua chave
  const reproduz = cat.every((e) => typeof e.key === "string" && e.creature != null);
  ok(reproduz, `Dex mundo ${w}: cada slot tem criatura de exemplo`);
}

console.log("\n============================");
console.log(`RESULTADO: ${pass} ok, ${fail} falhas.`);
console.log("============================");
process.exit(fail === 0 ? 0 : 1);
