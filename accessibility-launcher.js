/**
 * Accessibility Launcher — Drop-in Script v2.1
 * Fixes: cursor shape, WCAG contrast, focus trap, focus return on close
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
      background: #1d4ed8;
      border: none;
      cursor: pointer !important;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 12px rgba(29,78,216,.4);
      transition: background .18s, box-shadow .18s;
      font-family: system-ui, sans-serif;
    }
    #__a11y-launcher:hover { background: #1e40af; box-shadow: 0 4px 18px rgba(29,78,216,.5); }
    #__a11y-launcher:focus-visible {
      outline: 3px solid #1d4ed8;
      outline-offset: 3px;
    }
    #__a11y-launcher svg { width: 24px; height: 24px; fill: #fff; pointer-events: none; }

    #__a11y-panel {
      all: initial;
      position: fixed;
      bottom: 92px;
      right: 28px;
      z-index: 2147483646;
      width: 320px;
      max-height: 620px;
      overflow-y: auto;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,.12), 0 2px 8px rgba(0,0,0,.06);
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      color: #0f172a;
      scroll-behavior: smooth;
    }
    #__a11y-panel::-webkit-scrollbar { width: 4px; }
    #__a11y-panel::-webkit-scrollbar-track { background: transparent; }
    #__a11y-panel::-webkit-scrollbar-thumb { background: #94a3b8; border-radius: 4px; }

    /* Visible focus ring for all focusable elements — WCAG 2.4.7 */
    #__a11y-panel *:focus-visible {
      outline: 2px solid #1d4ed8;
      outline-offset: 2px;
      border-radius: 6px;
    }

    @media (prefers-color-scheme: dark) {
      #__a11y-panel { background: #0f172a; border-color: #334155; color: #f1f5f9; }
      #__a11y-panel .__a11y-header { background: #0f172a; border-color: #334155; }
      #__a11y-panel .__a11y-header h2 { color: #e2e8f0 !important; }
      .__a11y-row { background: #1e293b !important; color: #e2e8f0 !important; border-color: #334155 !important; }
      .__a11y-row:hover { background: #263349 !important; border-color: #475569 !important; }
      .__a11y-row.__a11y-on { background: #1e3a5f !important; color: #bfdbfe !important; border-color: #3b82f6 !important; }
      .__a11y-font-btn { background: #1e293b !important; color: #e2e8f0 !important; border-color: #334155 !important; }
      .__a11y-font-btn:hover { background: #263349 !important; border-color: #475569 !important; }
      .__a11y-font-display { color: #f1f5f9 !important; }
      .__a11y-color-row { background: #1e293b !important; border-color: #334155 !important; }
      .__a11y-color-label { color: #e2e8f0 !important; }
      /* #94a3b8 on #0f172a = 4.6:1 WCAG AA ✓ */
      .__a11y-section-label { color: #94a3b8 !important; }
      .__a11y-close { color: #94a3b8 !important; }
      .__a11y-close:hover { background: #1e293b !important; color: #f1f5f9 !important; }
      .__a11y-reset { background: #2d1515 !important; color: #fca5a5 !important; border-color: #7f1d1d !important; }
      .__a11y-reset:hover { background: #3d1a1a !important; }
      .__a11y-color-swatch { border-color: #475569 !important; }
      .__a11y-color-reset-btn { border-color: #334155 !important; color: #94a3b8 !important; }
    }

    #__a11y-panel .__a11y-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 18px 14px;
      border-bottom: 1px solid #cbd5e1;
      position: sticky;
      top: 0;
      background: #000000ff;
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
      color: #000;
    }
    #__a11y-panel .__a11y-header h2 svg {
      width: 18px; height: 18px;
      fill: #1d4ed8;
      pointer-events: none;
    }
    #__a11y-panel svg { pointer-events: none; }

    .__a11y-close {
      background: none;
      border: none;
      cursor: pointer !important;
      padding: 6px;
      border-radius: 8px;
      /* #374151 on #ffffff = 10.7:1 WCAG AAA ✓ */
      color: #374151;
      display: flex;
      align-items: center;
      line-height: 1;
      transition: background .15s, color .15s;
    }
    .__a11y-close:hover { background: #f1f5f9; color: #0f172a; }
    .__a11y-close svg { width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }

    .__a11y-body { padding: 14px 16px 16px; display: flex; flex-direction: column; gap: 18px; }

    .__a11y-section-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .07em;
      /* #475569 on #ffffff = 5.9:1 WCAG AA ✓ */
      color: #475569;
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
      border: 1px solid #cbd5e1;
      width: 100%;
      text-align: left;
      font-family: inherit;
      font-size: 13.5px;
      /* #1e293b on #f8fafc = 14.7:1 WCAG AAA ✓ */
      color: #1e293b;
      transition: background .13s, border-color .13s;
      margin-bottom: 5px;
    }
    .__a11y-row:last-child { margin-bottom: 0; }
    .__a11y-row:hover { background: #f1f5f9; border-color: #94a3b8; }
    .__a11y-row.__a11y-on { background: #eff6ff; border-color: #3b82f6; color: #1e40af; }
    .__a11y-row.__a11y-on .__a11y-toggle { background: #1d4ed8; }
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
      flex-shrink: 0;
    }

    .__a11y-toggle {
      width: 36px;
      height: 20px;
      border-radius: 10px;
      background: #94a3b8;
      flex-shrink: 0;
      position: relative;
      transition: background .2s;
      pointer-events: none;
    }
    .__a11y-toggle::after {
      content: '';
      position: absolute;
      top: 3px;
      left: 3px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 1px 3px rgba(0,0,0,.25);
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
      font-size: 14px;
      font-weight: 700;
      /* #1e293b on #ffffff = 14.7:1 WCAG AAA ✓ */
      color: #1e293b;
      padding: 0 4px;
    }
    .__a11y-font-btn {
      width: 40px;
      height: 40px;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      background: #f8fafc;
      cursor: pointer !important;
      font-family: inherit;
      color: #1e293b;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background .13s, border-color .13s;
      flex-shrink: 0;
    }
    .__a11y-font-btn:hover { background: #f1f5f9; border-color: #94a3b8; }
    .__a11y-font-btn svg { width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

    .__a11y-color-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 9px 12px;
      border-radius: 10px;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      margin-bottom: 5px;
    }
    .__a11y-color-row:last-child { margin-bottom: 0; }
    .__a11y-color-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13.5px;
      /* #1e293b on #f8fafc = 14.7:1 WCAG AAA ✓ */
      color: #1e293b;
      font-weight: 500;
    }
    .__a11y-color-label svg {
      width: 15px; height: 15px;
      stroke: currentColor; fill: none;
      stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round;
    }
    .__a11y-color-input-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .__a11y-color-swatch {
      width: 32px; height: 32px;
      border-radius: 8px;
      border: 2px solid #94a3b8;
      overflow: hidden;
      cursor: pointer !important;
      position: relative;
      flex-shrink: 0;
      transition: border-color .15s;
    }
    .__a11y-color-swatch:hover { border-color: #334155; }
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
      border: 1px solid #cbd5e1;
      cursor: pointer !important;
      padding: 5px;
      border-radius: 7px;
      /* #374151 on #000000ff = 10.7:1 WCAG AAA ✓ */
      color: #374151;
      display: flex;
      align-items: center;
      transition: background .15s, color .15s, border-color .15s;
      line-height: 1;
    }
    .__a11y-color-reset-btn:hover { background: #fee2e2; border-color: #fca5a5; color: #dc2626; }
    .__a11y-color-reset-btn svg { width: 13px; height: 13px; stroke: currentColor; fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }

    .__a11y-reset {
      width: 100%;
      padding: 10px;
      border: 1px solid #fca5a5;
      border-radius: 10px;
      background: #fff1f2;
      /* #991b1b on #fff1f2 = 7.2:1 WCAG AAA ✓ */
      color: #991b1b;
      font-family: inherit;
      font-size: 13.5px;
      cursor: pointer !important;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      font-weight: 600;
      transition: background .13s, border-color .13s;
    }
    .__a11y-reset:hover { background: #fee2e2; border-color: #f87171; }
    .__a11y-reset svg { width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .__a11y-footer {
      font-size: 12px;
      text-align: center;
      margin-top: 10px;
    }
    .__a11y-footer a {
      color: #fff;
      text-decoration: underline;
    }


    /* Applied classes */
    html.accessibility-high-contrast * { border-color: #000 !important; }
    html.accessibility-high-contrast body { background: #fff !important; color: #000 !important; }
    html.accessibility-high-contrast a { color: #0000cc !important; text-decoration: underline !important; }
    html.accessibility-text-spacing * { letter-spacing: .12em !important; word-spacing: .16em !important; line-height: 1.8 !important; }
    html.accessibility-hide-images img,
    html.accessibility-hide-images [role=img],
    html.accessibility-hide-images figure { visibility: hidden !important; }
    html.accessibility-readable-font * { font-family: Arial, Helvetica, sans-serif !important; }
  `;
  document.head.appendChild(style);

  /* ─── Cursor styles ─── */
  function buildCursorSVG(fill, stroke) {
    /*
     * fill   = cursor body color  (settings.cursorColor)
     * stroke = outline color      (settings.cursorBgColor)
     *
     * Hotspots:
     *   arrow    — (4, 2)   tip of pointer
     *   pointer  — (9, 1)   tip of index finger
     *   text     — (10, 14) centre of I-beam
     *   others   — (16, 16) centre
     */
    const enc = (svg, hx, hy) =>
      `url("data:image/svg+xml,${encodeURIComponent(svg)}") ${hx} ${hy}, auto`;

    /* Arrow */
    const arrowSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="32" viewBox="0 0 28 32">
      <path d="M4 2 L4 26 L9 21 L13 30 L17 28 L13 19 L21 19 Z"
        fill="${fill}" stroke="${stroke}" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>`;

    /*
     * Pointer hand — index finger extended, other fingers curled
     * Drawn at 28×34, finger tip at ~(9,1)
     */
    const pointerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="34" viewBox="0 0 28 34">
      <path d="
        M9 1
        C9 0 10 0 11 0
        C12 0 13 1 13 2
        L13 13
        L15 13
        L15 5
        C15 4 16 3 17 3
        C18 3 19 4 19 5
        L19 13
        L21 13
        L21 8
        C21 7 22 6 23 6
        C24 6 25 7 25 8
        L25 15
        L26 15
        C27 15 28 16 28 17
        C28 17 28 18 27 19
        L26 20
        L26 24
        C26 29 22 33 17 33
        L14 33
        C10 33 7 30.5 6 27
        L4 21
        C3.5 19 4.5 17 6.5 17
        L9 17
        L9 1 Z
      " fill="${fill}" stroke="${stroke}" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>`;

    /* I-beam text cursor */
    const textSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="28" viewBox="0 0 20 28">
      <line x1="10" y1="0"  x2="10" y2="28" stroke="${stroke}" stroke-width="3.5" stroke-linecap="round"/>
      <line x1="4"  y1="0"  x2="16" y2="0"  stroke="${stroke}" stroke-width="3.5" stroke-linecap="round"/>
      <line x1="4"  y1="28" x2="16" y2="28" stroke="${stroke}" stroke-width="3.5" stroke-linecap="round"/>
      <line x1="10" y1="0"  x2="10" y2="28" stroke="${fill}"   stroke-width="2"   stroke-linecap="round"/>
      <line x1="4"  y1="0"  x2="16" y2="0"  stroke="${fill}"   stroke-width="2"   stroke-linecap="round"/>
      <line x1="4"  y1="28" x2="16" y2="28" stroke="${fill}"   stroke-width="2"   stroke-linecap="round"/>
    </svg>`;

    /* Not-allowed */
    const notAllowedSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="13" fill="none" stroke="${stroke}" stroke-width="4.5"/>
      <line x1="5.5" y1="5.5" x2="26.5" y2="26.5" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round"/>
      <circle cx="16" cy="16" r="13" fill="none" stroke="${fill}" stroke-width="3"/>
      <line x1="5.5" y1="5.5" x2="26.5" y2="26.5" stroke="${fill}" stroke-width="3" stroke-linecap="round"/>
    </svg>`;

    /* Crosshair */
    const crosshairSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <line x1="16" y1="1"  x2="16" y2="12" stroke="${stroke}" stroke-width="3.5" stroke-linecap="round"/>
      <line x1="16" y1="20" x2="16" y2="31" stroke="${stroke}" stroke-width="3.5" stroke-linecap="round"/>
      <line x1="1"  y1="16" x2="12" y2="16" stroke="${stroke}" stroke-width="3.5" stroke-linecap="round"/>
      <line x1="20" y1="16" x2="31" y2="16" stroke="${stroke}" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="16" cy="16" r="4.5" fill="none" stroke="${stroke}" stroke-width="3.5"/>
      <line x1="16" y1="1"  x2="16" y2="12" stroke="${fill}" stroke-width="2" stroke-linecap="round"/>
      <line x1="16" y1="20" x2="16" y2="31" stroke="${fill}" stroke-width="2" stroke-linecap="round"/>
      <line x1="1"  y1="16" x2="12" y2="16" stroke="${fill}" stroke-width="2" stroke-linecap="round"/>
      <line x1="20" y1="16" x2="31" y2="16" stroke="${fill}" stroke-width="2" stroke-linecap="round"/>
      <circle cx="16" cy="16" r="4.5" fill="none" stroke="${fill}" stroke-width="2"/>
    </svg>`;

    /* Grab / open hand */
    const grabSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="30" viewBox="0 0 28 30">
      <path d="
        M5 13
        L5 7  C5 5.5 6 4.5 7.5 4.5 C9 4.5 10 5.5 10 7
        L10 12
        C10 10.5 11 9.5 12.5 9.5 C14 9.5 15 10.5 15 12
        L15 12.5
        C15 11 16 10 17.5 10 C19 10 20 11 20 12.5
        L20 13
        C20 11.5 21 10.5 22.5 10.5 C24 10.5 25 11.5 25 13
        L25 20
        C25 24.5 21.5 28 17 28
        L15 28
        C11 28 8 25 7 22
        L5 17
        Z
      " fill="${fill}" stroke="${stroke}" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>`;

    return {
      default: enc(arrowSvg, 4, 2),
      pointer: enc(pointerSvg, 9, 1),
      text: enc(textSvg, 10, 14) + ", text",
      "not-allowed": enc(notAllowedSvg, 16, 16) + ", not-allowed",
      crosshair: enc(crosshairSvg, 16, 16) + ", crosshair",
      grab: enc(grabSvg, 12, 10),
      grabbing: enc(grabSvg, 12, 10),
      move: enc(crosshairSvg, 16, 16) + ", move",
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
    const c = buildCursorSVG(settings.cursorColor, settings.cursorBgColor);
    cursorStyleEl.textContent = `
      html, html * { cursor: ${c.default} !important; }

      html a,
      html button,
      html [role="button"],
      html input[type="submit"],
      html input[type="button"],
      html input[type="reset"],
      html input[type="checkbox"],
      html input[type="radio"],
      html label[for],
      html select,
      html summary,
      html [tabindex]:not([tabindex="-1"]),
      html [onclick],
      html [style*="cursor:pointer"],
      html [style*="cursor: pointer"] {
        cursor: ${c.pointer} !important;
      }

      html input[type="text"],
      html input[type="email"],
      html input[type="password"],
      html input[type="search"],
      html input[type="url"],
      html input[type="tel"],
      html input[type="number"],
      html textarea,
      html [contenteditable="true"],
      html [contenteditable=""] {
        cursor: ${c.text} !important;
      }

      html [disabled],
      html [aria-disabled="true"],
      html button:disabled,
      html input:disabled,
      html select:disabled,
      html textarea:disabled,
      html [style*="cursor:not-allowed"],
      html [style*="cursor: not-allowed"] {
        cursor: ${c["not-allowed"]} !important;
      }

      html [style*="cursor:crosshair"],
      html [style*="cursor: crosshair"] { cursor: ${c.crosshair} !important; }

      html [style*="cursor:grab"],
      html [style*="cursor: grab"]     { cursor: ${c.grab} !important; }

      html [style*="cursor:grabbing"],
      html [style*="cursor: grabbing"] { cursor: ${c.grabbing} !important; }

      html [style*="cursor:move"],
      html [style*="cursor: move"]     { cursor: ${c.move} !important; }
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
    palette: `<svg viewBox="0 0 24 24"><circle cx="6.5" cy="11.5" r="1.5"/><circle cx="9.5" cy="7.5" r="1.5"/><circle cx="14.5" cy="7.5" r="1.5"/><circle cx="17.5" cy="11.5" r="1.5"/><path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10 1.1 0 2-.9 2-2 0-.53-.19-1.01-.5-1.38-.31-.37-.5-.85-.5-1.37 0-1.1.9-2 2-2h2.36c3.09 0 5.64-2.55 5.64-5.64C22 6.22 17.52 2 12 2z"/></svg>`,
    image: `<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
    font: `<svg viewBox="0 0 24 24"><path d="M4 20h4l8-12-4-3-8 15z"/><path d="M13.5 6.5l4 3"/></svg>`,
    zoomin: `<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`,
    zoomout: `<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`,
    reset: `<svg viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.96"/></svg>`,
    textColor: `<svg viewBox="0 0 24 24"><path d="M4 20h4l8-12-4-3-8 15z"/><path d="M2 22h20" stroke-width="2.5"/></svg>`,
    bgColor: `<svg viewBox="0 0 24 24"><path d="M20 11a8 8 0 1 0-16 0c0 4.42 7 11 8 11s8-6.58 8-11z"/></svg>`,
    xMark: `<svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>`,
  };

  /* ─── Build panel HTML ─── */
  function toggleRow(key, label, iconKey) {
    const on = settings[key] === true || settings[key] === "large";
    return `
      <button class="__a11y-row${on ? " __a11y-on" : ""}"
        data-key="${key}"
        role="switch"
        aria-checked="${on}"
        aria-label="${label}: ${on ? "on" : "off"}">
        <span class="__a11y-row-label" aria-hidden="true">${
          icons[iconKey] || ""
        }${label}</span>
        <div class="__a11y-toggle" aria-hidden="true"></div>
      </button>`;
  }

  function colorRow(key, label, iconKey, defaultVal) {
    const val = settings[key] || defaultVal;
    const isSet = !!settings[key];
    const rowId = `__a11y-color-${key}`;
    return `
      <div class="__a11y-color-row" role="group" aria-labelledby="${rowId}-lbl">
        <span class="__a11y-color-label" id="${rowId}-lbl">${
      icons[iconKey] || ""
    }${label}</span>
        <div class="__a11y-color-input-wrap">
          <div class="__a11y-color-swatch" title="Choose ${label.toLowerCase()}">
            <div class="__a11y-swatch-fill" style="background:${val}" aria-hidden="true"></div>
            <input type="color" value="${val}" data-color-key="${key}"
              aria-label="Choose ${label.toLowerCase()}, current value ${val}">
          </div>
          ${
            isSet
              ? `<button class="__a11y-color-reset-btn" data-color-clear="${key}"
                 aria-label="Reset ${label.toLowerCase()} to default">${
                  icons.xMark
                }</button>`
              : ""
          }
        </div>
      </div>`;
  }

  function buildPanel() {
    return `
      <div class="__a11y-header">
        <h2 id="__a11y-dialog-title">${icons.accessibility}Accessibility</h2>
        <button class="__a11y-close" id="__a11y-close" aria-label="Close accessibility panel">
          ${icons.close}
        </button>
      </div>
      <div class="__a11y-body">

        <div role="group" aria-label="Text size, currently ${
          settings.fontSize
        }%">
          <div class="__a11y-section-label" aria-hidden="true">Text size — ${
            settings.fontSize
          }%</div>
          <div class="__a11y-font-row">
            <button class="__a11y-font-btn" id="__a11y-dec" aria-label="Decrease text size">${
              icons.zoomout
            }</button>
            <div class="__a11y-font-display" aria-live="polite" aria-atomic="true" aria-hidden="true">${
              settings.fontSize
            }%</div>
            <button class="__a11y-font-btn" id="__a11y-inc" aria-label="Increase text size">${
              icons.zoomin
            }</button>
          </div>
        </div>

        <div role="group" aria-labelledby="__a11y-lbl-cursor">
          <div class="__a11y-section-label" id="__a11y-lbl-cursor" aria-hidden="true">Cursor</div>
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

        <div role="group" aria-labelledby="__a11y-lbl-visual">
          <div class="__a11y-section-label" id="__a11y-lbl-visual" aria-hidden="true">Visual</div>
          ${toggleRow("highContrast", "High contrast", "contrast")}
          ${toggleRow("invertColors", "Invert colors", "eye")}
          ${toggleRow("grayscale", "Grayscale", "contrast")}
          ${toggleRow("hideImages", "Hide images", "image")}
        </div>

        <div role="group" aria-labelledby="__a11y-lbl-colors">
          <div class="__a11y-section-label" id="__a11y-lbl-colors" aria-hidden="true">Colors</div>
          ${colorRow("bgColor", "Page background", "bgColor", "#ffffff")}
          ${colorRow("textColor", "Text color", "textColor", "#000000")}
        </div>

        <div role="group" aria-labelledby="__a11y-lbl-content">
          <div class="__a11y-section-label" id="__a11y-lbl-content" aria-hidden="true">Content</div>
          ${toggleRow("textSpacing", "More text spacing", "type")}
          ${toggleRow("readableFont", "Readable font", "font")}
        </div>

        <button class="__a11y-reset" id="__a11y-reset">
          ${icons.reset} Reset all settings
        </button>
        <div class="__a11y-footer">
        <a href="https://www.henryodunsi.com/" target="_blank" rel="noopener noreferrer">
          Built by Henry Odunsi
        </a>
        </div>
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

    document.body.style.backgroundColor = settings.bgColor || "";
    document.body.style.color = settings.textColor || "";

    applyCustomCursors();
  }

  /* ─── Render panel ─── */
  function renderPanel() {
    panel.innerHTML = buildPanel();

    document.getElementById("__a11y-close").onclick = () => closePanel();
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

  /* ─── Focus trap — WCAG 2.1.2 No Keyboard Trap ─── */
  const FOCUSABLE_SELECTORS = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ].join(", ");

  function getFocusableEls() {
    return Array.from(panel.querySelectorAll(FOCUSABLE_SELECTORS)).filter(
      (el) => el.offsetParent !== null && !el.closest("[hidden]")
    );
  }

  function trapFocus(e) {
    if (!panelOpen || e.key !== "Tab") return;
    const focusable = getFocusableEls();
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (
        document.activeElement === first ||
        !panel.contains(document.activeElement)
      ) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (
        document.activeElement === last ||
        !panel.contains(document.activeElement)
      ) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  /* ─── Open / close ─── */
  function openPanel() {
    panelOpen = true;
    panel.style.display = "block";
    launcher.setAttribute("aria-expanded", "true");
    renderPanel();
    requestAnimationFrame(() => {
      const first = getFocusableEls()[0];
      if (first) first.focus();
    });
  }

  function closePanel() {
    panelOpen = false;
    panel.style.display = "none";
    launcher.setAttribute("aria-expanded", "false");
    /* Return focus to trigger — WCAG 2.4.3 Focus Order ✓ */
    launcher.focus();
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

  /* ─── Mount ─── */
  const launcher = document.createElement("button");
  launcher.id = "__a11y-launcher";
  launcher.setAttribute("aria-label", "Open accessibility options");
  launcher.setAttribute("aria-expanded", "false");
  launcher.setAttribute("aria-haspopup", "dialog");
  launcher.innerHTML = icons.accessibility;
  launcher.onclick = () => (panelOpen ? closePanel() : openPanel());

  const panel = document.createElement("div");
  panel.id = "__a11y-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");
  panel.setAttribute("aria-labelledby", "__a11y-dialog-title");
  panel.style.display = "none";

  document.body.appendChild(launcher);
  document.body.appendChild(panel);

  /* Close on outside click */
  document.addEventListener("click", (e) => {
    if (panelOpen && !panel.contains(e.target) && e.target !== launcher) {
      closePanel();
    }
  });

  /* Escape closes; Tab is trapped inside dialog */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panelOpen) closePanel();
    trapFocus(e);
  });
})();
