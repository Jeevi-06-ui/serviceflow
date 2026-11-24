# Final Internship Project Report
## ServiceFlow — Smart Warranty & After-Sales Service Management System

**Student / Intern:** Kishore R  
**Role:** Frontend Development Intern  
**Organization:** Jeevix Technologies  
**Project Domain:** Enterprise B2B SaaS • Consumer Electronics & Home Appliances After-Sales  
**Technology Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, Recharts, Vitest  

---

## 1. Project Background & Business Context
Jeevix Technologies required a centralized after-sales service management platform to solve fragmented customer communication, manual technician scheduling clashes, unapproved repair billing disputes, and lack of warranty verification in tier-1 Indian electronics retail and service networks.

The primary objective for frontend intern **Kishore R** was to design and construct a functional, portfolio-quality B2B web application that models the complete after-sales service lifecycle across four distinct enterprise personas without relying on external databases.

---

## 2. Completed Milestones & Feature Deliverables

### Milestone 1: Architectural Foundation & Planning
- Formulated complete System Architecture, Acceptance Checklist, and 8px Base Grid Design Tokens.
- Initialized Next.js 14 App Router with strict TypeScript compiler options and Tailwind CSS.

### Milestone 2: Domain Data Models & Versioned Mock Persistence
- Defined 16 TypeScript data models (Customer, Product, Warranty, ServiceRequest, Appointment, Estimate, SparePart, ServiceEvent, Feedback, Complaint, etc.).
- Created deterministic Indian seed dataset: 20 customers, 32 appliances, 32 warranty policies, 4 service hubs (Bengaluru, Chennai, Hyderabad, Mumbai), 10 technicians, 42 service tickets across all 11 lifecycle statuses, 16 appointments, and 16 customer CSAT reviews.
- Implemented versioned browser `localStorage` repository with SSR safe memory fallback and instant `Reset Demo Data` functionality.

### Milestone 3: Design System & Reusable Component Library
- Built enterprise dark navy sidebar, breadcrumbs, top notification drawer, and quick demo role switcher pill.
- Developed accessible `DataTable` with client-side sorting, pagination, and multi-key search.
- Created `StatusBadge` covering all 11 ticket states and warranty validity statuses.
- Designed `WarrantyCardModal` with barcode simulation and printable certificate styling.
- Built itemized `EstimateModal` with dynamic 18% GST calculation, `AssignTechnicianModal`, and `ScheduleAppointmentModal`.

### Milestone 4: Customer Portal User Journeys
- **Appliance Registration:** Validates category, serial number, authorized seller, purchase date, and simulated invoice attachment (validating size <= 5MB and MIME types). Prevents duplicate serial registration.
- **Dynamic Warranty Evaluator:** Computes policy status for any arbitrary target date (Active, Expiring Soon, Expired, Not Yet Active) with visual progress bar.
- **Doorstep Repair Booking:** Generates unique ticket numbers (`SR-2026-XXXX`), creates tamper-evident audit logs, and alerts the nearest service center.
- **Estimate Review Gate:** Allows customers to review itemized quotations and approve or reject repairs.
- **CSAT Feedback:** Unlocks 1 to 5 star rating upon repair completion and officially closes the ticket.

### Milestone 5: Service Center & Field Technician Portals
- **Center Dispatch Hub:** Triage queue filtering by status/severity, technician workload visualization, and conflict-checked appointment scheduling.
- **Warehouse Inventory:** Low-stock threshold alerts with enforced non-negative quantity stock allocation rules.
- **Technician Run Sheet:** Chronological daily visit schedule with customer contact details and equipment issue symptoms.
- **Workmanship Diagnostics:** Enforces diagnostic findings entry before advancing ticket stages.

### Milestone 6: Executive Administration & Reporting
- **Operational Command Center:** Real-time KPI aggregation and Recharts visualizations for status distribution and monthly intake trends.
- **Master Data Management:** Non-destructive customer account deactivation preserving historical audit relationships.
- **Reports & Exporting:** RFC 4180 CSV report generator and printable executive summary.

### Milestone 7: Testing & Production Compilation
- Developed 13 automated unit tests in Vitest covering warranty calculations, transition graphs, estimate totals, scheduling conflicts, and spare stock integrity (100% passing).
- Verified production build with 36/36 static routes optimized in Next.js.

---

## 3. Key Technical Challenges & Solutions

| Challenge | Architectural Solution |
| :--- | :--- |
| **Serverless Deployment Persistence** | Replaced fragile server file writes with a versioned `localStorage` repository (`serviceflow_v1.4_store`) backed by an in-memory SSR fallback. |
| **Technician Double Booking** | Implemented a collision detection algorithm checking existing appointments for `(technicianId, scheduledDate, timeSlot)`. |
| **Repair Progress Past Unpaid Estimates** | Designed an estimate gate in `transition-rules.ts` that blocks transitioning from `Awaiting Approval` to `In Progress` or `Quality Check` until customer approval is recorded. |
| **Next.js Prerendering with URL Search Params** | Wrapped client-side search parameter reading in React `<Suspense>` boundaries to ensure static page optimization. |

---

## 4. Conclusion & Acknowledgments
ServiceFlow represents an internship project that meets enterprise SaaS standards. Special thanks to the engineering mentors at **Jeevix Technologies** for guidance on B2B service workflows and state machine design.
