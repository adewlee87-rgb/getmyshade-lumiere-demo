# Lumière × GetMyShade — Stage-by-Stage Specification Testing Guide & Checklist (v2.0)

This testing guide provides a step-by-step verification plan to test the entire **Lumière × GetMyShade** integration against the **v2.0 Developer Specification**.

---

## 🚀 Pre-flight: Starting the Server

1. Open your terminal in the project directory:
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to:
   [http://localhost:3000](http://localhost:3000) (or `http://localhost:3001` if running on port 3001).

---

## 🧪 Stage 1: Brand Positioning & Storefront Navigation

> **Goal:** Verify Lumière leads as a luxury beauty brand and GetMyShade sits seamlessly as an infrastructure partner without intrusive "AI" buzzwords.

| Step | Action | Expected Outcome | Status |
| :--- | :--- | :--- | :---: |
| **1.1** | Open Homepage (`/`) | Page header displays **Lumière**. Hero copy reads: *"Your skin. Your shade. Your match."* | [ ] |
| **1.2** | Search page text for "AI" | Press `Ctrl + F` and search for "AI". **Confirm zero customer-facing mentions of "AI"** (uses *"Precision Beauty Matching"* instead). | [ ] |
| **1.3** | Check Header Navigation | Top header displays **Lumière** logo, catalog links, and a subtle **"Powered by GetMyShade"** mark next to notification bell. | [ ] |
| **1.4** | Check Sidebar Navigation | Click sidebar menu; verify entry point reads **"Beauty Match"** (NOT "AI Beauty Match"). | [ ] |

---

## 🛍️ Stage 2: Product Detail & Catalog Shade Selector

> **Goal:** Ensure shoppers can browse products normally, manually select shades, and access GetMyShade assistance when needed.

| Step | Action | Expected Outcome | Status |
| :--- | :--- | :--- | :---: |
| **2.1** | Navigate to `/catalog` | Products are strictly categorized into **Foundation, Concealer, Contour, and Highlighter**. (No lipsticks/primers in match catalog). | [ ] |
| **2.2** | Select a Foundation (e.g. *Lumière Skin Veil*) | Product detail page loads showing product image, price ($48), rating, and description. | [ ] |
| **2.3** | Interact with Shade Swatches | Click different shade circles (e.g., *120 Fair Neutral*, *340 Tan Neutral*). Selected shade updates active ring and title text. | [ ] |
| **2.4** | Verify Embedded CTA Banner | Below the swatches, confirm the card reads: *"Not sure which shade is right for you? Find Your Shade — Powered by GetMyShade"*. | [ ] |

---

## 📷 Stage 3: Scan Experience & Anonymous Session

> **Goal:** Verify friction-free scanning without account barriers and validate quality gate controls.

| Step | Action | Expected Outcome | Status |
| :--- | :--- | :--- | :---: |
| **3.1** | Click **"Find Your Shade"** | Opens the shade scanner (`/match`) without requiring email login or account sign-up. | [ ] |
| **3.2** | Test Live Camera Scan | Click **"Turn on camera"**. Video opens with auto 3-2-1 countdown capture. Captures automatically without manual clicks. | [ ] |
| **3.3** | Test Photo Upload Fallback | Switch to **"Upload Photo"** tab. Select a clear front-facing face photo file. | [ ] |
| **3.4** | Check Anonymous Session ID | Open Browser DevTools (`F12` $\rightarrow$ Console/Network). Verify a random `session_id` (e.g. `GMS-8F42A7`) is generated. | [ ] |
| **3.5** | Test Scan Quality Gate | Upload a very dark/blurry photo. Confirm yellow warning banner appears explaining lighting issues and offering retry tips. | [ ] |

---

## 🎯 Stage 4: Multi-Match Recommendations & Add-to-Cart Flow

> **Goal:** Validate that GetMyShade returns MULTIPLE ranked recommendations with individual Add-to-Cart CTAs.

| Step | Action | Expected Outcome | Status |
| :--- | :--- | :--- | :---: |
| **4.1** | Complete a valid scan | Screen transitions to *"Analyzing your skin..."* followed by *"Your GetMyShade Matches"*. | [ ] |
| **4.2** | Inspect Top Match Card | **#1 Best Match** is visually highlighted with a primary border and high confidence score (e.g., `96% Match`). | [ ] |
| **4.3** | Inspect Alternative Matches | Secondary cards (#2, #3) are displayed below/beside #1 with their respective match percentages (e.g., `92% Match`, `88% Match`). | [ ] |
| **4.4** | Check Individual CTAs | **Every recommendation card has its own independent "Add to Cart" button.** | [ ] |
| **4.5** | Click Add to Cart on #2 Match | Success banner appears: *"✓ Added [Shade Name] (92% Match) to your bag"*. Cart item count in header increments. | [ ] |
| **4.6** | Verify Cart Page (`/cart`) | Open cart. Item lists exact recommended shade name, hex swatch, price, and attached match rank. | [ ] |

---

## 💬 Stage 5: Post-Match Feedback & Session Signals

> **Goal:** Test customer match feedback loop and event logging.

| Step | Action | Expected Outcome | Status |
| :--- | :--- | :--- | :---: |
| **5.1** | Scroll below match cards | Feedback card asks: *"How accurate do these matches look?"*. | [ ] |
| **5.2** | Click feedback button | Click *"Perfect match"* or *"Slightly light"*. Card updates to *"✓ Thank you for your feedback!"*. | [ ] |

---

## 📊 Stage 6: Brand Admin Dashboard & Match Intelligence

> **Goal:** Confirm brand management, analytics, rank selection tracking, and developer API monitoring.

| Step | Action | Expected Outcome | Status |
| :--- | :--- | :--- | :---: |
| **6.1** | Open Admin Portal (`/admin`) | Page header loads **Lumière × GetMyShade Infrastructure Brand Admin Dashboard**. | [ ] |
| **6.2** | Check KPI Cards | Displays Total Scans, #1 Match Acceptance Rate (78.4%), Add-to-Cart Lift (+8.6%), and Active Catalog count. | [ ] |
| **6.3** | Test **Overview & Funnel** Tab | Displays conversion funnel from Scan Launched $\rightarrow$ Served $\rightarrow$ Clicked $\rightarrow$ Added to Cart $\rightarrow$ Purchased. | [ ] |
| **6.4** | Test **Recommendation Ranks** Tab | Displays rank analytics chart comparing #1 recommendation choice (78.4%) vs #2 choice (14.1%) vs #3 (7.5%). | [ ] |
| **6.5** | Test **Match Intelligence** Tab | Displays model version payload (`GMS-BASELINE-1.0`), sample JSON intelligence event signals, and return rate correlation. | [ ] |
| **6.6** | Test **Shade Catalog** Tab | Lists all 4 product lines with color swatches and "Seed API Catalog" trigger. | [ ] |
| **6.7** | Test **Shopper Feedback** Tab | Lists shopper ratings and feedback entries with anonymous session IDs. | [ ] |
| **6.8** | Test **Developer & API Tools** Tab | Embedded API panel displays API Status, active proxy route (`/api/gms/*`), API key configuration, and upstream health log. | [ ] |

---

## 🛠️ Summary Verification Command

To verify that all components build and pass strict TypeScript compilation without errors, execute:

```bash
npx tsc --noEmit
```
Expected output: `Exit code: 0` (No errors).
