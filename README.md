# MantraCare RCM — Revenue Operations Platform

A modern, high-performance Revenue Cycle Management (RCM) platform built with React 19, Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Framer Motion, and Recharts.

---

## 🌟 Key Features

* **Control Tower & Operations Dashboard**: High-level revenue intelligence, live net collection rates, clean claim rates, and root-cause denial cluster rankings.
* **Denial Management & Root-Cause Groups**: Grouped CARC/RARC denial clusters with timely filing countdowns, batch AI appeal generation, and resolution tracking.
* **Claim Lifecycle & 999 Functional Ack Monitoring**: Touchless EDI 837 submission tracking with real-time clearinghouse acknowledgements.
* **Patient Responsibility & Decoupled AR**: Decoupled patient billing engine that only invoices after real ERA/EOB adjudication.
* **Credentialing & Enrollment Vault**: Payer credentialing lifecycle tracking and EDI/ERA transaction enrollment state machine.
* **Role Scoping**: Instant toggling between **Biller Mode** (full operational access) and **Provider Mode** (filtered practice view).

---

## 🛠️ Tech Stack

* **Framework**: React 19 + Next.js 15.5 (App Router)
* **Language**: TypeScript
* **Styling**: Tailwind CSS v4 + Custom Light Neumorphism & Glassmorphism Design System
* **State Management**: Zustand (`useAppStore`)
* **Data Schemas**: Zod
* **Animations**: Framer Motion
* **Analytics & Charts**: Recharts

---

## 🚀 Getting Started

### Prerequisites
* Node.js v18.0.0 or higher
* npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
# Generate optimized production build
npm run build

# Start production server
npm run start
```

---

## 📁 Repository Structure

```
mantracare-rcm-export/
├── public/                 # Static assets and icons
├── src/
│   ├── app/                # Next.js App Router routes & layouts
│   ├── components/         # UI primitives, layout (Sidebar, Topbar), modals
│   ├── data/               # Mock datasets (Analytics, Claims, Denials, Encounters)
│   ├── schema/             # Zod validation schemas
│   ├── store/              # Zustand global application state
│   └── styles/             # Global CSS design tokens & Neumorphism utilities
├── package.json
├── tsconfig.json
├── next.config.mjs
└── README.md
```

---

## 📄 License
Internal Proprietary — MantraCare RCM.
