# Academic Homepage — Design Patterns Reference

This file contains ready-to-use design patterns, code snippets, and creative ideas for building visually distinctive academic homepages.

---

## 1. Hero / Header Patterns

### Pattern A: Split Hero (Photo + Text Side by Side)

```css
.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 80vh;
  align-items: center;
  gap: 4rem;
  padding: 4rem;
}

.hero-photo {
  width: 100%;
  max-width: 400px;
  aspect-ratio: 3/4;
  object-fit: cover;
  border-radius: 2px;
  filter: grayscale(20%);
  transition: filter 0.5s ease;
}

.hero-photo:hover {
  filter: grayscale(0%);
}

@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 2rem;
  }
  .hero-photo {
    max-width: 250px;
    margin: 0 auto;
  }
}
```

### Pattern B: Full-Width Minimal Hero

```css
.hero {
  padding: 12vh 4rem 8vh;
  max-width: 900px;
  margin: 0 auto;
}

.hero h1 {
  font-size: clamp(2.5rem, 6vw, 5rem);
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin-bottom: 1.5rem;
}

.hero .subtitle {
  font-size: clamp(1.1rem, 2vw, 1.4rem);
  opacity: 0.7;
  font-weight: 300;
  max-width: 600px;
}
```

### Pattern C: Editorial Hero with Background Texture

```css
.hero {
  position: relative;
  padding: 15vh 4rem 10vh;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 50%, rgba(var(--accent-rgb), 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(var(--accent-rgb), 0.05) 0%, transparent 40%);
  pointer-events: none;
}

/* Dot grid texture */
.hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px);
  background-size: 24px 24px;
  pointer-events: none;
}
```

### Pattern D: Asymmetric Hero with Accent Bar

```css
.hero {
  display: grid;
  grid-template-columns: 6px 1fr;
  gap: 3rem;
  padding: 10vh 4rem;
  max-width: 1000px;
  margin: 0 auto;
}

.hero-accent-bar {
  background: var(--accent);
  border-radius: 3px;
  height: 100%;
}
```

---

## 2. Navigation Patterns

### Minimal Sticky Nav

```css
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 1rem 2rem;
  backdrop-filter: blur(12px);
  background: rgba(var(--bg-rgb), 0.85);
  border-bottom: 1px solid rgba(var(--text-rgb), 0.08);
  transition: box-shadow 0.3s ease;
}

.nav.scrolled {
  box-shadow: 0 1px 20px rgba(0,0,0,0.08);
}

.nav-links {
  display: flex;
  gap: 2rem;
  list-style: none;
  justify-content: center;
}

.nav-links a {
  text-decoration: none;
  color: var(--text);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.nav-links a:hover,
.nav-links a.active {
  opacity: 1;
}
```

### Side Navigation (for single-page academic sites)

```css
.side-nav {
  position: fixed;
  left: 2rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 100;
}

.side-nav a {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--text);
  opacity: 0.2;
  transition: all 0.3s ease;
}

.side-nav a.active {
  opacity: 1;
  transform: scale(1.5);
  background: var(--accent);
}

@media (max-width: 1200px) {
  .side-nav { display: none; }
}
```

---

## 3. Research Interest Tags

### Pill Tags with Hover Effect

```css
.interests {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.tag {
  display: inline-block;
  padding: 0.4rem 1.2rem;
  border: 1px solid rgba(var(--accent-rgb), 0.3);
  border-radius: 100px;
  font-size: 0.85rem;
  color: var(--accent);
  transition: all 0.3s ease;
  cursor: default;
}

.tag:hover {
  background: var(--accent);
  color: var(--bg);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--accent-rgb), 0.3);
}
```

### Underline Tags (More Editorial)

```css
.tag {
  display: inline-block;
  padding: 0.2rem 0;
  font-size: 0.9rem;
  color: var(--text);
  border-bottom: 2px solid var(--accent);
  margin-right: 1.5rem;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
}

.tag:hover {
  color: var(--accent);
}
```

---

## 4. Publication Patterns

### Pattern A: Elegant Timeline

```css
.publications {
  position: relative;
  padding-left: 3rem;
}

.publications::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(to bottom, transparent, var(--accent), var(--accent), transparent);
}

.pub-year {
  position: relative;
  margin: 3rem 0 1.5rem;
  font-size: 1.5rem;
  font-family: var(--font-display);
  color: var(--accent);
}

.pub-year::before {
  content: '';
  position: absolute;
  left: -3rem;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--accent);
}

.pub-item {
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.pub-item:hover {
  background: rgba(var(--accent-rgb), 0.05);
}

.pub-title {
  font-weight: 600;
  font-size: 1.05rem;
  margin-bottom: 0.4rem;
  line-height: 1.4;
}

.pub-authors {
  font-size: 0.9rem;
  opacity: 0.7;
  margin-bottom: 0.3rem;
}

.pub-authors .me {
  font-weight: 700;
  opacity: 1;
  color: var(--accent);
}

.pub-venue {
  font-size: 0.85rem;
  font-style: italic;
  opacity: 0.6;
}

.pub-links {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.pub-links a {
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border: 1px solid var(--accent);
  border-radius: 4px;
  color: var(--accent);
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.3s ease;
}

.pub-links a:hover {
  background: var(--accent);
  color: var(--bg);
}
```

