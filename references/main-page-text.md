# MORNINGO — PAGE COPY
Single source of truth for all on-page copy.
Read this file in full before writing any code.

---

## PART 1: RULES FOR CLAUDE CODE

1. Use copy exactly as written. Do not rewrite, improve, or paraphrase any line. If something looks wrong, flag it — do not silently change it.

2. No em dashes anywhere on the page. Ever.

3. Price is a placeholder. Do not invent a number. Replace [X] when confirmed.

4. Product and testimonial photos are placeholders. Mark clearly in code. Do not use stock images.

5. Regulatory constraint: do not add any health claims beyond what is written here. No "improves focus," "boosts energy," or "enhances performance" language anywhere on the page. The copy has been written to stay on the right side of UK NHC regulations. Do not drift from it.

6. One CTA on the page. Copy: "Reserve My Place." Destination: email capture page.

7. CTA behaviour — two states, one element:
   - Default: sits in the product detail block above the fold.
   - Sticky: as soon as the product detail block scrolls out of view, the CTA locks to the bottom of the page and remains visible for the full scroll journey. Applies to both desktop and mobile.

8. Page order is locked. Build sections in the sequence they appear below.

---

## PART 2: SECTIONS IN PAGE ORDER

---

### SECTION 1: HERO — PRODUCT DETAIL

**Job**
This is the product detail block. It sits above the fold with the product image. It must function like a product page — headline, flavour, price, CTA, and accordions all live here. The reader should be able to register their interest without scrolling.

**Headline**
> Updated 2026-10-21 (owner-supplied copy, replaces "Calm focus. All morning, alongside your coffee.").
>
> Updated 2026-10-25 (owner-supplied, replaces "A morning drink for the second-coffee slot."). **Owner decision against Part 1 rule 5:** the phrase "energy drink" was flagged as sitting against the no-energy-claims rule and the owner chose to use the headline as supplied, with no full stop (and asked for "morning" to be added after "new", then "must" to be removed, the same day). Not legal advice; the risk is that "energy drink" implies an energy effect from the caffeine, which is not an authorised claim, and the same wording in an ad could be refused by Meta. Check it against the GB claims register before ads run.

The new morning energy drink you sit down with

**Sub-copy**
> Updated 2026-10-21 (owner-supplied copy, replaces the 2026-10-02 line "Keep your morning exactly as it is. Just add one sachet, stirred into a glass of water, first thing.").

Your first coffee stays. Morningo is its concentration partner in the second-coffee slot: thick, dark blackcurrant, warmed with ginger, stirred into a glass of water. We made 47 versions to get the thickness, taste and blend just right.

**Core ingredients** *(new 2026-10-21, owner-supplied copy; sits directly under the sub-copy, above the price)*

> This block adds the caffeine concentration line and the Vitamin B5 mental performance line to the hero, which Part 1 rule 5 did not cover. Owner-supplied. Still to check: wording against the current GB claims register, "about a small coffee's worth", and that "47 versions" is a true count.

Sub heading: The core ingredients

- 80mg of natural caffeine, from green tea. About a small coffee's worth. Caffeine aids concentration.
- Vitamin B12 contributes to normal energy-yielding metabolism and to the reduction of tiredness and fatigue.
- Vitamin B5 contributes to normal mental performance.
- And a few more: L-theanine, Rhodiola rosea root, blackcurrant extract and ginger.

**Flavour**
> Updated 2026-10-02 (owner chose this wording; "with" matches the sachet artwork).

Dark blackcurrant, warmed with ginger

**Price**
£60 · 28 servings · £2.14 per morning

**Reassurance**
No payment now. You'll be first to know when we're ready.

**CTA**
Reserve My Place

**Scarcity**
Get in early. Numbers are limited.

**Secondary action** *(text link, visually subordinate to CTA — interaction detail in separate UX file)*
Have a question? Ask us here.

**Callouts**
- Vegan
- No artificial sweeteners
- Research-led formula

---

#### Accordion 1: What to expect

Within the first few minutes, a mild warmth. Nothing dramatic. From around thirty minutes, energy building smoothly rather than arriving all at once. No spike, no edge. Just clear and composed through the morning.

The longer you take it, the more consistent it becomes. Week one you'll notice. Week three it's just how mornings feel.

---

#### Accordion 2: What's in it

*Updated 2026-10-01 (owner-supplied copy, replaces the earlier ingredient list). Below the list, the page keeps the callout rows (Vegan, No artificial sweeteners, Research-led formula, Gluten free); their wording is awaiting confirmation against the new formula.*

