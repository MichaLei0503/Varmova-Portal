// Framer only registers a code component whose default export is a plain
// `export default <Name>;`. esbuild emits `export { <Name> as default };`,
// which Framer silently ignores (component never shows up in the dropdown).
const fs = require('fs');
const path = process.argv[2];
if (!path) {
  console.error('usage: node scripts/fix-default-export.cjs <bundle>');
  process.exit(1);
}
const src = fs.readFileSync(path, 'utf8');
const re = /export\s*\{\s*(\w+)\s+as\s+default,?\s*\};?\s*$/;
const m = src.trimEnd().match(re);
if (!m) {
  console.log('default export already in plain form — nothing to do');
  process.exit(0);
}
fs.writeFileSync(path, src.trimEnd().replace(re, `export default ${m[1]};`) + '\n');
console.log('default export rewritten:', `export default ${m[1]};`);
