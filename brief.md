
# Morningo — Project Brief

## What This Is

A lean validation build. A single-product micro-site designed to test whether there is genuine consumer intent for a calm morning energy supplement in the UK market. This is not a production site or a finished brand. The goal is to move fast, spend as little as possible, and get a real signal from cold Facebook traffic.

## The Question We're Answering

*Are enough people willing to hand over their email address for a calm morning energy supplement they've never heard of, discovered through a cold Facebook ad, to justify building the full product and brand?*

## Brand

- **Name:** Morningo
- **Positioning:** Better energy, not more energy
- **Audience:** UK professionals and entrepreneurs, broadly 35–55

## Product

A single-serve morning supplement sachet containing core active ingredients across five mechanisms, plus complementary ingredients for suspension and flavour. Taken alongside coffee, not instead of it. Core outcome: calm, steady focus through the morning.

## Site Structure

Four pages. Not artificially capped at two — every page has to earn its place by doing a job for the ad campaign or for compliance. No homepage, no about page, nothing decorative.

**Product page** — the cold traffic destination from Facebook ads. Structured as a product detail page. One CTA element ("Reserve My Place"), not two: by default it sits inside the hero, above the fold, visible without scrolling. Once the hero scrolls out of view, it becomes sticky to the bottom of the viewport for the rest of the scroll journey. Same behaviour on desktop and mobile.

**Email capture page** — a separate, dedicated page reached by clicking the CTA. Clean, single message, one email field.

**Thank-you page** — a separate, standalone page the user is redirected to on successful submission. Confirms the signup, sets expectations for what happens next. This is also where the Facebook Pixel Lead event and GA4 conversion event fire — on page load, not on form submission. That's the more reliable tracking pattern: it doesn't miss slow submits or duplicate submits, and it gives Ads Manager a stable URL to optimise against, which is how Facebook conversion tracking is designed to work.

**Privacy policy page** — required because the email capture form collects personal data via a Facebook ad. Covers UK GDPR/PECR disclosure and Facebook's ad policy requirement for a linked privacy notice on any data-collecting page. Linked from a standard footer present on all four pages, not just the capture page.

## Product Page Sections

1. Logo — top of page, non-sticky, brand mark only, no nav links
2. Hero — product detail block: image, headline, flavour, price, CTA, accordions; above fold, CTA visible on load without scrolling (see CTA behaviour above)
3. Problem — specific morning moments and their consequences
4. The Product — format, ritual, how it works
5. Why It Works — ingredients paired with outcomes
6. Social Proof — early tester quotes, unpolished; placeholder quotes until real tester language is available

## Tech Stack

- HTML + Tailwind CSS via CDN. One file per page. No build step.
- Netlify — deployment, connected to GitHub repo (dapps88/morningo)
- Netlify Forms — email capture. No confirmation email sent; feedback happens entirely in-browser via redirect to the thank-you page.
- GA4 + Facebook Pixel — loaded via single analytics.js file, consent-gated. The scripts load on all three marketing pages (product, capture, thank-you) once consent is accepted, not only on the thank-you page. Their default pageview events (GA4 page_view, Pixel PageView) fire automatically on each of those page loads. This is deliberate: it's what gives funnel visibility — product page loads vs. capture page loads vs. thank-you page loads lets you read CTA click-through rate and form completion rate purely from pageview counts, with no extra engineering.
- Facebook Pixel Lead event and GA4 conversion event — this is the ONE event, distinct from ordinary pageview tracking above, that is scoped only to the thank-you page load. Never fires on form submission, never on the capture page.
- Optional, not yet built: a dedicated GA4 click event on the CTA button itself, for click-level (not just pageview-level) funnel diagnosis. Flagged as a nice-to-have, doesn't affect the Pixel Lead event or Ads Manager optimisation — purely internal diagnostic data.
- Netlify Forms' own submission log is the source of truth for total signups — it captures every submission regardless of cookie consent. The Pixel Lead count in Ads Manager will always be lower than this, since anyone who declines or ignores the cookie banner still completes the form successfully but generates zero tracking signal. Check both numbers; don't read Ads Manager's Lead count as the true signup total.
- Cookie consent banner — custom implementation in analytics.js, controlling whether GA4 and Facebook Pixel load. No third-party consent library required.

## Locked Decisions

- Name is Morningo. One word. Capital M.
- Four pages: product, email capture, thank-you, privacy policy. No homepage, no about page — every page must do a job.
- HTML + Tailwind via CDN. No React, no Vite, no build step.
- Netlify Forms only for email capture. No email service, no confirmation email, no paid email platform. Confirmation is the in-browser redirect to the thank-you page.
- Email capture is a separate page. Not an overlay, not a section.
- The Lead/conversion event fires on thank-you page load, never on the capture page or on form submission. This is distinct from ordinary GA4/Pixel pageview tracking, which runs consent-gated on all three marketing pages — see Tech Stack for the full explanation.
- Cookie consent is required before GA4 and Facebook Pixel load. A banner appears on first visit with Accept and Decline options; tracking scripts load only on Accept. The visitor's choice is saved in the browser so the banner does not reappear on return visits. Built as part of analytics.js, with no third-party consent library. Do not load any tracking scripts unconditionally. Include a code comment explaining how to reset the saved consent preference during testing.
- Standard footer, identical across all four pages, containing the privacy policy link.

## Reference Files

For copy rules → ecommerce-copywriter skill
For brand voice → brand-voice.md
For ingredients and science → product-science.md
For page section detail → page-architecture.md *(to be created)*
For product page copy → main-page-text.md
For email capture + thank-you page copy → email-capture-text.md
For privacy policy copy → privacy-policy.md
For cookie banner copy and rules → cookie-banner.md

## File Structure

To be confirmed with Claude Code. Brief lives at project root as `brief.md`. Reference files live in a `/references` subfolder. Pages and scripts at root level.
