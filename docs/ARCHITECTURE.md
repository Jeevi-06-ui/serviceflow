# Technical Architecture & Engineering Design
## ServiceFlow — Smart Warranty & After-Sales Service Management System

**Client:** Jeevix Technologies  
**Assigned Developer:** Kishore R (Frontend Development Intern)  
**Technology Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, Lucide React, Recharts, Vitest  

---

## 1. Architectural Overview & Component Structure

```
src/
├── app/                        # Next.js 14 App Router routes & layouts
│   ├── layout.tsx              # Root HTML shell with Auth & Toast providers
│   ├── page.tsx                # Interactive landing page & demo launchpad
│   ├── login/                  # One-click demo authentication
│   ├── customer/               # Customer portal routes (Products, Warranties, Requests)
│   ├── center/                 # Service center dispatch & inventory routes
│   ├── technician/             # Field technician run sheets & diagnostics
│   └── admin/                  # Executive dashboard, master catalogs & reports
├── components/
│   ├── shared/                 # Reusable domain components
│   │   ├── Header.tsx          # Top bar with role switcher, breadcrumbs & notifications
│   │   ├── Sidebar.tsx         # Responsive role-scoped navigation drawer
│   │   ├── DataTable.tsx       # Paginated, sortable, searchable data table
│   │   ├── KPICard.tsx         # Metric summary card with trend indicator
│   │   ├── StatusBadge.tsx     # Semantic status badge (all 11 ticket states)
│   │   ├── ServiceTimeline.tsx # Chronological audit event logger
│   │   ├── WarrantyCardModal.tsx # Printable official digital warranty certificate
│   │   ├── EstimateModal.tsx   # Itemized quote builder & customer approval modal
│   │   ├── AssignTechnicianModal.tsx # Technician dispatch modal
│   │   └── ScheduleAppointmentModal.tsx # Conflict-checked appointment scheduler
├── context/
│   ├── AuthContext.tsx         # Active role simulation & database reset engine
│   └── ToastContext.tsx        # Toast notification system
├── lib/
│   ├── api/repository.ts       # Typed REST Repository abstraction layer
│   ├── mock/
│   │   ├── seed-data.ts        # Deterministic Indian enterprise dataset (40+ tickets)
│   │   └── storage.ts          # Versioned localStorage storage manager with SSR fallback
│   ├── workflow/
│   │   └── transition-rules.ts # Strict state machine & role permission validator
│   └── utils/
│       ├── warranty.ts         # Dynamic date-based warranty calculator
│       ├── dates.ts            # Indian standard date & INR currency formatters
│       └── export.ts           # RFC 4180 CSV export generator
└── test/                       # Vitest automated unit tests (100% passing)
```

---

## 2. Mock Repository & Persistence Architecture

To guarantee deployability on serverless hosts like Vercel without relying on local server filesystem writes or external databases, ServiceFlow implements a **Versioned LocalStorage Repository Pattern**:

1. **Deterministic Bootstrapping:**  
   On first application launch, `initializeStorage()` checks for storage key `serviceflow_v1.4_store`. If absent, it populates the store with deterministic seed data:
   - 20 Indian Customers (Bengaluru, Chennai, Hyderabad, Mumbai)
   - 32 Consumer Appliances & Electronics
   - 32 Warranty Policies across all validity tiers
   - 4 Regional Service Hubs
   - 10 Certified Technicians
   - 42 Service Tickets covering all 11 lifecycle statuses
   - 16 Scheduled Appointments & 16 Customer CSAT Feedback items
2. **SSR Safe Memory Fallback:**  
   During static prerendering and server-side evaluation (`typeof window === 'undefined'`), operations execute against an in-memory singleton, preventing hydration mismatches.
3. **Cross-Component Reactivity:**  
   Mutations dispatch a browser event `serviceflow-storage-updated`, allowing immediate re-render across disparate layout components without page reloads.
4. **Deterministic Reset Demo Data:**  
   Users can wipe browser mutations and restore clean seeds at any time via the top navigation bar.

---

## 3. Transition Rules & Business Logic Engine

### 3.1 Strict Transition Validator (`transition-rules.ts`)
Arbitrary jumping of workflow states is blocked at the repository level:
```typescript
export const PERMITTED_STATUS_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  Submitted: ['Under Review', 'Cancelled'],
  'Under Review': ['Assigned', 'Cancelled'],
  Assigned: ['Scheduled', 'In Progress', 'Under Review', 'Cancelled'],
  Scheduled: ['In Progress', 'Assigned', 'Cancelled'],
  'In Progress': ['Awaiting Parts', 'Awaiting Approval', 'Quality Check', 'Cancelled'],
  'Awaiting Parts': ['In Progress', 'Cancelled'],
  'Awaiting Approval': ['In Progress', 'Cancelled'],
  'Quality Check': ['Completed', 'In Progress'],
  Completed: ['Closed'],
  Closed: [],
  Cancelled: [],
};
```

### 3.2 Customer Estimate Gate
Repairs cannot advance past `Awaiting Approval` or proceed to `Quality Check` without customer estimate approval:
```typescript
if (requiresEstimate && !estimateApproved) {
  if (fromStatus === 'Awaiting Approval' && toStatus === 'In Progress') {
    return { valid: false, reason: 'Customer estimate approval is required.' };
  }
}
```

### 3.3 Conflict-Free Appointment Scheduler
Prevents technician double-booking by enforcing exclusivity on `(technicianId, scheduledDate, timeSlot)`:
```typescript
const hasConflict = Repository.appointments.checkConflict(
  technicianId,
  scheduledDate,
  timeSlot,
  serviceRequestId
);
```

### 3.4 Non-Negative Spare Parts Stock Rule
Deductions from warehouse stock check `currentStock - decrement >= 0` to preserve physical inventory integrity.

---

## 4. Connecting a Real Backend (Future Migration Path)
The `Repository` object in `src/lib/api/repository.ts` isolates all data transport from presentation components. When Jeevix Technologies connects a production REST backend:
1. Replace `localStorage` calls with standard Axios HTTP requests (`axios.get('/api/v1/requests')`).
2. Retain identical method signatures (`Repository.requests.getAll()`, `Repository.requests.create()`).
3. Zero presentation components need refactoring.
