# Homepage Academic Identity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Tsinghua University and the Electronic Information program immediate first-screen signals on the default English and Chinese homepages, using the supplied seal while keeping both names on one line.

**Architecture:** Add the same semantic academic-identity component to the two static hero sections and style it through their existing shared stylesheet. Store one optimized local WebP seal and protect the component, copy, name wrapping, page scope, and asset path through the existing Node contract test.

**Tech Stack:** Static HTML5, shared CSS, Node.js `assert` contract tests, macOS `sips`, Python static server, browser screenshots.

---

## File Map

- Create `assets/images/tsinghua-seal.webp`: optimized local seal shared by both default homepages.
- Modify `index.html`: English academic identity lockup and one-line name.
- Modify `zh/index.html`: Chinese academic identity lockup and one-line name.
- Modify `assets/css/main.css`: identity lockup, one-line name, and narrow-screen single-column hero.
- Modify `tests/site-contract.mjs`: structural, copy, asset, scope, and wrapping contracts.
- Modify `.gitignore`: exclude persistent visual brainstorming previews.
- Do not modify `soe/index.html` or `assets/css/soe.css`.

### Task 1: Add Failing Academic Identity Contracts

**Files:**
- Modify: `tests/site-contract.mjs:1-2`
- Modify: `tests/site-contract.mjs:90-127`
- Modify: `tests/site-contract.mjs:256-268`

- [ ] **Step 1: Import the binary asset existence helper**

Replace the filesystem import with:

```js
import { existsSync, readFileSync } from 'node:fs';
```

- [ ] **Step 2: Add exact hero identity assertions**

After the existing English/Chinese page structure loop, add:

```js
for (const [label, html, institution, degree, school] of [
  [
    'English page',
    english,
    'Tsinghua University',
    'M.E. in Electronic Information (085400)',
    'Institute for Network Sciences and Cyberspace · 2026-Present',
  ],
  [
    'Chinese page',
    chinese,
    '清华大学',
    '电子信息（085400）硕士研究生',
    '网络科学与网络空间研究院 · 2026年至今',
  ],
]) {
  assert.match(html, /class=["'][^"']*academic-identity[^"']*["']/i, `${label} must contain the academic identity lockup`);
  assert.match(html, /<img\b[^>]*class=["'][^"']*academic-seal[^"']*["'][^>]*src=["']\/assets\/images\/tsinghua-seal\.webp["']/i, `${label} must use the local Tsinghua seal`);
  assert.ok(html.includes(institution), `${label} must show ${institution}`);
  assert.ok(html.includes(degree), `${label} must show ${degree}`);
  assert.ok(html.includes(school), `${label} must show ${school}`);
}

const englishHeroName = english.match(/<h1>([\s\S]*?)<\/h1>/i);
assert.ok(englishHeroName, 'English page must contain a hero h1');
assert.equal(englishHeroName[1].trim(), 'Jinshuai Zhang', 'English hero name must remain on one line');
assert.doesNotMatch(englishHeroName[1], /<br\b/i, 'English hero name must not use a forced line break');
assert.doesNotMatch(soe, /class=["'][^"']*academic-identity[^"']*["']/i, 'SOE page must not receive the default homepage identity lockup');
assert.ok(existsSync(join(root, 'assets/images/tsinghua-seal.webp')), 'Tsinghua seal asset must exist');
assert.match(files['assets/css/main.css'], /\.academic-identity\b/i, 'Shared CSS must style the academic identity lockup');
```

- [ ] **Step 3: Update the old degree-copy contract**

Replace the final homepage degree loop with:

```js
for (const [html, expected] of [
  [english, 'M.E. in Electronic Information (085400)'],
  [chinese, '电子信息（085400）硕士研究生'],
]) {
  assert.ok(html.includes(expected), `Existing homepage must contain ${expected}`);
}
```

- [ ] **Step 4: Run the contract and verify it fails for the new component**

Run:

```bash
/Users/zhangjinshuai/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/site-contract.mjs
```

Expected: FAIL with `English page must contain the academic identity lockup`.

- [ ] **Step 5: Commit the failing contract**

```bash
git add tests/site-contract.mjs
git commit -m "test: define homepage academic identity contract"
```

### Task 2: Create the Local Seal and Semantic Hero Markup

**Files:**
- Create: `assets/images/tsinghua-seal.webp`
- Modify: `index.html:43-48`
- Modify: `zh/index.html:43-48`

