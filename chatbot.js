// ============================================================
// CHATBOT MODULE — Mohammad Sarabian's AI Research Assistant
// Uses OpenAI GPT-4o-mini with streaming responses
// CV is loaded from cv.pdf using PDF.js (CDN), with hardcoded
// fallback if the file is missing or PDF.js fails.
// ============================================================

(function () {
  'use strict';

  const PDFJS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  const PDFJS_WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
  const MODEL = 'gpt-4o-mini';

  const FALLBACK_CV = `
NAME: Dr. Mohammad Sarabian
EMAIL: ms322615@ohio.edu
LOCATION: Scottsdale, Arizona

CURRENT ROLE:
- Senior Research Scientist, MIM Software (a GE HealthCare Company), Remote — Scottsdale, AZ (June 2026 – Present)
  Medical image-based AI research, computational modeling for clinical workflows, and integration of physics-informed methods into diagnostic imaging pipelines.

PREVIOUS ROLES:
- Senior Modeling & Simulation Scientist — CFD, W.L. Gore & Associates (Gore Medical), Scottsdale, AZ (March 2023 – June 2026).
  Developed CFD models for medical device optimization (cardiovascular and cerebrovascular devices); created mathematical surrogate models;
  built Nitinol constitutive modeling Streamlit platforms (SuperE32, SuperEP33, SuperEP35 Anisotropic) with VUMAT subroutines for Abaqus.
- AI Researcher, OriGen.AI, Inc., New York (Remote) (March 2022 – March 2023). Physics-inspired AI for CFD of multiphase porous media; PINN
  surrogates for assisted history matching (AHM); CNN+Transformer networks for subsurface flow prediction.
- Postdoctoral Research Associate, Dept. of Biomedical Engineering, University of Arizona, Tucson, AZ (March 2020 – March 2022).
  Developed AS-PINN (Area Surrogate Physics-Informed Neural Network) for cerebral blood flow hemodynamics, validated against 4D-flow MRI;
  brain disease classification.
- Research Assistant / PhD Candidate, Ohio University, Athens, OH (2015 – March 2020). Experimental investigations and DNS of rigid
  particles in shear flows of Newtonian and complex fluids. Custom PIV/PTV. Collaborated with Prof. Luca Brandt (KTH) on IBM solvers.
- Research Assistant, Shiraz University, Iran (2007 – 2014). Transonic compressor rotor CFD, auto-ignition, microchannel water-gas shift.

EDUCATION:
- Ph.D. Mechanical Engineering, Ohio University, 2020. Thesis on rigid particles in shear flows of Newtonian and complex fluids.
  Advisors: Dr. Sarah Hormozi (Cornell), Dr. Bloen Metzger (CNRS Marseille).
- M.Sc. Mechanical Engineering, Shiraz University, 2014.
- B.Sc. Mechanical Engineering, Shiraz University, 2011.

PUBLICATIONS (selected):
- Ashtiani, Sarabian, Laksari, Babaee (2024). Reconstructing Blood Flow in Data-Poor Regimes — Vasculature Network Kernel for Gaussian
  Process Regression. J. Royal Society Interface (In Press). https://arxiv.org/abs/2403.09758
- Sarabian et al. FV-FluidAttentionNet: Physics-Informed Autoencoder with Finite-Volume Discretization for Rapid Navier-Stokes (preprint).
- Kamali, Sarabian* et al. (2023). Elasticity Imaging Using PINNs. Acta Biomaterialia. (Equal contribution.)
- Sarabian, Babaee, Laksari (2022). PINNs for Brain Hemodynamic Predictions Using Medical Imaging. IEEE Trans. Medical Imaging 41(9), 2285–2303.
- Sarabian, Rosti, Brandt, Hormozi (2020). Numerical Simulations of a Sphere Settling in Simple Shear Flows of Yield Stress Fluids.
  J. Fluid Mechanics 896, A17.
- Sarabian, Firouznia, Metzger, Hormozi (2019). Concentration Profiles of Particulate Suspensions in a Cylindrical Couette Cell.
  J. Fluid Mechanics 862, 659–671.
- Izbassarov, Rosti, ..., Sarabian, Hormozi et al. (2018). Computational Modeling of Multiphase Viscoelastic and Elastoviscoplastic Flows.
  Int. J. Numerical Methods in Fluids 88(12), 521–543.

TALKS: APS-DFD 2018 (Atlanta), 2019 (Seattle), 2021 (Phoenix), 2022 (Indianapolis), 2023 (Washington DC); U of Arizona BME Seminar (Feb 2022).

SKILLS:
- Languages: Python (Expert, 10+ yrs), MATLAB (Expert), Fortran (Expert), Java (Advanced), C/C++, Bash.
- AI/ML: PyTorch (Expert), TensorFlow/Keras, PINNs (Expert), SciML, Operator Learning, Transformers, CNNs, Autoencoders, Reinforcement Learning.
- CFD: STAR-CCM+ (Expert), ANSYS Fluent/CFX, OpenFOAM, COMSOL, Abaqus/Explicit (VUMAT, Nitinol).
- Experimental: PIV, PTV, RIM.
- HPC: MPI, OpenMP, SLURM, Domain Decomposition.
- Other: Git, Docker, LaTeX, Streamlit, Maven/JPype.

LINKS:
- LinkedIn: https://www.linkedin.com/in/msarabian/
- Google Scholar: https://scholar.google.com/citations?user=r45Kw9sAAAAJ
  `.trim();

  const SYSTEM_PROMPT = `You are an AI research assistant representing Dr. Mohammad Sarabian, a Senior Research Scientist specializing in Computational Fluid Dynamics (CFD), Physics-Informed AI (PINNs), and Biomedical Engineering. You have deep knowledge of his career, publications, skills, and research.

Answer questions about his background, expertise, publications, and experience in a professional, warm, and enthusiastic tone. Speak in the third person on his behalf (e.g., "Mohammad has published..." or "His work on PINNs..."). Be concise — a few short paragraphs at most.

Use the CV content provided below to answer specific questions. If asked something not covered in the CV or this prompt, say: "That's a great question — I don't have specific details on that, but feel free to reach out directly via the Contact section!"

Do NOT make up publications, dates, or specific claims not in the CV. Be accurate.

Key facts you always know:
- Current role: Senior Research Scientist at MIM Software (GE HealthCare), starting June 2026
- Previous role: Senior Modeling & Simulation Scientist at W.L. Gore & Associates (2023–2026)
- PhD: Ohio University, Mechanical Engineering (2020)
- Expertise: CFD, PINNs, PyTorch, scientific machine learning, biomedical simulation
- Google Scholar: https://scholar.google.com/citations?user=r45Kw9sAAAAJ`;

  const SUGGESTED = [
    "What is his current research focus?",
    "Tell me about his PINN publications",
    "What CFD software does he use?",
    "Describe his work at W.L. Gore",
    "What are his key AI/ML skills?",
    "Has he published in IEEE?"
  ];

  // ============================================================
  // STYLES — injected once
  // ============================================================
  const STYLES = `
    .sb-chat {
      background: var(--bg-card, #111d35);
      border: 1px solid var(--border, rgba(0, 229, 255, 0.15));
      border-radius: 14px;
      overflow: hidden;
      display: flex; flex-direction: column;
      box-shadow: 0 0 50px rgba(0, 229, 255, 0.08);
    }
    .sb-chat-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 20px;
      background: rgba(0, 229, 255, 0.04);
      border-bottom: 1px solid var(--border, rgba(0, 229, 255, 0.15));
    }
    .sb-chat-title { display: flex; align-items: center; gap: 12px; }
    .sb-avatar {
      width: 38px; height: 38px;
      border-radius: 50%;
      background: linear-gradient(135deg, #00e5ff, #00b4d8);
      display: flex; align-items: center; justify-content: center;
      color: #080d1a; font-weight: 700; font-size: 0.95rem;
    }
    .sb-chat-title h3 {
      font-family: var(--font-heading, 'DM Serif Display', serif);
      font-size: 1.1rem; color: var(--text-primary, #f0f4ff);
      margin: 0; line-height: 1.2;
    }
    .sb-chat-title small { font-size: 0.78rem; color: var(--text-secondary, #8ba3c7); }
    .sb-settings-btn {
      width: 34px; height: 34px;
      border-radius: 8px;
      color: var(--text-secondary, #8ba3c7);
      transition: all 0.2s;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.1rem;
    }
    .sb-settings-btn:hover { color: #00e5ff; background: rgba(0, 229, 255, 0.08); }

    .sb-messages {
      padding: 20px;
      max-height: 480px;
      min-height: 280px;
      overflow-y: auto;
      display: flex; flex-direction: column; gap: 14px;
      scroll-behavior: smooth;
    }
    .sb-messages::-webkit-scrollbar { width: 6px; }
    .sb-messages::-webkit-scrollbar-track { background: transparent; }
    .sb-messages::-webkit-scrollbar-thumb { background: rgba(0, 229, 255, 0.2); border-radius: 3px; }

    .sb-bubble {
      max-width: 82%;
      padding: 12px 16px;
      border-radius: 14px;
      font-size: 0.94rem;
      line-height: 1.55;
      white-space: pre-wrap;
      word-wrap: break-word;
      animation: sbFade 0.25s ease;
    }
    @keyframes sbFade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    .sb-bot {
      align-self: flex-start;
      background: rgba(0, 229, 255, 0.04);
      border-left: 3px solid #00e5ff;
      color: var(--text-primary, #f0f4ff);
      border-top-left-radius: 4px;
    }
    .sb-user {
      align-self: flex-end;
      background: #00e5ff;
      color: #080d1a;
      font-weight: 500;
      border-top-right-radius: 4px;
    }
    .sb-typing { display: inline-flex; gap: 4px; padding: 4px 0; }
    .sb-typing span {
      width: 7px; height: 7px;
      border-radius: 50%;
      background: #00e5ff;
      animation: sbBlink 1.2s infinite;
    }
    .sb-typing span:nth-child(2) { animation-delay: 0.2s; }
    .sb-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes sbBlink { 0%, 60%, 100% { opacity: 0.3; } 30% { opacity: 1; } }

    .sb-suggestions {
      display: flex; flex-wrap: wrap; gap: 8px;
      padding: 0 20px 16px;
    }
    .sb-suggestion {
      padding: 7px 14px;
      background: rgba(0, 229, 255, 0.06);
      border: 1px solid var(--border, rgba(0, 229, 255, 0.15));
      border-radius: 999px;
      color: var(--text-secondary, #8ba3c7);
      font-size: 0.84rem;
      cursor: pointer;
      transition: all 0.2s;
      font-family: inherit;
    }
    .sb-suggestion:hover {
      color: #00e5ff; border-color: #00e5ff;
      background: rgba(0, 229, 255, 0.1);
    }

    .sb-input-row {
      display: flex; gap: 10px;
      padding: 14px 16px;
      border-top: 1px solid var(--border, rgba(0, 229, 255, 0.15));
      background: rgba(0, 0, 0, 0.15);
    }
    .sb-input {
      flex: 1;
      padding: 12px 16px;
      background: var(--bg-secondary, #0d1526);
      border: 1px solid var(--border, rgba(0, 229, 255, 0.15));
      border-radius: 10px;
      color: var(--text-primary, #f0f4ff);
      font-family: inherit; font-size: 0.94rem;
      transition: all 0.2s;
    }
    .sb-input:focus {
      outline: none; border-color: #00e5ff;
      box-shadow: 0 0 0 3px rgba(0, 229, 255, 0.12);
    }
    .sb-input:disabled { opacity: 0.5; cursor: not-allowed; }
    .sb-send {
      padding: 0 22px;
      background: #00e5ff;
      color: #080d1a;
      border-radius: 10px;
      font-weight: 700;
      transition: all 0.2s;
    }
    .sb-send:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(0, 229, 255, 0.4);
    }
    .sb-send:disabled { opacity: 0.5; cursor: not-allowed; }

    .sb-setup {
      padding: 24px;
      text-align: center;
    }
    .sb-setup h4 {
      font-family: var(--font-heading, 'DM Serif Display', serif);
      font-size: 1.2rem;
      margin-bottom: 8px;
      color: var(--text-primary, #f0f4ff);
    }
    .sb-setup p {
      font-size: 0.88rem;
      color: var(--text-secondary, #8ba3c7);
      margin-bottom: 16px;
      max-width: 460px;
      margin-left: auto; margin-right: auto;
      line-height: 1.5;
    }
    .sb-setup-row {
      display: flex; gap: 8px;
      max-width: 460px; margin: 0 auto;
    }
    .sb-setup-row input {
      flex: 1;
      padding: 11px 14px;
      background: var(--bg-secondary, #0d1526);
      border: 1px solid var(--border, rgba(0, 229, 255, 0.15));
      border-radius: 8px;
      color: var(--text-primary, #f0f4ff);
      font-family: inherit; font-size: 0.92rem;
    }
    .sb-setup-row input:focus { outline: none; border-color: #00e5ff; }
    .sb-setup-row button {
      padding: 0 20px;
      background: #00e5ff; color: #080d1a;
      font-weight: 700; border-radius: 8px;
      transition: all 0.2s;
    }
    .sb-setup-row button:hover { box-shadow: 0 4px 16px rgba(0, 229, 255, 0.4); }
    .sb-setup .sb-note { font-size: 0.75rem; color: var(--text-muted, #4a6080); margin-top: 14px; }

    .sb-reset {
      color: var(--text-muted, #4a6080);
      font-size: 0.8rem;
      cursor: pointer;
      text-decoration: underline;
      margin-top: 8px;
      display: inline-block;
    }
    .sb-reset:hover { color: #00e5ff; }

    .sb-error {
      background: rgba(255, 100, 100, 0.08);
      border-left: 3px solid #ff6b6b;
      color: #ff9999;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 0.86rem;
      margin: 8px 20px;
    }
  `;

  function injectStyles() {
    if (document.getElementById('sb-chat-styles')) return;
    const style = document.createElement('style');
    style.id = 'sb-chat-styles';
    style.textContent = STYLES;
    document.head.appendChild(style);
  }

  // ============================================================
  // CV loader (PDF.js)
  // ============================================================
  function loadPdfJs() {
    return new Promise((resolve, reject) => {
      if (window.pdfjsLib) return resolve(window.pdfjsLib);
      const s = document.createElement('script');
      s.src = PDFJS_CDN;
      s.onload = () => {
        if (!window.pdfjsLib) return reject(new Error('pdfjsLib not exposed'));
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
        resolve(window.pdfjsLib);
      };
      s.onerror = () => reject(new Error('Failed to load PDF.js'));
      document.head.appendChild(s);
    });
  }

  async function loadCvText() {
    try {
      const pdfjsLib = await loadPdfJs();
      const resp = await fetch('cv.pdf');
      if (!resp.ok) throw new Error('cv.pdf not found (status ' + resp.status + ')');
      const buf = await resp.arrayBuffer();
      const doc = await pdfjsLib.getDocument({ data: buf }).promise;
      let text = '';
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(it => it.str).join(' ') + '\n';
      }
      const cleaned = text.replace(/\s+/g, ' ').trim();
      console.info('[Chatbot] CV loaded from PDF —', cleaned.length, 'chars');
      return cleaned || FALLBACK_CV;
    } catch (err) {
      console.warn('[Chatbot] PDF load failed, using fallback CV:', err.message);
      return FALLBACK_CV;
    }
  }

  // ============================================================
  // Chatbot class
  // ============================================================
  class SarabianChatbot {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
      if (!this.container) {
        console.error('[Chatbot] Container not found:', containerId);
        return;
      }
      this.messages = [];
      this.cvText = '';
      this.isLoading = false;
      this.apiKey = localStorage.getItem('openai_key') || '';
      injectStyles();
      this.render();
      this.bootstrap();
    }

    async bootstrap() {
      this.cvText = await loadCvText();
    }

    render() {
      if (!this.apiKey) {
        this.renderSetup();
      } else {
        this.renderChat();
      }
    }

    renderSetup() {
      this.container.innerHTML = `
        <div class="sb-chat">
          <div class="sb-setup">
            <h4>🔑 Activate the AI Assistant</h4>
            <p>To chat with Mohammad's AI research assistant, paste your OpenAI API key below. The key is stored locally in your browser and sent only to OpenAI — never to any other server.</p>
            <div class="sb-setup-row">
              <input type="password" id="sb-key-input" placeholder="sk-..." autocomplete="off" />
              <button id="sb-key-save">Activate</button>
            </div>
            <div class="sb-note">Don't have a key? Get one at <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener" style="color:#00e5ff;">platform.openai.com/api-keys</a> · Cost: ~$0.001 per question with gpt-4o-mini.</div>
          </div>
        </div>
      `;
      const input = this.container.querySelector('#sb-key-input');
      const btn = this.container.querySelector('#sb-key-save');
      const submit = () => {
        const v = input.value.trim();
        if (!v) return;
        this.apiKey = v;
        localStorage.setItem('openai_key', v);
        this.renderChat();
      };
      btn.addEventListener('click', submit);
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
    }

    renderChat() {
      this.container.innerHTML = `
        <div class="sb-chat">
          <div class="sb-chat-header">
            <div class="sb-chat-title">
              <div class="sb-avatar">MS</div>
              <div>
                <h3>Mohammad's AI Research Assistant</h3>
                <small>Ask me anything about his career &amp; research</small>
              </div>
            </div>
            <button class="sb-settings-btn" id="sb-settings" title="Reset API key">⚙</button>
          </div>
          <div class="sb-messages" id="sb-messages"></div>
          <div class="sb-suggestions" id="sb-suggestions"></div>
          <div class="sb-input-row">
            <input type="text" class="sb-input" id="sb-input" placeholder="Ask me anything..." />
            <button class="sb-send" id="sb-send">Send →</button>
          </div>
        </div>
      `;

      this.messagesEl = this.container.querySelector('#sb-messages');
      this.inputEl = this.container.querySelector('#sb-input');
      this.sendBtn = this.container.querySelector('#sb-send');
      this.suggestionsEl = this.container.querySelector('#sb-suggestions');
      this.settingsBtn = this.container.querySelector('#sb-settings');

      this.addBotMessage("Hello! I'm Mohammad's AI assistant. Ask me anything about his research, career, publications, or skills — I'm here to help!");
      this.renderSuggestions();

      this.sendBtn.addEventListener('click', () => this.handleSend());
      this.inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.handleSend();
        }
      });
      this.settingsBtn.addEventListener('click', () => this.resetKey());
    }

    renderSuggestions() {
      this.suggestionsEl.innerHTML = SUGGESTED
        .map(q => `<button class="sb-suggestion">${q}</button>`)
        .join('');
      this.suggestionsEl.querySelectorAll('.sb-suggestion').forEach(btn => {
        btn.addEventListener('click', () => {
          this.inputEl.value = btn.textContent;
          this.handleSend();
        });
      });
    }

    addBotMessage(text) {
      const div = document.createElement('div');
      div.className = 'sb-bubble sb-bot';
      div.textContent = text;
      this.messagesEl.appendChild(div);
      this.scrollDown();
      return div;
    }

    addUserMessage(text) {
      const div = document.createElement('div');
      div.className = 'sb-bubble sb-user';
      div.textContent = text;
      this.messagesEl.appendChild(div);
      this.scrollDown();
    }

    addTypingIndicator() {
      const div = document.createElement('div');
      div.className = 'sb-bubble sb-bot';
      div.innerHTML = '<span class="sb-typing"><span></span><span></span><span></span></span>';
      this.messagesEl.appendChild(div);
      this.scrollDown();
      return div;
    }

    addError(msg) {
      const div = document.createElement('div');
      div.className = 'sb-error';
      div.textContent = '⚠ ' + msg;
      this.messagesEl.appendChild(div);
      this.scrollDown();
    }

    scrollDown() {
      this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
    }

    resetKey() {
      if (!confirm('Clear the stored OpenAI API key?')) return;
      localStorage.removeItem('openai_key');
      this.apiKey = '';
      this.messages = [];
      this.renderSetup();
    }

    buildMessages(userInput) {
      const systemContent = SYSTEM_PROMPT + '\n\nCV CONTENT:\n' + (this.cvText || FALLBACK_CV);
      const recent = this.messages.slice(-8);
      return [
        { role: 'system', content: systemContent },
        ...recent,
        { role: 'user', content: userInput }
      ];
    }

    async handleSend() {
      if (this.isLoading) return;
      const text = this.inputEl.value.trim();
      if (!text) return;

      this.inputEl.value = '';
      this.suggestionsEl.style.display = 'none';
      this.addUserMessage(text);
      this.messages.push({ role: 'user', content: text });

      this.isLoading = true;
      this.sendBtn.disabled = true;
      this.inputEl.disabled = true;

      const typingEl = this.addTypingIndicator();
      let botEl = null;
      let fullReply = '';

      try {
        const response = await fetch(OPENAI_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            model: MODEL,
            messages: this.buildMessages(text),
            stream: true,
            max_tokens: 600,
            temperature: 0.7
          })
        });

        if (!response.ok) {
          const errBody = await response.text();
          let parsed;
          try { parsed = JSON.parse(errBody); } catch (_) {}
          const msg = parsed?.error?.message || `OpenAI API error ${response.status}`;
          throw new Error(msg);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        typingEl.remove();
        botEl = this.addBotMessage('');

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data:')) continue;
            const data = trimmed.slice(5).trim();
            if (data === '[DONE]') continue;
            try {
              const json = JSON.parse(data);
              const delta = json.choices?.[0]?.delta?.content;
              if (delta) {
                fullReply += delta;
                botEl.textContent = fullReply;
                this.scrollDown();
              }
            } catch (_) {
              // ignore partial JSON
            }
          }
        }

        if (fullReply) {
          this.messages.push({ role: 'assistant', content: fullReply });
        }
      } catch (err) {
        if (typingEl.parentNode) typingEl.remove();
        if (botEl && !fullReply) botEl.remove();
        console.error('[Chatbot] Error:', err);
        this.addError(err.message + ' — Please check your API key and try again. If issues persist, reach out via the Contact section.');
      } finally {
        this.isLoading = false;
        this.sendBtn.disabled = false;
        this.inputEl.disabled = false;
        this.inputEl.focus();
      }
    }
  }

  // ============================================================
  // Auto-init
  // ============================================================
  function init() {
    if (document.getElementById('chatbot-mount')) {
      new SarabianChatbot('chatbot-mount');
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.SarabianChatbot = SarabianChatbot;
})();
