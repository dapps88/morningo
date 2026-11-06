# Redesign v3 (local variant)

Started 2026-11-06 on the `redesign` branch. `concepts/product-wireframe-v3.html` is a copy of the live product page (`product-wireframe-v2.html`, which is untouched) with the changes the owner worked out on a design canvas. Nothing here is live: `_redirects` still sends `/home` to v2, v3 is marked `noindex`, and the branch has not been pushed.

View it: `python3 scripts/dev-server.py 8744 concepts`, then http://localhost:8744/product-wireframe-v3.html. The live page is the same address ending `-v2.html`, so the two can be compared side by side.

## What changed against the live page

- **Nav:** soft warm glow behind the logo (stops at 50% strength), faint white key line along the bottom, basket on the far right, "Question" as plain underlined text beside it, basket and Question in the logo cream `#f9f8c1`.
- **Hero copy:** title "Morning energy drink"; flavour line directly under it; new intro; "The core ingredients" sub-head gone; four bullets with a bold lead ("Support concentration", "Reduce tiredness", "Stay relaxed and switched on", "Keep mental fatigue at bay").
- **Hero body text:** 16px on 26px lines in near-black `#17150F` (after the Feel page), in the hero and the product section. Accordion titles, sub-headings and panel text match.
- **Hero buttons and pills:** the "Early access offer" pill and the grey "Limited first release" box are gone. The button says "Buy now" in `#581E85`. Two soft capsules under it: "30 day money back guarantee" and "Free shipping".
- **Formula strip** at the base of the hero: a full-width near-black bar (72px) touching the bottom of the lilac band on every screen width, four ticked lines scrolling right to left at a steady 26px a second and never stopping (pauses on hover, still for reduced motion). Modelled on the strip on mengotomars.com. The page column closes before it and reopens after (the same pattern as the nav and footer), and a small script copies the group until the track is wider than the screen. Regular weight, 1px letter spacing, 24px lines so two-line items are not cramped, 48px between items.
- **Body copy colour:** every `.body-lg` is now near-black `#17150F` instead of grey `#585858` across the page (Problem, Comparison, "Steady isn't an accident", "47+ versions", Questions). Links in plum and the plum comparison card's white text are unchanged. Small grey captions (the italic labels on the ingredient cards, footnotes, sticky caption) and the nutrition modal are unchanged. Line spacing outside the hero and product section is still the old 1.45.
- **Questions section:** the first accordion, "It's not on sale yet. What am I signing up for?", is removed (owner, 2026-11-06). The other three stay, all closed.
- **Gallery:** the progress bar on the main image is gone (the thumbnails still show the active picture).
- **Product section:** title "A morning drink that keeps you switched on.", three new paragraphs, button "Buy now" (still plum `#39002A`).
- **Sticky bar:** "Buy now" in `#581E85`, caption "30 day money back guarantee. Free shipping."

## Owner decisions these override

- Skill and rules said one CTA, "Get first access", with "No payment now" beside it; the hero's grey "Limited first release. Not on sale yet." card was a deliberate copy decision. All replaced by "Buy now" and the two assurance pills (owner, 2026-11-06).
- The footer, cookie banner, chat modal, nutrition modal, forms, analytics and the other sections are unchanged.

## My assumptions (not confirmed by the owner)

- The sticky bar's label and caption follow the hero (the canvas did not have a sticky bar).
- "Buy now" still goes to `email-capture.html`, because there is no shop. The basket button does nothing.
- The strip uses the four callouts already on the page (Vegan, No artificial sweeteners, Research-led formula, Gluten free), not the reference site's wording. "No sweeteners or fillers" and "No bulking agents" would clash with the citrus fibre.
- The product section's button stays plum while the hero's is `#581E85` (the owner only said "on the hero").
- Letter spacing on the strip is 1px (the owner's own tweak).

## Open before this can go live

- **Bebas Neue licence text.** The strip's font was downloaded with the owner's yes on 2026-11-06 from Google Fonts into `concepts/fonts/bebas-neue-latin.woff2` (8.6 KB, latin subset, SIL Open Font License 1.1) and is served from our own site. The file is untracked like the page and must be committed with it. `concepts/fonts/OFL.txt` is Instrument Sans's licence text; add Bebas Neue's licence and copyright text beside it before going live.
- **Claims check.** `references/claims-fixes-draft.md`: L-theanine and Rhodiola have no approved outcome wording (bullets 3 and 4); "keep tiredness away" in the product section and the "About a small coffee's worth" caffeine line also lean on wording that needs the check.
- **A shop.** "Buy now", the money-back guarantee and free shipping are promises for a shop that does not exist yet; the live site is a waitlist.
- **The "What's in it" callouts** still await confirmation against the new formula (already open before this variant).
- **Other pages** (email capture, survey, thank-you) still say "Get first access" and carry the old styling. The pages after "Buy now" are the owner's next piece of work.
- **Desktop** is a first pass beyond the strip (checked at 1440px wide: full width, no sideways scroll).
- **The removed Questions accordion** also exists in `references/main-page-text.md`; that file still lists it.
- **Going live** would mean pointing the `/home` rule in `concepts/_redirects` at v3 and merging to `main`, which is a production deploy (15 of the 300 monthly Netlify credits). Not done, and not to be done without the owner's go.

To throw it away: `git switch main`, then `git branch -D redesign`. The live files are never touched by this branch.
