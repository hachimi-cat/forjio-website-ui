// tsup compiles TS/TSX but leaves binary assets (fonts) and CSS alone.
// This script mirrors them into dist/ so package consumers can import
// `@forjio/website-ui/styles/marketing.css` and the next/font/local
// helper can find the .woff2 files at runtime.
//
// It also post-processes the generated ESM (.js) and CJS (.cjs) files
// to rewrite relative imports without an extension to include `.js` /
// `.cjs` — required for strict Node ESM resolution AND keeps webpack
// happy with explicit paths. tsup bundleless mode leaves the import
// specifiers verbatim from source, which uses extension-less imports
// per TypeScript convention.
import { cp, mkdir, readFile, writeFile, readdir } from 'node:fs/promises';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

async function copy(from, to) {
  await mkdir(dirname(to), { recursive: true });
  await cp(from, to, { recursive: true });
}

await copy(join(root, 'src/fonts'), join(root, 'dist/fonts'));
await copy(join(root, 'src/styles'), join(root, 'dist/styles'));

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...(await walk(p)));
    } else {
      out.push(p);
    }
  }
  return out;
}

function rewriteImports(src, ext) {
  // Match `from "./x"` or `from "../x/y"` (no existing extension), then
  // append the target extension. Skip non-relative specifiers (npm pkgs)
  // and specifiers that already end in a known extension.
  return src.replace(
    /(from\s+["'])(\.\.?\/[^"']+?)(["'])/g,
    (match, pre, spec, post) => {
      if (/\.(js|cjs|mjs|json|css|woff2?)$/.test(spec)) return match;
      return `${pre}${spec}${ext}${post}`;
    },
  );
}

const distFiles = await walk(join(root, 'dist'));
let rewrote = 0;
for (const f of distFiles) {
  const e = extname(f);
  if (e !== '.js' && e !== '.cjs') continue;
  const targetExt = e;
  const src = await readFile(f, 'utf8');
  const next = rewriteImports(src, targetExt);
  if (next !== src) {
    await writeFile(f, next);
    rewrote++;
  }
}

console.log(`[copy-assets] copied fonts/ and styles/ to dist/; rewrote imports in ${rewrote} files`);
