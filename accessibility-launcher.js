/**
 * Accessibility Launcher — Drop-in Script
 * Usage: <script src="accessibility-launcher.js"></script>
 * Or paste into browser console / bookmarklet
 */
(function () {
  if (document.getElementById("__a11y-launcher")) return; // prevent double-init

  /* ─── State ─── */
  const defaults = {
    fontSize: 100,
    cursorSize: "normal",
    highContrast: false,
    invertColors: false,
    grayscale: false,
    textSpacing: false,
    hideImages: false,
    readableFont: false,
  };
  let settings = { ...defaults };
  let panelOpen = false;

  /* ─── Inject CSS ─── */
  const style = document.createElement("style");
  style.id = "__a11y-style";
  style.textContent = `
    #__a11y-launcher {
      all: initial;
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 2147483647;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #2563eb;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 14px rgba(0,0,0,.25);
      transition: background .2s, transform .15s;
      font-family: system-ui, sans-serif;
    }
    #__a11y-launcher:hover { background: #1d4ed8; transform: scale(1.07); }
    #__a11y-launcher svg { width: 26px; height: 26px; fill: #fff; pointer-events: none; }

    #__a11y-panel {
      all: initial;
      position: fixed;
      bottom: 84px;
      right: 24px;
      z-index: 2147483646;
      width: 300px;
      max-height: 580px;
      overflow-y: auto;
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 14px;
      box-shadow: 0 8px 30px rgba(0,0,0,.15);
      font-family: system-ui, sans-serif;
      font-size: 14px;
      color: #111;
    }
    @media (prefers-color-scheme: dark) {
      #__a11y-panel { background: #1f2937; border-color: #374151; color: #f9fafb; }
      #__a11y-panel .__a11y-header { background: #1f2937; border-color: #374151; }
    }
    #__a11y-panel .__a11y-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      border-bottom: 1px solid #e5e7eb;
      position: sticky;
      top: 0;
      background: #0000;
      z-index: 1;
    }
    #__a11y-panel .__a11y-header h2 {
      margin: 0;
      font-size: 15px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 7px;
    }
    #__a11y-panel .__a11y-header h2 svg { width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; pointer-events: none; }
    #__a11y-panel svg { pointer-events: none; }
    #__a11y-panel .__a11y-close {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      border-radius: 6px;
      color: inherit;
      display: flex;
      align-items: center;
    }
    #__a11y-panel .__a11y-close:hover { background: #f3f4f6; }
    #__a11y-panel .__a11y-body { padding: 14px 16px; display: flex; flex-direction: column; gap: 16px; }

    .__a11y-section-label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: .05em;
      opacity: .55;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .__a11y-section-label svg { width: 13px; height: 13px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; }

    .__a11y-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 9px 11px;
      border-radius: 8px;
      background: #f3f4f6;
      cursor: pointer;
      border: none;
      width: 100%;
      text-align: left;
      font-family: inherit;
      font-size: 13.5px;
      color: inherit;
      transition: background .15s;
      box-sizing: border-box;
    }
    .__a11y-row:hover { background: #e5e7eb; }
    .__a11y-row.__a11y-on { background: #dbeafe; color: #1e40af; }
    @media (prefers-color-scheme: dark) {
      .__a11y-row { background: #374151; }
      .__a11y-row:hover { background: #4b5563; }
      .__a11y-row.__a11y-on { background: #1e3a5f; color: #93c5fd; }
    }
    .__a11y-check {
      width: 18px;
      height: 18px;
      border-radius: 4px;
      border: 2px solid #d1d5db;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .__a11y-row.__a11y-on .__a11y-check { background: #2563eb; border-color: #2563eb; }
    .__a11y-check svg { width: 11px; height: 11px; stroke: #fff; fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; display: none; }
    .__a11y-row.__a11y-on .__a11y-check svg { display: block; }

    .__a11y-row-label { display: flex; align-items: center; gap: 7px; }
    .__a11y-row-label svg { width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; flex-shrink: 0; }

    .__a11y-font-row { display: flex; align-items: center; gap: 8px; }
    .__a11y-font-btn {
      flex: 1;
      padding: 8px;
      border: none;
      border-radius: 8px;
      background: #f3f4f6;
      cursor: pointer;
      font-family: inherit;
      font-size: 13px;
      color: inherit;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      transition: background .15s;
    }
    .__a11y-font-btn:hover { background: #e5e7eb; }
    @media (prefers-color-scheme: dark) {
      .__a11y-font-btn { background: #374151; }
      .__a11y-font-btn:hover { background: #4b5563; }
    }
    .__a11y-font-btn svg { width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; }

    .__a11y-reset {
      width: 100%;
      padding: 9px;
      border: none;
      border-radius: 8px;
      background: #fee2e2;
      color: #991b1b;
      font-family: inherit;
      font-size: 13.5px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: background .15s;
      box-sizing: border-box;
    }
    .__a11y-reset:hover { background: #fecaca; }
    .__a11y-reset svg { width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

    /* Applied classes */
    html.accessibility-high-contrast * { border-color: #000 !important; }
    html.accessibility-high-contrast body { background: #fff !important; color: #000 !important; }
    html.accessibility-high-contrast a { color: #00f !important; }
    html.accessibility-text-spacing * { letter-spacing: .12em !important; word-spacing: .16em !important; line-height: 1.8 !important; }
    html.accessibility-hide-images img, html.accessibility-hide-images [role=img], html.accessibility-hide-images figure { visibility: hidden !important; }
    html.accessibility-readable-font * { font-family: Arial, Helvetica, sans-serif !important; }
  `;
  document.head.appendChild(style);

  /* ─── SVG icons (inline) ─── */
  const icons = {
    accessibility: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 3.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-3 4.5h6a.5.5 0 0 1 .45.72L14 13.5V18a.75.75 0 0 1-1.5 0v-3.5h-1V18a.75.75 0 0 1-1.5 0v-4.5l-1.45-2.78A.5.5 0 0 1 9 10z"/></svg>`,
    close: `<svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>`,
    type: `<svg viewBox="0 0 24 24"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>`,
    eye: `<svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
    contrast: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 3v18"/><path d="M12 3C16.97 3 21 7.03 21 12s-4.03 9-9 9"/></svg>`,
    cursor: `<svg viewBox="0 0 24 24"><path d="M5 3l14 9-7 1-4 7z"/></svg>`,
    menu: `<svg viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6"  x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
    zoomin: `<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`,
    zoomout: `<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`,
    reset: `<svg viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.96"/></svg>`,
    check: `<svg viewBox="0 0 12 12"><polyline points="1.5 6 4.5 9 10.5 3"/></svg>`,
  };

  /* ─── Build DOM ─── */
  function checkbox() {
    return `<span class="__a11y-check">${icons.check}</span>`;
  }

  function toggleRow(key, label, icon) {
    const on = settings[key] === true || settings[key] === "large";
    return `
      <button class="__a11y-row${
        on ? " __a11y-on" : ""
      }" data-key="${key}" aria-pressed="${on}">
        <span class="__a11y-row-label">${icons[icon] || ""}${label}</span>
        ${checkbox()}
      </button>`;
  }

  function buildPanel() {
    return `
      <div class="__a11y-header">
        <h2>${icons.accessibility}Accessibility</h2>
        <button class="__a11y-close" id="__a11y-close" aria-label="Close">${
          icons.close
        }</button>
      </div>
      <div class="__a11y-body">
        <div>
          <div class="__a11y-section-label">${icons.type}Font size — ${
      settings.fontSize
    }%</div>
          <div class="__a11y-font-row">
            <button class="__a11y-font-btn" id="__a11y-dec" aria-label="Decrease font size">
              ${icons.zoomout} Smaller
            </button>
            <button class="__a11y-font-btn" id="__a11y-inc" aria-label="Increase font size">
              ${icons.zoomin} Larger
            </button>
          </div>
        </div>

        <div>
          <div class="__a11y-section-label">${icons.cursor}Cursor</div>
          ${toggleRow("cursorSize", "Large cursor", "cursor")}
        </div>

        <div>
          <div class="__a11y-section-label">${icons.eye}Visual</div>
          ${toggleRow("highContrast", "High contrast", "contrast")}
          ${toggleRow("invertColors", "Invert colors", "contrast")}
          ${toggleRow("grayscale", "Grayscale", "contrast")}
          ${toggleRow("hideImages", "Hide images", "eye")}
        </div>

        <div>
          <div class="__a11y-section-label">${icons.menu}Content</div>
          ${toggleRow("textSpacing", "More text spacing", "type")}
          ${toggleRow("readableFont", "Readable font", "type")}
        </div>

        <button class="__a11y-reset" id="__a11y-reset">
          ${icons.reset} Reset all
        </button>
      </div>`;
  }

  /* ─── Apply settings to document ─── */
  function applySettings() {
    const html = document.documentElement;
    html.style.fontSize = `${settings.fontSize}%`;

    if (settings.cursorSize === "large") {
      html.style.cursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M2 2L2 28L10 20L14 28L18 26L14 18L24 18Z' fill='black' stroke='white' stroke-width='1'/%3E%3C/svg%3E") 0 0, auto`;
    } else {
      html.style.cursor = "auto";
    }

    html.classList.toggle("accessibility-high-contrast", settings.highContrast);
    html.classList.toggle("accessibility-text-spacing", settings.textSpacing);
    html.classList.toggle("accessibility-hide-images", settings.hideImages);
    html.classList.toggle("accessibility-readable-font", settings.readableFont);

    if (settings.invertColors) {
      html.style.filter = "invert(1) hue-rotate(180deg)";
    } else if (settings.grayscale) {
      html.style.filter = "grayscale(1)";
    } else {
      html.style.filter = "none";
    }
  }

  /* ─── Render / re-render panel ─── */
  function renderPanel() {
    panel.innerHTML = buildPanel();

    document.getElementById("__a11y-close").onclick = () => togglePanel(false);
    document.getElementById("__a11y-dec").onclick = () => changeFontSize(-10);
    document.getElementById("__a11y-inc").onclick = () => changeFontSize(+10);
    document.getElementById("__a11y-reset").onclick = resetSettings;

    panel.querySelectorAll(".__a11y-row[data-key]").forEach((btn) => {
      btn.onclick = () => toggle(btn.dataset.key);
    });
  }

  /* ─── Actions ─── */
  function changeFontSize(delta) {
    settings.fontSize = Math.min(200, Math.max(80, settings.fontSize + delta));
    applySettings();
    renderPanel();
  }

  function toggle(key) {
    if (typeof settings[key] === "boolean") {
      settings[key] = !settings[key];
    } else {
      settings[key] = settings[key] === "normal" ? "large" : "normal";
    }
    applySettings();
    renderPanel();
  }

  function resetSettings() {
    settings = { ...defaults };
    applySettings();
    renderPanel();
  }

  function togglePanel(force) {
    panelOpen = force !== undefined ? force : !panelOpen;
    panel.style.display = panelOpen ? "block" : "none";
    launcher.setAttribute("aria-expanded", panelOpen);
    if (panelOpen) renderPanel();
  }

  /* ─── Mount elements ─── */
  const launcher = document.createElement("button");
  launcher.id = "__a11y-launcher";
  launcher.setAttribute("aria-label", "Open accessibility options");
  launcher.setAttribute("aria-expanded", "false");
  launcher.innerHTML = icons.accessibility;
  launcher.onclick = () => togglePanel();

  const panel = document.createElement("div");
  panel.id = "__a11y-panel";
  panel.role = "dialog";
  panel.setAttribute("aria-label", "Accessibility options");
  panel.style.display = "none";

  document.body.appendChild(launcher);
  document.body.appendChild(panel);

  /* ─── Close on outside click ─── */
  document.addEventListener("click", (e) => {
    if (panelOpen && !panel.contains(e.target) && e.target !== launcher) {
      togglePanel(false);
    }
  });

  /* ─── Keyboard: Escape closes panel ─── */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panelOpen) togglePanel(false);
  });
})();