### Pattern B: Compact Academic List

```css
.pub-item {
  padding: 1rem 0;
  border-bottom: 1px solid rgba(var(--text-rgb), 0.08);
}

.pub-item:last-child {
  border-bottom: none;
}

.pub-number {
  font-family: var(--font-mono, monospace);
  font-size: 0.75rem;
  opacity: 0.4;
  margin-bottom: 0.25rem;
}

.pub-title {
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
}

.pub-meta {
  font-size: 0.85rem;
  opacity: 0.6;
  margin-top: 0.25rem;
}
```

### Pattern C: Featured Publication Card

```css
.featured-pub {
  padding: 2rem;
  border: 1px solid rgba(var(--accent-rgb), 0.2);
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(var(--accent-rgb), 0.03), transparent);
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
}

.featured-pub::before {
  content: 'Featured';
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--accent);
  opacity: 0.8;
}

.featured-pub .pub-title {
  font-size: 1.25rem;
  font-family: var(--font-display);
  margin-bottom: 0.75rem;
}

.featured-pub .pub-abstract {
  font-size: 0.9rem;
  line-height: 1.7;
  opacity: 0.7;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(var(--text-rgb), 0.1);
}
```

---

## 5. Section Dividers

### Geometric Line

```css
.section-divider {
  width: 60px;
  height: 3px;
  background: var(--accent);
  margin: 4rem 0;
  border: none;
}
```

### Fading Line

```css
.section-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, var(--accent), transparent);
  border: none;
  margin: 5rem auto;
  max-width: 300px;
}
```

### Section Heading with Number

```css
.section-heading {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.section-number {
  font-family: var(--font-display);
  font-size: 3rem;
  opacity: 0.1;
  font-weight: 700;
  line-height: 1;
}

.section-title {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--accent);
}
```

---

## 6. Dark Mode Toggle

```html
<button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle dark mode">
  <svg class="sun-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="5"/>
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
  </svg>
  <svg class="moon-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>
</button>
```

```css
.theme-toggle {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 200;
  background: rgba(var(--text-rgb), 0.08);
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  cursor: pointer;
  display: grid;
  place-items: center;
  color: var(--text);
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  background: rgba(var(--text-rgb), 0.15);
  transform: rotate(30deg);
}

[data-theme="light"] .moon-icon { display: none; }
[data-theme="dark"] .sun-icon { display: none; }
```

```javascript
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}

// Respect system preference, allow override
(function() {
  const saved = localStorage.getItem('theme');
  const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', saved || preferred);
})();
```

---

## 7. Social / Academic Link Icons (Inline SVG)

All icons use `currentColor` for theme adaptation. Keep viewBox="0 0 24 24".

```html
<!-- Email -->
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
</svg>

<!-- GitHub -->
<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
</svg>

<!-- Google Scholar -->
<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
  <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/>
</svg>

<!-- Twitter/X -->
<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
</svg>

<!-- ORCID -->
<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378a.87.87 0 110 1.74.87.87 0 010-1.74zm-.869 3.166h1.738v11.17H6.5V7.544zm3.726 0h4.695c3.376 0 5.61 2.313 5.61 5.593 0 3.281-2.234 5.577-5.61 5.577h-4.695V7.544zm1.738 1.58v8.01h2.957c2.423 0 3.87-1.667 3.87-3.997 0-2.33-1.447-4.013-3.87-4.013h-2.957z"/>
</svg>

<!-- LinkedIn -->
<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
</svg>
```

---

## 8. Background Textures

### Noise Texture (CSS only)

```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 9999;
}
```

### Grid Pattern

```css
.grid-bg {
  background-image:
    linear-gradient(rgba(var(--text-rgb), 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(var(--text-rgb), 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
}
```

---

## 9. News / Updates Timeline

```css
.news-list {
  list-style: none;
  padding: 0;
}

.news-item {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 1.5rem;
  padding: 1.25rem 0;
  border-bottom: 1px solid rgba(var(--text-rgb), 0.06);
  align-items: baseline;
}

.news-date {
  font-size: 0.8rem;
  font-family: var(--font-mono, monospace);
  opacity: 0.4;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.news-content {
  font-size: 0.95rem;
  line-height: 1.6;
}

.news-badge {
  display: inline-block;
  padding: 0.15rem 0.5rem;
  font-size: 0.7rem;
  border-radius: 3px;
  background: rgba(var(--accent-rgb), 0.1);
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-right: 0.5rem;
  vertical-align: middle;
}

@media (max-width: 640px) {
  .news-item {
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }
}
```

---

## 10. Contact Section

### Minimal Contact

