const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
const vm = require("node:vm");
const mammoth = require("mammoth");
const pdfParse = require("pdf-parse");

const root = process.cwd();
const inputDir = path.join(root, "knowledge_base");
const outputFile = path.join(inputDir, "index.json");
const extensions = new Set([".pdf", ".docx", ".txt"]);
const maxChars = 1800, overlap = 250;

async function walk(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === "index.json") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full));
    else if (extensions.has(path.extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}
function split(text) {
  const clean = text.replace(/\r/g, "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
  const chunks = [];
  for (let start = 0; start < clean.length;) {
    let end = Math.min(start + maxChars, clean.length);
    if (end < clean.length) {
      const boundary = clean.lastIndexOf("\n", end);
      if (boundary > start + maxChars * 0.55) end = boundary;
    }
    const part = clean.slice(start, end).trim();
    if (part) chunks.push(part);
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
async function embed(texts) {
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small", input: texts })
  });
  if (!response.ok) throw new Error(`Embedding API failed: ${response.status} ${await response.text()}`);
  return (await response.json()).data.map(item => item.embedding);
}
async function main() {
  if (!process.env.OPENAI_API_KEY) throw new Error("Define OPENAI_API_KEY antes de indexar.");
  await fs.mkdir(inputDir, { recursive: true });
  const documents = [];
  for (const file of await walk(inputDir)) {
    const text = await extract(file);
    const source = path.relative(inputDir, file).split(path.sep).join("/");
    for (const part of split(text)) documents.push({ source, text: part });
  }
  try {
    const sandbox = { window: {} };
    vm.runInNewContext(await fs.readFile(path.join(root, "assets/products.js"), "utf8"), sandbox, { timeout: 1000 });
    for (const p of sandbox.window.BUILDEX_PRODUCTS || []) {
      const text = [p.name, p.category, ...(p.colors || []), ...(p.specs || []).flat(), ...(p.models || []).flatMap(m => [m.model, ...(m.specs || []).flat(), ...(m.finishes || [])])].filter(Boolean).join(". ");
      if (text) documents.push({ source: "Catálogo Buildex 2026", text });
    }
  } catch (err) { console.warn("No se pudo cargar el catálogo:", err.message); }
  const chunks = [];
  const seen = new Set();
  for (const doc of documents) {
    const hash = crypto.createHash("sha256").update(doc.text).digest("hex");
    if (!seen.has(hash)) { seen.add(hash); chunks.push({ id: hash, source: doc.source, text: doc.text }); }
  }
  const vectors = [];
  for (let i = 0; i < chunks.length; i += 64) vectors.push(...await embed(chunks.slice(i, i + 64).map(c => c.text)));
  const result = { version: 1, model: process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small", updatedAt: new Date().toISOString(), chunks: chunks.map((chunk, i) => ({ ...chunk, embedding: vectors[i] })) };
  const temporary = outputFile + ".tmp";
  await fs.writeFile(temporary, JSON.stringify(result), "utf8");
  await fs.rename(temporary, outputFile);
  console.log(`Base actualizada: ${chunks.length} fragmentos de ${new Set(chunks.map(c => c.source)).size} fuentes.`);
}
main().catch(err => { console.error(err.message); process.exitCode = 1; });
