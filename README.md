# Mohammad Sarabian — Personal Website

A modern, single-page personal website for **Dr. Mohammad Sarabian** — CFD scientist & AI research engineer. Pure HTML/CSS/JS (no build step, no frameworks), designed for free hosting on GitHub Pages.

**Live site:** [msarabian.com](https://msarabian.com)

---

## 📁 File Structure

```
msarabian-website/
├── index.html          ← Main site (HTML + embedded CSS + JS)
├── chatbot.js          ← AI ego-bot module (OpenAI integration)
├── cv.pdf              ← Your CV — read by the chatbot
├── assets/
│   ├── profile.jpg     ← Your profile photo (circular hero image)
│   ├── aps2022.jpg     ← APS-DFD 2022 photo (optional)
│   └── aps2023.jpg     ← APS-DFD 2023 photo (optional)
└── README.md           ← This file
```

> Missing images render as placeholders — the site never breaks.

---

## 🚀 Quick Start (Local Preview)

Just open the site in a browser:

```bash
open index.html        # macOS
xdg-open index.html    # Linux
start index.html       # Windows
```

For the chatbot's PDF.js + `fetch('cv.pdf')` call to work, serve the folder over HTTP instead of `file://`:

```bash
cd msarabian-website
python3 -m http.server 8000
# Open http://localhost:8000
```

---

## 🌐 GitHub Pages Deployment (Free Forever)

1. Create a GitHub account: <https://github.com/signup>
2. Create a new public repository. For the simplest setup, name it exactly `msarabian.github.io` (replace `msarabian` with your GitHub username).
3. Upload every file in this folder to the repo root:
   - Web UI: **Add file → Upload files → drag everything in → Commit**
   - Or with Git:
     ```bash
     git init
     git add .
     git commit -m "Initial site"
     git branch -M main
     git remote add origin https://github.com/<your-username>/<your-username>.github.io.git
     git push -u origin main
     ```
4. In GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: main → /(root) → Save**.
5. Wait ~1–2 minutes. Your site is live at `https://<your-username>.github.io`.

---

## 🔗 Custom Domain (msarabian.com)

You can use your existing `msarabian.com` domain with GitHub Pages for free.

### 1. In GitHub Pages settings

- **Settings → Pages → Custom domain** → enter `msarabian.com` → Save.
- After DNS propagates, check **Enforce HTTPS**.

### 2. In your DNS provider (BlueHost, Namecheap, etc.)

Replace the A and CNAME records for the apex / www with GitHub's official IPs:

| Type  | Host  | Value                  |
|-------|-------|------------------------|
| A     | @     | 185.199.108.153        |
| A     | @     | 185.199.109.153        |
| A     | @     | 185.199.110.153        |
| A     | @     | 185.199.111.153        |
| CNAME | www   | `<your-username>.github.io` |

DNS propagation typically takes 10 minutes to a few hours.

### 3. Drop BlueHost hosting (save ~$120/year)

Once GitHub Pages is serving the site, you can cancel the BlueHost **hosting** plan. Keep the domain registration only (~$15/yr), or transfer it to Namecheap (~$9/yr) for further savings.

---

## 🤖 Chatbot Setup (OpenAI API)

The chatbot uses `gpt-4o-mini` via the OpenAI API for accurate, cheap, fast responses (~$0.001 / question).

### How visitors activate it

1. They scroll to the **AI Assistant** section.
2. They paste their own OpenAI API key into the setup field.
3. The key is stored in their browser's `localStorage` (never sent anywhere except OpenAI).

### Get an OpenAI API key

1. Sign up at <https://platform.openai.com/signup>
2. Add a payment method and a small prepaid credit (e.g. $5).
3. Create a key at <https://platform.openai.com/api-keys>.

### CV loading

`chatbot.js` automatically tries to extract text from `cv.pdf` using PDF.js (loaded from CDN). If that fails (file missing, network error, CORS), it falls back to a hardcoded CV summary embedded inside `chatbot.js` — the bot always works.

> **To update the CV:** drop your new PDF as `cv.pdf` in the root folder, commit & push. No code changes needed.

### Security note

Because the key lives in the visitor's browser, this design is appropriate for **personal/portfolio use** where each visitor brings their own key. If you ever want the bot to work for visitors *without* asking for a key, you'd need a small backend proxy (Cloudflare Worker, Vercel function, etc.) that holds your key server-side. That's outside the scope of this static site.

---

## ✉️ Contact Form (Formspree — Free)

The contact form posts to Formspree. Free tier = 50 submissions / month, no server needed.

1. Sign up at <https://formspree.io>.
2. Create a new form → copy the form endpoint (it looks like `https://formspree.io/f/abcdwxyz`).
3. In `index.html`, find:
   ```html
   <form class="contact-form reveal" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```
   Replace `YOUR_FORM_ID` with your form ID. Commit & push.
4. The first submission triggers a Formspree email asking you to verify ownership.

---

## ✏️ Updating Content

All content lives in `index.html`. Sections are clearly commented:

| Section          | HTML comment marker         | What to edit                         |
|------------------|-----------------------------|--------------------------------------|
| Hero             | `<!-- === HERO === -->`     | Name, tagline, current role badge    |
| About            | `<!-- === ABOUT === -->`    | Narrative paragraphs + stat numbers  |
| Experience       | `<!-- === EXPERIENCE === -->` | Timeline cards (add/remove positions) |
| Education        | `<!-- === EDUCATION === -->` | Degree cards                         |
| Skills           | `<!-- === SKILLS === -->`   | Competency cards + skill pills       |
| Publications     | `<!-- === PUBLICATIONS === -->` | Filterable publication cards     |
| Chatbot          | `<!-- === CHATBOT === -->`  | Section header text only             |
| Contact          | `<!-- === CONTACT === -->`  | Contact cards + Formspree form ID    |
| Footer           | `<!-- === FOOTER === -->`   | Copyright + social links             |

**Stat counters** (About section): edit `data-target="10"` and `data-suffix="+"` on each `.stat-num` div.

**Publication filters:** each `.pub-card` has a `data-tags="cfd aiml biomedical experimental"` attribute. Add any combination of these tags to make a paper appear under those filters.

---

## 🖼️ Adding Images

- **Profile photo:** save your photo as `assets/profile.jpg` (square aspect, at least 400×400px recommended). It renders as a circle with a glowing cyan ring.
- **APS-DFD photos:** save as `assets/aps2022.jpg` and `assets/aps2023.jpg`. If absent, the site shows a 🎤 placeholder.
- **Optimize images** before upload — use [Squoosh.app](https://squoosh.app/) to compress to ~100–200KB each.

---

## 🎨 Design Customization

All colors live in CSS custom properties at the top of `index.html`:

```css
:root {
  --bg-primary: #080d1a;
  --accent-cyan: #00e5ff;
  --accent-gold: #ffd166;
  /* ... */
}
```

Change a single variable to retheme the whole site.

---

## 📱 Browser Support

- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Fully responsive: 320px (mobile) → 1100px+ (desktop)
- Hamburger menu on mobile, sticky nav with active-section highlighting
- All scroll animations use the Intersection Observer API
- Canvas particle animation pauses when the tab is not visible (Page Visibility API)

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Chatbot says "PDF load failed" | Make sure you're serving over HTTP (not opening `file://`). Also confirm `cv.pdf` is in the same folder as `index.html`. |
| Profile photo doesn't show | Confirm the file is `assets/profile.jpg` (lowercase, exact name). The fallback shows your initials "MS". |
| Custom domain not working | Wait up to 24h for DNS. Verify A records with `dig msarabian.com +short`. |
| Contact form doesn't send | Check that you replaced `YOUR_FORM_ID` in `index.html`, and that you verified your Formspree email. |
| Chatbot returns "Invalid API key" | Open the ⚙ settings icon in the chatbot header to reset the key, then paste a fresh one from <https://platform.openai.com/api-keys>. |
| Mobile menu doesn't close after clicking a link | Hard refresh (Cmd+Shift+R / Ctrl+Shift+F5) to clear cached JS. |

---

## 📜 License

Personal website — content © 2026 Mohammad Sarabian. Code is yours to fork and adapt.
