# CLAUDE.md — Personal Website Build Instructions
## Mohammad Sarabian | msarabian.com

> **For Claude Code:** Follow these phases in order. Read the entire document before beginning Phase 1. Each phase has clear deliverables and acceptance criteria. Do not skip ahead.

---

## 📌 Project Overview

Build a **modern, single-file personal website** for Dr. Mohammad Sarabian — a CFD scientist and AI expert. The site replaces a WordPress/Elementor site hosted on BlueHost and will be **hosted for free on GitHub Pages** (or Netlify). It must be a single polished `index.html` file with embedded CSS and JS (no build step required), plus a `chatbot.js` module for the AI ego-bot.

### Key Design Direction
- **Aesthetic:** Dark-mode scientific elegance — deep navy/slate backgrounds, electric cyan/teal accents, crisp white typography. Think "research lab meets Silicon Valley."
- **Feel:** Premium, modern, trustworthy. Like a top-tier academic's portfolio — not a cookie-cutter template.
- **Fonts:** Use Google Fonts — `DM Serif Display` for headings, `DM Sans` for body text. Load via `<link>` tag.
- **Animations:** Subtle scroll-reveal (Intersection Observer API), smooth section transitions, particle/node background on hero.
- **Layout:** Full-width sections, sticky nav, smooth scrolling, mobile-responsive.

---

## 🏗️ File Structure

```
msarabian-website/
├── index.html          ← Main single-page site (HTML + embedded CSS + JS)
├── chatbot.js          ← Ego-bot chat widget (OpenAI API integration)
├── cv.pdf              ← User's CV (drop this file here — chatbot reads it)
├── assets/
│   └── profile.jpg     ← Profile photo (user provides)
└── README.md           ← Deployment instructions (auto-generate)
```

---

## 🚀 Free Hosting — How It Works

**Platform: GitHub Pages (recommended) or Netlify**

### GitHub Pages Setup (free, forever)
1. Create a free account at https://github.com
2. Create a new repository named exactly: `msarabian.github.io` (or any name if using custom domain)
3. Upload all website files to the repository root
4. Go to **Settings → Pages → Source → Deploy from branch → main**
5. The site will be live at `https://msarabian.github.io` within minutes

### Custom Domain (msarabian.com) — Free with GitHub Pages
1. In the GitHub Pages settings, enter `msarabian.com` as the custom domain
2. In BlueHost DNS settings, add/update these records:
   ```
   A     @     185.199.108.153
   A     @     185.199.109.153
   A     @     185.199.110.153
   A     @     185.199.111.153
   CNAME www   msarabian.github.io
   ```
3. Enable "Enforce HTTPS" in GitHub Pages settings
4. **You can cancel BlueHost hosting** — just keep the domain registration (~$15/year) or transfer it to Namecheap (~$9/year) for even more savings

### Alternative: Netlify (also free)
- Drag and drop the website folder at https://app.netlify.com
- Automatic HTTPS, custom domain support, and continuous deployment — all free tier

---

## 📋 PHASE 1 — Project Scaffold & Design System

**Goal:** Create the file structure and design system (CSS variables, fonts, base styles).

### Tasks:
1. Create the folder structure above
2. Create `index.html` with the full HTML skeleton — all sections present but content can be placeholder
3. Embed a `<style>` block with the complete CSS design system:

```css
/* === DESIGN SYSTEM === */
:root {
  --bg-primary: #080d1a;       /* Deep navy — main background */
  --bg-secondary: #0d1526;     /* Slightly lighter — section backgrounds */
  --bg-card: #111d35;          /* Card backgrounds */
  --accent-cyan: #00e5ff;      /* Electric cyan — primary accent */
  --accent-teal: #00b4d8;      /* Secondary accent */
  --accent-gold: #ffd166;      /* Gold — for highlights/tags */
  --text-primary: #f0f4ff;     /* Near-white text */
  --text-secondary: #8ba3c7;   /* Muted blue-gray text */
  --text-muted: #4a6080;       /* Very muted text */
  --border: rgba(0, 229, 255, 0.12); /* Subtle cyan border */
  --shadow-glow: 0 0 30px rgba(0, 229, 255, 0.15); /* Cyan glow */
  --radius: 12px;
  --radius-sm: 6px;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --max-width: 1100px;
  --font-heading: 'DM Serif Display', serif;
  --font-body: 'DM Sans', sans-serif;
}
```

