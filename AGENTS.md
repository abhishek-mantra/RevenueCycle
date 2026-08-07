# MantraCare RCM — Developer Agents Guide (v1)

This project directory is fully built and verified from scratch adhering strictly to `docs/*`.

## Quick Reference Links

| # | Document | Scope & Purpose | Status |
|---|---|---|---|
| 1 | `docs/01-vision.md` | Product Context, Non-Negotiable Governance, History of Failures | Locked |
| 2 | `docs/02-prd.md` | PRD Scope Bible — Modules §8.0 to §8.8 | Fully Built |
| 3 | `docs/03-design.md` | Monochrome Neumorphism + Glassmorphism system, radii, motion | Fully Built |
| 4 | `docs/04-build.md` | Stack decision (§2), Route Inventory (§6), Milestone Build Order (§7) | Milestones 1–8 Complete |
| 5 | `docs/05-qa.md` | Verification Rules & Anti-Slop Checklist | Passed 100% |

---

## Technical Stack (Recorded per `docs/04-build.md` §2)

* **Core**: React 19 + Next.js 15.5 (App Router) + TypeScript.
* **Styling**: Tailwind CSS v4 + Vanilla CSS Design Tokens (`src/styles/globals.css`).
* **Material System**: Light Monochrome Neumorphism (Soft-extrude cards & inset wells) + Glassmorphism Chrome backdrop blur (`glass-panel` / `glass-chrome`).
* **Icons & UI Primitives**: Lucide React + custom restyled UI primitives (`Button`, `KpiCard`, `StatusBadge`, `DataTable`, `Input`, `Switch`, `GlassModal`, `BulkActionBar`).
* **State Management**: Zustand (`src/store/useAppStore.ts`) for global role scoping (`"biller"` | `"provider"`).
* **Data Verification**: Zod schemas (`src/schema/*`) for Denial, Claim, Encounter, Patient AR, Invoice, Credentialing, and Analytics entities.
* **Motion & Animation**: Framer Motion spring physics, `AnimatePresence` scale dialogs, and `layoutId` gliding pills.
* **Charts & Analytics**: Recharts responsive stacked bar charts.

---

## Commands

```powershell
# Development server (starts on http://localhost:3000)
npm run dev

# Production build check & static HTML generation
npm run build
```

---

## Non-Negotiable Governance Rules

1. **One visual system, one density.** Role scopes data/nav only (`01` §8.1).
2. **Data flat, body neu, chrome glass.** No exceptions (`03` §1, §12).
3. **Closed palette:** monochrome + one cobalt accent + muted semantics. Never invent colors (`03` §2).
4. **Light mode is the target.** Dark mode out of scope (`04` §10).
5. **Fresh build, zero prior code reuse.** All ~27 inventory routes built fresh in `C:\RCM-V1`.