- [ ] **Step 1: Generate the optimized seal asset**

Run:

```bash
sips -Z 192 -s format webp '/Users/zhangjinshuai/Pictures/办公文件/清华/thu校徽.jpg' --out assets/images/tsinghua-seal.webp
```

Expected: `assets/images/tsinghua-seal.webp` is created at approximately `192 × 191` pixels and is substantially smaller than the 600 px source JPEG.

- [ ] **Step 2: Replace the English hero identity and name markup**

In `index.html`, keep the eyebrow and replace the existing `h1` and `hero-status` with this order:

```html
<div class="academic-identity">
  <img class="academic-seal" src="/assets/images/tsinghua-seal.webp" width="192" height="191" alt="Tsinghua University seal" decoding="async">
  <div>
    <p class="academic-institution">Tsinghua University</p>
    <p class="academic-degree">M.E. in Electronic Information (085400)</p>
    <p class="academic-school">Institute for Network Sciences and Cyberspace · 2026-Present</p>
  </div>
</div>
<h1>Jinshuai Zhang</h1>
<p class="hero-intro">I build ranking and learning systems for practical recommendation problems, supported by research in scalable tool calling and graph machine learning.</p>
```

- [ ] **Step 3: Replace the Chinese hero identity and name markup**

In `zh/index.html`, keep the eyebrow and replace the existing `h1` and `hero-status` with:

```html
<div class="academic-identity">
  <img class="academic-seal" src="/assets/images/tsinghua-seal.webp" width="192" height="191" alt="清华大学校徽" decoding="async">
  <div>
    <p class="academic-institution">清华大学</p>
    <p class="academic-degree">电子信息（085400）硕士研究生</p>
    <p class="academic-school">网络科学与网络空间研究院 · 2026年至今</p>
  </div>
</div>
<h1>张金帅</h1>
<p class="hero-intro">面向实际推荐问题构建排序与学习系统，并持续研究可扩展工具调用与图机器学习。</p>
```

- [ ] **Step 4: Run the contract and verify that only CSS remains missing**

Run the Node contract command from Task 1.

Expected: FAIL with `Shared CSS must style the academic identity lockup`.

- [ ] **Step 5: Commit the asset and markup**

```bash
git add assets/images/tsinghua-seal.webp index.html zh/index.html
git commit -m "feat: add bilingual Tsinghua identity lockup"
```

### Task 3: Style the Identity Lockup and Responsive Hero

**Files:**
- Modify: `assets/css/main.css:191-258`
- Modify: `assets/css/main.css:817-878`
- Modify: `assets/css/main.css:970-986`

- [ ] **Step 1: Remove `hero-status` from the shared label selector and delete its standalone rule**

The shared selector should end with `.date`, and the obsolete `.hero-status` block should be removed because the new lockup owns that information.

- [ ] **Step 2: Add the academic identity styles before `.hero h1`**

```css
.academic-identity {
  display: grid;
  grid-template-columns: 4rem minmax(0, 1fr);
  gap: 1rem;
  align-items: center;
  margin-top: 1.25rem;
  padding: 1rem 0;
  border-top: 2px solid var(--blue);
  border-bottom: 1px solid var(--line);
}

.academic-seal {
  width: 3.75rem;
  height: 3.75rem;
  border-radius: 50%;
  object-fit: cover;
}

.academic-identity p {
  margin: 0;
}

.academic-institution {
  color: var(--blue);
  font-family: var(--display);
  font-size: 2.15rem;
  font-weight: 600;
  line-height: 1.05;
}

[lang="zh-CN"] .academic-institution {
  font-family: "STSong", "Songti SC", var(--display);
}

.academic-degree {
  margin-top: 0.45rem !important;
  font-size: 0.82rem;
  font-weight: 700;
}

.academic-school {
  margin-top: 0.2rem !important;
  color: var(--muted);
  font-size: 0.7rem;
  line-height: 1.45;
}
```

- [ ] **Step 3: Make both hero names single-line and rebalance spacing**

Update the hero name and intro rules:

```css
.hero h1 {
  max-width: none;
  margin: 1.25rem 0;
  font-family: var(--display);
  font-size: 5.8rem;
  font-weight: 450;
  line-height: 0.95;
  letter-spacing: 0;
  white-space: nowrap;
}

[lang="zh-CN"] .hero h1 {
  font-family: "STSong", "Songti SC", var(--display);
  font-size: 5.4rem;
  line-height: 1;
}
```

