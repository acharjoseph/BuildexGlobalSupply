const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
const vm = require("node:vm");
const mammoth = require("mammoth");
const pdfParse = require("pdf-parse");
const root = process.cwd(), inputDir = path.join(root, "knowledge_base"), outputFile = path.join(inputDir, "index.json");
const extensions = new Set([".pdf", ".docx", ".txt"]), maxChars = 1800, overlap = 250;
const STOP = new Set("a al algo aqui así como con cual cuales cuando cuanto da de del desde donde el ella ellas ellos en entre es esa esas ese esos esta estas este estos fue ha hasta hay la las le les lo los mas me mi mis mucha muy no o para pero por que se si sin sobre su sus te tu un una uno unos unas y ya the a an and are as at be by for from how in is it of on or that the this to was what when which with".split(" "));
const ALIASES = { floor:"piso", flooring:"piso", floors:"piso", pisos:"piso", suelo:"piso", wall:"panel", walls:"panel", paneles:"panel", panel:"panel", acoustic:"acustico", acousticpanel:"acustico", width:"ancho", height:"alto", length:"largo", dimensions:"medida", dimension:"medida", dimensiones:"medida", medidas:"medida", medida:"medida", profile:"perfil", profiles:"perfil", thickness:"grosor", espesor:"grosor", model:"modelo", waterproof:"impermeable" };
function embedLocally(value) {
  const tokens = String(value || "").toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g, "").match(/[a-z0-9]+/g) || [];
  const vector = Object.create(null);
  for (let token of tokens) {
    if (token.length <= 1 || STOP.has(token)) continue;
    token = ALIASES[token] || token;
    vector[token] = (vector[token] || 0) + 1;
  }
  return vector;
}
async function walk(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes:true })) {
    if (entry.name.startsWith(".") || entry.name === "index.json") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full));
    else if (extensions.has(path.extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}
function split(text) {
  const clean = text.replace(/\r/g, "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim(), chunks = [];
  for (let start = 0; start < clean.length;) {
    let end = Math.min(start + maxChars, clean.length);
    if (end < clean.length) { const boundary = clean.lastIndexOf("\n", end); if (boundary > start + maxChars * 0.55) end = boundary; }
    const part = clean.slice(start,end).trim(); if (part) chunks.push(part);
    if (end >= clean.length) break;
    start = Math.max(start + 1, end - overlap);
  }
  return chunks;
}
async function extract(file) {
  const ext = path.extname(file).toLowerCase(), buffer = await fs.readFile(file);
  if (ext === ".txt") return buffer.toString("utf8");
  if (ext === ".pdf") return (await pdfParse(buffer)).text || "";
  return (await mammoth.extractRawText({ buffer })).value || "";
}
async function main() {
  await fs.mkdir(inputDir, { recursive:true });
  const documents = [];
  for (const file of await walk(inputDir)) {
    const text = await extract(file), source = path.relative(inputDir,file).split(path.sep).join("/");
    for (const part of split(text)) documents.push({ source, text:part });
  }
  try {
    const sandbox = { window:{} };
    vm.runInNewContext(await fs.readFile(path.join(root,"assets/products.js"),"utf8"),sandbox,{timeout:1000});
    for (const p of sandbox.window.BUILDEX_PRODUCTS || []) {
      const text = [p.name,p.category,...(p.colors||[]),...(p.specs||[]).flat(),...(p.models||[]).flatMap(m=>[m.model,...(m.specs||[]).flat(),...(m.finishes||[])])].filter(Boolean).join(". ");
      if (text) documents.push({ source:"Catálogo Buildex 2026", text });
    }
  } catch (err) { console.warn("No se pudo cargar el catálogo:",err.message); }
  const unique = new Map();
  for (const doc of documents) {
    const id = crypto.createHash("sha256").update(doc.text).digest("hex");
    if (!unique.has(id)) unique.set(id,{ id,source:doc.source,text:doc.text,embedding:embedLocally(doc.text) });
  }
  const result = { version:1, model:"local-token-v1", updatedAt:new Date().toISOString(), chunks:[...unique.values()] };
  const temp = outputFile + ".tmp";
  await fs.writeFile(temp,JSON.stringify(result),"utf8");
  await fs.rename(temp,outputFile);
  console.log(`Base actualizada: ${result.chunks.length} fragmentos de ${new Set(result.chunks.map(c=>c.source)).size} fuentes.`);
}
main().catch(err => { console.error(err); process.exitCode = 1; });
