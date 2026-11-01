# AGENTS.md — “Important Detail” Project Guide

This document is the complete working context for any agent continuing this project. Read it in full before making changes. It is intentionally self-contained: do not rely on files, notes, drafts, or generated artifacts outside this repository.

## 1. Project purpose

“Важлива деталь” (“Important Detail”) is a Ukrainian-language static crowdfunding landing page supporting the 65th Separate Mechanized Brigade “Velykyi Luh”.

The current campaign goal is to:

- raise **31,978 UAH**;
- fund **one 17-item equipment kit** for a heavy drone;
- cover onboard computing, power, networking, cabling, Starlink Mini, and one month of Starlink Local Priority 200 GB;
- let a supporter choose one or more understandable “parts” instead of inventing an abstract donation amount;
- hand the supporter off to the official monobank Jar.

The central idea is that every small component contributes to the complete result. The primary slogan is **“Кожна деталь має значення”** (“Every detail matters”).

This is not an online store and not a payment processor. Selecting a part is a donation metaphor and an amount-building mechanism. The site does not reserve goods, confirm payments, receive payment details, or prove that a payment occurred.

## 2. Non-negotiable requirements

Do not make any of the following changes without an explicit user request:

- change the 17-item list, item names, quantities, or prices;
- change the total campaign goal of 31,978 UAH;
- change the beneficiary or campaign context: the 65th Separate Mechanized Brigade “Velykyi Luh”;
- change the landing page language from Ukrainian;
- add invented specifications, combat results, statistics, partners, testimonials, guarantees, or legal claims;
- add reports, receipts, report pages, or links to them; the user explicitly decided that reports will not be published;
- add empty links, fictional contacts, newsletter forms, or unnecessary personal-data collection;
- imply that opening the Jar or the thank-you page confirms payment;
- describe a researched or proposed external feature as implemented.

All user-facing copy must be natural Ukrainian. Technical documentation and code comments may be English, but the visible interface must remain Ukrainian.

Save every newly generated image and any source/intermediate version that must be retained under `assets/`. Production pages must reference only final, optimized assets. Do not leave important project assets only in temporary directories.

## 3. Repository structure and source of truth

This repository is the complete production source. Its primary files are:

- `AGENTS.md` — project requirements, decisions, constraints, and handoff context;
- `index.html` — the main campaign landing page;
- `styles.css` — the main visual system, animations, and responsive behavior;
- `app.js` — item data, selector logic, campaign progress rendering, and donation handoff;
- `donation.html`, `donation.css`, `donation.js` — the donation handoff page;
- `thanks.html` — the thank-you page;
- `monobank-config.js` — the monobank Jar URL and optional official iframe template;
- `campaign-progress.js` — local fallback campaign values;
- `assets/` — all production images, sprites, and video;
- `.github/workflows/deploy-pages.yml` — GitHub Pages deployment workflow;
- `.nojekyll` — disables Jekyll processing for the static site.

Edit these files directly. Do not introduce a second generated copy of the site or an undocumented mirror. When a rule or value changes, update every affected runtime location in the same change.

### Historical values that must not return

An older project state used 18 components and a 46,550 UAH goal. Those values are obsolete. The current state is **17 items and 31,978 UAH**. Do not restore the old values from history, cached context, or previous conversations.

An older content plan also proposed reports and receipts. That proposal was explicitly cancelled. Do not implement it.

## 4. Canonical item list

The canonical runtime data is the `componentData` array in `app.js`. The list below is duplicated here so that this document remains a complete human-readable source of project context.

1. Raspberry Pi 4 2GB Model B+ — 4,050 UAH
2. R2D2 license — 1,000 UAH
3. TP-LINK TL-SG105 switch — 800 UAH
4. Adjustable DC converter 60–36 V — 500 UAH
5. 60×60 fan — 200 UAH
6. Matek BEC12S-PRO voltage regulator — 950 UAH
7. Low ESR capacitors, 2 pcs. — 400 UAH total
8. JST GX1.25 6-pin cable, 2 pcs. — 60 UAH total
9. Raspberry Pi TX30 power cable — 30 UAH
10. Switch TX30 power cable — 30 UAH
11. Camera JST GX1.25 5-pin to RJ-45 cable — 70 UAH
12. RJ-45 to RJ-45 cable, switch to Raspberry Pi — 60 UAH
13. RJ-45 to RJ-45 cable, switch to Starlink — 90 UAH
14. IN DC TX30 power cable — 30 UAH
15. Consumables — 500 UAH
16. Starlink Mini — 19,999 UAH
17. Starlink Local Priority 200 GB, one month — 3,209 UAH

