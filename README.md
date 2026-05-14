# Curium Landing Page — V1

A single-page replacement for curium.sg, built around the new positioning:
**"Crowd analytics that work with the cameras you already have."**

---

## What's in this folder

```
curium-site/
├── index.html                  # The complete page — HTML + inline CSS, no build step
├── assets/                     # Images (~1.7 MB total)
├── google-apps-script.gs       # Form backend (only needed for form setup, below)
└── README.md                   # This file
```

Total page weight: ~1.7 MB. Loads in under 2 seconds on a normal connection.

---

## FOR ALI — UPLOAD THIS WHEREVER curium.sg LIVES

The site is a static page. No build step, no Node, no database. It will work on any web host — current shared hosting, a CDN, Netlify, anywhere that serves files.

**Two things must be true before you upload:**

1. **The Google Apps Script form endpoint is set up** (see "Form setup" below). Until that's done, the "Request walkthrough" button will fail. If you upload before the form is ready, users who try to submit will see an error pointing them to email contact@curium.sg — still acceptable, just not ideal.

2. **The previous site's `noindex, nofollow` tag is gone.** The old curium.sg had `<meta name="robots" content="noindex, nofollow">` in the head, telling Google not to index it. This new page does NOT have that tag. After upload, view the page source in a browser and confirm you don't see `noindex` anywhere. If the host is WordPress, check Yoast/RankMath settings → make sure the homepage is "indexable".

**Upload steps by host type:**

- **Static / shared hosting (cPanel, FTP, etc.):** Upload `index.html` to the public web root (often `public_html/`), then upload the `assets/` folder alongside it. Done.
- **WordPress:** Easiest is to install a "raw HTML page" plugin (e.g. "Custom HTML"), paste the index.html content into a new page, then set it as homepage under Settings → Reading. Upload assets to `wp-content/uploads/` and adjust image paths in the HTML (`assets/foo.jpg` → `/wp-content/uploads/foo.jpg`).
- **Netlify / Vercel / Cloudflare Pages:** Drag the entire `curium-site` folder into the deployment UI. They give you a temporary URL immediately; then point DNS at it.

After uploading, browse to curium.sg and verify:
- KONE Helsinki dashboard image loads on the hero
- All three case study cards have their images
- Both founder photos appear in the Company section
- Scrolling and the form work on mobile

---

## Form setup (~10 minutes, one-time)

The "Request walkthrough" form submits to a Google Apps Script endpoint that **(a) appends each submission to a Google Sheet, and (b) emails contact@curium.sg** every time someone submits. No third-party services, no monthly fees, fully under your control.

### Steps

1. **Create a new Google Sheet.** Go to https://sheets.new and name it "Curium — Walkthrough Requests".

2. **Add column headers** in row 1: `Timestamp | Name | Email | Company | Role | Message | Source`

3. **Open the script editor.** In the sheet menu: `Extensions → Apps Script`. A new tab opens.

4. **Paste the script.** Delete any boilerplate, paste the entire contents of `google-apps-script.gs` from this folder. Save with the disk icon — name it anything (e.g. "Curium Walkthrough Handler").

5. **Deploy as a web app.**
   - Click `Deploy → New deployment` (top right)
   - Click the gear icon next to "Select type" → `Web app`
   - Set:
     - Description: `Walkthrough form handler v1`
     - Execute as: `Me`
     - Who has access: `Anyone`
   - Click `Deploy`

6. **Authorize permissions.** Google asks for permission to read/write the sheet and send mail. Click `Authorize access`. You may see "Google hasn't verified this app" — click `Advanced → Go to (project name) (unsafe)`. This is normal for personal scripts. Accept.

7. **Copy the deployment URL.** Google shows a URL like `https://script.google.com/macros/s/AKfycb.../exec`. Copy it.

8. **Paste the URL into index.html.** Open `index.html` in any text editor, find this string:
   ```
   REPLACE_WITH_GOOGLE_APPS_SCRIPT_URL
   ```
   Replace it with the URL from step 7. Save.

9. **Test.** Re-upload `index.html`. Submit a test entry on the live site. Within ~5 seconds:
   - A new row appears in the Google Sheet
   - An email arrives at contact@curium.sg with the submission

If anything fails, the most common cause is step 6 (authorization) wasn't fully completed — redo it from the Apps Script editor.

---

## Pre-launch checklist

- [ ] Founder bios for Hasnain and Ahmed — read for tone, edit as needed
- [ ] Case study stats (Helsinki "5 zones", Expo "14 sensors fused") — confirm or correct
- [ ] "Brick & Mortar AI" in the trust strip — remove if explicit permission isn't on record
- [ ] Footer address `77 Ayer Rajah Crescent #01-21, Singapore 139954` — verify or replace
- [ ] Footer LinkedIn URL `linkedin.com/company/curiumsg/` — verify
- [ ] Form endpoint is set (see Form setup above)

---

## What's *not* in V1 that can be added in V2

1. **Autoplay-muted hero video.** The KONE dashboard is currently a static screenshot. Replacing it with a 15-second loop of `Kone_Digital_Twin_Kalium.mp4` (counts updating live) would be much more striking.
2. **One real quote / testimonial,** even anonymized ("Director of Innovation at a global elevator manufacturer"). Significantly strengthens credibility.
3. **Privacy & Terms pages.** Required for GDPR compliance and enterprise procurement.
4. **Brussels Airport case study card.** If Brussels Airport visuals become available with permission, that case study slot is the obvious upgrade.

---

## Design rationale (so you can defend it if questioned)

- **Dark theme** matches the actual product UI (CuTrack admin is dark). Differentiates from generic SaaS sites. Lets the technical visuals dominate.
- **Editorial serif typography (Fraunces)** signals technical/scientific gravity, not marketing fluff. Distances Curium from "another AI startup" aesthetics.
- **KONE Helsinki dashboard as hero** is the single most defensible credibility asset. The KONE logos in the UI are independently verifiable.
- **Camera-first positioning** is the wedge against Outsight and Seoul Robotics (both LiDAR-only). Lets you sell into customers who already have CCTV.
- **No biometric / facial / demographic visuals** — the privacy-preserving claim has to hold up. Face detection and gender/age dashboards from the Brick & Mortar deck were deliberately excluded.
- **Form instead of phone or Calendly** reduces spam, captures qualified leads to a Google Sheet, and emails both founders automatically. No third-party booking tool exposed.
