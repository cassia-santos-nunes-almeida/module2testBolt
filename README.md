# EM&AC Lab -- Module 2: Circuit Analysis

An interactive learning platform for electromagnetics and analog circuit analysis. Built for students taking introductory circuit theory courses.

**Live Demo:** `https://cassia-santos-nunes-almeida.github.io/module2testBolt/`

## What's Inside

| Module | Topics |
|--------|--------|
| **Component Physics** | Resistors, capacitors, inductors -- interactive SVG diagrams that respond to physical parameters |
| **Circuit Analysis** | Time-domain analysis, RC/RL/RLC circuits, differential equations |
| **Laplace Theory** | Laplace transforms, partial fractions, inverse transforms |
| **S-Domain Analysis** | Transfer functions, poles & zeros, Bode plots, stability |
| **Interactive Lab** | Circuit simulations with real-time parameter tuning |

## AI Circuit Tutor (optional)

The app includes an AI-powered tutor sidebar that can answer circuit analysis questions. It uses the **Google Gemini API** (free tier).

To enable it:
1. Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click the chat icon in the app sidebar
3. Paste your key when prompted

The key is stored only in your browser's local storage -- it is never sent to any server other than Google's API.

## Deploying to GitHub Pages

This repo includes a GitHub Actions workflow that auto-deploys on every push to `main`.

**One-time setup:**
1. Go to your repo on GitHub
2. Navigate to **Settings > Pages**
3. Under **Build and deployment > Source**, select **Deploy from a branch**
4. Under **Branch**, select **gh-pages** / **/ (root)** and click **Save**
5. Push to `main` -- the workflow builds the app and pushes it to the `gh-pages` branch automatically

## For Developers

```bash
# Install dependencies
npm install

# Start dev server (localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

### Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- KaTeX (math rendering)
- Recharts (data visualization)
- Google Generative AI (optional, for AI tutor)
