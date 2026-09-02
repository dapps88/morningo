# MORNINGO — EMAIL CAPTURE + THANK-YOU PAGE COPY
Single source of truth for all on-page copy across both pages.
Read this file in full before writing any code.

---

## PART 1: RULES FOR CLAUDE CODE

1. Use copy exactly as written. Do not rewrite, improve, or paraphrase any line. If something looks wrong, flag it — do not silently change it.

2. No em dashes anywhere on either page. Ever.

3. Two pages are described in this document. Build both: the email capture page and the thank-you page.

4. On successful form submission, the user is redirected to the thank-you page. This is not an inline success state. The thank-you page is a separate, standalone HTML file.

5. The Facebook Pixel Lead event and GA4 conversion event fire on page load of the thank-you page only. Do not fire either event on the capture page. Technical implementation detail for both events is in brief.md.

6. Product photo on the capture page is a placeholder. Mark clearly in code. Do not use stock images.

7. No navigation on either page. No links back to the product page. Logo only, plus the standard site footer (privacy policy link), which appears identically on all four pages per brief.md.

8. Page order is locked. Build sections in the sequence they appear below.

---

## PART 2: EMAIL CAPTURE PAGE

---

### SECTION 1: LOGO

Morningo wordmark. Same treatment as the product page.

---

### SECTION 2: PRODUCT IMAGE

**Job**
Visual continuity from the product page. The reader should see the same object they just left.

Product sachet image. Placeholder — same asset as product page hero.

Mark in code: `<!-- Product image: placeholder — replace with final sachet photography -->`

---

### SECTION 3: CAPTURE BLOCK

**Job**
State the scarcity. Clarify the mechanic. Ask for the email. Remove the last hesitation. Nothing else.

**Headline**
500 places. First come, first served.

**Supporting line**
Leave your email. When Morningo is ready to order, you'll be first in line.

**Form field label**
Your email address

**CTA button**
Reserve My Place

**Micro-copy** *(directly below button, visually subordinate)*
One email, when we're ready. Nothing else. [Privacy notice →]

The privacy notice link points to `/privacy`. That page is covered in a separate brief — use a placeholder href for now.

---

## PART 3: THANK-YOU PAGE

---

### SECTION 1: LOGO

Morningo wordmark. Same treatment as all other pages.

---

### SECTION 2: CONFIRMATION BLOCK

**Job**
Confirm the submission clearly. Set the expectation for what happens next. Nothing else — no upsell, no social share prompt, no link back to the product page.

**Headline**
You're in.

**Body**
We'll be in touch the moment Morningo is ready to order. One email. That's all.

---

## PART 4: PLACEHOLDERS LOG

Nothing on this list should be invented or assumed. Each must be replaced before launch.

- [ ] Product image — capture page Section 2
- [ ] Privacy notice page — `/privacy` (separate brief, not in scope here)
- [ ] Analytics IDs — GA4 Measurement ID and Facebook Pixel ID must be present in `analytics.js` before conversion events will fire
