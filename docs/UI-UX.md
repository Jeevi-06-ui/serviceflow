# UI/UX Specification & Design System
## ServiceFlow — Smart Warranty & After-Sales Service Management System

**Developer:** Kishore R (Frontend Development Intern)  
**Client:** Jeevix Technologies  
**Standard:** WCAG 2.1 AA Compliance, 8px Base Grid, B2B SaaS Enterprise Standard  

---

## 1. Design Principles & Aesthetic Philosophy
ServiceFlow is crafted as a high-density, high-efficiency B2B SaaS workstation. Unlike consumer marketing websites, every visual element prioritizes data clarity, predictable visual rhythm, quick operational triage, and low visual fatigue during extended workday usage.

- **Warm Neutral Canvas:** Crisp `#F8FAFC` (`slate-50`) background provides high contrast without the harsh glare of pure white.
- **Deep Navy Command:** Navigation menus and primary headers utilize `#0F172A` (`slate-900`) for visual grounding and immediate perspective recognition.
- **Focused Teal Primary Accent:** `#0D9488` (`brand-600` / `teal-600`) serves as the single primary interactive accent, driving focus to affirmative CTAs without color pollution.
- **Restrained Motion:** Subtle micro-interactions (150ms transitions, smooth drawer slides) prevent distraction.

---

## 2. Color Palette & Token Hierarchy

### 2.1 Core Palette
| Token Name | Tailwind Class | Hex Code | Purpose |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | `bg-slate-50` | `#F8FAFC` | Viewport backdrop |
| **Card / Surface** | `bg-white` | `#FFFFFF` | Workstation cards, data tables, modals |
| **Primary Navy** | `bg-slate-900` | `#0F172A` | Sidebar, main brand accents, headers |
| **Teal Primary** | `bg-teal-600` | `#0D9488` | Primary buttons, active tabs, links |
| **Teal Light** | `bg-teal-50` | `#F0FDFA` | Active role pills, badge backgrounds |
| **Neutral Border** | `border-slate-200` | `#E2E8F0` | Dividers, input outlines, table rows |
| **Text Primary** | `text-slate-900` | `#0F172A` | High-contrast headings and data points |
| **Text Secondary** | `text-slate-500` | `#64748B` | Labels, captions, audit timestamps |

### 2.2 Semantic Status System
| Status | Badge Background | Badge Border | Text Color | Dot Indicator |
| :--- | :--- | :--- | :--- | :--- |
| **Submitted** | `bg-purple-50` | `border-purple-200` | `text-purple-700` | `bg-purple-500` |
| **Under Review** | `bg-indigo-50` | `border-indigo-200` | `text-indigo-700` | `bg-indigo-500` |
| **Assigned / Scheduled** | `bg-blue-50` | `border-blue-200` | `text-blue-700` | `bg-blue-500` |
| **In Progress** | `bg-amber-50` | `border-amber-200` | `text-amber-700` | `bg-amber-500` |
| **Awaiting Approval** | `bg-yellow-50` | `border-yellow-200` | `text-yellow-800` | `bg-yellow-500` |
| **Quality Check** | `bg-teal-50` | `border-teal-200` | `text-teal-700` | `bg-teal-500` |
| **Completed** | `bg-emerald-50` | `border-emerald-200` | `text-emerald-700` | `bg-emerald-500` |
| **Cancelled / Expired** | `bg-red-50` | `border-red-200` | `text-red-700` | `bg-red-500` |

---

## 3. Typography Scale (Inter / System Font)
- **Display 1 (Landing Hero):** 48px / Bold (700) / Tracking: -0.02em
- **H1 (Page Titles):** 20px - 24px / Bold (700) / Tracking: -0.01em
- **H2 (Card Section Titles):** 14px - 16px / Bold (700)
- **Body / Table Cells:** 12px - 14px / Regular (400) / Leading: 1.5
- **Data Labels & Badges:** 11px / Medium (500) & SemiBold (600)
- **Monospace Identifiers:** 11px - 12px (Tickets `SR-2026-XXXX`, Serials `SN-XXX`)

---

## 4. Responsive Viewport Adaptations

### 4.1 Mobile Viewport (390px - iPhone 14 / Standard Smartphone)
- Sidebar collapses into off-canvas drawer accessed via floating mobile hamburger button.
- Top navigation converts into compact breadcrumb header.
- KPI cards stack cleanly in a 2-column or 1-column responsive grid.
- Tables support native horizontal touch scrolling (`overflow-x-auto`) with sticky headers and non-truncated cell contents.
- Modals scale to 95vw with bottom-sheet padding.

### 4.2 Tablet Viewport (768px - iPad / Tablet)
- 2-column layouts for request triage and technician schedule run sheets.
- Action toolbars align side-by-side with search inputs.

### 4.3 Desktop Viewport (1440px - Standard Workstation)
- Fixed 256px (`w-64`) dark navy sidebar with active route indicator.
- 3-column detail views: 2 columns for operational forms and appliance specs, 1 column for the chronological audit event timeline.
- Sticky top bar with quick role perspective switcher and notification bell drawer.

---

## 5. Accessibility & Inclusivity
- **Visible Focus:** Global `:focus-visible` ring with 2px teal outline and 2px offset.
- **Screen Reader Support:** Accessible labels (`aria-label`) on icon-only buttons (pagination, notification dismiss, modals).
- **Reduced Motion:** CSS transitions respect `prefers-reduced-motion` settings.
- **Print Optimization:** Dedicated `@media print` rules for the official Digital Warranty Certificate and Executive Summary, stripping away UI buttons and sidebars.
