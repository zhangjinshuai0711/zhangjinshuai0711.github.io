# Homepage Divider Spacing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Shorten the default homepage academic identity rules by 24px on desktop so they do not visually collide with the portrait divider, while retaining full-width mobile rules.

**Architecture:** Keep the existing bilingual HTML unchanged and move the decorative top and bottom rules from element borders to shared CSS pseudo-elements. Protect the desktop inset and mobile reset with the existing static contract, then verify computed styles and screenshots in a real browser.

**Tech Stack:** Static CSS, Node.js `assert` contract tests, Python static server, Playwright browser automation.

---

## File Map

- Modify `tests/site-contract.mjs`: require pseudo-element rules, the `1.5rem` desktop inset, and the mobile `right: 0` reset.
- Modify `assets/css/main.css`: replace full-width borders with inset pseudo-elements.
- Verify `index.html` and `zh/index.html` without modifying them.
- Do not modify `soe/index.html` or `assets/css/soe.css`.

### Task 1: Add the Divider Spacing Contract

**Files:**
- Modify: `tests/site-contract.mjs:180-183`

- [ ] **Step 1: Add failing CSS structure assertions**

After the existing `mainCssWithoutComments` assertion, add:

```js
assert.match(
  mainCssWithoutComments,
  /\.academic-identity::before\s*,\s*\.academic-identity::after\s*\{[\s\S]*?right:\s*1\.5rem;/i,
  'Academic identity rules must stop 24px before the desktop divider',
);
assert.match(
  mainCssWithoutComments,
  /@media\s*\(max-width:\s*560px\)[\s\S]*?\.academic-identity::before\s*,\s*\.academic-identity::after\s*\{[\s\S]*?right:\s*0;/i,
  'Academic identity rules must return to full width on mobile',
);
```

- [ ] **Step 2: Run the contract and verify the red state**

Run:

```bash
/Users/zhangjinshuai/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/site-contract.mjs
```

Expected: FAIL with `Academic identity rules must stop 24px before the desktop divider`.

- [ ] **Step 3: Commit the failing contract**

```bash
git add tests/site-contract.mjs
git commit -m "test: define homepage divider spacing contract"
```

### Task 2: Implement Inset Desktop Rules

**Files:**
- Modify: `assets/css/main.css:216-226`
- Modify: `assets/css/main.css:883-889`

- [ ] **Step 1: Replace the full-width borders with pseudo-elements**

Update the base academic identity rules to:

```css
.academic-identity {
  position: relative;
  display: grid;
  grid-template-columns: 4rem minmax(0, 1fr);
  gap: 1rem;
  align-items: center;
  margin-top: 1.25rem;
  padding: 1rem 0;
}

.academic-identity::before,
.academic-identity::after {
  position: absolute;
  right: 1.5rem;
  left: 0;
  content: "";
  pointer-events: none;
}

.academic-identity::before {
  top: 0;
  height: 2px;
  background: var(--blue);
}

.academic-identity::after {
  bottom: 0;
  height: 1px;
  background: var(--line);
}
```

- [ ] **Step 2: Restore full-width rules at the mobile breakpoint**

Inside `@media (max-width: 560px)`, after the existing `.academic-identity` block, add:

```css
.academic-identity::before,
.academic-identity::after {
  right: 0;
}
```

- [ ] **Step 3: Run automated checks**

Run:

```bash
/Users/zhangjinshuai/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/site-contract.mjs
/Users/zhangjinshuai/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check assets/js/main.js
git diff --check
```

Expected: `site contract: PASS`; JavaScript and diff checks exit with status 0.

- [ ] **Step 4: Commit the CSS implementation**

```bash
git add assets/css/main.css
git commit -m "style: refine homepage divider spacing"
```

### Task 3: Browser Verification and Publication

**Files:**
- Verify: `index.html`
- Verify: `zh/index.html`
- Verify: `soe/index.html`

- [ ] **Step 1: Start the local static server**

Run from the repository root:

```bash
/Users/zhangjinshuai/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 -m http.server 4174
```

Expected: the preview is available at `http://127.0.0.1:4174/`.

- [ ] **Step 2: Verify desktop computed spacing and screenshots**

Open `/` and `/zh/` at `1440 × 1000`. For each page, verify:

```text
getComputedStyle(document.querySelector('.academic-identity'), '::before').right === '24px'
getComputedStyle(document.querySelector('.academic-identity'), '::after').right === '24px'
document.documentElement.scrollWidth === window.innerWidth
```

Capture viewport screenshots and confirm both horizontal lines end visibly before the portrait divider without changing content alignment.

- [ ] **Step 3: Verify mobile computed spacing and screenshots**

Open `/` and `/zh/` at `390 × 844` and `360 × 800`. For each page, verify:

```text
getComputedStyle(document.querySelector('.academic-identity'), '::before').right === '0px'
getComputedStyle(document.querySelector('.academic-identity'), '::after').right === '0px'
document.documentElement.scrollWidth === window.innerWidth
```

Capture viewport screenshots and confirm the rules remain full width and the existing mobile layout is unchanged.

- [ ] **Step 4: Confirm the SOE edition is unchanged**

Open `/soe/` and verify it contains no `.academic-identity` component and its hero appearance matches the current production edition.

- [ ] **Step 5: Run final checks and push `main`**

```bash
/Users/zhangjinshuai/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/site-contract.mjs
git status -sb
git push origin main
```

Expected: the contract passes, the working tree is clean, and Git reports `main -> main`.

- [ ] **Step 6: Verify GitHub Pages deployment**

Check the latest `pages build and deployment` workflow for the pushed commit and confirm `status: completed` with `conclusion: success` before sharing the versioned production links.
