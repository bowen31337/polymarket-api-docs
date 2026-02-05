# Polymarket Learn: PRD & Architecture

## 1. Overview

**Polymarket Learn** is an interactive educational platform designed to onboard new users to Polymarket—the world's largest prediction market. The application transforms static markdown documentation into an engaging, immersive learning experience with modern animations, responsive design, and intuitive navigation.

---

## 2. Goals

| Goal | Description |
|------|-------------|
| **Accessibility** | Make prediction market concepts understandable for non-technical users |
| **Engagement** | Use motion design (GSAP, Framer Motion) to create a premium, interactive feel |
| **Completeness** | Cover all 36 documentation files across 5 categories |
| **Discoverability** | Enable search, category browsing, and sequential lesson navigation |
| **Maintainability** | Auto-load markdown files—no manual imports when docs are updated |

---

## 3. Content Structure

All learning content is sourced from `/docs/polymarket-learn/`. The platform dynamically discovers and categorizes files:

### Categories & Lessons (36 total)

```
get-started/          (4 lessons)
├── what-is-polymarket.md
├── how-to-signup.md
├── how-to-deposit.md
└── making-your-first-trade.md

markets/              (4 lessons)
├── how-are-markets-created.md
├── how-are-markets-resolved.md
├── how-are-markets-clarified.md
└── dispute.md

trading/              (9 lessons)
├── limit-orders.md
├── market-orders.md
├── using-the-orderbook.md
├── how-are-prices-calculated.md
├── fees.md
├── no-limits.md
├── holding-rewards.md
├── liquidity-rewards.md
└── maker-rebates-program.md

deposits/             (6 lessons)
├── coinbase.md
├── moonpay.md
├── usdc-on-eth.md
├── large-cross-chain-deposits.md
├── how-to-withdraw.md
└── supported-tokens.md

FAQ/                  (13 lessons)
├── what-are-prediction-markets.md
├── is-polymarket-the-house.md
├── why-do-i-need-crypto.md
├── is-my-money-safe.md
├── sell-early.md
├── geoblocking.md
├── recover-missing-deposit.md
├── how-to-export-private-key.md
├── does-polymarket-have-an-api.md
├── embeds.md
├── polling.md
├── support.md
└── wen-token.md
```

---

## 4. Technical Architecture

### 4.1 High-Level Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser (Client)                        │
├─────────────────────────────────────────────────────────────────┤
│  React 19 + React Router 7                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Landing   │  │   Layout    │  │      LessonView         │  │
│  │   (Hero,    │  │  (Sidebar,  │  │  (Markdown Renderer,    │  │
│  │  Features)  │  │   Search)   │  │   Custom Components)    │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│  Content Engine (modules.ts)                                    │
│  └── Vite import.meta.glob → loads all .md files at build time │
├─────────────────────────────────────────────────────────────────┤
│  Styling: Tailwind CSS v4 + @tailwindcss/typography             │
│  Animations: GSAP ScrollTrigger + Framer Motion                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   /docs/polymarket-learn/**/*.md                │
│                   (Source of Truth for Content)                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Routing Structure

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Landing` | Marketing homepage with Hero, Features, FAQ |
| `/learn` | `Layout` → redirect | Redirects to first lesson |
| `/learn/:category` | `CategoryOverview` | Lists all lessons in a category |
| `/learn/:category/:slug` | `LessonView` | Renders individual lesson content |

---

## 5. Component Architecture

### 5.1 Core Components

| Component | Responsibility |
|-----------|----------------|
| `App.tsx` | Root router configuration |
| `Layout.tsx` | Sidebar navigation + main content outlet |
| `LessonView.tsx` | Markdown rendering + GSAP animations + Next/Prev nav |
| `CategoryOverview.tsx` | Category landing page with lesson cards |
| `Search.tsx` | Full-text search across all lessons |

### 5.2 Landing Page Components

| Component | Responsibility |
|-----------|----------------|
| `Navbar.tsx` | Fixed top navigation with glassmorphism |
| `Hero.tsx` | Animated headline + CTA |
| `FeatureSection.tsx` | Key value propositions grid |
| `HowItWorks.tsx` | Horizontal scroll step-by-step guide |
| `FAQ.tsx` | Accordion-style Q&A |
| `Footer.tsx` | Links and copyright |

### 5.3 Custom Markdown Components

| Tag | Component | Use Case |
|-----|-----------|----------|
| `<note>` | `Note` | Informational callout (blue) |
| `<tip>` | `Tip` | Best practice suggestion (green) |
| `<warning>` | `Warning` | Important caution (yellow) |
| `<videoplayer>` | `VideoPlayer` | Embedded video player |
| `<steps>` | `Steps` | Sequential step container |
| `<step>` | `Step` | Individual step item |

---

## 6. Tech Stack

### Runtime Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | 19.x | UI framework |
| `react-router-dom` | 7.x | Client-side routing |
| `react-markdown` | 10.x | Markdown → React rendering |
| `remark-gfm` | 4.x | GitHub Flavored Markdown support |
| `rehype-raw` | 7.x | HTML-in-markdown support |
| `framer-motion` | 12.x | Declarative animations |
| `gsap` | 3.x | Advanced scroll animations |
| `lucide-react` | Latest | Icon library |
| `tailwind-merge` | 3.x | Utility class merging |
| `clsx` | 2.x | Conditional classnames |

### Build Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `vite` | 7.x | Dev server + bundler |
| `tailwindcss` | 4.x | Utility-first CSS |
| `@tailwindcss/typography` | 0.5.x | Prose styling for markdown |
| `typescript` | 5.9.x | Type safety |

---

## 7. Content Loading System

### `modules.ts` - Dynamic Content Registry

```typescript
// Vite glob import - auto-discovers all markdown files
const modulesGlob = import.meta.glob(
  '../../docs/polymarket-learn/**/*.md', 
  { query: '?raw', import: 'default', eager: true }
);