Validation total: **31,978 UAH**.

The runtime array is sorted by price before rendering, so the visual order is different from the human-readable order above.

If the user explicitly authorizes an item-list change, update at least:

- `componentData` and corresponding asset names in `app.js`;
- the slider maximum, static counters, and visible item-count copy in `index.html`;
- the allowed `parts` range in `donation.js`;
- the total and item count in visible copy, meta tags, Open Graph copy, FAQ JSON-LD, ARIA labels, and this document;
- the corresponding files under `assets/`.

Do not update only one displayed number. The JavaScript goal is calculated from the item list, while several static fallbacks must remain synchronized.

## 5. Intended user journey

The primary flow is:

1. The visitor sees the campaign name, beneficiary, goal, current progress, and number of completed drones.
2. The visitor reads a compact explanation and may watch the local video.
3. The visitor moves to the central item selector.
4. The visitor selects items manually or with the range slider.
5. The interface displays the selected count, status, and calculated donation amount.
6. The visitor selects “Підтримати збір” and opens `donation.html` with `amount` and `parts` query parameters.
7. The visitor follows the direct link to the official monobank Jar or uses a future official iframe if one is properly configured.
8. The visitor may manually open `thanks.html`, but that page does not confirm a payment.

The conversion principle is to remove the burden of inventing an amount. A person chooses a concrete contribution, and the interface calculates the amount automatically.

## 6. Main page architecture

The order of sections in `index.html` is intentional:

1. **Campaign header** — “Важлива деталь” brand, raised/goal amount, progress percentage, and completed-drone count.
2. **65th Brigade hero** — brigade emblem, one primary H1, concise campaign explanation, selector CTA, and information CTA.
3. **About the campaign** — Ukrainian Q&A accordion on the left and local video on the right. The first answer is open by default; opening another answer closes the previous one.
4. **Choose parts** — the central interactive selector.
5. **Pixel battle scene** — a decorative narrative transition between the selector and final CTA.
6. **Footer** — slogan, repeated synchronized progress, CTA, internal navigation, monobank Jar, and verified social links.

Do not add a second long item list outside the selector. Do not overload the hero with technical specifications.

### Required Q&A topics

The campaign explanation must continue to answer these five questions in Ukrainian:

- “Хто ми?”
- “На що збираємо?”
- “Для чого це потрібно?”
- “Як долучитися?”
- “Чому «Важлива деталь»?”

The answers must stay concise, factual, and consistent with the visible campaign goal and item list.

## 7. Item-selector behavior

`app.js` contains critical campaign logic.

Required behavior:

- sort items from the lowest price to the highest price;
- select one lowest-priced 30 UAH item by default;
- show six cards per row on desktop;
- use a horizontally scrollable card strip on mobile;
- make the slider select the first N lowest-priced items;
- allow every card to be selected or cleared independently through its check control;
- after a manual card change, synchronize the slider to the number of selected items, not to a continuous price threshold;
- calculate the donation amount as the sum of selected items;
- format amounts with `Intl.NumberFormat("uk-UA")`;
- prevent donation navigation when zero items are selected and show “Оберіть хоча б одну деталь”;
- reveal `assets/complete-dron.png` and the complete-kit message when all 17 items are selected;
- encode `parts` as the current sorted-array indices plus one;
- keep the support control as a real anchor with a functional fallback URL; JavaScript may update its `href`, but must not replace it with a JavaScript-only button.

Keyboard interaction inside the item viewport uses the Left and Right arrow keys to change the selected count. Preserve `tabindex`, `aria-pressed`, dynamic `aria-label` values, `aria-live`, and visible focus states.