4. Add Google Fonts link for `DM Serif Display` and `DM Sans`
5. Add base resets and global styles
6. Create the `<nav>` (sticky, transparent-to-solid on scroll) with links to all sections
7. Create empty `<section>` elements with correct IDs: `#hero`, `#about`, `#experience`, `#education`, `#skills`, `#publications`, `#contact`, `#chatbot`

**Acceptance criteria:** The page loads, nav is visible and sticky, all sections exist with correct IDs, fonts load correctly.

---

## 📋 PHASE 2 — Hero Section

**Goal:** Create a visually stunning hero/landing section.

### Content:
- **Headline:** "Mohammad Sarabian"
- **Subtitle:** "Pioneering CFD Scientist & AI Research Engineer"
- **Tagline:** "Bridging Computational Fluid Dynamics, Physics-Informed AI, and Biomedical Innovation"
- **CTA buttons:** "View My Work" (→ #publications) and "Talk to My AI CV" (→ #chatbot)
- **Profile photo:** `assets/profile.jpg` — circular, with glowing cyan border ring
- **Background:** Animated particle/node network (use pure JS canvas, no libraries needed) — subtle moving dots connected by lines, resembling a neural network or fluid simulation mesh

### Hero Layout:
```
[ LEFT: Photo + Name + Tagline + CTAs ]    [ RIGHT: Animated Canvas ]
```
On mobile: stacked vertically, canvas becomes a subtle background layer.

### Current Role Badge:
Below the headline, show an animated badge:
```
🔬 Senior Research Scientist @ MIM Software (a GE HealthCare Company)
```

### Social Links (icon buttons, bottom of hero):
- LinkedIn: https://www.linkedin.com/in/msarabian/
- Google Scholar: https://scholar.google.com/citations?user=r45Kw9sAAAAJ
- GitHub: (user to provide, leave as `#`)
- Email: mailto link

**Implementation Notes:**
- Canvas animation: 80 particles, connections within 120px, particles drift slowly
- Hero takes 100vh minimum height
- Text animates in on load with staggered delays (CSS keyframes)
- Scroll indicator arrow at bottom (bouncing animation)

---

## 📋 PHASE 3 — About Me Section

**Goal:** Rich narrative section with timeline indicator.

### Content (use this text, lightly edited for freshness):
Dr. Mohammad Sarabian is a Senior Research Scientist at MIM Software (a GE HealthCare Company), specializing in the intersection of computational fluid dynamics, physics-informed AI, and biomedical engineering. With a PhD in Mechanical Engineering from Ohio University and postdoctoral training at the University of Arizona, he has spent over a decade developing cutting-edge mathematical and computational frameworks that drive innovation across diverse engineering fields.

His work spans AI-driven digital twins for cardiovascular disease, cerebrovascular hemodynamic modeling, Nitinol medical device simulation, and surrogate modeling for subsurface flows. He has published in top-tier journals including IEEE Transactions on Medical Imaging, Journal of Fluid Mechanics, and Acta Biomaterialia, and has presented at the American Physical Society's Division of Fluid Dynamics (APS-DFD) annually.

### Layout:
- Two-column: left has a large decorative quote/stat block, right has narrative text
- **Animated stat counters** (trigger on scroll):
  - `10+` Years of Research Experience
  - `15+` Peer-reviewed Publications & Presentations
  - `3` Patents & Applications (update as needed)
  - `1000×` CFD speedup via AI surrogate models
- Include APS-DFD conference photos (user can drop in assets/ — reference as `assets/aps2022.jpg` and `assets/aps2023.jpg`)
- Caption each photo: "APS-DFD 2022, Indianapolis, IN" and "APS-DFD 2023, Washington, DC"

---

## 📋 PHASE 4 — Work Experience Section

**Goal:** Interactive timeline of career positions.

### Positions (chronological, latest first):

**1. Senior Research Scientist**
- Company: MIM Software, a GE HealthCare Company
- Location: Remote — Scottsdale, AZ
- Dates: June 2026 – Present
- Focus: Medical image-based AI research, computational modeling for clinical workflows, integration of physics-informed methods into diagnostic imaging pipelines.

**2. Senior Modeling & Simulation Scientist — CFD**
- Company: W.L. Gore & Associates (Gore Medical)
- Location: Scottsdale, AZ
- Dates: March 2023 – June 2026
- Focus: Developed innovative CFD models for medical device optimization (cardiovascular and cerebrovascular devices). Created mathematical surrogate models enabling rapid design assessment. Developed Nitinol constitutive modeling platforms (Streamlit-based) supporting multiple material models (SuperE32, SuperEP33, SuperEP35 Anisotropic).

**3. Artificial Intelligence (AI) Researcher**
- Company: OriGen.AI, Inc.
- Location: New York, NY (Remote)
- Dates: March 2022 – March 2023
- Focus: Pioneered physics-inspired AI frameworks to accelerate CFD simulations of multiphase porous media. Developed novel PINN surrogate models for assisted history matching (AHM). Built CNN+Transformer networks for subsurface flow prediction.

**4. Postdoctoral Research Associate**
- Institution: Department of Biomedical Engineering, University of Arizona
- Location: Tucson, AZ
- Dates: March 2020 – March 2022
- Focus: Developed the Area Surrogate Physics-Informed Neural Network (AS-PINN) for cerebral blood flow hemodynamic prediction. Validated against 4D flow MRI clinical data. Developed brain disease classification models.

**5. Research Assistant / PhD Candidate**
- Institution: Department of Mechanical Engineering, Ohio University
- Location: Athens, OH
- Dates: 2015 – March 2020
- Focus: Experimental investigations and direct numerical simulations of rigid particles in shear flows of Newtonian and complex fluids. Developed custom PIV/PTV systems. Collaborated with Prof. Luca Brandt (KTH) on IBM-based solvers.

**6. Research Assistant / M.Sc. & B.Sc. Student**
- Institution: Department of Mechanical Engineering, Shiraz University
- Location: Shiraz, Iran
- Dates: 2007 – 2014
- Focus: Transonic compressor rotor CFD simulations, auto-ignition processes, microchannel water-gas shift surface reactors.

### Layout:
- Vertical timeline with alternating left/right cards (desktop) or single-column (mobile)
- Each card has: company logo placeholder div (colored with initials), title, company, dates, description
- Active hover state: card lifts slightly, left border glows cyan
- Scroll-reveal animation: cards fade in from left/right as they enter viewport

---

## 📋 PHASE 5 — Education Section

**Goal:** Clean education cards with degree details.

### Degrees:

**1. Ph.D. — Mechanical Engineering**
- Institution: Ohio University, Athens, OH
- Year: 2020
- Thesis: "Experimental Investigations and Numerical Simulations of Rigid Particles in Shear Flows of Newtonian and Complex Fluids"
- Advisors: Dr. Sarah Hormozi (Cornell), Dr. Bloen Metzger (CNRS Marseille)

**2. M.Sc. — Mechanical Engineering**
- Institution: Shiraz University, Shiraz, Iran
- Year: 2014
- Focus: Computational methods, fluid dynamics

**3. B.Sc. — Mechanical Engineering**
- Institution: Shiraz University, Shiraz, Iran
- Year: 2011

### Layout:
- Three cards in a row, each with a gradient top border in accent colors
- Icons: 🎓 graduation cap or custom SVG
- Mobile: stacked vertically

---

## 📋 PHASE 6 — Skills & Expertise Section

**Goal:** Visually rich skills display — NOT just progress bars.

### Skill Categories and Items:

**Programming Languages**
- Python (Expert) — 10+ years, NumPy, SciPy, pandas, Matplotlib
- MATLAB (Expert) — numerical simulations, signal processing
- Fortran (Expert) — legacy CFD solvers, VUMAT subroutines for Abaqus
- Java (Advanced) — high-performance simulation backends, JPype bridge

**AI / Machine Learning**
- PyTorch (Expert) — PINNs, transformers, autoencoders, CNNs
- TensorFlow/Keras (Advanced) — deep learning pipelines
- Physics-Informed Neural Networks (PINNs) — cerebrovascular, elasticity, porous media
- Scientific Machine Learning (SciML) — surrogate models, operator learning
- Reinforcement Learning — drug delivery optimization

**CFD Software**
- STAR-CCM+ (Expert)
- ANSYS Fluent / CFX / Workbench (Advanced)
- OpenFOAM (Intermediate)
- COMSOL Multiphysics (Advanced)
- Abaqus/Explicit — VUMAT subroutines, Nitinol modeling

**Experimental Techniques**
- Particle Image Velocimetry (PIV)
- Particle Tracking Velocimetry (PTV)
- Refractive Index Matching (RIM)

**High-Performance Computing**
- Domain Decomposition Parallelization
- MPI / OpenMP
- HPC cluster job scheduling (SLURM)

**Other Tools**
- Git / GitHub, Docker, LaTeX, Streamlit, Maven/JPype

### Layout — Use a hexagonal grid or tag-cloud style, NOT just progress bars:
- Group skills by category with colored category headers
- Each skill is a pill/badge that glows on hover
- For key skills (Python, PyTorch, STAR-CCM+, PINNs), show a subtle proficiency ring
- Add a "Core Competencies" highlight block at top: four large icon cards (Mathematical Modeling, CFD, AI/ML, Biomedical Engineering)

---

## 📋 PHASE 7 — Publications & Research Section

**Goal:** Academic publication list with filtering capability.

### Filter Tags: All | CFD | AI/ML | Biomedical | Experimental

### Publications (ordered by year, newest first):

**[2024]** Ashtiani, S.Z., **Sarabian, M.**, Laksari, K., & Babaee, H. (2024). Reconstructing Blood Flow in Data-Poor Regimes: A Vasculature Network Kernel for Gaussian Process Regression. *Journal of the Royal Society Interface* (In Press).
- Tags: Biomedical, AI/ML
- Link: https://arxiv.org/abs/2403.09758

**[Preprint]** **Sarabian, M.** et al. FV-FluidAttentionNet: A Label-Free Physics-Informed Autoencoder with Finite-Volume Discretization for Rapid Navier-Stokes Solutions.
- Tags: CFD, AI/ML
- Link: (preprint coming soon — mark as "Coming Soon")

**[2023]** Kamali, A.*, **Sarabian, M.*** et al. (2023). Elasticity Imaging Using Physics-Informed Neural Networks: Spatial Discovery of Elastic Modulus and Poisson's Ratio. *Acta Biomaterialia*. *(Equal contribution)*
- Tags: AI/ML, Biomedical
- Link: https://doi.org/10.1016/j.actbio.2022.11.024

**[2022]** **Sarabian, M.**, Babaee, B., & Laksari, K. (2022). Physics-Informed Neural Networks for Brain Hemodynamic Predictions Using Medical Imaging. *IEEE Transactions on Medical Imaging*, 41(9), 2285–2303.
- Tags: AI/ML, Biomedical
- Link: https://ieeexplore.ieee.org/abstract/document/9740143

**[2020]** **Sarabian, M.**, Rosti, M.E., Brandt, L., & Hormozi, S. (2020). Numerical Simulations of a Sphere Settling in Simple Shear Flows of Yield Stress Fluids. *Journal of Fluid Mechanics*, 896, A17.
- Tags: CFD, Experimental
- Link: https://doi.org/10.1017/jfm.2020.316

**[2019]** **Sarabian, M.**, Firouznia, M., Metzger, B., & Hormozi, S. (2019). Fully Developed and Transient Concentration Profiles of Particulate Suspensions Sheared in a Cylindrical Couette Cell. *Journal of Fluid Mechanics*, 862, 659–671.
- Tags: CFD, Experimental
- Link: https://doi.org/10.1017/jfm.2018.971

**[2018]** [Cover] Izbassarov, D., Rosti, M.E., ..., **Sarabian, M.**, Hormozi, S. et al. (2018). Computational Modeling of Multiphase Viscoelastic and Elastoviscoplastic Flows. *Int. Journal for Numerical Methods in Fluids*, 88(12), 521–543.
- Tags: CFD
- Link: https://onlinelibrary.wiley.com/doi/abs/10.1002/fld.4678

### Selected Talks & Presentations:
List the following (simple vertical list, less prominent):
- APS-DFD 2023, Washington, DC — Particle-resolved simulations of wall effect on sedimentation
- APS-DFD 2022, Indianapolis, IN — Finite PINN Net for 3D transient Darcy flows in porous media
- APS-DFD 2021, Phoenix, AZ — Brain hemodynamic predictions using PINNs
- APS-DFD 2019, Seattle, WA — Sphere settling in shear flows of yield-stress fluids
- APS-DFD 2018, Atlanta, GA — Interface-resolved simulations in elastoviscoplastic fluids
- U of Arizona BME Seminar, Feb 2022 — Physics-Inspired AI in Biomedical Engineering

### Layout:
- Each publication = a card with: colored year badge, title (bold), journal (italic), author list (bold the name "Sarabian"), tags, and a "Read Paper →" button
- Filter buttons at top: clicking filters publication cards with smooth CSS transition (fade out non-matching)
- Google Scholar link button at top: "Full Publication List →"

---

## 📋 PHASE 8 — AI Ego-Bot (Chatbot) Section ⭐

**Goal:** A polished, embedded AI chatbot that users can ask questions about Mohammad's background, expertise, and publications. The bot uses the OpenAI API with the CV as context.

### Section Header:
```
🤖 Talk to My AI Research Assistant
Ask anything about my career, publications, skills, or research interests.
```

### Chatbot Architecture:

**File: `chatbot.js`**

```javascript
// ============================================================
// CHATBOT MODULE — Mohammad Sarabian's AI Research Assistant
// Uses OpenAI GPT-4o with streaming responses
// CV is embedded as a text blob or fetched from cv.pdf
// ============================================================

class SarabianChatbot {
  constructor(containerId) {
    this.containerId = containerId;
    this.messages = [];         // Conversation history
    this.cvText = '';           // CV content as text
    this.isLoading = false;
    this.apiKey = '';           // Set via init(apiKey) or env prompt
    this.systemPrompt = '';     // Built after CV is loaded
    this.init();
  }

  // ... (see implementation details below)
}
```

### System Prompt (hardcode this as the base — user can update):
```
You are an AI research assistant representing Dr. Mohammad Sarabian, a Senior Research Scientist 
specializing in Computational Fluid Dynamics (CFD), Physics-Informed AI (PINNs), and Biomedical 
Engineering. You have deep knowledge of his career, publications, skills, and research.

Answer questions about his background, expertise, publications, and experience in a professional, 
warm, and enthusiastic tone. Speak in the first person as if you are representing him directly 
(e.g., "Mohammad has published..." or "His work on PINNs..."). 

Use the CV content provided to answer specific questions. If asked something not covered in the CV 
or this prompt, say: "That's a great question — I don't have specific details on that, but feel 
free to reach out directly via the Contact section!"

Do NOT make up publications, dates, or specific claims not in the CV. Be accurate.

Key facts you always know:
- Current role: Senior Research Scientist at MIM Software (GE HealthCare), starting June 2026
- Previous role: Senior Modeling & Simulation Scientist at W.L. Gore & Associates (2023–2026)
- PhD: Ohio University, Mechanical Engineering (2020)
- Expertise: CFD, PINNs, PyTorch, scientific machine learning, biomedical simulation
- Google Scholar: https://scholar.google.com/citations?user=r45Kw9sAAAAJ
```

### CV Loading Strategy:
The chatbot should load the CV using one of two methods (try both, fall back gracefully):

**Method A — PDF.js (preferred):**
```javascript
// Load cv.pdf from the same directory using PDF.js (CDN)
// Extract all text pages and concatenate
// Include in system prompt: "Here is his CV:\n\n" + cvText
```

**Method B — Fallback hardcoded CV summary:**
If PDF.js fails or cv.pdf is not found, use a hardcoded summary string with key CV facts (name, positions, publications, skills) so the bot always works.

### OpenAI API Call:
- Model: `gpt-4o-mini` (cheap, fast, good quality)
- Temperature: 0.7
- Max tokens: 600
- Use streaming (`stream: true`) for real-time character-by-character response display
- API key: stored in `localStorage` after the user enters it once, OR the user can set it in a config at the top of chatbot.js

### API Key UI:
When the chatbot section loads for the first time, if no API key is stored:
1. Show a small settings panel: "To activate the AI chatbot, enter your OpenAI API key. It is stored locally in your browser and never sent to any server other than OpenAI."
2. Input field + "Activate" button
3. Once entered, key is stored in `localStorage('openai_key')` and hidden
4. Show a small "⚙ Reset Key" link for future key changes

### Chat UI Layout:
```
┌─────────────────────────────────────────────────────────┐
│  🤖 Mohammad's AI Research Assistant              ⚙     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Bot bubble] Hello! I'm Mohammad's AI assistant.       │
│  Ask me anything about his research, career, or         │
│  publications. I'm here to help!                        │
│                                                         │
│                    [User bubble] What is his PhD work?  │
│                                                         │
│  [Bot bubble] Mohammad's doctoral research at Ohio      │
│  University focused on...                               │
│                                                         │
│  [Typing indicator: • • •]                              │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  [ Ask me anything...                      ] [Send →]   │
└─────────────────────────────────────────────────────────┘
```

### Suggested Questions (shown as clickable chips before first message):
- "What is his current research focus?"
- "Tell me about his PINN publications"
- "What CFD software does he use?"
- "Describe his work at W.L. Gore"
- "What are his key AI/ML skills?"
- "Has he published in IEEE?"

### Styling:
- Chat container: dark card with subtle border, max-height 500px, scrollable
- User bubbles: right-aligned, solid cyan background, white text
- Bot bubbles: left-aligned, dark card background, cyan-accented left border, white text
- Bot avatar: small circular icon with "MS" initials or 🔬 emoji
- Typing indicator: animated three dots
- Send button: glowing cyan on hover
- The entire section has a subtle animated gradient background to draw attention

### Implementation Details for Claude Code:

1. Create `chatbot.js` as a self-contained module
2. Include PDF.js from CDN: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js`
3. In `index.html`, add the chatbot section with the container div and load both scripts
4. The chatbot automatically initializes when the page loads
5. Use the Fetch API to call OpenAI (no SDK needed):
```javascript
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.apiKey}`
  },
  body: JSON.stringify({
    model: 'gpt-4o-mini',
    messages: this.buildMessages(userInput),
    stream: true,
    max_tokens: 600,
    temperature: 0.7
  })
});

// Handle streaming with ReadableStream
const reader = response.body.getReader();
const decoder = new TextDecoder();
// Parse SSE (Server-Sent Events) line by line
// Each line: "data: {json}" → parse json.choices[0].delta.content
// Append characters to bot bubble in real-time
```

