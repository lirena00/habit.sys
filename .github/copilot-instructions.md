## Here are Instructions for copilot

# 🧾 Copilot Instructions for ZINE UI Hackathon Submission

<!-- ## This project is a **manga-inspired zine-style scroll web app** using **Next.js 15**, **Tailwind CSS v4**, and **GSAP** animations. It is structured for visual storytelling and creative flair. -->

## 📁 Project Structure

src/
├── app/
│ ├── layout.tsx # Root layout for App Router
│ ├── page.tsx # Landing page with GSAP scroll animations
│ └── components/ # All React components used throughout the app
├── styles/
│ └── globals.css # Tailwind base + custom styles
.env # Environment variables
.env.example # Template for .env

---

## 📦 Tech Stack

- **Next.js 15 (App Router)** + TypeScript
- **Tailwind CSS v4**
- **GSAP (ScrollTrigger, ScrollSmoother, Draggable plugins)**
- **pnpm** for dependency management
- **Dark theme** with:
  - `primary` → blue (`#1e90ff`)
  - `secondary` → green (`#00ffb3`)

---

## 🧠 Copilot & GPT Hints

> These ensure Copilot understands your codebase better and avoids hallucinations.

- Use **App Router** (`src/app/`) — avoid the old `pages/` structure.
- Use **Tailwind v4** syntax (`text-balance`, CSS variables, etc.).
- Avoid importing components that don't exist in `components/`.
- Prefer **GSAP timelines** over native CSS for animations.
- Assume plugins like `ScrollTrigger` are already registered globally.
- All assets (manga images/fonts) go in `/public` and are imported via `next/image` or `url()` in CSS.
- Avoid third-party UI libraries — use Tailwind + custom React components only.

---

## 🧩 Styling Rules

- All styling is **Tailwind-first**, backed by `globals.css` for global themes.
- Maintain a **grid/zine-style layout** with scroll reveals.
- Keep accessibility in mind: alt text, readable contrast, semantic markup.
- Use **custom fonts** and Japanese/manga-styled text where needed.

---

## 🔧 Setup

```bash
pnpm install
pnpm dev
```

Ensure:

- Node.js 20+
- `.env` file is configured from `.env.example`

---

## 🎯 Project Goals

- A visually rich, dark-mode **zine interface**
- Panels/pages animated with **GSAP ScrollTrigger**
- Interactive layers, glowing text, manga-like frames
- **Custom cursor effects** and playful interactions
- Emphasis on editorial storytelling — not CRUD

---

## ✅ Must-Have Features

- `layout.tsx`: Base layout with meta tags, custom fonts, theme variables.
- `page.tsx`: GSAP-driven homepage (acts as scroll zine).
<!-- - `components/`: Split into panels/sections (ex: `<ZinePanel>`, `<Header>`, `<ScrollIntro>`, etc.) -->
- Smooth scroll behaviors using `ScrollSmoother`.

---

## 🧪 Best Practices

- Lazy load images via `next/image`.
- Prefer `@/` alias if configured (via `tsconfig.json`) for cleaner imports.
- Avoid adding unnecessary npm packages — keep build size lean.
- Use custom GSAP hooks if animation logic gets complex.

---

## 📤 Deployment

- Deploy on [Vercel](https://vercel.com/) with preview links enabled.
- Add screenshots, walkthrough in `README.md`.

---

## 👤 Author

Made by [Saksham](https://www.lirena.in)
[GitHub](https://github.com/LiReNa00)
[Contact](mailto:saksham@lirena.in)

---
