# ServiceFlow — Smart Warranty & After-Sales Service Management System

[![Live Demo on Vercel](https://img.shields.io/badge/Vercel-Live%20Demo-black?logo=vercel)](https://serviceflow-chi-khaki.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Jeevi--06--ui%2Fserviceflow-blue?logo=github)](https://github.com/Jeevi-06-ui/serviceflow)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://serviceflow-chi-khaki.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg)](https://nextjs.org)
[![Vitest](https://img.shields.io/badge/Tests-23%20Passed-emerald.svg)](https://vitest.dev)

> **Live Deployment:** [https://serviceflow-chi-khaki.vercel.app](https://serviceflow-chi-khaki.vercel.app)  
> **GitHub Repository:** [https://github.com/Jeevi-06-ui/serviceflow](https://github.com/Jeevi-06-ui/serviceflow)  
> **Client:** Jeevix Technologies  
> **Frontend Developer Intern:** Kishore R (<kishoreyadhav39@gmail.com>)  
> **Architecture:** Next.js 14 App Router, TypeScript, Tailwind CSS, Versioned Mock REST Repository  

---

## 1. Executive Summary
**ServiceFlow** is a centralized after-sales service and warranty management web application designed for electronics retailers, appliance dealers, manufacturers, and authorized service centers across India. 

The application implements four distinct role-based enterprise portals (Customer, Service Center, Technician, and System Admin), pre-seeded with deterministic Indian enterprise data, standard Indian Rupee (INR ₹) currency formatting, and Asia/Kolkata date handling.

---

## 2. Key Features

- **Customer Self-Service:**
  - Register electronics & appliances with duplicate serial number protection.
  - Digital warranty certificates with QR/barcode simulation and print/save PDF.
  - Dynamic date-based warranty evaluator (Active, Expiring Soon, Expired, Not Yet Active).
  - Doorstep repair booking with preferred date and time windows.
  - Customer estimate approval gate (authorizing or declining paid repairs).
  - 1–5 star post-repair CSAT feedback and review submission.
- **Service Center Dispatch:**
  - Real-time queue triage across 11 lifecycle statuses.
  - Technician assignment with center-scoping and device skill matching.
  - Appointment scheduling with automated conflict clash detection.
  - Itemized repair estimates with 18% GST calculation.
  - Warehouse spare parts catalog with low-stock alerts and non-negative quantity rules.
  - Filtered CSV exports (RFC 4180 compliant).
- **Field Technician Run Sheet:**
  - Daily schedule run sheets with customer addresses and phone numbers.
  - Mandatory technical diagnostic logging before stage progression.
  - Spare parts requisition and Quality Control (QC) submission.
  - Performance scorecard tracking jobs completed, average turnaround, and CSAT rating.
- **Executive Administration & Analytics:**
  - Pan-India operational KPIs across 4 tier-1 service hubs (Bengaluru, Chennai, Hyderabad, Mumbai).
  - Recharts status distribution bar charts and 6-month repair intake volume trends.
  - Non-destructive customer account deactivation preserving historical audit links.
  - Customer complaint escalation and SLA resolution workflow.
  - Printable executive operational audit report.

---

## 3. Technology Stack

- **Framework:** Next.js 14 App Router (React 18, TypeScript 5.5)
- **Styling & Design System:** Tailwind CSS, Lucide React icons, 8px base grid, WCAG AA compliance
- **Data Visualization:** Recharts (Responsive bar and line charts)
- **Mock REST Architecture:** Versioned `localStorage` repository (`serviceflow_v1.4_store`) with SSR safe memory fallback and instant `Reset Demo Data`
- **Testing:** Vitest, Testing Library, JSDOM

---

## 4. Getting Started & Installation

### Prerequisites
- Node.js `v18.17.0` or higher (tested on Node v26)
- npm `v9+` or higher

### Installation Steps
```bash
# Clone the repository
git clone https://github.com/jeevix/serviceflow.git

# Enter project directory
cd serviceflow

# Install stable dependencies
npm install

# Run automated unit test suite
npm run test

# Run TypeScript typecheck
npm run typecheck

# Build optimized production bundle
npm run build

# Start local production server
npm run start
```
Access the application at `http://localhost:3005`.

---

## 5. One-Click Demo Credentials & Roles

| Role | Demo User | Seed Hub / Details | Quick Link |
| :--- | :--- | :--- | :--- |
| **Customer** | Priya Sharma | Bengaluru (`cust-1`) | `/customer/dashboard` |
| **Service Center** | Rajesh Nair | Bengaluru Central Hub (`center-blr-1`) | `/center/dashboard` |
| **Field Technician** | Vikram Verma | Senior Specialist (`tech-1`) | `/technician/dashboard` |
| **System Admin** | Arun Kumar | Operations VP (`usr-admin-1`) | `/admin/dashboard` |

*Switch perspectives at any time using the one-click role pill in the top header.*

---

## 6. Project Documentation Index

- [`docs/SRS.md`](docs/SRS.md) — Comprehensive Software Requirements Specification
- [`docs/UI-UX.md`](docs/UI-UX.md) — Wireframes, Design Tokens & Responsive Layout Guide
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — Technical Architecture, State Machine & Repository Pattern
- [`docs/API.md`](docs/API.md) — OpenAPI Compatible REST API Contract
- [`docs/postman_collection.json`](docs/postman_collection.json) — Postman API Collection
- [`docs/TEST-REPORT.md`](docs/TEST-REPORT.md) — QA Execution Report (13/13 passing tests)
- [`docs/PROJECT-REPORT.md`](docs/PROJECT-REPORT.md) — Internship Project Final Report
- [`docs/DEMO-SCRIPT.md`](docs/DEMO-SCRIPT.md) — Step-by-Step Live Demo Presentation Script
- [`docs/WEEKLY-REPORT-TEMPLATE.md`](docs/WEEKLY-REPORT-TEMPLATE.md) — Weekly Progress Reporting Template

---

## 7. Vercel Deployment Instructions

1. Push this GitHub-ready repository to your GitHub account (`git push origin main`).
2. Log into the [Vercel Dashboard](https://vercel.com).
3. Click **"New Project"** and import the repository.
4. Framework preset will automatically detect **Next.js**.
5. Build Command: `npm run build` (or leave default).
6. Output Directory: `.next` (leave default).
7. Click **"Deploy"**. The app will build statically in ~45 seconds with 0 configuration.

---

## 8. Development Team & Attribution
- **Developer:** Kishore R (Frontend Development Intern)
- **Organization:** Jeevix Technologies
- **License:** Proprietary Portfolio Internship Project (2026)
