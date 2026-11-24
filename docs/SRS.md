# Software Requirements Specification (SRS)
## ServiceFlow — Smart Warranty & After-Sales Service Management System

**Client:** Jeevix Technologies  
**Project Lead / Developer:** Kishore R (Frontend Development Intern)  
**System Architecture:** Next.js 14 App Router, TypeScript, Tailwind CSS, Versioned Mock Repository  
**Document Revision:** 1.0 (Production Release)  
**Evaluation Standard:** APAC / India (IST, Asia/Kolkata, INR ₹)  

---

## 1. System Overview & Purpose
ServiceFlow is an enterprise after-sales service and warranty management platform designed for consumer electronics retailers, home appliance distributors, authorized service center networks, and original equipment manufacturers (OEMs). The platform unifies the entire after-sales lifecycle across four dedicated operational roles:
1. **Customer Self-Service Portal**
2. **Authorized Service Center Dispatch Portal**
3. **Field Technician Run Sheet Portal**
4. **Executive Administration & Analytics Portal**

---

## 2. User Roles & Permission Matrix

| Operational Capability | Customer | Service Center | Field Technician | System Admin |
| :--- | :---: | :---: | :---: | :---: |
| Register Appliances & Upload Invoice | **Yes** (Own) | No | No | **Yes** (All) |
| View Digital Warranty Certificate | **Yes** (Own) | **Yes** | No | **Yes** (All) |
| Check Warranty Validity by Date | **Yes** | **Yes** | No | **Yes** |
| Book Doorstep Repair Service | **Yes** | No | No | **Yes** |
| Triage & Assign Technicians | No | **Yes** (Center) | No | **Yes** (All) |
| Schedule Appointments & Conflict Check | No | **Yes** (Center) | No | **Yes** (All) |
| Issue Itemized Estimates (Part/Labor/GST) | No | **Yes** (Center) | No | **Yes** (All) |
| Approve / Reject Repair Estimate | **Yes** (Customer) | No | No | **Yes** (Override) |
| Record Diagnostics & Root Cause | No | **Yes** | **Yes** (Assigned) | **Yes** (All) |
| Request & Allocate Spare Parts | No | **Yes** (Stock) | **Yes** (Request) | **Yes** (All) |
| Quality Control (QC) Submission | No | **Yes** | **Yes** | **Yes** |
| Submit 1–5 Star CSAT Feedback | **Yes** (Completed) | No | No | View Only |
| Deactivate / Archive Customer Records | No | No | No | **Yes** (Non-destructive) |
| Export Data to CSV & Print Summaries | No | **Yes** (Center) | No | **Yes** (Global) |

---

## 3. Functional Requirements

### 3.1 Customer Module (FR-CUST)
- **FR-CUST-01 (Product Registration):** Customer can register home electronics by providing category, brand, model name, serial number, purchase date, authorized seller, and simulated receipt.
- **FR-CUST-02 (Duplicate Serial Prevention):** The repository rejects registration if the serial number already exists in the system.
- **FR-CUST-03 (Digital Warranty Certificate):** Generates an official digital warranty certificate with QR/barcode simulation, terms summary, coverage type, expiry date, and print capability.
- **FR-CUST-04 (Service Request Creation):** Customer can book a repair ticket specifying appliance, issue category, description, severity, and preferred time slot.
- **FR-CUST-05 (Estimate Decision Gate):** If a repair requires customer payment, the ticket pauses at `Awaiting Approval` until the customer reviews and either approves or declines the itemized quotation.
- **FR-CUST-06 (Post-Service Feedback):** After repair completion, customer can submit a 1 to 5 star rating, resolution score, punctuality score, and written review. Ticket transitions to `Closed`.

### 3.2 Service Center Module (FR-CENT)
- **FR-CENT-01 (Queue Management):** Center manager can filter tickets by status, severity, technician, and date.
- **FR-CENT-02 (Conflict-Free Dispatch):** Technicians can be assigned only if they belong to the center. Appointments check for overlapping date and time slot collisions.
- **FR-CENT-03 (Itemized Estimates):** Calculates parts, labor, and inspection costs with automated 18% GST addition.
- **FR-CENT-04 (Spare Parts Non-Negative Rule):** Spare parts inventory alerts on low stock (threshold breaches) and strictly prevents negative inventory deductions.

### 3.3 Field Technician Module (FR-TECH)
- **FR-TECH-01 (Daily Run Sheet):** Displays scheduled visits for the day with customer contact, address, and equipment symptoms.
- **FR-TECH-02 (Mandatory Diagnostics):** Updating a ticket from `In Progress` to `Quality Check` or `Awaiting Parts` mandates recording technical findings.
- **FR-TECH-03 (Performance Scorecard):** Computes completed task counts, turnaround hours, and customer CSAT from real demo records.

### 3.4 Administration & Governance Module (FR-ADM)
- **FR-ADM-01 (Executive KPIs):** Real-time aggregation of active customers, protected appliances, active tickets, and system CSAT.
- **FR-ADM-02 (Analytics & Charts):** Recharts visualization of status distributions and 6-month repair intake trends.
- **FR-ADM-03 (Complaint Escalation):** Intake and resolution of customer grievances with SLA audit logging.
- **FR-ADM-04 (CSV Reporting):** Filtered and global CSV export generation using standard RFC 4180 formatting.

---

## 4. State Machine: Ticket Status Flow

The system strictly enforces the following permitted transition graph:
```
Submitted ---------> Under Review ---------> Assigned ---------> Scheduled ---------> In Progress
   |                       |                    |                    |                     |
   v                       v                    v                    v                     +---> Awaiting Parts ---> In Progress
Cancelled               Cancelled            Cancelled            Cancelled                |
                                                                                           +---> Awaiting Approval (Estimate)
                                                                                           |          |
                                                                                           |          +---> Approved ---> In Progress
                                                                                           |          +---> Rejected ---> Cancelled
                                                                                           |
                                                                                           +---> Quality Check ---> Completed ---> Closed
```

---

## 5. Non-Functional Requirements
- **Performance:** Initial page load under 1.5 seconds; client-side route transitions under 100ms.
- **Accessibility:** WCAG 2.1 AA compliant colors, minimum 4.5:1 contrast, explicit focus rings, keyboard navigable dialogs.
- **Responsive Layout:** Adaptive layouts for Mobile (390px), Tablet (768px), and Desktop (1440px).
- **Data Persistence:** Versioned browser `localStorage` repository with fallback memory store for SSR safety and instant Reset Demo Data capability.
