# SOE Homepage Hero Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Redesign only the /soe/ first-screen Hero with a full-width Tsinghua masthead, a desktop text-and-portrait split, a mobile single-column flow, plain-text email, and no Hero GitHub link or party-conversion date.

**Architecture:** Keep the existing static HTML, CSS, and JavaScript structure. Build the Hero from three explicit layout units: a full-width tsinghua-masthead, a hero-body containing hero-copy and hero-portrait, and the existing credential-row; use CSS display: contents only at the mobile breakpoint to enforce the approved reading order without duplicating content.

**Tech Stack:** Semantic HTML5, native CSS, existing vanilla JavaScript, Node.js contract tests, Playwright visual verification, GitHub Pages.

---

### Task 1: Create an isolated implementation worktree

**Files:**
- Read: docs/superpowers/specs/2026-08-06-soe-homepage-hero-redesign-design.md
- Modify: soe/index.html
- Modify: assets/css/soe.css
- Test: tests/site-contract.mjs

- [ ] **Step 1: Confirm the current public baseline**

Run:

~~~bash
git fetch origin
git rev-parse origin/main
git status --short
~~~

Expected: origin/main resolves successfully. The existing main worktree remains unchanged, including its local design commits, .superpowers directory, and uncommitted Hero files.

- [ ] **Step 2: Create a clean worktree from origin/main**

Run from the repository root:

~~~bash
git worktree add .worktrees/soe-hero-redesign -b codex/soe-hero-redesign origin/main
~~~

Expected: a clean worktree exists at .worktrees/soe-hero-redesign and git status --short inside it prints nothing.

- [ ] **Step 3: Verify the implementation scope**

Run:

~~~bash
git -C .worktrees/soe-hero-redesign status --short
git -C .worktrees/soe-hero-redesign log -1 --oneline
~~~

Expected: clean status and a baseline commit matching origin/main.

### Task 2: Add failing Hero contract assertions

**Files:**
- Modify: tests/site-contract.mjs:46-95
- Test: tests/site-contract.mjs

- [ ] **Step 1: Remove the obsolete required conversion date**

Delete this entry from the SOE required-text array:

~~~js
'2025.06.18 转正',
~~~

- [ ] **Step 2: Define the Hero test subject**

Insert immediately after the existing soe constant:

