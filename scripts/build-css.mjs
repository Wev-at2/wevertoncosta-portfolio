// Junta os CSS (resolvendo os @import) em um único arquivo minificado por entrada.
// Evita a cascata de requisições do @import, que bloqueia a renderização.
// Uso: npm run build:css
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve, posix } from 'node:path';

const CSS_DIR = resolve('assets/css');
const ENTRIES = ['style.css', 'case.css'];

const toPosix = (p) => p.split('\\').join(posix.sep);

function inline(file, outDir, seen = new Set()) {
  if (seen.has(file)) return '';
  seen.add(file);
  const dir = dirname(file);
  let css = readFileSync(file, 'utf8');

  // Reescreve url() relativos para continuarem válidos a partir do arquivo de saída
  css = css.replace(/url\(\s*(['"]?)(?!data:|https?:|\/|#)([^'")]+)\1\s*\)/g, (match, quote, path) => {
    if (path.endsWith('.css')) return match; // @import, tratado abaixo
    const fixed = toPosix(relative(outDir, resolve(dir, path)));
    return `url("${fixed}")`;
  });

  return css.replace(/@import\s+url\(\s*['"]?([^'")]+\.css)['"]?\s*\)\s*;?/g, (_, path) =>
    inline(resolve(dir, path), outDir, seen));
}

function minify(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};,])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

for (const entry of ENTRIES) {
  const src = join(CSS_DIR, entry);
  const out = join(CSS_DIR, entry.replace(/\.css$/, '.min.css'));
  const css = minify(inline(src, CSS_DIR));
  writeFileSync(out, css + '\n');
  console.log(`${entry} -> ${relative(process.cwd(), out)} (${(statSync(out).size / 1024).toFixed(1)} KB)`);
}
