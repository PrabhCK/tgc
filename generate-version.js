const fs = require('fs');
const path = require('path');

const version = Date.now().toString();

const envPath = path.join(__dirname, 'src/environments/environment.prod.ts');
const versionPath = path.join(__dirname, 'src/assets/version.json');

// update version.json
fs.writeFileSync(versionPath, JSON.stringify({ version }));

// update environment.prod.ts
let content = fs.readFileSync(envPath, 'utf8');

content = content.replace(
  /version:\s*['"`].*?['"`]/,
  `version: '${version}'`
);

fs.writeFileSync(envPath, content);

console.log('✅ Version injected:', version);