## 8. Campaign progress

The campaign goal is calculated in `app.js` from `componentData`. Current raised funds and completed-drone count come from:

```js
window.CAMPAIGN_PROGRESS = {
  collectedAmount: 0,
  collectedDrones: 0,
};
```

Local fallback values are stored in `campaign-progress.js`.

GitHub Pages injects deployment values from repository variables:

- `CAMPAIGN_COLLECTED_AMOUNT`;
- `CAMPAIGN_COLLECTED_DRONES`.

Both values must be non-negative integers. Static GitHub Pages cannot read environment variables dynamically in the browser. After changing repository variables, rerun the **Deploy GitHub Pages** workflow.

The visual progress bar is capped at 100%, even when the raised amount is higher than the goal. The displayed raised amount may exceed the goal, while ARIA `valuenow` remains capped at the goal. Header and footer values must always match.

## 9. Monobank handoff

The canonical Jar URL is:

`https://send.monobank.ua/jar/4BtyfStgP8`

Configuration lives in `monobank-config.js`.

Current integration state:

- the direct official HTTPS Jar link is validated and displayed;
- only `monobank.ua` and its subdomains are accepted by URL validation;
- `widgetUrlTemplate` is empty;
- when no official widget template exists, the demo iframe area is hidden and the Jar link remains available;
- an official iframe URL must not be invented; it must come from a real official monobank invoice/widget flow;
- `MAX_SINGLE_DONATION = 29999`, so the complete 31,978 UAH kit displays a warning that multiple payments may be required;
- automatic payment splitting is not implemented;
- the site does not verify payment status.

Testing previously showed that a Jar URL can accept `?amount=1234` and display a prefilled read-only amount. The current code does **not** append the selected amount to `jarUrl`. Treat amount prefill as researched but not implemented.

Do not mark prefill as complete until all of the following are done:

1. `donation.js` is updated;
2. zero, ordinary, maximum, and complete-kit amounts are tested;
3. the real monobank form behavior is reverified;
4. the site is redeployed;
5. the published flow is tested.

Because external payment behavior can change, verify current monobank behavior and official documentation before modifying the integration.

## 10. Content voice

The voice must be:

- direct, concrete, and respectful;
- concise, with clear calls to action;
- free of bureaucracy and excessive dramatization;
- free of invented promises or pressure tactics;
- focused on what each technical item contributes to the complete kit;
- careful not to expand military claims or capabilities without confirmed facts and a clear need.

The established pixel-art “zombie” metaphor is part of the project and may include the phrase “Більше дронів — менше зомбі”. Keep it playful and clearly separate from factual campaign claims.

Established Ukrainian wording:

- brand: “Важлива деталь”;
- subtitle: “Благодійний збір · 65 ОМБр”;
- monogram: “ВД”;
- H1: “Збір на важкий дрон для 65 ОМБр”;
- CTAs: “Обрати важливу деталь”, “Підтримати збір”, “Обрати деталі та підтримати”;
- slogan: “Кожна деталь має значення”.

Do not place periods at the end of short UI headings. This is an established design decision.

## 11. Visual system

The project combines a **dark tactical interface, industrial console styling, and a clear pixel-art layer**. It is not a generic charity template, a soft SaaS dashboard, or a cute retro site.

Core colors from `styles.css`:

- background: `#080a0f`;
- panels: `#11151d` and `#171c25`;
- main text: `#f0f2f3`;
- muted text: `#919caa`;
- primary amber accent: `#ffc247`;
- deep amber shadow: `#8a4b08`;
- warning: `#ff6b51`;
- green is reserved for small ONLINE/status indicators.

Characteristic styling:

- grid and scanline background texture;
- square corners, thin technical borders, and dashed separators;
- hard offset shadows instead of soft floating-card shadows;
- small uppercase labels with wide letter spacing;
- amber reserved for important states and primary CTAs;
- large condensed headings using `Arial Black` / `Impact`;
- interface text using `Cascadia Mono`, `Segoe UI Mono`, or `Consolas`;
- readable body copy using `Segoe UI`;
- pixel-art images rendered with `image-rendering: pixelated` or `crisp-edges`;
- real photos and video rendered normally.

