# Morningo — Analytics tracking plan

What we measure, why, and how to read it. Built 2026-10-01. Code: `concepts/attribution.js` (the ad "name tag", no consent needed) and `concepts/analytics.js` (the consent-gated "counters": Google Analytics 4 + Meta Pixel). Decisions behind it are in `brief.md` (Tech Stack, Locked Decisions).

## The three layers (and why)

| Question | Source | Needs cookie consent? |
|---|---|---|
| How many people clicked each ad? | Meta Ads Manager (link clicks per ad) | No |
| How many signed up / asked a question, per ad? | Netlify Forms: each submission carries the ad's tags | No |
| What did visitors do on the page (buttons, carousels, scroll)? | GA4 events | Yes, so it sees only people who pressed Accept |
| Which people should Meta find more of? | Meta Pixel `Lead` | Yes |

**Per-ad conversion rate = Netlify signups tagged with that ad ÷ Meta link clicks for that ad.** Both numbers exist whether or not the visitor accepted cookies. GA4 explains *why* (where people drop off), but never use it as the signup total.

## 1. Tag every ad (do this in Meta Ads Manager)

On each ad, "URL parameters" box (ad level), paste exactly:

```
utm_source=facebook&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}&ad_id={{ad.id}}
```

- Meta fills the `{{...}}` parts with the real names when the ad runs.
- The ad's **name** becomes the label in every report, so name ads readably and consistently, e.g. `hook-tired-v1`, `hook-focus-v1`. Lower case and hyphens only (no spaces or symbols).
- An ad without the parameters shows up as "unknown" in Netlify and as direct/none in GA4.
- Landing URL for ads: `https://morningo.netlify.app/home` (the bare address also works and keeps the tags).

How the tags travel (attribution.js): read from the address bar, added to every link to another page of this site and to the CTA / signup redirects, and written into six hidden fields on both forms: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `ad_id`. Nothing is stored on the visitor's device. The thank-you page's "Copy link" shares the site address tagged `?utm_source=share&utm_medium=link` (added 2026-10-04), never the sharer's own ad tags. So a visit that arrives through a shared link shows in GA4 as source "share / link", and a signup that follows is saved in Netlify with `utm_source=share`. Copies are counted (`share_copy`); whether the link is then actually sent can only be seen from those tagged arrivals.

## 2. Events (GA4)

All fire only after Accept. Names do not collide with GA4's automatic events (`scroll`, `click`, `form_start`, `form_submit`...).

| Event | Page | Fires when | Parameters | Answers |
|---|---|---|---|---|
| `page_view` | all three | tag loads (automatic) | page location incl. ad tags | funnel: home → capture → thank-you |
| `section_view` | home | a section first reaches the top 60% of the screen | `section_id`: hero, problem, the-product, why-it-works, social-proof, footer | how far down people read |
| `carousel_slide_view` | home | a slide is mostly visible AND its carousel is on screen, once per slide per visit | `carousel_name` (hero_gallery, why_it_works, reviews), `slide_number` (1-based), `slide_name` | which slide/card people reach |
| `carousel_interact` | home | first sideways move of a carousel, once per carousel | `carousel_name` | which carousels people actually swipe |
| `accordion_open` | home | an accordion is opened, once per accordion | `accordion_name` | which details people want |
| `cta_click` | home | CTA pressed | `cta_location`: hero or sticky | which button works |
| `question_open` | home, capture, thank-you | "Have a question?" opened | `trigger_location`: header, hero, footer, page | who wants to ask |
| `question_asked` | home, capture, thank-you | "Send message" pressed on the first step (question typed, no email yet) | none | how many questions are asked; the text is saved in Netlify, never in GA4 |
| `question_sent` | home, capture, thank-you | question really sent with an email | none | questions that came with an email |
| `signup_start` | capture | first click into the email box | none | drop-off between seeing the page and typing |
| `generate_lead` | thank-you | page load, once per browser tab session | none | THE conversion (also Pixel `Lead`) |
| `share_copy` | thank-you | Copy link pressed | none | people sharing |

The Pixel also gets its own `PageView` on all three pages. The conversion fires on thank-you load only, never on submit (brief.md, Locked Decisions).

### Where the question text lives (added 2026-10-04)

GA4 only ever gets counts (`question_open`, `question_asked`, `question_sent`), never the text: Google forbids personal data in Analytics and free text can contain it. The text is saved in Netlify Forms:

- **`question asked-no email`**: one entry the moment "Send message" is pressed on the first step, with no email. No notification email is set on it (add one in Netlify if wanted). Fields: `question`, `page`, `ref`, the six ad fields.
- **`question`**: the existing entry with the email (also notifies the owner). It carries the same `ref`.
- Match the two on `ref`: a `question asked-no email` entry with no `question` entry sharing its `ref` is a question asked by someone who left no email. Text typed but never sent is deliberately not captured.
- The first prod deploy after 2026-10-04 registers the new form with Netlify; check it appears under Forms.

## 3. One-time GA4 setup (the owner does this in the Google Analytics screens)

