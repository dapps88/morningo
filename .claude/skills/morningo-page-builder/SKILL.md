---
name: morningo-page-builder
description: Design system and build process for the Morningo micro-site (product, email capture, thank-you, privacy policy pages) — locked typography scale, components, spacing rhythm, and copy-fidelity rules validated through real iteration on the product page. Use this whenever building, revising, or reviewing ANY page for the Morningo project, even if the user doesn't explicitly mention these tokens by name — e.g. requests to build the email capture page, the thank-you page, or the privacy policy page, or to add, adjust, or restyle any section on the existing product page. Also consult this before making any typography, spacing, color, or component decision on this project — defaults are already locked from real feedback and should not be re-derived from scratch.
---

# Morningo Page Builder

## Start here

The canonical, working example is [concepts/product-wireframe-v2.html](../../../concepts/product-wireframe-v2.html) — a complete, tested mobile page (hero, problem, product, why-it-works, social-proof, footer). When building a new page, copy its `<style>` block wholesale (it already contains every token below as real CSS) and its `<script>` block if you need the scroll-carousel or sticky-CTA behavior. Don't re-derive the type scale or re-invent utility classes — extend what's already there.

Everything in this file was arrived at through real back-and-forth, not assumed upfront. Where a rule exists because something visibly broke, that's noted — it's not arbitrary, and reverting it will likely reproduce the original bug.

## Working method

These are process fixes, not preferences — skipping them is what caused the rework in the first place.

1. **One HTML file per page, edited incrementally.** Never regenerate a whole file as chat output. Use targeted edits (Edit tool), even for large changes — read the current file, change only what needs to change.
2. **Build one section at a time and get visual sign-off before the next.** Not the whole page in one shot.
3. **Plain static CSS only — never Tailwind's CDN script (`cdn.tailwindcss.com`).** It generates styles dynamically via JavaScript at runtime, and the Artifact publishing platform (used for phone/mobile testing) blocks that kind of dynamic style injection even though it allows the script tag to load. The result is a page that looks fine in local preview but publishes as raw unstyled HTML. Write plain CSS by hand instead — the reference file already has the full set of utility classes needed; add to it rather than pulling in a framework.
4. **Always reset margins explicitly:** `h1, h2, h3, h4, p { margin: 0; }`. Browsers apply default margins to headings and paragraphs; without this reset, flex `gap` spacing compounds with the browser default, producing exactly the "padding gone huge, icons don't align with text" bug this project hit. Tailwind normally does this invisibly via its preflight, which is why it's easy to forget when writing plain CSS.
5. **After any change to shared/global CSS (not just one section), visually re-check every section by screenshot before calling it done.** A change to a class like `.body-lg` or `.gap-3` affects every place that class is used — confirming the section you edited looks right is not enough; regressions showed up in untouched sections before because of this.
6. **When pulling design inspiration from a reference site, extract real computed CSS values (via browser JS / devtools) rather than eyeballing a screenshot.** This project's type scale, spacing, and component patterns came from actually measuring Seed.com, Apple, and a Cowboy/Refero style reference this way — not guessing at what "looks about right."
7. **Avoid default AI-generated-design instincts unless the content specifically calls for them:** eyebrow/kicker labels above headlines, decorative divider lines with no structural meaning, icon-in-a-circle rows applied reflexively, numbered markers unless the content is a genuine sequence, gratuitous gradients. The brand voice is deliberately restrained — when in doubt, do less.
8. **When a decision is genuinely ambiguous, ask rather than guess.** But once something is confirmed through real visual feedback (not just discussed in the abstract), treat it as locked and carry it forward — don't re-litigate a settled pattern on the next page unless new visual evidence contradicts it.
9. **Prefer a plain scroll-position check over `IntersectionObserver`** for show/hide triggers (e.g. a sticky element). `IntersectionObserver` fires its first check immediately on `observe()`, which can race against web-font loading and cause a visible flash on page load. Compare `getBoundingClientRect()` against the viewport on a scroll listener instead.

## Design tokens

**Typeface:** Instrument Sans (Google Fonts), one family throughout. Weight does the differentiation — don't switch fonts for emphasis.

| Token | Size | Weight | Line-height | Letter-spacing | Use |
|---|---|---|---|---|---|
| `.headline` (H1) | 32px | 400 | 1.15 | -0.02em | Page/hero headline |
| `.headline-sm` (H2) | 26px | 400 | 1.2 | -0.02em | Section titles |
| `.card-title` (H3) | 20px | 400 | 1.3 | -0.01em | Card titles, accordion titles, price/numeral callouts |
| `.body-lg` | 16px | 400 | 1.45 | — | The one primary descriptive paragraph under a title — color `#585858` |
| `.body-sm` | 14px | 400 (500 for UI labels) | 1.45 | — | Everything else: meta text, captions, pill/chip labels, links |

A numeral callout (like a price) gets size, not boldness — use `.card-title`, never a one-off bold override. That reads as more considered and was a direct correction from feedback.