6. `this.buildMessages()` should structure:
```javascript
[
  { role: 'system', content: this.systemPrompt + '\n\nCV Content:\n' + this.cvText },
  ...this.messages.slice(-8),  // Last 8 messages for context window efficiency
  { role: 'user', content: userInput }
]
```

---

## 📋 PHASE 9 — Contact Section

**Goal:** Clean contact section with form and social links.

### Content:
- Heading: "Let's Connect"
- Subtext: "Whether you're interested in research collaboration, speaking opportunities, or just want to discuss the latest in AI-driven CFD — I'd love to hear from you."

### Contact Methods (icon cards):
- 📧 Email: [user to provide — leave placeholder]
- 💼 LinkedIn: https://www.linkedin.com/in/msarabian/
- 🎓 Google Scholar: https://scholar.google.com/citations?user=r45Kw9sAAAAJ
- 📍 Location: Scottsdale, Arizona

### Contact Form (client-side with Formspree — free):
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
  <input type="text" name="name" placeholder="Your Name" required>
  <input type="email" name="email" placeholder="Your Email" required>
  <input type="text" name="subject" placeholder="Subject">
  <textarea name="message" placeholder="Your message..." rows="5" required></textarea>
  <button type="submit">Send Message →</button>
</form>
```

> **Note:** Formspree is free up to 50 submissions/month. User signs up at formspree.io and replaces `YOUR_FORM_ID` with their form endpoint. No server needed.

### Layout:
- Two columns: left = contact info cards, right = contact form
- Form inputs: dark background, cyan focus border
- Submit button: full-width, cyan gradient

---

## 📋 PHASE 10 — Polish, Navigation & Mobile Responsiveness

**Goal:** Final polish pass — make everything production-ready.

### Navigation:
- Sticky nav that becomes solid dark background after scrolling 80px
- Active section highlighting (Intersection Observer tracks which section is in view)
- Mobile: hamburger menu (pure CSS/JS, no library) that slides in from right
- Nav items: Home | About | Experience | Education | Skills | Research | AI Assistant | Contact

### Scroll Animations (Intersection Observer):
Apply to all major section elements:
```css
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

