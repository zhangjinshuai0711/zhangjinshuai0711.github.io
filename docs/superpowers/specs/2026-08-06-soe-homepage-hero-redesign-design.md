# SOE Homepage Hero Redesign

## Goal

Redesign the first screen of the Chinese state-owned-enterprise job homepage at /soe/ so that the Tsinghua University identity is immediately visible, while the applicant's name, target roles, portrait, and contact email remain easy to scan.

## Scope

- Update only the hero section of /soe/ and its responsive styles.
- Preserve all awards, education, experience, projects, service, and footer content below the hero.
- Reuse the existing local Tsinghua seal and portrait assets.
- Do not change the default English homepage or the Chinese algorithm homepage.

## Information Hierarchy

The desktop hero uses two vertical zones:

1. A full-width Tsinghua identity masthead.
2. A lower split layout with text on the left and the portrait on the right.

The masthead contains:

- Tsinghua University seal.
- 清华大学.
- 电子信息（085400）.
- 网络科学与网络空间研究院 · 2026 至今.

The lower text area contains:

- 中共党员 · 信息科技 / 算法 / 网络安全.
- Name: 张金帅.
- Capability focus: 推荐算法 · 机器学习 · 网络安全.
- A concise summary of recommendation ranking, graph machine learning, large-model tool calling, engineering delivery, and collaboration.
- Full email address: zhangjinshuai0711@163.com.

## Contact Behavior

- Render the full email address as visible plain text.
- Do not render the email as a button or navigation action.
- Do not wrap it in a mailto link.
- Remove the GitHub entry from the /soe/ hero.
- Other pages may retain their existing email and GitHub links.

## Party Membership

- Keep the identity 中共党员.
- Remove 2025.06.18 转正 from /soe/.
- Do not replace it with another date or explanatory sentence.

## Visual Treatment

- Use a restrained Tsinghua purple masthead with a light neutral background, a purple top rule, and a subtle lower divider.
- Keep the seal subordinate to the university name.
- Set 清华大学 in the existing Chinese serif stack and supporting degree text in the existing sans-serif stack.
- Keep the name prominent without increasing it beyond the current visual scale.
- Preserve the site's existing neutral, red, blue-gray, and Tsinghua purple palette.
- Keep motion restrained and honor prefers-reduced-motion.

## Responsive Behavior

Desktop and tablet:

- The Tsinghua masthead spans the full hero width.
- The lower area uses a text-and-portrait split.
- The portrait fills the right column without stretching or changing aspect ratio.
- The first screen remains compact enough to reveal the start of the following content on typical desktop viewports.

Mobile:

- Collapse to one column in this order: Tsinghua masthead, party and role line, name, capability focus, portrait, summary, full email address.
- The masthead text may wrap naturally, but the seal must keep a fixed size.
- The email address must fit without horizontal overflow.
- No text may overlap or be clipped at 390 px width.

## Accessibility

- Retain the existing main landmark, skip link, navigation, semantic heading order, and portrait alt text.
- Treat the university seal as decorative inside the labeled identity masthead.
- Keep text contrast at WCAG AA levels.
- Do not rely on color alone to communicate institution, role, or contact information.

## Verification

- Update the site contract to require the full-width identity masthead and the exact university, degree, institute, party, role, and email text.
- Assert that /soe/ does not contain 2025.06.18 转正.
- Assert that the hero does not contain a GitHub link or a mailto link.
- Run the existing site contract and JavaScript syntax checks.
- Run git diff --check.
- Inspect desktop and 390 px mobile screenshots for first-screen hierarchy, wrapping, overflow, asset loading, and portrait framing.

## Non-Goals

- Rewriting resume content below the hero.
- Changing award order, project descriptions, or education records.
- Removing GitHub from the default English or Chinese algorithm homepage.
- Replacing or regenerating the portrait or Tsinghua seal.
- Adding a resume download, phone number, WeChat, or other contact channels.
