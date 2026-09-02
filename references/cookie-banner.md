# Morningo — Cookie Banner

## Banner Copy

**Body**
We use analytics and advertising cookies, including the Meta Pixel, to understand how this site is used and measure our ads.

**Actions**
- Primary button: Accept cookies
- Secondary button: Reject cookies
- Tertiary text link: Learn more

---

## Implementation Rules

1. The banner fires before any non-essential script loads. GA4 and Meta Pixel are both blocked until the user accepts.
2. Both buttons must be visually equal — same size, same weight, same prominence. No ghost button for Reject.
3. "Learn more" links to the Cookies section of the privacy policy page (privacy.html#cookies) — there is no separate cookie policy page, per the four-page limit in brief.md.
4. On Accept: load GA4 and Meta Pixel, set consent cookie (12 months).
5. On Reject: set decline cookie (12 months), no tracking scripts load.
6. Banner does not reappear until consent cookie expires or user clears cookies.
7. Banner closes on either button selection. No confirmation state required.
8. No separate "Cookie settings" footer link. The footer contains only the privacy policy link (see brief.md).
9. Meta Pixel Lead event and GA4 conversion event fire on page load of the thank-you page only, and only if the consent cookie = accepted — never on form submission, per brief.md's tracking architecture (chosen for reliability: avoids missed or duplicate conversions from slow/repeat submits).

---

## Do Not

- Do not give Accept and Reject different visual weights
- Do not fire any pixel or analytics tag before consent is registered
- Do not add a "by continuing you agree" fallback
- Do not reword the body copy — the Meta Pixel disclosure and purpose naming are required for PECR and Meta Business Tools compliance
