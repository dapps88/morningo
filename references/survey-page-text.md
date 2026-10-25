# MORNINGO — SURVEY PAGE COPY ("about-you.html")
Single source of truth for all on-page copy on the page that sits between the email capture page and the thank-you page. Added 2026-10-21 from the owner's mock-up and replies. Read this file in full before touching the page.

---

## PART 1: RULES FOR CLAUDE CODE

1. Use copy exactly as written. Do not rewrite, improve, or paraphrase any line. If something looks wrong, flag it, do not silently change it.

2. No em dashes anywhere on the page. Ever. (The age ranges use an en dash, "25–34", as in the owner's mock-up.)

3. Order of pages is locked: product page, email capture, survey page, thank-you page. The survey page opens only after the email has really been saved.

4. The Facebook Pixel Lead event and the GA4 `generate_lead` event fire on page load of THIS page (changed from the thank-you page on 2026-10-21, owner decision). The thank-you page no longer fires them. Details: `references/analytics-tracking-plan.md`.

5. Logo only in the header (links to the product page), like the thank-you page. No back button, no question pill. Standard site footer, cookie banner and "Have a question?" modal, identical to the other pages.

6. Both questions must be answered for Done. Skip needs neither. Nothing is saved on Skip.

7. The two answers are never sent to Google Analytics or the Meta Pixel. They are saved only in the Netlify form `survey`, in one row together with the email, the ad tags and the answers.

---

## PART 2: THE PAGE

### Pill (same look as the gold "Early access offer" pill in the product hero, with a small plain tick, no circle)
You're on the list

### Headline
Help us find more people like you.

### Supporting line
Two taps. It tells us who else to let know.

### Question 1 (three cards: Woman, Man, Other)
**Title**
I am a…

**Options**
Woman / Man / Other

### Question 2 (six rows)
**Title**
My age group is…

**Helper line**
A real answer is more use than a guess.

**Options**
18–24 / 25–34 / 35–44 / 45–54 / 55–64 / 65+

### Primary button
Done

### Skip (plain plum underlined text, same style as "Nutritional information" and "Have a question? Ask us here.")
Skip

---

## PART 3: MESSAGES (written by Claude, not from the mock-up; owner can change)

- Under an unanswered question, in red, after pressing Done: **Choose one.**
- Button while saving: **Saving…**
- If the save fails, above the button, in red: **Something went wrong saving that. Please try again.**

---

## PART 4: WHAT IS SAVED

Netlify form `survey`, one row per person who presses Done:
`email`, `gender` (woman / man / other), `age_group` (18-24 / 25-34 / 35-44 / 45-54 / 55-64 / 65+), the six ad fields (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `ad_id`).
The email comes from the capture page, held in the browser tab's temporary memory (sessionStorage key `morningo-signup-email`), never in the address bar, removed on Done, on Skip and on the thank-you page. With no email in memory (someone opens the page directly, or a browser blocks that storage) the page still works but saves nothing.
The `signup` form (email + ad) is unchanged and is still the true sign-up count; a person who answers therefore has a row in both forms, and the `survey` row is the complete one.
