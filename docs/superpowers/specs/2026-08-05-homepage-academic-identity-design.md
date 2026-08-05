# Homepage Academic Identity Design

## Goal

Strengthen the first-screen visibility of Tsinghua University and the Electronic Information program on the default English and Chinese personal homepages. Preserve the site's job-oriented technical positioning and keep the person's name prominent without allowing it to wrap.

## Scope

- Update the English homepage at `/`.
- Update the Chinese homepage at `/zh/`.
- Update their shared stylesheet and contract tests.
- Add a locally hosted, optimized Tsinghua University seal derived from the user-provided `thu校徽.jpg`.
- Do not modify the state-owned enterprise edition at `/soe/`.
- Do not change the awards, projects, experience, education, or contact content below the hero.

## Hero Information Hierarchy

The hero copy uses this order:

1. Technical focus eyebrow.
2. Academic identity lockup with the Tsinghua seal.
3. Person's name on one line.
4. Existing technical summary.
5. Existing email and GitHub links.

The academic identity lockup places a restrained circular seal to the left of the institution text. A blue top rule and a neutral bottom rule separate the lockup from the surrounding content.

### English Content

- `Tsinghua University`
- `M.E. in Electronic Information (085400)`
- `Institute for Network Sciences and Cyberspace · 2026-Present`
- Name: `Jinshuai Zhang`, rendered on one line.

### Chinese Content

- `清华大学`
- `电子信息（085400）硕士研究生`
- `网络科学与网络空间研究院 · 2026年至今`
- Name: `张金帅`, rendered on one line.

## Visual Treatment

- Use the existing blue as the institution color so the change remains consistent with the current site.
- Render the institution name in a larger serif face and the degree in a smaller, bold sans-serif face.
- Keep the seal visually subordinate to the institution name, approximately 56-64 px on desktop and 42-48 px on mobile.
- Keep the existing name style, but remove the English line break and reduce its desktop size only as much as needed to fit one line.
- Preserve the existing portrait, background, navigation, and overall editorial design.

## Responsive Behavior

- Desktop and tablet retain the current copy-and-portrait composition.
- At narrow mobile widths, the hero becomes a single column: identity lockup, name, summary and links, then portrait.
- The English name must remain on one line at every supported width.
- Long English degree and institute text may wrap naturally within the identity text column without overlapping the seal.
- The seal has fixed responsive dimensions so loading and text do not shift the layout.

## Image Handling

- Use `/Users/zhangjinshuai/Pictures/办公文件/清华/thu校徽.jpg` as the source image.
- Generate a compact WebP asset sized for its maximum rendered dimensions.
- Store the generated asset under `assets/images/` and reference it locally from both pages.
- Set explicit image dimensions, descriptive alt text, and asynchronous decoding.
- Do not depend on an external logo URL.

## Verification

- Extend the site contract test to require the identity lockup, the exact English and Chinese institution and degree text, the local seal asset, and the absence of a forced line break inside the English name.
- Assert that `/soe/` does not receive the new identity lockup.
- Run the existing site contract test.
- Serve the static site locally and inspect desktop and mobile screenshots for wrapping, overlap, image loading, and first-screen hierarchy.

## Non-Goals

- Redesigning the rest of the homepage.
- Changing the state-owned enterprise edition.
- Adding a resume download or new contact information.
- Altering the user's portrait or enlarging the name.