### Footer:
```
© 2026 Mohammad Sarabian · Built with ❤️ and pure HTML/CSS/JS
[LinkedIn] [Scholar] [GitHub] [Email]
```

### Mobile Responsive Breakpoints:
- Desktop: > 1024px — two-column layouts
- Tablet: 768px–1024px — single column, reduced padding
- Mobile: < 768px — full single column, hamburger nav, smaller fonts

### Performance Checklist:
- [ ] All images have `loading="lazy"` attribute
- [ ] CSS is minified in final output
- [ ] Canvas particle animation pauses when tab is not visible (Page Visibility API)
- [ ] No external dependencies except Google Fonts and PDF.js CDN
- [ ] Total page weight < 500KB (excluding images)

### Browser Compatibility:
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Test: sticky nav, chat, canvas animation, scroll reveals

---

## 📋 PHASE 11 — README.md & Deployment

**Goal:** Write a clear README.md so the user can deploy and maintain the site themselves.

### README Contents:
1. **Overview** — what this is
2. **Quick Start** — open index.html locally to preview
3. **GitHub Pages Deployment** (step-by-step with screenshots described)
4. **Custom Domain Setup** (DNS records for msarabian.com)
5. **Chatbot Setup** — how to get an OpenAI API key, pricing note (~$0.001/query with gpt-4o-mini)
6. **Formspree Contact Form Setup** — free tier instructions
7. **Updating Content** — where to find each section in index.html to update text
8. **Adding/Updating CV** — replace cv.pdf in the folder
9. **Adding Profile Photo** — replace assets/profile.jpg
10. **Troubleshooting** — common issues and solutions

