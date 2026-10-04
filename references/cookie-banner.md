# Morningo — Cookie Banner

## Banner Copy

**Body**
We use analytics and advertising cookies to understand how this site is used and measure our ads.

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

---

## Owner decision (2026-10-04): footer "Cookie settings" link

Overrides rule 8 ("No separate Cookie settings footer link"). The owner approved a footer link called **Cookie settings** on all four pages (class `cookie-settings-link`, next to Privacy Policy). It reopens this same banner (same copy, same buttons) so a visitor can change their choice at any time; without JavaScript it goes to `privacy.html#cookies`. On the privacy page the banner is not shown automatically (so the policy stays readable), only from that link. Choosing Reject after Accept removes the Google/Meta cookies and stops sending; choosing Accept after Reject starts analytics. Reason: UK guidance expects withdrawing consent to be as easy as giving it.

## Implementation note (2026-10-04)

Rules 4 to 6 (choice remembered for 12 months) are now implemented as written: the choice is the first-party cookie `morningo-consent` with a 12-month lifetime (`concepts/consent.js`). Declining removes any `_ga*` / Meta cookies already on the device. The old localStorage choice is migrated once. Fonts are self-hosted, so nothing contacts Google before a choice.

## Owner decisions (2026-09-30)

These two decisions were made by the site owner and override the matching rules above. The rules are left in place so the reasoning stays visible.

1. **Banner body copy:** "including the Meta Pixel" was removed from the banner. The Meta Pixel is still named in full in the privacy policy (privacy.html, and references/privacy-policy.md), which the "Learn more" link points to. This overrides "Do not reword the body copy".
2. **Reject button style:** Reject is an outline button (transparent background, black text, black outline) and sits on the left, with the filled Accept button on the right. This overrides rule 2 ("visually equal") and the "different visual weights" line under Do Not.

3. **Buttons reconfirmed (2026-10-04, owner confirmed):** the owner is happy to keep the current Reject (outline, left) and Accept (filled, right) styling for now, knowing that UK regulator guidance (ICO) expects refusing to be as easy as accepting. Do not change the buttons or re-raise this unless the owner asks.
