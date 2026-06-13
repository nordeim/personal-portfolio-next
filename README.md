# Nicholas Yun — "The Engineered Soul" (v2.0)

[![Framework](https://img.shields.io/badge/Framework-Next.js%2016-black?logo=next.js)](https://nextjs.org/)
[![Styling](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-blue?logo=tailwind-css)](https://tailwindcss.com/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%20%2B%20Drizzle-336791?logo=postgresql)](https://orm.drizzle.team/)

An avant-garde digital installation balancing **Tactile Brutalism** with **High-End Editorial** design. This project is a meticulous port of the Nicholas Yun portfolio from a Vite SPA to the **Next.js 16 App Router**, preserving architectural integrity and design fidelity.

## 🧠 Overview
- **The Problem**: Transitioning a highly interactive, kinetic Vite SPA to a server-rendered Next.js environment without losing performance or design precision.
- **The Solution**: A Client-Side SPA Orchestrator model embedded within the Next.js App Router, utilizing hash-based routing and static TypeScript data ingestion to maintain the original "digital installation" feel.

## 🛠️ Tech Stack
| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js | 16.2.6 | App Router, Server Components |
| **Runtime** | React | 19.2.6 | UI Library |
| **Styling** | Tailwind CSS | 4.1.17 | CSS-first utility styling |
| **Database** | PostgreSQL | 17+ | Persistent storage (optional) |
| **ORM** | Drizzle | 0.45.2 | Type-safe database management |
| **Language** | TypeScript | 5.9.3 | Type safety |

## 🎨 Design System
- **Core Aesthetic**: Tactile Brutalism (Zero border-radius, visible grids).
- **Mathematical Grid**: 28px visible background grid governing all spacing.
- **Typography Hierarchy**:
  - **Editorial**: *Cormorant Garamond* — Heading/Narrative.
  - **Utility**: *IBM Plex Mono* — Labels/Machine Mode.
  - **Body**: *Inter* — General content.
- **Dual Theme**: High-contrast "Night" (Dark) and warm "Day" (Cream) modes.

## 📂 File Hierarchy
- `📂 src/app/` — Next.js entry points, global design system.
- `📂 src/components/` — Modular brutalist UI components (BentoGrid, HeroKinetic, etc.).
- `📂 src/hooks/` — Custom interaction logic (Velocity scroll, hash routing).
- `📂 src/lib/` — Static content arrays and TypeScript interfaces.
- `📂 src/db/` — Drizzle schema and database configuration.

## 🚀 Quick Start
### Prerequisites
- Node.js ≥ 20
- PostgreSQL (for database-dependent features)

### Installation
```bash
npm install
cp .env.example .env  # Configure your database URL
```

### Development
```bash
npm run dev
```

### Verification
```bash
npm run lint       # ESLint check
npm run typecheck  # TypeScript validation
```

## 📊 Project Status
| Phase | Status | Key Deliverables |
| :--- | :--- | :--- |
| **0: Design System** | ✅ Complete | globals.css, theme configuration |
| **1: Core Logic** | ✅ Complete | Hooks (useRouteHash, useWeightedScroll) |
| **2: Components** | ✅ Complete | 16+ brutalist UI components |
| **3: Data Layer** | ✅ Complete | Static content arrays, Drizzle schema |
| **4: Orchestration** | ⏳ In Progress | `PortfolioApp.tsx` integration |
| **5: Entry Point** | ⏳ In Progress | Updating `src/app/page.tsx` |

## 🧪 Testing
- **Command**: `npm test` (TDD preferred)
- **Convention**: Test behavior over implementation; use mocks for DB operations.

## 📝 License
Proprietary — All rights reserved.
