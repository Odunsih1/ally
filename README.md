# Ally — Accessibility Launcher

A lightweight, zero-dependency accessibility widget you can drop into any website with a single `<script>` tag. No frameworks, no build step required on the consumer side.

![Version](https://img.shields.io/badge/version-1.0.1-blue) ![License](https://img.shields.io/badge/license-MIT-green)

---

## Features

- Font size adjustment
- Large cursor toggle
- High contrast mode
- Invert colors
- Grayscale mode
- Hide images
- Increased text spacing
- Readable font toggle
- Reset all settings

---

## Usage

### Any HTML site
```html
<script src="https://cdn.jsdelivr.net/gh/Odunsih1/ally@v1.0.1/accessibility-launcher.v1.0.1.min.js" defer></script>
```

### Next.js / React
Add this inside your root layout `<body>`:
```tsx
<script
  src="https://cdn.jsdelivr.net/gh/Odunsih1/ally@v1.0.1/accessibility-launcher.v1.0.1.min.js"
  defer
/>
```

### Angular
Add to the `scripts` array in `angular.json`:
```json
"scripts": [
  "https://cdn.jsdelivr.net/gh/Odunsih1/ally@v1.0.1/accessibility-launcher.v1.0.1.min.js"
]
```
Or directly in `index.html`:
```html
<script
  src="https://cdn.jsdelivr.net/gh/Odunsih1/ally@v1.0.1/accessibility-launcher.v1.0.1.min.js"
  defer>
</script>
```

### Vue
In your `public/index.html`:
```html
<script
  src="https://cdn.jsdelivr.net/gh/Odunsih1/ally@v1.0.1/accessibility-launcher.v1.0.1.min.js"
  defer>
</script>
```
Or programmatically in `main.js` / `main.ts`:
```js
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/gh/Odunsih1/ally@v1.0.1/accessibility-launcher.v1.0.1.min.js';
script.defer = true;
document.body.appendChild(script);
```

### Browser console (for testing)
```js
var s = document.createElement('script');
s.src = 'https://cdn.jsdelivr.net/gh/Odunsih1/ally@v1.0.1/accessibility-launcher.v1.0.1.min.js';
document.body.appendChild(s);
```

---

## npm

### Install
```bash
npm i @odunsih/ally
```

### Any HTML site
After installing, copy the script from `node_modules` into your project and reference it:
```html
<script src="node_modules/@odunsih/ally/accessibility-launcher.min.js" defer></script>
```

### Next.js / React
```tsx
// In your root layout or _app.tsx
<script
  src="https://cdn.jsdelivr.net/gh/Odunsih1/ally@v1.0.1/accessibility-launcher.v1.0.1.min.js"
  defer
/>
```
Or import it directly in your entry file:
```js
import '@odunsih/ally';
```

### Angular
In `angular.json`, reference the package from `node_modules`:
```json
"scripts": [
  "node_modules/@odunsih/ally/accessibility-launcher.min.js"
]
```

### Vue
In `main.js` / `main.ts`:
```js
import '@odunsih/ally';
```

---

## Accessibility Note

Ally enhances accessibility but does not replace proper semantic HTML,
ARIA usage, and inclusive design practices.

## Why Ally?

Unlike heavy accessibility overlays, Ally is:

- Lightweight (no dependencies)
- Developer-friendly (fully transparent)
- Non-intrusive (no DOM hijacking)
- Privacy-safe (no tracking, no external APIs)

Ally does NOT claim to make your site fully WCAG compliant. It provides user-controlled accessibility enhancements.

## Contributing

Contributions are welcome and appreciated! Here's how to get started:

### 1. Fork the repo
Click the **Fork** button at the top right of this page.

### 2. Clone your fork
```bash
git clone https://github.com/Odunsih1/ally.git
cd ally
```

### 3. Make your changes
Edit `accessibility-launcher.js` — this is the main source file. Keep changes focused and avoid adding external dependencies.

### 4. Minify before submitting
```bash
npm install -g terser
terser accessibility-launcher.js -o accessibility-launcher.min.js --compress --mangle
```

### 5. Open a Pull Request
Push your changes to your fork and open a PR against the `main` branch. Include a clear description of what you changed and why.

---

## Versioning

This project follows [Semantic Versioning](https://semver.org):

- `patch` (1.0.**x**) — bug fixes
- `minor` (1.**x**.0) — new features, backwards compatible
- `major` (**x**.0.0) — breaking changes

---

## License

MIT — free to use in personal and commercial projects.