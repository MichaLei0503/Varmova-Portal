const fs = require('fs');
const path = process.argv[2];
let src = fs.readFileSync(path, 'utf8');
const lines = src.split('\n');
const namespaceImports = [];
const namedBySource = new Map();
const bodyLines = [];
const reNamed = /^import\s*\{([^}]*)\}\s*from\s*"([^"]+)";?\s*$/;
const reNs = /^import\s+\*\s+as\s+(\w+)\s+from\s*"([^"]+)";?\s*$/;
const reBare = /^import\s+"([^"]+)";?\s*$/;
for (const line of lines) {
  const t = line.trim();
  let m;
  if ((m = t.match(reNamed))) {
    const s = m[2];
    if (!namedBySource.has(s)) namedBySource.set(s, new Set());
    m[1].split(',').map(x=>x.trim()).filter(Boolean).forEach(x=>namedBySource.get(s).add(x));
  } else if ((m = t.match(reNs))) { namespaceImports.push(`import * as ${m[1]} from "${m[2]}";`); }
  else if ((m = t.match(reBare))) { namespaceImports.push(`import "${m[1]}";`); }
  else { bodyLines.push(line); }
}
const header = [];
[...new Set(namespaceImports)].forEach(l=>header.push(l));
for (const [source, specs] of namedBySource) header.push(`import { ${[...specs].join(', ')} } from "${source}";`);
while (bodyLines.length && bodyLines[0].trim()==='') bodyLines.shift();
fs.writeFileSync(path, header.join('\n') + '\n\n' + bodyLines.join('\n'));
console.log('imports merged:', header.length);
