# 👗 Jiya Collections — Modern Modestwear & Fashion Platform

<p align="center">
  <img src="public/hero.jpg" alt="Jiya Collections Banner" width="100%" style="border-radius: 12px; max-height: 420px; object-fit: cover;" />
</p>

<p align="center">
  <strong>Thoughtful modestwear, cut in Pakistan and crafted to move with the rhythm of everyday life.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Oxlint-Linter-orange?style=for-the-badge&logo=rust&logoColor=white" alt="Oxlint" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</p>

---

## 🌟 Overview

**Jiya Collections** is a single-brand, Pakistan-first modern fashion & modestwear e-commerce platform designed for elegance, speed, and bespoke customization. Combining ready-to-wear luxury collections (Lawn, Silk, Abayas, Cotton edits) with a dedicated **Bespoke Custom Design Studio** and an integrated **AI Shopping & Styling Assistant**, the platform delivers a high-touch boutique experience on the web.

Built with cutting-edge web technologies (**React 19**, **TypeScript**, and **Vite**), the application boasts lightning-fast performance, zero bloated UI frameworks, and an editorial aesthetic inspired by luxury fashion lookbooks.

---

## ✨ Key Features

### 🛍️ 1. Editorial Storefront
- **Dynamic Catalog:** Browse through *Ready to wear*, *Abayas*, and *New arrivals*.
- **Instant Search & Filters:** Real-time multi-attribute search across product names, color palettes, and fabric materials.
- **Smart Sorting:** Sort collections seamlessly by *Recommended*, *Price (Low to High / High to Low)*, or *Newest*.
- **Interactive Shopping Bag & Wishlist:** Real-time local state management for quick adds, quantity updates, and saved pieces.

### 🤖 2. Grounded AI Stylist & Shopping Assistant ("Jiya")
- Context-aware virtual shopping companion to guide customers on:
  - **Sizing Guidance:** Recommends exact fits based on measurements, height, and personal fit preferences.
  - **Occasion Styling:** Festive, bridal, office, and everyday modest styling suggestions.
  - **Fabric & Care Advice:** Detailed fabric composition breakdown (e.g., Pure Lawn, Silk blend, Cotton Net).

### ✂️ 3. Bespoke Custom Design Studio
- Dedicated client portal for personalized tailoring and couture orders.
- Customers can submit their custom styling concepts, measurements, fabric selections, and special instructions directly to the in-house design team.

### 📊 4. Integrated Operations & Admin Suite
Built-in administration control panel with dedicated management tabs:
- **Overview:** Live store performance metrics and recent activity feeds.
- **Product Catalog Management:** Real-time price, stock, and status updates, plus new product onboarding.
- **Order Processing:** Track orders, payment verification, and fulfillment stages.
- **Customer Insights:** Manage customer records, VIP tiers, and purchase history.
- **Promotions & Discounts:** Configure seasonal discount codes and VIP loyalty perks.
- **Logistics & Shipping:** City-wise delivery fee controls tailored for Pakistan courier dispatch.
- **Brand & Store Settings:** Live customizable brand attributes, announcements, and AI greetings.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Framework** | [React 19](https://react.dev/) | Modern concurrent UI architecture with Hooks |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Strict static typing for enterprise robustness |
| **Bundler / Tooling** | [Vite 8](https://vitejs.dev/) | Instant Hot Module Replacement (HMR) & lean bundling |
| **Styling** | Vanilla CSS (Modern Design Tokens) | Custom fluid typography, glassmorphism, responsive grid |
| **Code Quality** | [Oxlint](https://oxc.rs/) | High-performance Rust-based static code linter |

---

## 📁 Project Architecture & Structure

```text
jiya-collections/
├── docs/                       # Comprehensive Product & Technical Specs
│   ├── PRD.md                  # Product Requirements & Acceptance Criteria
│   ├── ARCHITECTURE.md         # Full System Design & Boundaries
│   ├── DATA_MODEL.md           # Database Schemas & Entity Relationships
│   ├── API_SPEC.md             # Complete REST/GraphQL Endpoints Specification
│   ├── AI_CUSTOM_DESIGN.md     # AI Stylist Architecture & Custom Design flows
│   ├── ADMIN_PANEL.md          # Admin Procedures, Roles & Permissions
│   ├── USER_FLOWS.md           # Customer, Checkout & Return Journeys
│   ├── SECURITY.md             # Auth, Verified Payments & Abuse Control
│   ├── QA_RELEASE.md           # Quality Assurance & Release Gates
│   ├── ROADMAP.md              # Delivery Phases & Future Milestones
│   └── DECISIONS.md            # Architectural Decision Records (ADR)
├── public/                     # Static media, icons & favicons
├── src/
│   ├── assets/                 # SVGs and branding media
│   ├── App.tsx                 # Core Storefront & Admin Application
│   ├── App.css                 # Curated Design System & Storefront Styles
│   ├── main.tsx                # Application Entrypoint
│   └── index.css               # Global typography & root CSS tokens
├── package.json                # Project dependencies and run scripts
├── tsconfig.json               # TypeScript compiler options
└── vite.config.ts              # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have **Node.js** (v18 or higher recommended) and **npm** installed on your system.

### 1. Clone the repository
```bash
git clone https://github.com/okashaxortlogix/Jiya-Collections.git
cd Jiya-Collections
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173` to experience the storefront.

### 4. Build for production
```bash
npm run build
```

### 5. Lint the project
```bash
npm run lint
```

---

## 📚 Technical Specifications & Documentation

Explore the detailed specifications inside the [`docs/`](./docs) directory:

- 📖 **[Product Requirements Document (PRD)](./docs/PRD.md)** — Core scope, metrics, and business logic.
- 🏗️ **[System Architecture](./docs/ARCHITECTURE.md)** — Microservices, caching, and integration flows.
- 🗄️ **[Data Model & Schema](./docs/DATA_MODEL.md)** — Relational tables, inventory reservations, and indexes.
- 🔌 **[API Specifications](./docs/API_SPEC.md)** — Complete API endpoint contracts.
- 🛡️ **[Security & Payments](./docs/SECURITY.md)** — OTP verification, JazzCash / Easypaisa gateway integrations.

---

## 👤 Author & Maintainer

**Muhammad Okasha**
- GitHub: [@okashaxortlogix](https://github.com/okashaxortlogix)
- Profile: [@muhammadokashapak](https://github.com/muhammadokashapak)

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