1. **Key event:** Admin > Events (or Key events) > mark `generate_lead` as a key event (formerly "conversion"). It appears after the first hit arrives, which can take a few hours.
2. **Custom dimensions** (Admin > Custom definitions > Create custom dimension, scope **Event**), one per row, "Event parameter" must match exactly:

   | Dimension name | Event parameter |
   |---|---|
   | Section | `section_id` |
   | Carousel | `carousel_name` |
   | Slide number | `slide_number` |
   | Slide name | `slide_name` |
   | Accordion | `accordion_name` |
   | CTA location | `cta_location` |
   | Question trigger | `trigger_location` |

   Events are collected before this, but the details only show in reports from the moment each dimension exists, so do it now.

   **Done 2026-10-02:** all seven dimensions were created in the Morningo property (account 410350856, property 556942648), scope Event, by driving the owner's signed-in Chrome. GA's Events > Recent events already listed `page_view`, `section_view`, `carousel_slide_view`, `first_visit`, `session_start`, `user_engagement` from the draft test, and Realtime showed `generate_lead` arriving. **Still to do:** star `generate_lead` as a key event (Admin > Data display > Events > Recent events > the star). GA only lists an event there after it has processed it (minutes to hours after the first hit), so it was not starrable yet.
3. **Nothing to set up for ads:** GA4 reads the `utm_*` values from the page address itself. Use the dimensions "Session manual ad content" (= the ad name), "Session manual campaign" and "Session manual source / medium".
4. **Check it works:** open the site, press Accept, then GA4 > Reports > Realtime. Your visit should appear within a minute. The warning "Data collection isn't active" on the stream clears after the first hit.

### Reading it

**Ready-made view (built 2026-10-04):** GA4 > Explore > "Morningo - what people look at" (account 410350856, property 556942648; direct link `https://analytics.google.com/analytics/web/#/analysis/a410350856p556942648/edit/S_Zv4C2XTZa_vtHhssqEjg`). One free-form exploration with four tabs: 1 Gallery and cards (rows Carousel > Slide number > Slide name, filter `carousel_slide_view`), 2 Scroll depth (rows Section, filter `section_view`), 3 Accordions (rows Accordion, filter `accordion_open`), 4 Buttons and questions (rows Event name, filter regex `cta_click|question_open|question_asked|question_sent|signup_start|generate_lead|share_copy`). Values everywhere: Active users and Event count. Rows labelled "(not set)" are events from before the custom dimensions existed (2 Oct 2026). There is also an older untouched exploration named "Free form" that the owner made.

The manual recipes below are only needed if it is ever lost.

- **Funnel per ad:** Explore > Funnel exploration. Steps: `page_view` on /home, `cta_click`, `page_view` on /email-capture.html, `signup_start`, `generate_lead`. Break down by "Session manual ad content".
- **Carousels:** Explore > Free form. Rows: Carousel, Slide number, Slide name. Values: Event count. Filter: event name = `carousel_slide_view`. The first slide of each carousel is the baseline; the drop to slide 2, 3... shows where people stop.
- **Scroll depth:** same, rows = Section, filter event name = `section_view`.
- **Signups and questions per ad:** not GA4. Netlify > Forms > `signup` / `question` > export CSV, group by `utm_content`.

## 4. Known limits

- **Consent gap:** GA4 and the Pixel only see people who pressed Accept. Week 1: compare Meta link clicks with GA4 sessions to see how many visitors are invisible. If it is large, a cookieless tool (Plausible, Umami) is the option to add later; not added yet.
- **Small numbers:** with a handful of signups per ad, differences between ads are noise. Decide a minimum (a few hundred clicks per ad, say) before judging an ad.
- **Attribution leaks:** someone who clicks in the Facebook app and returns later in Safari arrives untagged. Expect an "unknown" bucket.
- **Thank-you refresh** is guarded (one `generate_lead` per tab session), but opening /thank-you.html directly still counts. Netlify Forms is the source of truth for total signups.
- **Pixel ID is not set yet.** Until it is pasted at the top of `analytics.js`, the Pixel does not load and Meta's Lead count stays empty.

## 5. Testing

- **Dry run:** on localhost, file:// and Netlify preview links (`anything--morningo.netlify.app`), analytics.js prints each event to the console and keeps it in `window.morningoAnalyticsLog` instead of sending, so tests never pollute the real numbers. Add `?mo_analytics=live` to the address to send for real from those hosts (events will carry that host name, so filter by hostname in GA4).
- **Reset the saved cookie choice:** `localStorage.removeItem('morningo-cookie-consent')` in the browser console, then reload. To retest the thank-you conversion in the same tab: `sessionStorage.removeItem('morningo-lead-sent')`.
- **Fake ad click:** `/home?utm_source=facebook&utm_medium=paid_social&utm_campaign=test&utm_content=claude-test-ignore&ad_id=0`, then sign up with an obviously fake email. Check the row in Netlify shows `utm_content`.
- Browser-pane gotcha: the hidden pane delays scroll-based events by seconds (it draws few frames). The code is fine; wait for the log rather than assuming a miss.

## 6. If the privacy policy / banner change

The policy says Netlify, GA4 and Meta are the processors and that analytics cookies load only after Accept. The ad tag saved with a signup or question is NOT yet described there (see the open item in the conversation of 2026-10-01); `references/privacy-policy.md` is copy-locked, so wording changes need the owner's approval.
