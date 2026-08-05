# Homepage Divider Spacing Design

## Goal

Refine the default bilingual homepage hero so the academic identity rules do not visually collide with the vertical portrait divider.

## Scope

- Update the shared default homepage stylesheet, `assets/css/main.css`.
- Apply the refinement to `/` and `/zh/` through their shared academic identity component.
- Do not modify the HTML content, portrait, typography, mobile structure, or `/soe/` edition.

## Design

- Replace the academic identity block's full-width top and bottom borders with positioned line pseudo-elements.
- Keep both lines aligned with the left edge of the identity block.
- End both lines `24px` before the identity block's right edge on desktop and tablet layouts.
- Preserve the identity content's existing full width; only the decorative lines become shorter.
- At the mobile breakpoint, restore the lines to full width because the vertical portrait divider is hidden and the hero uses a single column.
- Keep the existing line weights and colors: `2px` blue above and `1px` neutral below.

## Verification

- Run the existing site contract and JavaScript syntax checks.
- Inspect `/` and `/zh/` at `1440px` to confirm a visible gap between both horizontal lines and the vertical divider.
- Inspect `390px` and `360px` mobile widths to confirm full-width lines, no overflow, and unchanged content alignment.
- Confirm `/soe/` remains unchanged.