> Updated 2026-10-21 to match the nutrition label (`~/Desktop/nutrition-label.html`, formulation confirmed 1 Oct 2026). Owner decision the same day: the list shows ingredient NAMES ONLY, with no amounts or percentages after them (no comma, no "160mg", no "(35% anthocyanins)", no "% of your daily reference"). Every amount lives in the "Nutritional information" modal instead (see below). Ginger moved from the active list to "Other ingredients" with no dose, because its amount is still a starting point; "Other ingredients" follows the label's order (heaviest first). The one amount left in this accordion is the "80mg of caffeine" in the green tea description, which sits next to the caffeine alertness claim. A "Nutritional information" link sits under the lists, above the callouts, and opens the label in a modal.

**Heading**
Each sachet contains

**Group heading**
Active ingredients

- Green tea extract — Gives 80mg of caffeine. Caffeine helps to increase alertness.
- L-theanine — The amino acid tea has and coffee doesn't, alongside the caffeine.
- Rhodiola rosea root extract — A cold-climate root, studied for mental fatigue under stress. Give it two weeks.
- Blackcurrant extract — The dark pigment in blackcurrants, studied for blood flow and the brain, over weeks. Also gives the colour and flavour.
- Vitamin B12 (methylcobalamin) — Contributes to the reduction of tiredness and fatigue.
- Vitamin B5 (pantothenic acid) — Contributes to normal energy-yielding metabolism and the reduction of tiredness and fatigue.

**Group heading**
Other ingredients

- Sunflower lecithin — Mixes the powder smoothly and makes the froth on top.
- Citrus fibre — Gives the drink its body. Made from citrus peel.
- Ginger root extract — A gentle warmth in the first few minutes, so you know it's started.
- Natural flavouring — Rounds out the blackcurrant and ginger flavour.

**Link**
Nutritional information (opens the label in a modal)