Do not introduce rainbow neon gradients, large rounded corners, glassmorphism, generic blue CTAs, or unrelated colors. New components should reuse existing tokens, borders, shadows, typography, spacing logic, and focus states.

## 12. Pixel-art scene and generated graphics

The pixel scene is a deliberate part of the project identity. It shows a heavy drone moving across a dark forest/road scene and sequentially hitting zombie groups with pumpkin-like projectiles. Gravestones appear after each target. The main loop is approximately nine seconds with staggered target delays.

Rules:

- decorative sprites must keep empty `alt` attributes;
- the scene meaning is exposed through the section-level `role="img"` and `aria-label`;
- individual decorative sprites must not become focusable;
- `prefers-reduced-motion: reduce` must effectively disable animations and transitions;
- do not replace the pixel-art drone with SVG without an explicit request;
- use `assets/complete-dron.png` for the complete-kit state;
- save all generated image material that must be retained under `assets/`;
- only final optimized files should be referenced by production HTML or CSS;
- use clear Latin filenames for new production assets;
- do not rename or delete existing assets unless the change is necessary and every reference is updated.

## 13. Video

The campaign video must remain local. A previous YouTube embed failed with error 153 when opened without an HTTP Referer, so the project deliberately uses native video playback.

Required markup behavior:

```html
<video controls preload="metadata" playsinline>
```

Do not add any of the following without an explicit request:

- `autoplay`;
- an artificial `poster` image;
- automatic playback with sound;
- a YouTube iframe.

The video must start paused and use native controls. The current production file is `assets/video.mp4`, approximately 19.6 MB. Its maximum width on wide layouts is 680 px; on mobile it uses the available container width.

## 14. Responsive behavior and accessibility

Test at minimum:

- narrow phones around 320–375 px;
- 420–720 px;
- tablet/small desktop around 960 px;
- wide desktop.

Key responsive requirements:

- header brand, progress, and drone count must reflow cleanly;
- hero content becomes a single column on mobile;
- CTAs retain adequate touch targets;
- Q&A and video become a single column;
- the six-column item grid becomes a horizontal card strip;
- footer columns stack vertically;
- the body must not create horizontal overflow outside the intentional card scroller;
- large amounts and headings must not clip on small screens.

Preserve:

- semantic `header`, `main`, `section`, `footer`, and `nav` elements;
- exactly one visible H1;
- a logical H2 hierarchy;
- meaningful `alt` text for content images;
- empty `alt` for decorative images;
- `aria-labelledby`, `aria-live`, and progressbar attributes;
- visible `:focus-visible` states;
- keyboard navigation;
- reduced-motion support;
- native video controls.

## 15. SEO

The primary search query is **“збір на важкий дрон для 65 ОМБр”**.

Already implemented:

- the query appears at the beginning of the title;
- one H1 clearly describes the campaign;
- the meta description explains the goal, kit, and monobank action;
- Open Graph and Twitter metadata use Ukrainian copy;
- FAQPage JSON-LD mirrors the five visible Q&A items;
- donation and thank-you pages use `noindex,follow`;
- primary CTAs are real links rather than JavaScript-only buttons;
- meaningful images have dimensions, alt text, lazy loading, and asynchronous decoding where appropriate.

If visible FAQ content changes, update JSON-LD in the same change. Structured data must never contain hidden claims or facts that are absent from the visible page.

Remaining SEO tasks:

- reconfirm the final public URL;
- add absolute `canonical`, `og:url`, and `og:image` values;
- complete sitemap and crawler-directive work if needed;
- validate JSON-LD with an external Rich Results Test after publication;
- test every published asset and page path for 404 responses.

The site was previously available at `https://lov3catch.github.io/65ombr.donate/`, but verify that URL before using it in canonical or Open Graph tags.

## 16. Footer, contacts, and privacy

The current footer includes:

