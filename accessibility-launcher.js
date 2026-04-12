/**
 * Accessibility Launcher — Drop-in Script v2
 * Usage: <script src="accessibility-launcher.js"></script>
 */
(function () {
  if (document.getElementById("__a11y-launcher")) return;

  /* ─── State ─── */
  const defaults = {
    fontSize: 100,
    cursorSize: "normal",
    cursorColor: "#000000",
    cursorBgColor: "#ffffff",
    highContrast: false,
    invertColors: false,
    grayscale: false,
    textSpacing: false,
    hideImages: false,
    readableFont: false,
    bgColor: "",
    textColor: "",
  };
  let settings = { ...defaults };
  let panelOpen = false;
  let cursorStyleEl = null;

  /* ─── Inject base CSS ─── */
  const style = document.createElement("style");
  style.id = "__a11y-style";
  style.textContent = `
    *, *::before, *::after { box-sizing: border-box; }

    #__a11y-launcher {
      all: initial;
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 2147483647;
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: #2563eb;
      border: none;
      cursor: pointer !important;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 12px rgba(37,99,235,.35);
      transition: background .18s, box-shadow .18s;
      font-family: system-ui, sans-serif;
    }
    #__a11y-launcher:hover { background: #1d4ed8; box-shadow: 0 4px 18px rgba(37,99,235,.45); }
    #__a11y-launcher svg { width: 24px; height: 24px; fill: #fff; pointer-events: none; }

    #__a11y-panel {
      all: initial;
      position: fixed;
      bottom: 92px;
      right: 28px;
      z-index: 2147483646;
      width: 316px;
      max-height: 620px;
      overflow-y: auto;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0,0,0,.10), 0 1px 4px rgba(0,0,0,.06);
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      color: #0f172a;
      scroll-behavior: smooth;
    }
    #__a11y-panel::-webkit-scrollbar { width: 4px; }
    #__a11y-panel::-webkit-scrollbar-track { background: transparent; }
    #__a11y-panel::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }

    @media (prefers-color-scheme: dark) {
      #__a11y-panel { background: #0f172a; border-color: #1e293b; color: #f1f5f9; }
      #__a11y-panel .__a11y-header { background: #0f172a; border-color: #1e293b; }
      #__a11y-panel .__a11y-section { background: #0f172a; }
      .__a11y-row { background: #1e293b !important; color: #f1f5f9 !important; }
      .__a11y-row:hover { background: #263349 !important; }
      .__a11y-row.__a11y-on { background: #1e3a5f !important; color: #93c5fd !important; }
      .__a11y-font-btn { background: #1e293b !important; color: #f1f5f9 !important; }
      .__a11y-font-btn:hover { background: #263349 !important; }
      .__a11y-color-row { background: #1e293b !important; }
      .__a11y-section-label { color: #94a3b8 !important; }
      .__a11y-font-display { color: #94a3b8 !important; }
      .__a11y-reset { background: #2d1515 !important; color: #fca5a5 !important; }
      .__a11y-reset:hover { background: #3d1a1a !important; }
    }

    #__a11y-panel .__a11y-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 18px 14px;
      border-bottom: 1px solid #e2e8f0;
      position: sticky;
      top: 0;
      background: #ffffff;
      z-index: 1;
      border-radius: 16px 16px 0 0;
    }
    #__a11y-panel .__a11y-header h2 {
      margin: 0;
      font-size: 15px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
      color: #0f172a;
    }
    #__a11y-panel .__a11y-header h2 svg {
      width: 18px; height: 18px;
      fill: #2563eb;
      pointer-events: none;
    }
    #__a11y-panel svg { pointer-events: none; }
    .__a11y-close {
      background: none;
      border: none;
      cursor: pointer !important;
      padding: 6px;
      border-radius: 8px;
      color: #64748b;
      display: flex;
      align-items: center;
      line-height: 1;
      transition: background .15s, color .15s;
    }
    .__a11y-close:hover { background: #f1f5f9; color: #0f172a; }
    .__a11y-close svg { width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

    .__a11y-body { padding: 14px 16px 16px; display: flex; flex-direction: column; gap: 18px; }

    .__a11y-section-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: .06em;
      color: #94a3b8;
      margin-bottom: 8px;
    }

    .__a11y-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 10px 12px;
      border-radius: 10px;
      background: #f8fafc;
      cursor: pointer !important;
      border: 1px solid #e2e8f0;
      width: 100%;
      text-align: left;
      font-family: inherit;
      font-size: 13.5px;
      color: #334155;
      transition: background .13s, border-color .13s;
      margin-bottom: 5px;
    }
    .__a11y-row:last-child { margin-bottom: 0; }
    .__a11y-row:hover { background: #f1f5f9; border-color: #cbd5e1; }
    .__a11y-row.__a11y-on { background: #eff6ff; border-color: #bfdbfe; color: #1d4ed8; }
    .__a11y-row.__a11y-on .__a11y-toggle { background: #2563eb; }
    .__a11y-row.__a11y-on .__a11y-toggle::after { transform: translateX(16px); }

    .__a11y-row-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13.5px;
    }
    .__a11y-row-label svg {
      width: 15px; height: 15px;
      stroke: currentColor; fill: none;
      stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round;
      opacity: .65;
      flex-shrink: 0;
    }

    .__a11y-toggle {
      width: 34px;
      height: 18px;
      border-radius: 9px;
      background: #cbd5e1;
      flex-shrink: 0;
      position: relative;
      transition: background .2s;
    }
    .__a11y-toggle::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 1px 3px rgba(0,0,0,.2);
      transition: transform .2s;
    }

    .__a11y-font-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .__a11y-font-display {
      flex: 1;
      text-align: center;
      font-size: 13px;
      font-weight: 600;
      color: #64748b;
      padding: 0 4px;
    }
    .__a11y-font-btn {
      width: 38px;
      height: 38px;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      background: #f8fafc;
      cursor: pointer !important;
      font-family: inherit;
      color: #334155;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background .13s, border-color .13s;
      flex-shrink: 0;
    }
    .__a11y-font-btn:hover { background: #f1f5f9; border-color: #cbd5e1; }
    .__a11y-font-btn svg { width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

    .__a11y-color-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 9px 12px;
      border-radius: 10px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      margin-bottom: 5px;
    }
    .__a11y-color-row:last-child { margin-bottom: 0; }
    .__a11y-color-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13.5px;
      color: #334155;
    }
    .__a11y-color-label svg {
      width: 15px; height: 15px;
      stroke: currentColor; fill: none;
      stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round;
      opacity: .65;
    }
    .__a11y-color-input-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .__a11y-color-swatch {
      width: 28px; height: 28px;
      border-radius: 7px;
      border: 2px solid #e2e8f0;
      overflow: hidden;
      cursor: pointer !important;
      position: relative;
      flex-shrink: 0;
    }
    .__a11y-color-swatch input[type=color] {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer !important;
      border: none;
      padding: 0;
    }
    .__a11y-color-swatch .__a11y-swatch-fill {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }
    .__a11y-color-reset-btn {
      background: none;
      border: none;
      cursor: pointer !important;
      padding: 4px;
      border-radius: 6px;
      color: #94a3b8;
      display: flex;
      align-items: center;
      transition: color .15s;
      line-height: 1;
    }
    .__a11y-color-reset-btn:hover { color: #64748b; }
    .__a11y-color-reset-btn svg { width: 13px; height: 13px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

    .__a11y-reset {
      width: 100%;
      padding: 10px;
      border: 1px solid #fecaca;
      border-radius: 10px;
      background: #fff5f5;
      color: #dc2626;
      font-family: inherit;
      font-size: 13.5px;
      cursor: pointer !important;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      font-weight: 500;
      transition: background .13s;
    }
    .__a11y-reset:hover { background: #fee2e2; }
    .__a11y-reset svg { width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

    /* Applied classes */
    html.accessibility-high-contrast * { border-color: #000 !important; }
    html.accessibility-high-contrast body { background: #fff !important; color: #000 !important; }
    html.accessibility-high-contrast a { color: #0000ee !important; }
    html.accessibility-text-spacing * { letter-spacing: .12em !important; word-spacing: .16em !important; line-height: 1.8 !important; }
    html.accessibility-hide-images img,
    html.accessibility-hide-images [role=img],
    html.accessibility-hide-images figure { visibility: hidden !important; }
    html.accessibility-readable-font * { font-family: Arial, Helvetica, sans-serif !important; }
  `;
  document.head.appendChild(style);

  /* ─── Cursor styles ─── */
  function buildCursorSVG(stroke, fill) {
    const encodeSvg = (svg) =>
      'url("data:image/svg+xml,' + encodeURIComponent(svg) + '") 0 0, auto';

    function makeCursor(pathD, vw, vh) {
      return `<svg xmlns='http://www.w3.org/2000/svg' width='${vw}' height='${vh}' viewBox='0 0 ${vw} ${vh}'><path d='${pathD}' fill='${fill}' stroke='${stroke}' stroke-width='1.5'/></svg>`;
    }

    const arrow = makeCursor(
      "M4 2 L4 26 L10 20 L14 28 L18 26 L14 17 L22 17 Z",
      28,
      32
    );
    const pointer = makeCursor(
      "M8 2 C8 2 8 18 8 22 C8 24 9.5 25 11 24 C11 24 12 28 14 27 C14 27 15 30 17 29 C17 29 18 31 20 30 L20 18 C20 18 23 19 24 18 C26 16 24 14 22 14 L18 14 L18 2 C18 2 18 0 13 0 C8 0 8 2 8 2 Z",
      28,
      34
    );
    const text = `<svg xmlns='http://www.w3.org/2000/svg' width='16' height='28' viewBox='0 0 16 28'><line x1='8' y1='0' x2='8' y2='28' stroke='${fill}' stroke-width='2'/><line x1='2' y1='0' x2='14' y2='0' stroke='${fill}' stroke-width='2'/><line x1='2' y1='28' x2='14' y2='28' stroke='${fill}' stroke-width='2'/></svg>`;
    const notAllowed = `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><circle cx='16' cy='16' r='14' fill='none' stroke='${fill}' stroke-width='3'/><line x1='6' y1='6' x2='26' y2='26' stroke='${fill}' stroke-width='3'/></svg>`;
    const crosshair = `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><line x1='16' y1='2' x2='16' y2='30' stroke='${fill}' stroke-width='2'/><line x1='2' y1='16' x2='30' y2='16' stroke='${fill}' stroke-width='2'/><circle cx='16' cy='16' r='4' fill='none' stroke='${fill}' stroke-width='2'/></svg>`;
    const grab = makeCursor(
      "M8 14 L8 6 C8 5 9 4 10 4 C11 4 12 5 12 6 L12 12 C12 11 13 10 14 10 C15 10 16 11 16 12 L16 13 C16 12 17 11 18 11 C19 11 20 12 20 13 L20 14 C20 13 21 12 22 12 C23 12 24 13 24 14 L24 22 C24 26 21 29 17 29 L15 29 C11 29 8 26 8 22 Z",
      32,
      32
    );

    return {
      default: encodeSvg(arrow),
      pointer: encodeSvg(pointer),
      text: encodeSvg(text) + ", text",
      "not-allowed": encodeSvg(notAllowed) + ", not-allowed",
      crosshair: encodeSvg(crosshair) + ", crosshair",
      grab: encodeSvg(grab),
      grabbing: encodeSvg(grab),
      "zoom-in": encodeSvg(arrow),
      "zoom-out": encodeSvg(arrow),
    };
  }

  function applyCustomCursors() {
    if (!cursorStyleEl) {
      cursorStyleEl = document.createElement("style");
      cursorStyleEl.id = "__a11y-cursor-style";
      document.head.appendChild(cursorStyleEl);
    }

    if (settings.cursorSize !== "large") {
      cursorStyleEl.textContent = "";
      return;
    }

    const cursors = buildCursorSVG(
      settings.cursorBgColor,
      settings.cursorColor
    );

    cursorStyleEl.textContent = `
      html, html * { cursor: ${cursors.default} !important; }
      html a, html button, html [role=button], html input[type=submit], html input[type=button],
      html input[type=reset], html label, html select, html summary, html [tabindex]:not([tabindex="-1"]) {
        cursor: ${cursors.pointer} !important;
      }
      html input[type=text], html input[type=email], html input[type=password], html input[type=search],
      html input[type=url], html input[type=tel], html input[type=number], html textarea, html [contenteditable] {
        cursor: ${cursors.text} !important;
      }
      html [disabled], html [aria-disabled=true], html button:disabled, html input:disabled, html select:disabled {
        cursor: ${cursors["not-allowed"]} !important;
      }
      html [style*="cursor: not-allowed"], html [style*="cursor:not-allowed"] {
        cursor: ${cursors["not-allowed"]} !important;
      }
    `;
  }

  /* ─── SVG icons ─── */
  const icons = {
    accessibility: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 3.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-3 4.5h6a.5.5 0 0 1 .45.72L14 13.5V18a.75.75 0 0 1-1.5 0v-3.5h-1V18a.75.75 0 0 1-1.5 0v-4.5l-1.45-2.78A.5.5 0 0 1 9 10z"/></svg>`,
    close: `<svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>`,
    type: `<svg viewBox="0 0 24 24"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>`,
    eye: `<svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
    contrast: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 3v18"/></svg>`,
    cursor: `<svg viewBox="0 0 24 24"><path d="M5 3l14 9-7 1-4 7z"/></svg>`,
    palette: `<svg viewBox="0 0 24 24"><path d="M12 22C6.49 22 2 17.52 2 12c0-5.52 4.48-10 10-10 5.52 0 10 4.48 10 10 0 2.76-2.45 5-5.45 4.08-1.45-.44-2.55.5-2.55 1.92 0 2.2-1.82 4-4 4zm-8-10a2 2 0 1 0 4 0 2 2 0 0 0-4 0zm4-4a2 2 0 1 0 4 0 2 2 0 0 0-4 0zm8 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0zm3.65 6a2 2 0 1 0 4 0 2 2 0 0 0-4 0z"/></svg>`,
    textSize: `<svg viewBox="0 0 24 24"><path d="M3 7V5h10v2M8 5v14m-2 0h4M13 13v-2h8v2M17 11v8m-1.5 0h3"/></svg>`,
    image: `<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
    font: `<svg viewBox="0 0 24 24"><path d="M4 20h4l8-12-4-3-8 15z"/><path d="M13.5 6.5l4 3"/></svg>`,
    zoomin: `<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`,
    zoomout: `<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`,
    reset: `<svg viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.96"/></svg>`,
    textColor: `<svg viewBox="0 0 24 24"><path d="M4 20h4l8-12-4-3-8 15z"/><path d="M2 20h20" stroke-width="2.5"/></svg>`,
    bgColor: `<svg viewBox="0 0 24 24"><path d="M20 11a8 8 0 1 0-16 0c0 4.42 7 11 8 11s8-6.58 8-11z"/></svg>`,
    xCircle: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
  };

  /* ─── Build DOM ─── */
  function toggle(key) {
    return `<div class="__a11y-toggle"></div>`;
  }

  function toggleRow(key, label, iconKey) {
    const on = settings[key] === true || settings[key] === "large";
    return `
      <button class="__a11y-row${
        on ? " __a11y-on" : ""
      }" data-key="${key}" aria-pressed="${on}">
        <span class="__a11y-row-label">${icons[iconKey] || ""}${label}</span>
        ${toggle(key)}
      </button>`;
  }

  function colorRow(key, label, iconKey, defaultVal) {
    const val = settings[key] || defaultVal;
    const isSet = !!settings[key];
    return `
      <div class="__a11y-color-row">
        <span class="__a11y-color-label">${icons[iconKey] || ""}${label}</span>
        <div class="__a11y-color-input-wrap">
          <div class="__a11y-color-swatch" title="Pick color">
            <div class="__a11y-swatch-fill" style="background:${val}"></div>
            <input type="color" value="${val}" data-color-key="${key}" aria-label="${label}">
          </div>
          ${
            isSet
              ? `<button class="__a11y-color-reset-btn" data-color-clear="${key}" title="Clear">${icons.xCircle}</button>`
              : ""
          }
        </div>
      </div>`;
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
          <div class="__a11y-section-label">Text size — ${
            settings.fontSize
          }%</div>
          <div class="__a11y-font-row">
            <button class="__a11y-font-btn" id="__a11y-dec" aria-label="Decrease font size">${
              icons.zoomout
            }</button>
            <div class="__a11y-font-display">${settings.fontSize}%</div>
            <button class="__a11y-font-btn" id="__a11y-inc" aria-label="Increase font size">${
              icons.zoomin
            }</button>
          </div>
        </div>

        <div>
          <div class="__a11y-section-label">Cursor</div>
          ${toggleRow("cursorSize", "Large cursor", "cursor")}
          ${
            settings.cursorSize === "large"
              ? `
            ${colorRow("cursorColor", "Cursor color", "cursor", "#000000")}
            ${colorRow("cursorBgColor", "Cursor outline", "palette", "#ffffff")}
          `
              : ""
          }
        </div>

        <div>
          <div class="__a11y-section-label">Visual</div>
          ${toggleRow("highContrast", "High contrast", "contrast")}
          ${toggleRow("invertColors", "Invert colors", "eye")}
          ${toggleRow("grayscale", "Grayscale", "contrast")}
          ${toggleRow("hideImages", "Hide images", "image")}
        </div>

        <div>
          <div class="__a11y-section-label">Colors</div>
          ${colorRow("bgColor", "Page background", "bgColor", "#ffffff")}
          ${colorRow("textColor", "Text color", "textColor", "#000000")}
        </div>

        <div>
          <div class="__a11y-section-label">Content</div>
          ${toggleRow("textSpacing", "More text spacing", "type")}
          ${toggleRow("readableFont", "Readable font", "font")}
        </div>

        <button class="__a11y-reset" id="__a11y-reset">
          ${icons.reset} Reset all settings
        </button>
      </div>`;
  }

  /* ─── Apply settings ─── */
  function applySettings() {
    const html = document.documentElement;
    html.style.fontSize = `${settings.fontSize}%`;
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

    if (settings.bgColor) {
      document.body.style.backgroundColor = settings.bgColor;
    } else {
      document.body.style.backgroundColor = "";
    }
    if (settings.textColor) {
      document.body.style.color = settings.textColor;
    } else {
      document.body.style.color = "";
    }

    applyCustomCursors();
  }

  /* ─── Render panel ─── */
  function renderPanel() {
    panel.innerHTML = buildPanel();
    document.getElementById("__a11y-close").onclick = () => togglePanel(false);
    document.getElementById("__a11y-dec").onclick = () => changeFontSize(-10);
    document.getElementById("__a11y-inc").onclick = () => changeFontSize(+10);
    document.getElementById("__a11y-reset").onclick = resetSettings;

    panel.querySelectorAll(".__a11y-row[data-key]").forEach((btn) => {
      btn.onclick = () => toggleSetting(btn.dataset.key);
    });

    panel.querySelectorAll("input[data-color-key]").forEach((input) => {
      input.addEventListener("input", (e) => {
        const key = e.target.dataset.colorKey;
        settings[key] = e.target.value;
        const fill = e.target
          .closest(".__a11y-color-swatch")
          .querySelector(".__a11y-swatch-fill");
        if (fill) fill.style.background = e.target.value;
        applySettings();
      });
      input.addEventListener("change", () => renderPanel());
    });

    panel.querySelectorAll("button[data-color-clear]").forEach((btn) => {
      btn.onclick = () => {
        settings[btn.dataset.colorClear] = "";
        applySettings();
        renderPanel();
      };
    });
  }

  /* ─── Actions ─── */
  function changeFontSize(delta) {
    settings.fontSize = Math.min(200, Math.max(80, settings.fontSize + delta));
    applySettings();
    renderPanel();
  }

  function toggleSetting(key) {
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
    launcher.setAttribute("aria-expanded", String(panelOpen));
    if (panelOpen) renderPanel();
  }

  /* ─── Mount ─── */
  const launcher = document.createElement("button");
  launcher.id = "__a11y-launcher";
  launcher.setAttribute("aria-label", "Open accessibility options");
  launcher.setAttribute("aria-expanded", "false");
  launcher.innerHTML = icons.accessibility;
  launcher.onclick = () => togglePanel();

  const panel = document.createElement("div");
  panel.id = "__a11y-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Accessibility options");
  panel.style.display = "none";

  document.body.appendChild(launcher);
  document.body.appendChild(panel);

  document.addEventListener("click", (e) => {
    if (panelOpen && !panel.contains(e.target) && e.target !== launcher) {
      togglePanel(false);
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panelOpen) togglePanel(false);
  });
})();
