# Interactive Demo Walkthrough Script
## ServiceFlow — Smart Warranty & After-Sales Service Management System

**Presenter / Developer:** Kishore R (Frontend Development Intern)  
**Organization:** Jeevix Technologies  
**Target Audience:** Technical Mentors, Evaluators, and Viva Panel  
**Estimated Walkthrough Duration:** 6–8 Minutes  

---

## Act 1: Introduction & Landing Page (0:00 - 1:15)
1. **Welcome & Context:**
   - *"Hello everyone, I am Kishore R, Frontend Development Intern at Jeevix Technologies. Today, I am proud to present ServiceFlow, a smart warranty and after-sales service management platform designed for consumer electronics retailers, dealers, and authorized service centers."*
2. **Landing Page Overview:**
   - Open browser at `http://localhost:3005/`.
   - Point out the clean B2B SaaS enterprise aesthetic: warm white canvas (`bg-slate-50`), deep navy sidebar (`bg-slate-900`), and focused teal accents (`#0D9488`).
   - Highlight the **One-Click Demo Launchpad** showing the 4 operational personas: Customer, Service Center, Field Technician, and System Admin.

---

## Act 2: Customer Portal — Appliance Registration & Booking (1:15 - 3:00)
1. **Switch Perspective:**
   - Click **Customer Portal (Priya Sharma)**.
   - Navigate to `/customer/dashboard`. Point out the active warranty alerts and appliances.
2. **Register New Appliance:**
   - Click **"Register Appliance"** (`/customer/products/new`).
   - Fill in: Brand = *Sony*, Model = *Bravia 65" OLED*, Serial = *SN-SON-TEST-01*, Seller = *Croma Indiranagar*.
   - Demonstrate simulated invoice attachment validation (size limit <= 5MB and PDF/Image MIME verification).
   - Click **"Register & Generate Warranty Card"**.
3. **Inspect Digital Warranty Certificate:**
   - Click **"Warranty Card"** on the newly registered device.
   - Show the official certificate modal with QR verification code, policy reference, coverage limits, and **"Print / Save PDF"** action.
4. **Book a Doorstep Repair:**
   - Click **"Book Repair"** (`/customer/requests/new`).
   - Select the appliance, choose Issue Category = *Power Failure*, Severity = *High*, and choose preferred date & time slot.
   - Click **"Submit Ticket"**. Point out the generated ticket ID (e.g. `SR-2026-1043`).

---

## Act 3: Service Center Portal — Triage, Dispatch & Estimate (3:00 - 5:00)
1. **Switch Perspective:**
   - Using the top-right header role switcher, select **Service Center (Rajesh Nair)**.
   - Notice the immediate navigation to `/center/dashboard`.
2. **Queue Triage & Assignment:**
   - Navigate to `/center/requests`. Locate the newly submitted ticket.
   - Click **"Manage"** to open ticket detail.
   - Click **"Assign Technician"** &rarr; select *Vikram Verma* (highlight skill match badge).
   - Click **"Schedule Visit"** &rarr; select date & time slot. Explain the built-in conflict checker that prevents technician double-booking.
3. **Issue Itemized Repair Estimate:**
   - Open **"Create Estimate"**.
   - Add lines: *Power Supply Board Replacement (Part)* = ₹3,200, *Labor* = ₹950.
   - Point out automated 18% GST calculation (Total: ₹4,897).
   - Click **"Issue & Send Estimate"**. The ticket pauses at `Awaiting Approval`.

---

## Act 4: Customer Approval & Technician Repair Execution (5:00 - 6:30)
1. **Customer Approval:**
   - Switch role back to **Customer (Priya Sharma)**.
   - Open notifications drawer in header &rarr; click estimate notification.
   - Review itemized estimate and click **"Approve & Authorize Repair"**.
   - Notice ticket status immediately unlocks back to `In Progress`.
2. **Technician Execution:**
   - Switch role to **Field Technician (Vikram Verma)**.
   - Navigate to `/technician/dashboard` &rarr; open the assigned task sheet.
   - Enter diagnostic findings: *"Replaced blown varistor on standby power circuit. 24hr burn-in test passed."*
   - Click **"Mark Ready for QA"** (`Quality Check`).
3. **Center QA & Completion:**
   - Switch role to **Service Center**.
   - Transition ticket to `Completed`.
4. **Customer CSAT Review:**
   - Switch role to **Customer**.
   - The ticket displays **"Rate Service"**.
   - Submit a 5-star rating with resolution comments. Ticket transitions to `Closed`.

---

## Act 5: Executive Admin & Reports (6:30 - 7:30)
1. **Switch to Admin Role (Arun Kumar):**
   - Navigate to `/admin/dashboard`.
   - Point out Recharts graphs (Status distribution across 11 states, 6-month volume trends).
2. **Exporting & Audits:**
   - Navigate to `/admin/reports`.
   - Click **"Export All Requests CSV"** (show generated CSV download).
   - Demonstrate the top bar **"Reset Demo Data"** action, explaining that it resets browser storage back to clean deterministic seeds with zero leftover artifacts.
3. **Closing:**
   - *"Thank you for your time. I am ready to answer any technical questions regarding the architecture and implementation."*