**Nutritional information modal** *(new 2026-10-21; copy is the owner's `nutrition-label.html`, kept word for word in `concepts/product-wireframe-v2.html`)*

> DRAFT FIGURES. Energy, fat, saturates, carbohydrate, sugars, fibre, protein and salt are estimates, calculated from ingredient types and weights, not lab analysis. They must be replaced with the formulator's analysis before launch. Caffeine (80 mg) needs a certificate of analysis and an end-of-shelf-life test; the vitamins need end-of-shelf-life potency confirmation; the small print (caffeine warning, supplement statements) needs checking by the labelling specialist.

> Added 2026-10-25 (owner request): a one-line note directly under the typical-values table, "These figures are estimates and may change." It tells the reader the table is an estimate, but it does not replace the lab analysis above: the figures still have to be replaced before launch.

Contents: serving (1 sachet, 4.2 g, 28 per pack), typical values per sachet and per 100 g, per-sachet amounts for green tea extract (160 mg, 80 mg caffeine), L-theanine (150 mg), Rhodiola (300 mg, 3% rosavins, 1% salidroside) and blackcurrant extract (300 mg, 35% anthocyanins), other ingredients in weight order, the two vitamins with % NRV, and the caffeine and supplement small print.

---

#### Accordion 3: Is it right for me?

Morningo sits alongside your morning coffee, not instead of it. If you want a dramatic energy hit, this isn't it. If you want the hours between your first coffee and lunch to feel more consistent and clear, it probably is.

It contains caffeine from green tea extract. If you're sensitive to caffeine, factor that in.

The effect builds over time. Give it two weeks before you decide.

---

### SECTION 2: START READY

> Removed 2026-10-02 (owner decision). The black full-bleed band with the drink photo ("The first hours set the day. Start them properly.") is no longer on the page. The section numbers below are left as they were. The fade-in on its headline now applies to every H2 on the product page (`.title-fade`).

---

### SECTION 3: PROBLEM

**Job**
Make the reader feel the mid-morning focus fade before anything is sold. Recognition first, product never. They should feel seen, not lectured.

> Updated 2026-10-02 (owner-supplied copy, replaces the earlier headline, sub-copy and four bullets). Each bullet keeps a thin outline icon that matches its text: envelope, speech bubble with a question mark, clock showing half ten.

**Headline**
Most mornings start fine. They just don't stay that way.

**Sub-copy**
Not a crash. Just a slide in the wrong direction.

**Bullets**
- Reading the same email three times.
- Asking someone to repeat the question.
- The afternoon that quietly started at half ten.

---

### SECTION 4: THE PRODUCT

**Job**
Make the ritual feel real and intentional. The reader pictures themselves doing this tomorrow morning. One considered act that sets the tone for the day.

**Headline**
> Updated 2026-10-21 (owner-supplied copy, second rewrite the same day). Replaces "A morning drink for the second coffee slot." which replaced "One drink before the morning gets away from you.".

Your first coffee is the one you look forward to. Now the second can be too.

**Body**
> Updated 2026-10-21 (owner-supplied copy, second rewrite the same day, replaces the five-paragraph version). Six paragraphs with three bullets after the fourth. Later the same day the owner cut three pieces from it: "Most of our versions were too watery, too bland or too boring.", the paragraph "The test was simple: would we make another one mid-morning? For a long time, no.", and "Version 47 is the first one we'd put our name on." The "Within minutes, a mild warmth..." text still lives in the "What to expect" accordion. A "Get first access" button sits under the last paragraph (added 2026-10-21; it goes to the email capture page). Still to check: "47 versions" must be a true count (the hero says it too, and the social proof heading says "47+"); the bullet says "It needs a good shake" while the hero sub-copy says "stirred into a glass of water".

A thick, dark morning drink with a warm kick of ginger. It took us 47 versions to make one worth the glass.

Evenings get a table and some time. The second coffee gets a mug and a deadline, and it's gone before you notice.

We wanted that slot to have a drink of its own.

It's thick and it's not a quick drink, so you take your time with it.

- Thick. It needs a good shake.
- Dark, with a foam head.
- A warm kick of ginger at the end.

It still has caffeine, from green tea.

If you want a dramatic hit, this isn't it. If you'd rather have a mid-morning worth stopping for, it's for you.

---

### SECTION 5: WHY IT WORKS

> Replaced 2026-10-01 with the owner's new copy: five cards plus footnotes. The old three cards (Calm energy, Clarity that holds, Built to last) are gone. The Job line below is from the earlier version.

**Job**
Show the reader this product thinks differently about energy. Three mechanisms, each distinct, that together explain why this feels unlike anything else they've tried.

**Headline**
Steady isn't an accident.

**Subline**
A handful of good ingredients, properly dosed. Not a sprinkle of forty.

**Carousel**
Exactly 5 cards, in this order, scrolling horizontally (on desktop as well as phones).

---

#### Card 1: Alert, not wired¹
*Green tea extract + L-theanine*

Caffeine for alertness, plus L-theanine, the amino acid tea has and coffee doesn't.

*Photo: green tea leaves*

---

#### Card 2: Dark berry, deep flavour
> Updated 2026-10-21 (owner-supplied copy, replaces the title "Dark berry, clear head" and the body "... Studied for blood flow and the brain, over weeks."). The "What's in it" accordion line for blackcurrant still carries the old "studied for" wording.

*Blackcurrant anthocyanins*

The pigment that turns blackcurrants almost black. The blackcurrant brings rich flavour.

*Photo: [placeholder]*

---

#### Card 3: A warm start
*Ginger root*

There for one reason: a gentle warmth in the first few minutes, so you know it's started.

*Photo: [placeholder]*

---

#### Card 4: Better with time
*Rhodiola rosea*

A cold-climate root, studied for mental fatigue under stress. Give it two weeks.

*Photo: [placeholder]*

---

#### Card 5: Feel less tired²
*Vitamin B12 + B5*

Help your body release energy from food. B12 at 200% of your daily reference, B5 at 100%.

*Photo: seeds and grains (stand-in for the vitamins)*

---

**Footnotes** (directly below the carousel, small text; the markers in the card titles point to these)

¹ Caffeine helps to increase alertness.

² Vitamin B12 and pantothenic acid (B5) contribute to normal energy-yielding metabolism and to the reduction of tiredness and fatigue.

---

### SECTION 6: SOCIAL PROOF

> **Replaced 2026-10-22 (owner-supplied, verbatim, locked).** The cards below (Sarah M., James T., Rachel K., and the photo cards that followed) are history. The section now shows four text-only review cards under the headline "47+ versions to get here. Then we let people try it." and the line "A small group's been trying it. Here's what they're telling us so far.". Each card has a star rating, the quote and the first name, centred on the hero's lilac (#EAE3F1), stars in the primary plum, quote in italic body text:
>
> 1. Loic, 5 stars: "I've been pleasantly surprised through the morning. It's nice to take a moment with something different"
> 2. Amber, 4 stars: "Feels like I'm drinking a luxury smoothie with some nice extras"
> 3. Yann, 5 stars: "I'm enjoying switching things up from my usual coffee's. I'm drinking less coffee and saving a few pounds" (the apostrophe in "coffee's" is as supplied; do not correct it without asking)
> 4. Luke, 4 stars: "Helps power through work. The ginger kick makes me feel like it's working"
>
> **Owner decision (2026-10-22) against the Section 7 rule that tester words must be about taste or texture, never effects:** the owner chose to use all four as supplied, including Loic's and Luke's, which describe effects. That choice was made on the understanding that they are real testers who agreed to be named; written permission to use their names and words is the owner's to hold, and is not recorded in this repo. Cards are fixed 300px and scroll sideways on desktop (owner choice), 76% wide and swiped on a phone. Loic's quote is also the text on hero gallery picture 2.

**Job**
Let real people close the argument. Step back and let the quotes do the work. Nothing polished, nothing manufactured.

**Note for Claude Code**
Replace placeholder quotes with real tester language verbatim when available. Do not polish or rewrite.

**Headline**
They tried it. Here's what they said.

---

#### Card 1
*Photo: [placeholder]*
*Sarah M. — Project manager, Bristol*

"Didn't expect to notice much difference. Two weeks in and the 10am slump just isn't happening the way it was."

---

#### Card 2
*Photo: [placeholder]*
*James T. — Freelance consultant, London*

"I was sceptical. I'm less sceptical now. Mornings feel more consistent."

---

#### Card 3
*Photo: [placeholder]*
*Rachel K. — Entrepreneur, Manchester*

"Calm is the right word. Not a buzz. Just steady."

---

### SECTION 7: QUESTIONS

> Added 2026-10-21 (owner-supplied copy, locked word for word). The last section of the page, after social proof, with no CTA of its own. Four accordions, the first open on load, using the same accordion as the hero. The word "FAQ" does not appear anywhere. No company name, address or team wording. Still open, owner to resolve before this goes live: (1) "Early testers are drinking it now" needs testers who really have the product, and any tester words used later must be about taste or texture, never effects, with written permission; (2) "a warm finish of ginger" and the dark berry colour need confirming once samples are tasted; (3) "[check]" after "about a small coffee's worth" needs checking against real caffeine figures, and 80mg needs a certificate of analysis showing at least 75mg through shelf life; (4) the four amounts in answer 2 must be locked, and the blackcurrant extract spec confirmed.

**Headline**
The obvious questions, answered.

**1. It's not on sale yet. What am I signing up for?** *(open on load)*

Your email address, and nothing else. No payment, no card details.

When the first batch is ready, you hear about it before it opens to everyone else. We expect initial orders to be for 500 people.

We'll only email you when we're ready.

**2. Does it work?**

Plenty of drinks promise big things. We'll show you the label.

Some supplements keep their amounts inside a "proprietary blend". We don't. Every active ingredient is here with its amount.

- 80mg of caffeine, from green tea.
- 150mg of L-theanine.
- 300mg of Rhodiola rosea root extract.
- 300mg of blackcurrant extract, about 105mg of anthocyanins.

Vitamin B12 contributes to normal energy-yielding metabolism. Pantothenic acid (vitamin B5) contributes to the reduction of tiredness and fatigue.

Early testers are drinking it now, and we'll put what they say on the page, in their own words.

We're not trying to change your life. We're trying to make one part of your morning worth sitting down for.

**3. Why make another morning drink?**

Evenings get a table and some time. Mornings get a mug and a deadline.

Morningo is a new morning drink, still in early development. Coffee one stays. This is for the second slot, the one you'd normally fill without thinking, and it's made to be a moment of its own: a glass, a dark berry colour, a warm finish of ginger, and time to sit with it.

It took 47 versions to get one worth putting a name on.

**4. How much caffeine is in it, and who shouldn't have it?**

80mg per sachet, from green tea. That's about a small coffee's worth.

One sachet a day is the most we'd suggest. It's a morning drink, so we'd leave it out after lunch. Count it alongside any other caffeine you have.

Not recommended for children, or for pregnant or breast-feeding women. If you take medication or have a health condition, ask your doctor first.

---

## PART 3: PLACEHOLDERS LOG

Nothing on this list should be invented or assumed. Each must be replaced before launch.

- [ ] Price — £[X] in Section 1
- [ ] Product photography — Section 1 hero image
- [ ] Testimonial photos — all three cards in Section 5
- [x] Testimonial quotes — replaced 2026-10-22 with four owner-supplied reviews (Loic, Amber, Yann, Luke), see Section 6. Still the owner's to confirm: written permission from each, and that the effect wording (Loic, Luke) is acceptable for the ads' landing page
- [x] "[check]" marker — Section 7, answer 4, after "about a small coffee's worth". Removed 2026-10-25 at the owner's request so the page can be published. The caffeine comparison itself ("about a small coffee's worth", here and in the hero) is still to be checked against the GB claims register.