- [ ] **Step 4: Add tablet scaling inside the existing tablet media query**

```css
.academic-institution {
  font-size: 1.75rem;
}

.hero h1 {
  font-size: 4.2rem;
}

[lang="zh-CN"] .hero h1 {
  font-size: 4rem;
}
```

- [ ] **Step 5: Replace the narrow mobile hero rules with a single-column layout**

Inside `@media (max-width: 560px)`, use:

```css
.hero {
  grid-template-columns: minmax(0, 1fr);
  gap: 1.25rem;
  align-items: stretch;
  min-height: auto;
  padding-top: 1.75rem;
  padding-bottom: 4.5rem;
}

.hero-copy {
  min-width: 0;
}

.academic-identity {
  grid-template-columns: 3rem minmax(0, 1fr);
  gap: 0.7rem;
  margin-top: 1rem;
  padding: 0.75rem 0;
}

.academic-seal {
  width: 2.75rem;
  height: 2.75rem;
}

.academic-institution {
  font-size: 1.45rem;
}

.academic-degree {
  font-size: 0.68rem;
}

.academic-school {
  font-size: 0.62rem;
}

.hero h1,
[lang="zh-CN"] .hero h1 {
  margin: 1rem 0;
  font-size: 3rem;
}

[lang="zh-CN"] .hero h1 {
  font-size: 2.8rem;
}

.hero-portrait,
.hero-portrait img {
  width: 100%;
  min-height: 0;
  height: auto;
  aspect-ratio: 4 / 3;
}
```

Replace the `@media (max-width: 360px)` two-column grid override with this fixed name adjustment:

```css
@media (max-width: 360px) {
  .hero h1 {
    font-size: 2.6rem;
  }

  [lang="zh-CN"] .hero h1 {
    font-size: 2.5rem;
  }
}
```

- [ ] **Step 6: Run automated checks**

Run:

```bash
/Users/zhangjinshuai/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/site-contract.mjs
/Users/zhangjinshuai/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check assets/js/main.js
```

Expected: `site contract: PASS`; JavaScript syntax check exits with status 0.

- [ ] **Step 7: Commit the responsive styling**

```bash
git add assets/css/main.css tests/site-contract.mjs
git commit -m "style: emphasize homepage academic identity"
```

### Task 4: Visual and Regression Verification

**Files:**
- Verify: `index.html`
- Verify: `zh/index.html`
- Verify: `soe/index.html`
- Verify: `assets/images/tsinghua-seal.webp`
- Modify: `.gitignore`

- [ ] **Step 1: Start the static preview server**

Run:

```bash
/Users/zhangjinshuai/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 -m http.server 4173
```

Expected: the site is available at `http://127.0.0.1:4173/`.

- [ ] **Step 2: Capture English and Chinese desktop screenshots**

Open `/` and `/zh/` at `1440 × 1000`. Verify that the seal loads locally, Tsinghua University and Electronic Information are readable before the name, the name remains one line, and the portrait does not overlap the lockup.

- [ ] **Step 3: Capture English and Chinese mobile screenshots**

Open `/` and `/zh/` at `390 × 844` and `360 × 800`. Verify the single-column order, one-line name, natural degree wrapping, stable seal dimensions, full-width portrait, and absence of horizontal overflow.

- [ ] **Step 4: Check the unchanged SOE edition**

Open `/soe/` at `1440 × 1000` and verify that its hero and Tsinghua treatment are unchanged.

- [ ] **Step 5: Exclude the persistent visual companion workspace**

Append this line to `.gitignore`:

```gitignore
.superpowers/
```

- [ ] **Step 6: Re-run checks and inspect the final diff**

```bash
/Users/zhangjinshuai/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/site-contract.mjs
git diff --check
git status --short
```

Expected: contract passes, `git diff --check` prints nothing, `.superpowers/` is absent from status, and status contains only intentional project changes.

- [ ] **Step 7: Commit any screenshot-driven refinements and ignore rule**

```bash
git add .gitignore index.html zh/index.html assets/css/main.css tests/site-contract.mjs assets/images/tsinghua-seal.webp
git commit -m "fix: refine academic identity across viewports"
```

Skip this commit when visual verification requires no code changes.
