# EM&AC Lab - Module 2: Circuit Analysis

An interactive learning platform for electromagnetics and analog circuit analysis. Built for students taking introductory circuit theory courses at LUT University.

**Live Demo:** https://cassia-santos-nunes-almeida.github.io/module2testBolt/

## Modules

| Module | Description |
|--------|-------------|
| **Overview** | Learning objectives, guided learning path, and AI tutor introduction |
| **Component Physics** | Interactive exploration of resistors, capacitors, and inductors with adjustable physical parameters, SVG diagrams, and real-time value calculations |
| **Circuit Analysis** | Side-by-side comparison of time-domain differential equation solutions vs. s-domain (Laplace) algebraic methods for RC, RL, and RLC circuits |
| **Laplace Theory** | Transform definition, transform pairs table, key properties, and worked examples |
| **S-Domain Analysis** | Transfer functions, poles and zeros visualization, damping ratios, and stability analysis with interactive pole-zero plots |
| **Interactive Lab** | Real-time circuit simulations with parameter tuning (R, L, C, voltage, duration) supporting step and impulse responses |

## AI Circuit Tutor (optional)

The app includes an AI-powered tutor sidebar that can answer circuit analysis questions. It uses the **Google Gemini API** (free tier) and supports three display modes: closed, docked, and floating.

To enable it:
1. Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click the chat icon in the app sidebar
3. Paste your key when prompted

Your key is stored only in your browser's local storage — it is never sent to any server other than Google's API.

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (localhost:5173)
npm run dev

# Production build (TypeScript check + Vite bundle)
npm run build

# Lint
npm run lint

# Preview production build locally
npm run preview
```

## Tech Stack

- **React 19** + **TypeScript** — UI framework and type safety
- **Vite 7** — Build tool and dev server
- **Tailwind CSS 4** — Utility-first styling with custom `engineering-blue` palette
- **KaTeX** — LaTeX math rendering
- **Recharts** — Charts and data visualization
- **Lucide React** — Icons
- **React Router DOM 7** — Client-side routing
- **Google Generative AI** — Optional AI tutor (Gemini)

## Deployment

This repo includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that auto-deploys to GitHub Pages on every push to `main`.

**Setup:**
1. Go to **Settings > Pages** in your GitHub repo
2. Under **Source**, select **Deploy from a branch**
3. Select **gh-pages** / **/ (root)** and save
4. Push to `main` — the workflow builds and deploys automatically

## License

This project is intended for educational use.