- the final campaign CTA;
- synchronized campaign progress;
- the monobank Jar link;
- Telegram: `https://t.me/ombr65`;
- Instagram: `https://www.instagram.com/65ombr_recruit/`;
- Facebook: `https://www.facebook.com/profile.php?id=61573028283625`;
- the project service line.

Do not publish home addresses, identity documents, or unnecessary personal data. Verify changed external links before publication.

The site currently does not collect names, phone numbers, email addresses, cookies, or analytics data. It therefore does not need a newsletter form or a decorative privacy page. If analytics, forms, or other data collection are introduced, evaluate consent and privacy requirements before implementation.

Do not add reports, receipts, report navigation, or promises of future reporting.

## 17. Deployment

The GitHub Pages workflow is `.github/workflows/deploy-pages.yml`. It runs on pushes to `main` and through manual `workflow_dispatch`.

The workflow:

1. checks out the repository;
2. validates campaign repository variables;
3. copies the static site into the Pages artifact;
4. generates the runtime campaign-progress configuration in that artifact;
5. uploads the Pages artifact;
6. deploys GitHub Pages.

Changing a local file does not publish the live site. After deployment, wait for the workflow to reach a terminal success state and verify the public HTML, CSS, JavaScript, images, video, and donation flow.

Use `develop` for proposed changes and open a pull request into `main`. Do not merge a pull request unless the user explicitly asks for a merge.

## 18. Agent workflow

Before editing:

1. Read this document completely.
2. Identify whether the task affects production copy, item data, assets, SEO, accessibility, payment handoff, or deployment.
3. Inspect the current repository files instead of relying on cached context.
4. Preserve unrelated user changes.
5. Reverify live state when the task involves an external service or published site.

While editing:

1. Treat this repository as the single source of truth.
2. Preserve Ukrainian user-facing copy and the established visual system.
3. Maintain progressive enhancement and accessibility.
4. Keep all required assets under `assets/`.
5. Keep repeated values and fallback copy synchronized.
6. Do not confuse external-service research with a completed implementation.

After editing:

1. Confirm that the 17 prices still total 31,978 UAH unless the list was explicitly changed.
2. Search user-facing content for obsolete `18` and `46 550` campaign values.
3. Check all internal links and asset paths.
4. Test selector states for zero, one, several, and all 17 items.
5. Test manual card changes after using the slider.
6. Verify `amount` and `parts` query parameters on the donation page.
7. Verify the complete-kit 31,978 UAH warning.
8. Test keyboard navigation, focus visibility, reduced motion, and mobile layout.
9. Confirm that video has no `autoplay`, `poster`, or YouTube dependency.
10. If deployed, verify the live workflow and public site.

## 19. Minimum local verification

The project has no build step or package dependency. Serve the repository root over HTTP instead of relying only on `file://`. For example, when the Python launcher is available:

```powershell
py -m http.server 8000
```

Then check:

- `http://localhost:8000/`;
- `http://localhost:8000/donation.html?amount=30&parts=1`;
- `http://localhost:8000/donation.html?amount=31978&parts=1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17`;
- `http://localhost:8000/thanks.html`.

Do not consider browser verification complete merely because files parse successfully. Inspect interaction and responsive layout visually.

## 20. Known unfinished work

- monobank amount prefill through `?amount=` is researched but not implemented;
- an official monobank iframe is not configured and `widgetUrlTemplate` is empty;
- canonical, `og:url`, `og:image`, sitemap, and crawler-directive work requires confirmation of the final public URL;
- no named organizer contact exists beyond the brigade's official social links; do not invent one;
- the interface does not display the date of the latest progress update;
- there is no backend, automatic Jar synchronization, analytics, or payment confirmation;
- large media may be optimized further only if visual quality is preserved and references remain valid.

## 21. Definition of done

A task is complete only when:

- the requested change exists in the actual production source;
- data, visible copy, metadata, and styling remain consistent;
- the item list, goal, Ukrainian language, payment disclaimers, and accessibility remain intact unless explicitly changed;
- verification is proportional to the risk of the change;
- a published feature is verified on the live site, not only in local code;
- the agent clearly reports what was verified, what was not verified, and which parts still depend on external systems.
