import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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

assert.match(english, /<html\b[^>]*\blang=["']en["']/i, 'English page must use lang=en');
assert.match(chinese, /<html\b[^>]*\blang=["']zh-CN["']/i, 'Chinese page must use lang=zh-CN');

for (const [label, html] of [
  ['English page', english],
  ['Chinese page', chinese],
]) {
  assert.match(html, /<main\b/i, `${label} must contain a main element`);

  for (const id of ['awards', 'work', 'experience', 'education', 'contact']) {
    assert.match(html, new RegExp(`\\bid=["']${id}["']`, 'i'), `${label} must contain #${id}`);
  }

  assert.match(
    html,
    /class=["'][^"']*award-group[^"']*competition-awards/i,
    `${label} must contain a competition awards group`,
  );
  assert.match(
    html,
    /class=["'][^"']*award-group[^"']*personal-honors/i,
    `${label} must contain a personal honors group`,
  );

  assert.match(html, /<link\b[^>]*\brel=["']canonical["'][^>]*>/i, `${label} must define a canonical URL`);
  assert.match(html, /<link\b[^>]*\bhreflang=["']en["'][^>]*>/i, `${label} must define hreflang=en`);
  assert.match(html, /<link\b[^>]*\bhreflang=["']zh-CN["'][^>]*>/i, `${label} must define hreflang=zh-CN`);
}

for (const text of [
  'Jinshuai Zhang',
  'Recommendation Algorithms',
  'ByteDance',
  'Large-scale Content Recommendation Ranking Optimization',
  'ToolScaler: Scalable Generative Tool Calling via Structure-Aware Semantic Tokenization',
  'FGAD: Feedback-Guided Anomalous Diffusion Suppression for Graph Anomaly Detection',
  'ZDC: Intelligent Anti-Money Laundering Detection Platform',
  'Graph Anomaly Detection for Microservice Root-Cause Localization',
  'Competition Awards',
  'Personal Honors',
  'privacy-safe sample construction',
  'controlled online validation',
  'semantic compression',
  'iterative training',
  'attribute reconstruction',
  'structural consistency',
  'adaptive diffusion',
  'Metis',
  'model training and method innovation',
  'edge-aware aggregation',
  'CET-6',
  'Database Systems (99)',
]) {
  assert.ok(english.includes(text), `English page must contain ${text}`);
}

for (const text of [
  '张金帅',
  '推荐算法',
  '字节跳动',
  '大型内容推荐排序优化',
  '竞赛奖项',
  '个人荣誉',
  '国家奖学金',
  '优秀毕业生',
  '隐私安全的样本构建',
  '受控线上验证',
  '语义压缩',
  '迭代训练',
  '属性重构',
  '结构一致性',
  '自适应扩散',
  'Metis',
  '模型训练与方法创新',
  '边特征感知聚合',
  'CET-6',
  '数据库系统（99）',
]) {
  assert.ok(chinese.includes(text), `Chinese page must contain ${text}`);
}

function assertCurrentEducationArticle(html, label, date, school) {
  const article = html.match(
    /<article\b(?=[^>]*\bclass=["'][^"']*\beducation-current\b[^"']*["'])[^>]*>([\s\S]*?)<\/article>/i,
  );
  assert.ok(article, `${label} must contain an education-current article`);
  assert.ok(
    article[1].indexOf(date) >= 0 && article[1].indexOf(school) > article[1].indexOf(date),
    `${label} education-current article must list ${date} before ${school}`,
  );
}

assertCurrentEducationArticle(english, 'English page', '2026.09-Present', 'Tsinghua University');
assertCurrentEducationArticle(chinese, 'Chinese page', '2026.09-至今', '清华大学');

for (const text of ['zhangjinshuai0711@163.com', 'github.com/zhangjinshuai0711']) {
  assert.ok(publicText.includes(text), `Public text must contain ${text}`);
}

for (const text of ['15227301392', 'Youny711', '中共党员']) {
  assert.ok(!publicText.includes(text), `Public text must not contain ${text}`);
}

const decode = (codePoints) => String.fromCodePoint(...codePoints);
const encodedPattern = (codePoints) => new RegExp(decode(codePoints), 'i');

const confidentialPatterns = [
  encodedPattern([84, 105, 107, 84, 111, 107]),
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
  /\b(?:topic|slot|psm)\b/i,
];

for (const pattern of confidentialPatterns) {
  assert.doesNotMatch(publicText, pattern, `Public pages must not match ${pattern}`);
}

for (const pattern of [
  /\+111%|\+12\.8%|\+76\.9%/,
  /0\.81\s*\/\s*0\.79/,
  /10%\s*(?:traffic|流量)/i,
  /<dl\b[^>]*class=["'][^"']*\bmetrics\b/i,
]) {
  assert.doesNotMatch(publicText, pattern, `Public pages must not expose business metrics matching ${pattern}`);
}

for (const [label, html] of [
  ['English page', english],
  ['Chinese page', chinese],
]) {
  assert.match(
    html,
    /<img[^>]+jinshuai-zhang\.jpg[^>]+width=["']1000["'][^>]+height=["']1500["']/i,
    `${label} must use the supplied portrait dimensions`,
  );
  assert.equal(
    (html.match(/<article class=["'][^"']*\bwork\b[^"']*["']/g) ?? []).length,
    5,
    `${label} must contain exactly five projects`,
  );
}

assert.doesNotMatch(publicText, /href\s*=\s*["'][^"']*\.pdf(?:[?#][^"']*)?["']/i, 'Public pages must not link to PDF files');
assert.match(files['assets/css/main.css'], /prefers-reduced-motion/i, 'CSS must respect prefers-reduced-motion');
assert.ok(files['sitemap.xml'].includes('https://zhangjinshuai0711.github.io/'), 'Sitemap must contain the English production URL');
assert.ok(files['sitemap.xml'].includes('https://zhangjinshuai0711.github.io/zh/'), 'Sitemap must contain the Chinese production URL');

console.log('site contract: PASS');