**Color:** white background (`#ffffff`). Off-black ink `#17150F` for headlines and icons. `#585858` for `.body-lg` text. `#6b7280` (gray-500) for `.body-sm` meta text. `#e5e7eb` (gray-200) for hairline borders/dividers. The footer is the one deliberate exception — black background using the *same* `#17150F` (not a second black), white text. Nowhere else on the page uses color yet; this is a black/white/gray system by design.

## Components

- **Buttons:** fully rounded (pill), black background, white text, uppercase, letter-spacing wide, weight 600, generous padding. Sharp corners were tried first and rejected once seen rendered — pill is the locked shape.
- **Chips/pills** (e.g. dietary callouts, when used as pills): filled light gray (`bg-gray-100`), no border, fully rounded, `.body-sm` weight 500.
- **Icons:** thin outline style, `stroke-width: 1.5`, `stroke="currentColor"`, no fill, and critically — **no circular border wrapper around them**. That was tried and explicitly rejected as reading "fussy" at small scale. For an icon next to a line of text: use `items-center` (vertically centered) when the text is a single line; use `items-start` (top-aligned) when the text may wrap to multiple lines. Getting this backwards is a real, visible bug (icon floats noticeably off the text's center on single-line rows).
- **Card carousels** (used for ingredient/mechanism cards and testimonials): image leads, small/subtle corner radius — not the pill-rounded language, cards read as photography, not UI chrome. Unbordered caption below: title, then a small italic caption line, then `.body-lg` body copy (or for testimonials: quote in `.body-lg`, name/role as the small italic caption). Each card ~76% of viewport width so the next one peeks ~24% — enough to signal "more to scroll," not so much it feels cramped. Use `scroll-snap-type: x proximity`, not `mandatory` — mandatory snap feels aggressive/jerky on a real touch scroll. The carousel's gutter must match its section title's own inset exactly, and `scroll-padding-left`/`scroll-padding-right` must be set to match the container's own padding — without this, the carousel silently starts pre-scrolled past its first frame on load (a real, non-obvious bug; the fix is `scroll-pl-*`/`scroll-pr-*` matching `pl-*`/`pr-*`).
- **Accordions:** the open/close icon swaps between a real "+" and a real "−" via CSS `content`, never a rotating "+". A rotated plus was tried and rejected. Accordion titles use `.card-title`, body copy uses `.body-lg`.
- **Hero gallery:** full-bleed edge-to-edge image, 4:3 aspect ratio. This exact ratio is now the *one* image spec used everywhere on the page (including full-bleed narrative sections lower down) specifically so nothing needs a different crop per section. Swipe-only, no on-image arrows (arrows are unnecessary chrome on touch, and a labeled — not necessarily visible-labeled — set of tap targets below the image is what keeps it accessible to keyboard/screen-reader users instead). A centered progress bar overlaid low on the image shows position — not numeric "1/4" text. Thumbnail tiles below are landscape (matching the source crop), not square. Keep the tiles, the progress bar, and the main image in sync via plain scroll-position JS (see Working Method #9), not `IntersectionObserver`.
- **Sticky CTA:** hidden by default. Reveals via a graceful slide-up (`transform` + `transition`, never toggling `display`) once the page's primary inline CTA scrolls out of view, and hides again once the footer comes into view — a floating white bar sitting on top of the black footer looks like a mistake, and there's no reason to keep chasing the conversion once someone has reached the true end of the page.

## Layout rhythm

- **Section-to-section spacing is exactly one rule: top-padding only, currently 115px.** Never add bottom-padding to a section as well — two adjacent sections each contributing padding at their shared boundary double-stacks the visual gap. This was a real bug; the fix (top-only, one section owns the gap before it) is the thing to preserve.
- **A headline and the line directly below it (its subcopy) get a small, tight gap (~12px)** — never the full section rhythm gap. Group them in their own flex container distinct from the rest of the section's content so the two spacing scales don't collide.
- **Page-edge gutter:** 16px baseline, 24px for any section using the card-carousel pattern. Where a section has both a title and a carousel, their insets must match exactly or the misalignment is immediately visible.
- **Mobile only, for now.** Desktop is an explicit, separate later pass. Don't assume a mobile stacking/ordering decision (e.g. image-before-text) carries over to desktop without it being discussed again.

## Content fidelity rules

From the project's own copy files (`references/*.md`), which take precedence over anything in this skill if they ever conflict:

- Use copy exactly as written in the reference `.md` files. Never paraphrase or "improve" it — flag anything that looks wrong instead of silently changing it.
- No em dashes anywhere on any page.
- Price is always a placeholder (`£[X]`) until a real number is confirmed.
- Product and testimonial photos are placeholders, clearly marked as such in the markup — never stock images.
- No health claims beyond what's explicitly written in the copy (UK NHC regulatory constraint — this is a compliance boundary, not a style preference).
- One CTA per page, matching that page's locked copy exactly (e.g. "Reserve My Place" on the product page).
- The footer (logo, strapline, "Have a question?" link, Privacy Policy, copyright) is identical across all four site pages — build it once, reuse it exactly, don't redesign it per page.
