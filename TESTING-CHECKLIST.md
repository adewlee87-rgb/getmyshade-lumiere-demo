# Client Review — Tester's Checklist

**App URL:** http://localhost:3001 (dev server). If it's not running: `npm run dev`.
**Brand name in UI:** "Lumière". **Partner mark:** "GetMyShade".

> ✅ **API status (rechecked Aug 6):** subscription is **ACTIVE** (growth plan, ~1992 scans left).
> A live match returns real shades, and the catalog holds only the 4 approved categories.
> Items **4, 5, 6** are fully testable now.
>
> **Two known API-side quirks to expect (not site bugs):**
> 1. Match cards may show *"Your closest match — rescan in brighter light"* and **no % score**,
>    because the API is returning `match_score: null` even on high-confidence scans.
> 2. Matches may skew toward pale shades. If they consistently look wrong for the face, that's a
>    GetMyShade matching-quality issue to raise with them, not a site bug.
>
> If a scan ever ends on a red **"Scan failed · NO_SUBSCRIPTION"** card, the subscription lapsed
> again — that's an account/billing issue on GetMyShade's side, not a bug in the site.

---

## 1. Brand leads, no "AI", not overshadowed by GetMyShade
**Client said:** "The website itself is a brand, should not be showing anything about AI and should not be overshadowed by GetMyShade."

- [ ] Go to **http://localhost:3001/** (landing page).
- [ ] Read the hero, the "How it works" section, and the footer. **Confirm the word "AI" appears nowhere.**
      (Expected copy: "Precision Beauty Matching", "Our precision skin analysis" — no "AI".)
- [ ] Confirm the big brand name **"Lumière"** is what leads the page, not GetMyShade.
- [ ] Open the left sidebar nav item — it should read **"Beauty Match"** (NOT "AI Beauty Match").
      Path: sign in first (see below), then look under **Discover → Beauty Match**.
- [ ] **Judgment call to flag:** scroll to the very bottom of the landing page. There is a
      **"Building your own beauty brand?"** developer card that mentions the "public GetMyShade API".
      This is intentional (it's the developer CTA), but confirm with the client that a *developer*
      mention this visible on the customer homepage is acceptable, since she asked not to be
      overshadowed by GetMyShade.

**How to sign in (to reach the app/dashboard pages):**
- [ ] Click **"Get your match"** or go to **/signup**, fill anything, submit. You land in the app shell
      (left sidebar + top bar). This is a demo — no real account needed.

---

## 2. "Powered by GetMyShade" mark placement
**Client said:** "The icon of find my shade – powered by GetMyShade should be under menu and beside the top notification icon."

- [ ] In the app (after signing in), look at the **top-right header bar**.
- [ ] Confirm the **GetMyShade logo icon sits immediately to the LEFT of the bell (notification) icon.**
      Order should be: **[GetMyShade logo] [🔔 Bell] [♡ Wishlist] [🛒 Cart]**.
- [ ] Hover the GetMyShade icon — tooltip reads **"Powered by GetMyShade"**. Click it → opens the
      **Integration Guide** page.
- [ ] Open the **left sidebar menu**. Scroll to the bottom of the nav.
- [ ] Confirm there's a small **"Powered by GetMyShade"** link with the logo, below all menu items.
- [ ] Confirm the mark is **subtle** (small, muted) — not competing with the "Lumière" logo at the top.
- [ ] On mobile width (narrow the window): open the ☰ menu — the same "Powered by GetMyShade" link
      should appear at the bottom of the drawer.

---

## 3. Camera captures in ONE step (not 3 clicks)
**Client said:** "the way the camera was rendering is weird. You need to click it 3 times to capture."

- [ ] Go to **Beauty Match** (sidebar) or **/match**.
- [ ] Make sure the **"Live Camera Scan"** tab is selected (it's the default).
- [ ] Click **"Turn on camera"** — allow camera permission when the browser asks.
- [ ] Confirm you see your video with a **countdown (3 → 2 → 1)** and the text
      **"Hold still — capturing automatically"**.
- [ ] Confirm it **captures by itself when the countdown ends — you press NOTHING.**
      (The old 3-click capture button is gone. There should be no "capture" button at all while live.)
- [ ] After capture it should go straight into **"Analyzing your skin…"**.
- [ ] Edge check: if you have no camera / deny permission, you get a clear message pointing you to the
      **"Upload Photo"** tab — confirm that fallback reads sensibly.

---

## 4. A scan returns a SHADE (name + colour swatch), not just a product
**Client said:** "after scanning it's not picking out the shade that matches the skin. It just shows the product and does not give a shade."

> Needs an active API subscription — see the note at the top.

- [ ] Complete a scan (Live Camera, or **Upload Photo** with a clear, well-lit face photo).
- [ ] On the results screen, confirm the top card shows your analysis: a **skin-tone colour square**
      plus **Skin tone / Undertone / Depth / Skin type**, and a **confidence %** badge.
- [ ] Under **"Your shade matches"**, for **each** product card confirm ALL of these are present:
  - [ ] a **round colour swatch** (the actual shade colour),
  - [ ] the label **"Your shade"**,
  - [ ] a **shade name** (e.g. "Light Medium 9W"),
  - [ ] the product name underneath.
- [ ] Confirm you are **never** shown a product card without a shade name + swatch.

---

## 5. "No match" messaging is clear and encouraging
**Client said:** "it says my match is not available but didn't say check again soon — but it matched the product without a matching color."

> Needs an active API subscription — see the note at the top.

- [ ] Trigger a weak result on purpose: use **Upload Photo** with a **dim / poorly lit** face photo
      (or a low-confidence one).
- [ ] If confidence is low, confirm a **yellow warning** appears explaining it's likely the lighting,
      with retake tips (bright, even, front-facing light).
- [ ] If a whole category can't be matched, confirm the yellow banner says something like
      **"…check back soon, or try scanning again in bright, even light."** — i.e. it **explicitly tells
      you to check back / try again** (this was the missing "check again soon" the client called out).
- [ ] If nothing matches at all, confirm the empty state says
      **"We couldn't find a shade match… check back soon"** and offers a **"Scan again"** button.
- [ ] Confirm you are **NOT** shown any product without a matching colour (no colourless/blank cards).

---

## 6. Only the RIGHT categories get matched
**Client said:** "It's also matched products we are not supposed to be matching like lipstick, primer etc. Let getmyshade focus on matching what we claim we match."

> Needs an active API subscription — see the note at the top.

- [ ] Complete a scan and look at every card under **"Your shade matches"**.
- [ ] Confirm matched products are **ONLY** from these categories:
      **Foundation, Concealer, Highlighter, Contour.**
- [ ] Confirm there is **NO Lipstick, Primer, Powder, Blush, Setting Spray, or Tool/Brush** in the
      matches. (These can still exist elsewhere in the shop — just never as a shade match.)
- [ ] Note: even if the live catalog still contains old lipstick/primer entries, the site filters them
      out of match results. If you DO see one slip through, that's a real bug — record the product name.

---

## Wrap-up
- [ ] Note the browser + screen size you tested on (desktop and mobile widths).
- [ ] For anything that failed, capture: the page URL, a screenshot, and (for scan errors) the
      **red badge code** shown on the "Scan failed" card (e.g. `NO_SUBSCRIPTION`, `INVALID_API_KEY`).
- [ ] Remember: `NO_SUBSCRIPTION` / timeouts on scan = GetMyShade account issue, not a site bug.