---

## ✅ Final Acceptance Criteria

Before declaring the project complete, verify:

- [ ] Site loads without console errors
- [ ] All navigation links scroll to correct sections
- [ ] Hero canvas animation runs smoothly
- [ ] All 6 publications display with correct filter behavior
- [ ] Work experience timeline renders correctly with 6 positions
- [ ] Chatbot loads, accepts API key, loads cv.pdf, and responds to queries
- [ ] Streaming response displays character-by-character
- [ ] Suggested question chips work
- [ ] Contact form submits (test with Formspree)
- [ ] Site is fully responsive on mobile (320px width)
- [ ] Hamburger menu works on mobile
- [ ] Scroll reveal animations fire correctly
- [ ] Page passes basic accessibility: all images have alt text, buttons have labels
- [ ] README.md is complete and accurate

---

## 🎨 Design Reference — Color Usage Guide

| Element | Color |
|---|---|
| Page background | `--bg-primary` (#080d1a) |
| Section alternating bg | `--bg-secondary` (#0d1526) |
| Cards | `--bg-card` (#111d35) |
| Primary text | `--text-primary` (#f0f4ff) |
| Secondary text | `--text-secondary` (#8ba3c7) |
| Accent / glow / borders | `--accent-cyan` (#00e5ff) |
| CTA buttons background | `--accent-cyan` with dark text |
| Year badges, tags | `--accent-gold` (#ffd166) |
| Section headings | `--font-heading`, `--text-primary` |
| Nav links active | `--accent-cyan` |
| Timeline spine | gradient from `--accent-cyan` to `--accent-teal` |
| Skill pill hover | `--accent-cyan` border + glow |
| Bot chat bubble border | `--accent-cyan` left border |
| User chat bubble bg | `--accent-cyan` |

---

## 📝 Notes for Claude Code

- **Do not use any JavaScript frameworks** (React, Vue, etc.) — pure vanilla HTML/CSS/JS only
- **Do not use npm or build tools** — the site must be openable by double-clicking `index.html`
- **Single file for the main site** — `index.html` with embedded CSS and JS, except chatbot.js which is a separate file for clarity
- **PDF.js for CV reading** — load from CDN, do not bundle
- **OpenAI key security** — warn user in README that the API key is visible in browser localStorage and is appropriate for personal use only; for production use, a backend proxy is recommended
- **Graceful degradation** — if chatbot fails (no key, network error), show a friendly message and fallback to the contact section
- **Content accuracy** — use exactly the information provided in this document; do not invent new facts
- **Image placeholders** — where profile.jpg or other images are referenced but not present, show a styled placeholder div with initials or icon