// Processes each file into a Module object
interface Module {
  path: string;     // Original file path
  category: string; // Parent folder name
  slug: string;     // Filename without extension
  title: string;    // Extracted from first H1 or generated
  content: string;  // Raw markdown content
}
```

**Key Features:**
- Zero manual imports needed
- Add/remove markdown files → automatically reflected in UI
- Title extraction from `# Heading` in markdown
- Category ordering via custom sort

---

## 8. Functional Requirements

### FR-1: Lesson Rendering
- Render markdown content with full GFM support (tables, code blocks, task lists)
- Support custom HTML components via `rehype-raw`
- Apply typography styling for readability

### FR-2: Navigation
- Sidebar with categorized lesson links
- Active state highlighting for current lesson
- Next/Previous buttons for sequential reading
- Category overview pages

### FR-3: Search
- Full-text search across all lesson content
- Real-time results with highlighted matches
- Keyboard navigation (⌘K to open)

### FR-4: Animations
- GSAP ScrollTrigger for scroll-based reveals
- Framer Motion for component transitions
- Smooth page transitions between lessons

### FR-5: Responsive Design
- Mobile-first approach
- Collapsible sidebar on mobile
- Touch-friendly interactions

---

## 9. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| **First Contentful Paint** | < 1.5s |
| **Time to Interactive** | < 3s |
| **Bundle Size (gzip)** | < 300KB |
| **Lighthouse Score** | > 90 (all categories) |
| **Browser Support** | Chrome, Firefox, Safari, Edge (latest 2 versions) |
| **Accessibility** | WCAG 2.1 AA compliant |

---

## 10. File Structure

```
polymarket-learn-ui/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── CategoryOverview.tsx
│   │   ├── FAQ.tsx
│   │   ├── FeatureSection.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Layout.tsx
│   │   ├── LessonView.tsx
│   │   ├── MarkdownComponents.tsx
│   │   ├── Navbar.tsx
│   │   ├── Search.tsx
│   │   ├── TableOfContents.tsx
│   │   └── WelcomeModal.tsx
│   ├── data/
│   │   └── content.ts          # Static content for landing page
│   ├── hooks/
│   │   └── useScrollProgress.ts
│   ├── lib/
│   │   └── modules.ts          # Content registry
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── vite.config.ts
├── package.json
└── tsconfig.json
```

---

## 11. Future Considerations

| Feature | Description | Priority |
|---------|-------------|----------|
| **Progress Tracking** | LocalStorage-based lesson completion tracking | P1 |
| **Dark/Light Mode** | Theme toggle with system preference detection | P2 |
| **Interactive Quizzes** | End-of-lesson comprehension checks | P2 |
| **i18n Support** | Multi-language content support | P3 |
| **PDF Export** | Download lesson as PDF | P3 |
| **API Integration** | Live market data examples | P3 |

---

## 12. Development Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Lint code
pnpm lint
```