```css
.contact {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: center;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text);
  text-decoration: none;
  opacity: 0.7;
  transition: opacity 0.3s ease, color 0.3s ease;
}

.contact-item:hover {
  opacity: 1;
  color: var(--accent);
}

.contact-item svg {
  flex-shrink: 0;
}
```

---

## 11. Scroll-Triggered Animation (Minimal JS)

```javascript
// Intersection Observer for scroll animations — under 15 lines
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
```

```css
.animate-on-scroll {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.animate-on-scroll.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger children */
.animate-on-scroll:nth-child(2) { transition-delay: 0.1s; }
.animate-on-scroll:nth-child(3) { transition-delay: 0.2s; }
.animate-on-scroll:nth-child(4) { transition-delay: 0.3s; }
```

---

## 12. Print Styles

```css
@media print {
  body {
    font-size: 11pt;
    color: #000;
    background: #fff;
  }

  .theme-toggle,
  .side-nav,
  nav,
  .no-print {
    display: none !important;
  }

  a {
    color: #000;
    text-decoration: underline;
  }

  a[href]::after {
    content: " (" attr(href) ")";
    font-size: 0.8em;
    opacity: 0.6;
  }

  .pub-links a[href]::after {
    content: none; /* Too noisy for publication links */
  }

  section {
    page-break-inside: avoid;
  }
}
```

---

## 13. Color Palette Recipes

### Warm Terracotta

```css
:root, [data-theme="light"] {
  --bg: #faf6f1;
  --bg-rgb: 250, 246, 241;
  --text: #2d2420;
  --text-rgb: 45, 36, 32;
  --accent: #c45d3e;
  --accent-rgb: 196, 93, 62;
  --muted: #8a7b72;
}

[data-theme="dark"] {
  --bg: #1a1412;
  --bg-rgb: 26, 20, 18;
  --text: #e8ddd5;
  --text-rgb: 232, 221, 213;
  --accent: #e07a5f;
  --accent-rgb: 224, 122, 95;
  --muted: #8a7b72;
}
```

### Cool Sage

```css
:root, [data-theme="light"] {
  --bg: #f4f7f4;
  --bg-rgb: 244, 247, 244;
  --text: #1a2420;
  --text-rgb: 26, 36, 32;
  --accent: #4a7c6f;
  --accent-rgb: 74, 124, 111;
  --muted: #6b8a7e;
}

[data-theme="dark"] {
  --bg: #0f1612;
  --bg-rgb: 15, 22, 18;
  --text: #d5e0da;
  --text-rgb: 213, 224, 218;
  --accent: #6aad99;
  --accent-rgb: 106, 173, 153;
  --muted: #6b8a7e;
}
```

### Deep Ink

```css
:root, [data-theme="light"] {
  --bg: #f0ece6;
  --bg-rgb: 240, 236, 230;
  --text: #1a1a2e;
  --text-rgb: 26, 26, 46;
  --accent: #4a4078;
  --accent-rgb: 74, 64, 120;
  --muted: #6e6b80;
}

[data-theme="dark"] {
  --bg: #0e0e1a;
  --bg-rgb: 14, 14, 26;
  --text: #d8d5e0;
  --text-rgb: 216, 213, 224;
  --accent: #8b7fc7;
  --accent-rgb: 139, 127, 199;
  --muted: #6e6b80;
}
```

### Golden Academic

```css
:root, [data-theme="light"] {
  --bg: #faf8f3;
  --bg-rgb: 250, 248, 243;
  --text: #26231e;
  --text-rgb: 38, 35, 30;
  --accent: #b8860b;
  --accent-rgb: 184, 134, 11;
  --muted: #7a7468;
}

[data-theme="dark"] {
  --bg: #141210;
  --bg-rgb: 20, 18, 16;
  --text: #e0dcd4;
  --text-rgb: 224, 220, 212;
  --accent: #d4a530;
  --accent-rgb: 212, 165, 48;
  --muted: #7a7468;
}
```

### Midnight Teal

```css
:root, [data-theme="light"] {
  --bg: #f2f6f7;
  --bg-rgb: 242, 246, 247;
  --text: #1a2830;
  --text-rgb: 26, 40, 48;
  --accent: #1a7a7a;
  --accent-rgb: 26, 122, 122;
  --muted: #5a7a80;
}

[data-theme="dark"] {
  --bg: #0a1418;
  --bg-rgb: 10, 20, 24;
  --text: #cddee4;
  --text-rgb: 205, 222, 228;
  --accent: #3ac5c5;
  --accent-rgb: 58, 197, 197;
  --muted: #5a7a80;
}
```

---

## 14. Favicon from Initials

```javascript
// Generate inline SVG favicon from initials
function setFavicon(initials, bgColor, textColor) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <rect width="64" height="64" rx="12" fill="${bgColor}"/>
    <text x="32" y="40" font-family="system-ui, sans-serif" font-size="26" font-weight="700"
      fill="${textColor}" text-anchor="middle">${initials}</text>
  </svg>`;
  const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.rel = 'icon';
  link.href = 'data:image/svg+xml,' + encodeURIComponent(svg);
  document.head.appendChild(link);
}
```
