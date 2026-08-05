import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const requiredFiles = [
  'index.html',
  'zh/index.html',
  'soe/index.html',
  '404.html',
  'assets/css/main.css',
  'assets/css/soe.css',
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
const soe = files['soe/index.html'];
const publicText = `${english}\n${chinese}\n${soe}\n${files['404.html']}`;

function classTokenPattern(className) {
  return `\\bclass=["'][\\t\\r\\n\\f ]*(?:[^"'\\s]+[\\t\\r\\n\\f ]+)*${className}(?:[\\t\\r\\n\\f ]+[^"'\\s]+)*[\\t\\r\\n\\f ]*["']`;
}

function findElementByClass(html, className) {
  const opening = new RegExp(
    `<([a-z][\\w:-]*)\\b(?=[^>]*${classTokenPattern(className)})[^>]*>`,
    'i',
  ).exec(html);
  if (!opening) return null;

  const tagName = opening[1];
  const tags = new RegExp(`<\\/?${tagName}\\b[^>]*>`, 'gi');
  tags.lastIndex = opening.index + opening[0].length;
  let depth = 1;

  for (let tag = tags.exec(html); tag; tag = tags.exec(html)) {
    if (tag[0].startsWith('</')) {
      depth -= 1;
      if (depth === 0) return html.slice(opening.index, tags.lastIndex);
    } else if (!tag[0].endsWith('/>')) {
      depth += 1;
    }
  }

  return null;
}

assert.match(english, /<html\b[^>]*\blang=["']en["']/i, 'English page must use lang=en');
assert.match(chinese, /<html\b[^>]*\blang=["']zh-CN["']/i, 'Chinese page must use lang=zh-CN');
assert.match(soe, /<html\b[^>]*\blang=["']zh-CN["']/i, 'SOE page must use lang=zh-CN');

for (const id of ['overview', 'education', 'experience', 'projects', 'service', 'honors', 'contact']) {
  assert.match(soe, new RegExp(`\\bid=["']${id}["']`, 'i'), `SOE page must contain #${id}`);
}

for (const text of [
  '中共党员',
  '2025.06.18 转正',
  '电子信息（085400）',
  '网络科学与网络空间研究院',
  '计算机科学与技术学院',
  '自强不息，厚德载物',
  '班级就业联络员',
  '校友大使',
  '信息科技',
  '算法',
  '网络安全',
  '2 / 75',
  '94.09 / 100',
  '字节跳动',
  '中国科学院自动化研究所',
  'ICES 企业与服务智能计算研究中心',
  '大型内容推荐排序链路建设与优化',
  'ToolScaler：基于结构感知语义标记的可扩展生成式工具调用',
  'FGAD：反馈引导的异常扩散抑制图异常检测',
  'ZDC 智盾链：基于图异常检测的智能反洗钱研究原型',
  'SCWatch / 供链智防：供应链智能风控竞赛系统',
  'BCWatch：区块链异常交易检测系统',
  '面向微服务根因定位的图异常检测研究与工程原型',
  '学生工作',
  '社会实践与志愿服务',
  '个人荣誉',
  '竞赛奖项',
  '奖学金',
  '专业技能与证书',
]) {
  assert.ok(soe.includes(text), `SOE page must contain ${text}`);
}

assert.match(soe, /<link\b[^>]*\brel=["']canonical["'][^>]*href=["']https:\/\/zhangjinshuai0711\.github\.io\/soe\/["']/i, 'SOE page must define its canonical URL');
assert.match(soe, /<meta\b[^>]*\bproperty=["']og:title["'][^>]*>/i, 'SOE page must define Open Graph metadata');
assert.match(soe, /<details\b/i, 'SOE page must use native details for long indexes');
assert.match(soe, /class=["'][^"']*front-honors[^"']*["']/i, 'SOE page must place selected honors near the top');
assert.match(soe, /class=["'][^"']*front-competition[^"']*["']/i, 'SOE page must separate selected competition awards');
assert.match(soe, /class=["'][^"']*front-personal[^"']*["']/i, 'SOE page must separate selected personal honors');
assert.match(soe, /class=["'][^"']*tsinghua-name[^"']*["'][^>]*>清华大学</i, 'SOE page must visually emphasize Tsinghua University');
assert.match(soe, /class=["'][^"']*front-personal[^"']*["'][^>]*>[\s\S]*?优秀团员标兵[\s\S]*?<\/section>/i, 'Selected personal honors must feature Model Communist Youth League Member');
assert.match(soe, /class=["'][^"']*honor-featured[^"']*["'][^>]*>[\s\S]*?优秀团员标兵[\s\S]*?<\/div>\s*<\/div>/i, 'Featured honors must include Model Communist Youth League Member');
assert.match(files['assets/css/soe.css'], /\.tsinghua-name\b/i, 'SOE CSS must style the emphasized Tsinghua name');
assert.doesNotMatch(soe, /规格严格，功夫到家|网络空间安全方向/, 'SOE page must use the current Tsinghua motto and degree name');
assert.ok(!soe.includes('全国大学生信息安全竞赛作品赛 · 队长'), 'Selected information security award must not show the team-lead title');
assert.ok(!soe.includes('全国大学生信息安全竞赛作品赛 · 全国三等奖（队长）'), 'Information security award index must not show the team-lead title');
assert.ok(!soe.includes('全国大学生信息安全竞赛作品赛全国三等奖 · 队长'), 'Information security project metadata must not show the team-lead title');
assert.match(soe, /班长<\/span><time>2024 至 2026<\/time>/, 'Student role index must use the full class-monitor term');
assert.match(soe, /班级就业联络员<\/span><time>2025 至 2026<\/time>/, 'Student role index must include employment liaison');
assert.match(soe, /校友大使<\/span><time>2026 至今<\/time>/, 'Student role index must include alumni ambassador');
assert.ok(!soe.includes('班长</span><time>2024 至 2025</time>'), 'SOE page must not retain the old class-monitor term');

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

for (const [label, html, institution, degree, school] of [
  ['English page', english, 'Tsinghua University', 'M.E. in Electronic Information (085400)', 'Institute for Network Sciences and Cyberspace · 2026-Present'],
  ['Chinese page', chinese, '清华大学', '电子信息（085400）硕士研究生', '网络科学与网络空间研究院 · 2026年至今'],
]) {
  const academicIdentity = findElementByClass(html, 'academic-identity');
  assert.ok(academicIdentity, `${label} must contain the academic identity lockup`);
  assert.match(
    academicIdentity,
    new RegExp(
      `<img\\b(?=[^>]*${classTokenPattern('academic-seal')})(?=[^>]*\\bsrc=["']\\/assets\\/images\\/tsinghua-seal\\.webp["'])[^>]*>`,
      'i',
    ),
    `${label} must use the local Tsinghua seal`,
  );
  assert.ok(academicIdentity.includes(institution), `${label} must show ${institution}`);
  assert.ok(academicIdentity.includes(degree), `${label} must show ${degree}`);
  assert.ok(academicIdentity.includes(school), `${label} must show ${school}`);
}
const englishHeroName = english.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
assert.ok(englishHeroName, 'English page must contain a hero h1');
assert.doesNotMatch(englishHeroName[1], /<br\b/i, 'English hero name must not use a forced line break');
assert.equal(englishHeroName[1].trim(), 'Jinshuai Zhang', 'English hero name must remain on one line');
assert.doesNotMatch(soe, new RegExp(classTokenPattern('academic-identity'), 'i'), 'SOE page must not receive the default homepage identity lockup');
assert.ok(existsSync(join(root, 'assets/images/tsinghua-seal.webp')), 'Tsinghua seal asset must exist');
const mainCssWithoutComments = files['assets/css/main.css'].replace(/\/\*[\s\S]*?\*\//g, '');
assert.match(mainCssWithoutComments, /\.academic-identity\s*\{/i, 'Shared CSS must style the academic identity lockup');

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

for (const text of ['15227301392', 'Youny711']) {
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
assert.ok(files['sitemap.xml'].includes('https://zhangjinshuai0711.github.io/soe/'), 'Sitemap must contain the SOE production URL');

for (const [html, expected] of [
  [english, 'M.E. in Electronic Information (085400)'],
  [chinese, '电子信息（085400）硕士研究生'],
]) {
  assert.ok(html.includes(expected), `Existing homepage must contain ${expected}`);
}

assert.ok(english.includes('School of Computer Science and Technology'), 'English undergraduate education must name its school');
assert.ok(chinese.includes('计算机科学与技术学院'), 'Chinese undergraduate education must name its school');

assert.doesNotMatch(soe, /href\s*=\s*["'][^"']*\.pdf(?:[?#][^"']*)?["']/i, 'SOE page must not link to PDF files');
assert.match(files['assets/css/soe.css'], /prefers-reduced-motion/i, 'SOE CSS must respect prefers-reduced-motion');

console.log('site contract: PASS');