~~~js
const soeHero = soe.match(
  /<section\b[^>]*class=["'][^"']*\bhero\b[^"']*["'][^>]*>[\s\S]*?<\/section>/i,
)?.[0];

assert.ok(soeHero, 'SOE page must contain a hero section');
~~~

- [ ] **Step 3: Replace the identity-band assertions with the approved masthead contract**

Replace the old tsinghua-identity structure and CSS assertions with:

~~~js
assert.match(
  soeHero,
  /class=["'][^"']*tsinghua-masthead[^"']*["']/i,
  'SOE hero must use a full-width Tsinghua masthead',
);
assert.match(
  soeHero,
  /class=["'][^"']*hero-body[^"']*["']/i,
  'SOE hero must group copy and portrait below the masthead',
);
assert.match(
  soeHero,
  /<img\b[^>]*class=["'][^"']*tsinghua-mark[^"']*["'][^>]*src=["']\/assets\/images\/tsinghua-seal\.jpg["'][^>]*width=["']600["'][^>]*height=["']598["']/i,
  'SOE Tsinghua masthead must use the supplied seal dimensions',
);
assert.ok(
  soeHero.includes('网络科学与网络空间研究院 · 2026 至今'),
  'SOE masthead must show the institute and current study period',
);
assert.ok(
  soeHero.includes('zhangjinshuai0711@163.com'),
  'SOE hero must show the complete email address',
);
assert.doesNotMatch(
  soeHero,
  /href=["']mailto:/i,
  'SOE hero email must be plain text',
);
assert.doesNotMatch(
  soeHero,
  /github/i,
  'SOE hero must not include GitHub',
);
assert.doesNotMatch(
  soe,
  /2025\.06\.18\s*转正/,
  'SOE page must not publish the party-conversion date',
);
assert.match(
  files['assets/css/soe.css'],
  /\.tsinghua-masthead\b/i,
  'SOE CSS must style the Tsinghua masthead',
);
assert.match(
  files['assets/css/soe.css'],
  /\.hero-body\b/i,
  'SOE CSS must style the lower Hero split',
);
assert.match(
  files['assets/css/soe.css'],
  /\.hero-email\b/i,
  'SOE CSS must style the plain-text email',
);
~~~

Keep the existing seal existence and sub-100 KB assertions unchanged.

- [ ] **Step 4: Run the contract and verify that it fails for the intended reason**

Run inside the isolated worktree:

~~~bash
NODE=/Users/zhangjinshuai/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node
"$NODE" tests/site-contract.mjs
~~~

Expected: FAIL at the missing tsinghua-masthead assertion. A syntax error or unrelated assertion failure must be corrected before implementation.

### Task 3: Implement the approved semantic Hero structure

**Files:**
- Modify: soe/index.html:41-72
- Test: tests/site-contract.mjs

- [ ] **Step 1: Replace the current Hero markup**

Replace the existing Hero section with:

~~~html
<section class="hero" id="overview">
  <div class="tsinghua-masthead" aria-label="清华大学教育信息" data-reveal>
    <img class="tsinghua-mark" src="/assets/images/tsinghua-seal.jpg" width="600" height="598" alt="" decoding="async">
    <div class="tsinghua-details">
      <p class="tsinghua-name">清华大学</p>
      <p class="tsinghua-degree">电子信息（085400）</p>
      <p class="tsinghua-institute">网络科学与网络空间研究院 · 2026 至今</p>
    </div>
  </div>

  <div class="hero-body">
    <div class="hero-copy" data-reveal>
      <p class="hero-kicker"><span>中共党员</span> 信息科技 / 算法 / 网络安全</p>
      <h1>张金帅</h1>
      <p class="hero-role">推荐算法 · 机器学习 · 网络安全</p>
      <p class="hero-summary">具备推荐排序、图机器学习与大模型工具调用研究经历，也有完整的学生工作和社会实践经验。重视严谨、协作与工程落地，希望在关键行业的信息化建设中持续解决真实问题。</p>
      <p class="hero-email"><span>邮箱</span> zhangjinshuai0711@163.com</p>
    </div>

    <figure class="hero-portrait" data-reveal>
      <img src="/assets/images/jinshuai-zhang.jpg" width="1000" height="1500" alt="张金帅的半身照" decoding="async" fetchpriority="high">
      <figcaption>自强不息，厚德载物</figcaption>
    </figure>
  </div>

  <dl class="credential-row" aria-label="核心资历" data-reveal>
    <div><dt>本科专业排名</dt><dd>2 / 75</dd></div>
    <div><dt>本科 GPA</dt><dd>94.09 / 100</dd></div>
    <div><dt>个人荣誉</dt><dd>国家奖学金</dd></div>
    <div><dt>竞赛成果</dt><dd>全国特等奖</dd></div>
  </dl>
</section>
~~~

- [ ] **Step 2: Confirm the removed Hero actions are absent**

Run:

~~~bash
rg -n 'hero-actions|mailto:|github\.com' soe/index.html
~~~

Expected: matches may remain in the bottom contact section for mailto and GitHub, but no match occurs between the Hero opening and closing tags.

### Task 4: Implement desktop and mobile layout CSS

**Files:**
- Modify: assets/css/soe.css:174-369
- Modify: assets/css/soe.css:1166-1255
- Test: tests/site-contract.mjs

- [ ] **Step 1: Replace the desktop Hero layout and masthead rules**

Replace the current Hero grid, tsinghua-identity, and hero-actions blocks with:

~~~css
.hero {
  width: min(100%, var(--content));
  min-height: min(50rem, calc(100svh - 7.5rem));
  margin: 0 auto;
  padding: clamp(2.5rem, 5vh, 4rem) var(--gutter) 2.2rem;
}

.tsinghua-masthead {
  display: grid;
  grid-template-columns: 4.5rem minmax(0, 1fr);
  gap: 1.2rem;
  align-items: center;
  padding: 1.15rem 1.4rem;
  border-top: 3px solid var(--thu);
  border-bottom: 1px solid #d8d2da;
  background: #f1eef3;
}

.tsinghua-mark {
  width: 4.25rem;
  height: 4.25rem;
  border-radius: 50%;
  object-fit: cover;
}

.tsinghua-details {
  min-width: 0;
}

.tsinghua-name {
  margin: 0;
  color: var(--thu);
  font-family: var(--serif);
  font-size: clamp(2.5rem, 3.5vw, 3.4rem);
  font-weight: 650;
  line-height: 1;
}

.tsinghua-degree {
  margin: 0.55rem 0 0;
  color: var(--ink);
  font-size: 0.98rem;
  font-weight: 700;
}

.tsinghua-institute {
  margin: 0.18rem 0 0;
  color: var(--muted);
  font-size: 0.78rem;
  font-weight: 500;
}

.hero-body {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(19rem, 0.65fr);
  gap: clamp(2.5rem, 6vw, 6rem);
  align-items: stretch;
  min-height: 29rem;
  margin-top: 2rem;
}

.hero-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 46rem;
}

.hero-kicker {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  align-items: center;
  margin: 0 0 1.6rem;
  color: var(--muted);
  font-size: 0.82rem;
  font-weight: 600;
}

.hero-kicker span {
  padding: 0.18rem 0.55rem;
  border: 1px solid var(--red);
  border-radius: 2px;
  color: var(--red-dark);
  background: #fff8f8;
}

.hero h1 {
  margin: 0;
  font-family: var(--serif);
  font-size: clamp(3.8rem, 6vw, 5.5rem);
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0;
}

.hero-role {
  margin: 1.4rem 0 0;
  color: var(--blue-gray);
  font-size: 0.95rem;
  font-weight: 700;
}

.hero-summary {
  max-width: 41rem;
  margin: 1rem 0 0;
  color: var(--muted);
  font-size: 1.02rem;
}

.hero-email {
  margin: 1.5rem 0 0;
  color: var(--ink);
  font-size: 0.92rem;
  font-weight: 650;
  overflow-wrap: anywhere;
}

.hero-email span {
  margin-right: 0.7rem;
  color: var(--red-dark);
}
~~~

Keep the existing hero-portrait, credential-row, seal asset, and all below-Hero section styles. Remove grid-column: 1 / -1 from credential-row and add margin-top: 2rem.

- [ ] **Step 2: Replace the mobile Hero ordering rules**

Inside the existing max-width: 640px media query, replace the current Hero-specific rules with:

~~~css
.hero {
  display: flex;
  min-height: auto;
  flex-direction: column;
  align-items: stretch;
  padding-top: 2.25rem;
}

.tsinghua-masthead {
  order: 1;
  grid-template-columns: 3.2rem minmax(0, 1fr);
  gap: 0.8rem;
  padding: 0.85rem;
}

.tsinghua-mark {
  width: 3.2rem;
  height: 3.2rem;
}

.tsinghua-name {
  font-size: 2.2rem;
}

.tsinghua-degree {
  font-size: 0.82rem;
}

.tsinghua-institute {
  font-size: 0.7rem;
}

.hero-body,
.hero-copy {
  display: contents;
}

.hero-kicker {
  order: 2;
  margin: 1.6rem 0 0.8rem;
}

.hero h1 {
  order: 3;
  font-size: 3.8rem;
}

.hero-role {
  order: 4;
}

.hero-portrait {
  order: 5;
  width: 100%;
  min-height: 0;
  margin-top: 1.3rem;
  aspect-ratio: 4 / 3;
}

.hero-portrait img {
  min-height: 0;
  aspect-ratio: 4 / 3;
}

.hero-summary {
  order: 6;
  margin-top: 1.3rem;
}

.hero-email {
  order: 7;
}

.credential-row {
  order: 8;
  margin-top: 1.5rem;
}
~~~

Keep the existing two-column mobile credential-row rules.

- [ ] **Step 3: Run deterministic checks**

Run:

~~~bash
NODE=/Users/zhangjinshuai/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node
"$NODE" tests/site-contract.mjs
"$NODE" --check assets/js/main.js
git diff --check
~~~

Expected:

~~~text
site contract: PASS
~~~

The JavaScript syntax check and git diff check produce no output and exit zero.

- [ ] **Step 4: Commit the working implementation**

Run:

~~~bash
git add soe/index.html assets/css/soe.css tests/site-contract.mjs
git commit -m "feat: redesign SOE homepage hero"
~~~

Expected: one commit containing exactly the three listed files.

### Task 5: Verify desktop and mobile rendering

**Files:**
- Inspect: soe/index.html
- Inspect: assets/css/soe.css
- Temporary output: /tmp/soe-hero-desktop.png
- Temporary output: /tmp/soe-hero-mobile.png

- [ ] **Step 1: Start the local static server**

Run from the isolated worktree and keep the returned session active:

~~~bash
python3 -m http.server 4173 --bind 127.0.0.1
~~~

Expected: Serving HTTP on 127.0.0.1 port 4173.

- [ ] **Step 2: Capture desktop and mobile screenshots with the bundled Playwright**

Run the visual contract at exactly 1440 x 1000 and 390 x 844.

Create /tmp/soe-hero-visual-check.mjs with apply_patch using this complete script:

~~~js
import assert from 'node:assert/strict';
import { chromium } from 'file:///Users/zhangjinshuai/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const cases = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
];

const browser = await chromium.launch({ headless: true });

try {
  for (const testCase of cases) {
    const page = await browser.newPage({
      viewport: { width: testCase.width, height: testCase.height },
      deviceScaleFactor: 1,
    });

    await page.goto('http://127.0.0.1:4173/soe/', {
      waitUntil: 'networkidle',
    });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(
        [...document.images].map((img) => (
          img.complete ? undefined : img.decode()
        )),
      );
    });

    const metrics = await page.evaluate(() => {
      const rect = (selector) => {
        const box = document.querySelector(selector).getBoundingClientRect();
        return {
          top: box.top,
          right: box.right,
          bottom: box.bottom,
          left: box.left,
          width: box.width,
          height: box.height,
        };
      };
      const hero = document.querySelector('.hero');
      const email = document.querySelector('.hero-email');
      const mastheadImage = document.querySelector('.tsinghua-masthead img');

      return {
        overflow:
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
        heroText: hero.textContent,
        emailText: email.textContent,
        emailHasLink: email.querySelector('a') !== null,
        sealNaturalWidth: mastheadImage.naturalWidth,
        masthead: rect('.tsinghua-masthead'),
        name: rect('.hero h1'),
        copy: rect('.hero-copy'),
        role: rect('.hero-role'),
        portrait: rect('.hero-portrait'),
        summary: rect('.hero-summary'),
        email: rect('.hero-email'),
        credentials: rect('.credential-row'),
      };
    });

    assert.ok(metrics.overflow <= 0, testCase.name + ': horizontal overflow');
    assert.equal(metrics.sealNaturalWidth, 600, testCase.name + ': seal width');
    assert.ok(
      metrics.masthead.top < metrics.name.top,
      testCase.name + ': masthead must precede name',
    );
    assert.ok(
      metrics.emailText.includes('zhangjinshuai0711@163.com'),
      testCase.name + ': full email missing',
    );
    assert.equal(
      metrics.emailHasLink,
      false,
      testCase.name + ': Hero email must be plain text',
    );
    assert.ok(
      !metrics.heroText.includes('2025.06.18'),
      testCase.name + ': conversion date remains',
    );
    assert.ok(
      !metrics.heroText.includes('GitHub'),
      testCase.name + ': GitHub remains in Hero',
    );

    if (testCase.name === 'desktop') {
      assert.ok(
        metrics.masthead.width >= 1050,
        'desktop: masthead must span the Hero',
      );
      assert.ok(
        metrics.portrait.left > metrics.copy.left,
        'desktop: portrait must sit to the right of copy',
      );
    } else {
      const verticalOrder = [
        metrics.masthead.top,
        metrics.name.top,
        metrics.role.top,
        metrics.portrait.top,
        metrics.summary.top,
        metrics.email.top,
        metrics.credentials.top,
      ];
      assert.deepEqual(
        verticalOrder,
        [...verticalOrder].sort((a, b) => a - b),
        'mobile: Hero reading order is incorrect',
      );
    }

    await page.screenshot({
      path: '/tmp/soe-hero-' + testCase.name + '.png',
      fullPage: true,
    });
    await page.close();
  }
} finally {
  await browser.close();
}

console.log('SOE Hero visual contract: PASS');
~~~

Run:

~~~bash
NODE=/Users/zhangjinshuai/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node
"$NODE" /tmp/soe-hero-visual-check.mjs
~~~

Expected:

~~~text
SOE Hero visual contract: PASS
~~~

- [ ] **Step 3: Inspect both screenshots**

Verify visually:

- Desktop masthead spans the Hero width and remains above both copy and portrait.
- Desktop portrait shows the head and upper body without stretching.
- The name remains prominent but does not overwhelm the Tsinghua masthead.
- Mobile order is masthead, party and role line, name, capability focus, portrait, summary, email, credentials.
- The full email fits at 390 px with no clipping or overlap.
- The next section is hinted at on the 1440 x 1000 viewport.

- [ ] **Step 4: Re-run checks after visual inspection**

Run:

~~~bash
NODE=/Users/zhangjinshuai/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node
"$NODE" tests/site-contract.mjs
"$NODE" --check assets/js/main.js
git diff --check
git status --short
~~~

Expected: all checks pass and the worktree is clean after the implementation commit.

### Task 6: Publish and verify GitHub Pages

**Files:**
- Publish: soe/index.html
- Publish: assets/css/soe.css
- Publish: tests/site-contract.mjs

- [ ] **Step 1: Audit the branch diff**

Run:

~~~bash
git diff --name-status origin/main...HEAD
git log --oneline origin/main..HEAD
~~~

Expected: exactly soe/index.html, assets/css/soe.css, and tests/site-contract.mjs, with one implementation commit.

- [ ] **Step 2: Push the implementation commit**

Run:

~~~bash
git push origin HEAD:main
~~~

Expected: origin/main advances to the implementation commit without publishing local design documents or .superpowers content.

- [ ] **Step 3: Verify the remote branch**

Run:

~~~bash
git ls-remote origin refs/heads/main
git show origin/main:soe/index.html | rg 'tsinghua-masthead|zhangjinshuai0711@163.com|清华大学'
~~~

Expected: the remote branch points to the new commit and the three required strings are present.

- [ ] **Step 4: Verify the deployed page**

Run:

~~~bash
COMMIT=$(git rev-parse --short HEAD)
open "https://zhangjinshuai0711.github.io/soe/?v=$COMMIT"
~~~

Verify the deployed Hero matches the local desktop and mobile screenshots. If the Pages endpoint is temporarily unreachable, report the remote-branch verification separately and mark the deployed rendering as unverified.

- [ ] **Step 5: Clean up only the implementation worktree**

After the remote commit is verified and the worktree is clean, run:

~~~bash
git worktree remove .worktrees/soe-hero-redesign
git branch -d codex/soe-hero-redesign
~~~

Do not remove or modify other existing worktrees, the main worktree's uncommitted files, local design commits, or .superpowers content.
