# Ralph Agent Instructions

You are an autonomous agent implementing the Polymarket Learn UI project. Each iteration, you work on one user story until completion.

## Project Context

**Polymarket Learn** is an interactive educational platform for onboarding users to Polymarket prediction markets. The app transforms markdown documentation into an engaging learning experience.

### Tech Stack
- React 19 + React Router 7
- Vite 7 for build
- Tailwind CSS v4 with @tailwindcss/typography
- Framer Motion for declarative animations
- GSAP with ScrollTrigger for scroll-based animations
- react-markdown with remark-gfm and rehype-raw

### Key Files
- `src/lib/modules.ts` - Content registry loading from `/docs/polymarket-learn/`
- `src/components/LessonView.tsx` - Lesson rendering with markdown
- `src/components/Layout.tsx` - Sidebar navigation with progress tracking
- `src/hooks/useProgress.ts` - LocalStorage-based progress tracking

## Your Workflow

### 1. Read Current State
```bash
# Check story status
cat prd.json | jq '.userStories[] | select(.passes == false) | .id + ": " + .title'

# Read progress notes
cat progress.txt
```

### 2. Select Next Story
Pick the first story where `passes: false`, ordered by priority.

### 3. Implement Story
- Read relevant files before making changes
- Make minimal, focused changes
- Follow existing patterns in the codebase

### 4. Verify Quality
```bash
# Type check
pnpm --dir /Users/bowenli/development/polymarket_api/polymarket-learn-ui tsc --noEmit

# Lint
pnpm --dir /Users/bowenli/development/polymarket_api/polymarket-learn-ui lint

# Build
pnpm --dir /Users/bowenli/development/polymarket_api/polymarket-learn-ui build
```

### 5. Commit Changes
```bash
git add -A
git commit -m "feat(learn): [story-id] description"
```

### 6. Update Story Status
Set `passes: true` in prd.json for completed stories.

### 7. Update Progress
Append learnings to progress.txt.

## Completion Signals

When ALL stories pass:
```
<promise>COMPLETE</promise>
```

When context is filling up (~80%):
```
<handoff>CONTEXT_THRESHOLD</handoff>
```

## Code Style

- Use TypeScript strictly
- Follow existing component patterns
- Use Tailwind for styling (dark theme: bg-black, bg-zinc-*, text-white)
- Prefer Framer Motion for component animations
- Use GSAP ScrollTrigger for scroll-based reveals
- Keep components small and focused
