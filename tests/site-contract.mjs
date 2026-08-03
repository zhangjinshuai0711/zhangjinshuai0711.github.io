import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const requiredFiles = [
  'index.html',
  'zh/index.html',
  '404.html',
  'assets/css/main.css',
  'assets/js/main.js',
  'robots.txt',
  'sitemap.xml',
];

function readRequired(relativePath) {
  try {
    return readFileSync(join(root, relativePath), 'utf8');
  } catch (error) {
    if (error?.code === 'ENOENT') {
      assert.fail(`missing ${relativePath}`);
    }
    throw error;
  }
}

const files = Object.fromEntries(
  requiredFiles.map((relativePath) => [relativePath, readRequired(relativePath)]),
);
const english = files['index.html'];
const chinese = files['zh/index.html'];
const publicText = `${english}\n${chinese}\n${files['404.html']}`;

function readPublicTextTree(directory = root) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === '.git' || entry.name === 'tests') return [];
    const absolutePath = join(directory, entry.name);
    if (entry.isDirectory()) return readPublicTextTree(absolutePath);
    if (!/\.(?:html|css|js|md|txt|xml)$/i.test(entry.name)) return [];
    return readFileSync(absolutePath, 'utf8');
  }).join('\n');
}

const publicTextTree = readPublicTextTree();

assert.match(english, /<html\b[^>]*\blang=["']en["']/i, 'English page must use lang=en');
assert.match(chinese, /<html\b[^>]*\blang=["']zh-CN["']/i, 'Chinese page must use lang=zh-CN');

for (const [label, html] of [
  ['English page', english],
  ['Chinese page', chinese],
]) {
  assert.match(html, /<main\b/i, `${label} must contain a main element`);

  for (const id of ['work', 'experience', 'education', 'recognition', 'contact']) {
    assert.match(html, new RegExp(`\\bid=["']${id}["']`, 'i'), `${label} must contain #${id}`);
  }

  assert.match(html, /<link\b[^>]*\brel=["']canonical["'][^>]*>/i, `${label} must define a canonical URL`);
  assert.match(html, /<link\b[^>]*\bhreflang=["']en["'][^>]*>/i, `${label} must define hreflang=en`);
  assert.match(html, /<link\b[^>]*\bhreflang=["']zh-CN["'][^>]*>/i, `${label} must define hreflang=zh-CN`);
}

for (const text of ['Jinshuai Zhang', 'Recommendation Algorithms', 'Toolscaler', 'FGAD']) {
  assert.ok(english.includes(text), `English page must contain ${text}`);
}

for (const text of ['张金帅', '推荐算法']) {
  assert.ok(chinese.includes(text), `Chinese page must contain ${text}`);
}

for (const text of ['zhangjinshuai0711@163.com', 'github.com/zhangjinshuai0711']) {
  assert.ok(publicText.includes(text), `Public text must contain ${text}`);
}

for (const text of ['15227301392', 'Youny711', '中共党员']) {
  assert.ok(!publicText.includes(text), `Public text must not contain ${text}`);
}

const decode = (codePoints) => String.fromCodePoint(...codePoints);
const encodedPattern = (codePoints) => new RegExp(decode(codePoints), 'i');

const confidentialPatterns = [
  encodedPattern([66, 121, 116, 101, 68, 97, 110, 99, 101]),
  encodedPattern([84, 105, 107, 84, 111, 107]),
  encodedPattern([23383, 33410]),
  encodedPattern([25238, 38899]),
  new RegExp(`\\b${decode([65, 47, 66])}\\b`, 'i'),
  new RegExp(`\\b${decode([68, 65, 85])}\\b`, 'i'),
  new RegExp(`\\b${decode([86, 86])}\\b`, 'i'),
  new RegExp(`\\b${decode([67, 84, 82])}\\b`, 'i'),
  encodedPattern([97, 110, 99, 104, 111, 114, 32, 114, 97, 110, 107, 105, 110, 103]),
  encodedPattern([38170, 28857, 31934, 25490]),
  encodedPattern([99, 111, 97, 114, 115, 101, 45, 114, 97, 110, 107, 32, 99, 97, 110, 100, 105, 100, 97, 116, 101]),
  encodedPattern([31895, 25490, 25193, 20505, 36873]),
  encodedPattern([112, 101, 114, 115, 111, 110, 97, 108, 105, 122, 101, 100, 32, 102, 105, 110, 101, 45, 114, 97, 110, 107]),
  encodedPattern([31934, 25490, 20010, 24615, 21270, 25552, 26435]),
  encodedPattern([115, 116, 114, 101, 97, 109, 105, 110, 103, 32, 97, 110, 100, 32, 98, 97, 116, 99, 104, 32, 116, 114, 97, 105, 110, 105, 110, 103, 32, 112, 105, 112, 101, 108, 105, 110, 101, 115]),
  encodedPattern([27969, 24335, 19982, 25209, 24335, 35757, 32451, 38142, 36335]),
];

for (const pattern of confidentialPatterns) {
  assert.doesNotMatch(publicTextTree, pattern, `Public repository text must not match ${pattern}`);
}

for (const pattern of [/\+\d+(?:\.\d+)?%/, /\b0\.\d+\s*\/\s*0\.\d+\b/, /<dl\b[^>]*class=["'][^"']*\bmetrics\b/i]) {
  assert.doesNotMatch(publicText, pattern, `Public pages must not expose business metrics matching ${pattern}`);
}

assert.doesNotMatch(publicText, /href\s*=\s*["'][^"']*\.pdf(?:[?#][^"']*)?["']/i, 'Public pages must not link to PDF files');
assert.match(files['assets/css/main.css'], /prefers-reduced-motion/i, 'CSS must respect prefers-reduced-motion');
assert.ok(files['sitemap.xml'].includes('https://zhangjinshuai0711.github.io/'), 'Sitemap must contain the English production URL');
assert.ok(files['sitemap.xml'].includes('https://zhangjinshuai0711.github.io/zh/'), 'Sitemap must contain the Chinese production URL');

console.log('site contract: PASS');
