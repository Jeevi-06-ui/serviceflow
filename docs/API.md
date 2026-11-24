# REST API Contract & Specification
## ServiceFlow — Smart Warranty & After-Sales Service Management System

**Developer:** Kishore R (Frontend Development Intern)  
**Client:** Jeevix Technologies  
**Standard:** OpenAPI 3.0 Compatible REST Contract (Mock Client Transport)  
**Base URL:** `/api/v1` (Simulated via typed repository layer)  

---

## 1. Authentication & Session Endpoints

### 1.1 `POST /api/auth/demo-login`
Switches the active demo perspective.
- **Request Body:**
  ```json
  {
    "role": "customer" // "customer" | "center" | "technician" | "admin"
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "id": "usr-cust-1",
    "name": "Priya Sharma",
    "email": "priya.sharma@example.com",
    "role": "customer",
    "customerId": "cust-1"
  }
  ```

---

## 2. Customer & Appliance Endpoints

### 2.1 `GET /api/customers`
Returns customer master records.
- **Query Parameters:** `?city=Bengaluru&search=Sharma`
- **Response `200 OK`:**
  ```json
  [
    {
      "id": "cust-1",
      "name": "Priya Sharma",
      "email": "priya.sharma@example.com",
      "phone": "+91 98450 99001",
      "address": {
        "street": "Flat 402, Greenfield Heights, HAL 2nd Stage",
        "city": "Bengaluru",
        "state": "Karnataka",
        "postalCode": "560008"
      },
      "registeredAt": "2025-01-15T10:30:00Z"
    }
  ]
  ```

### 2.2 `POST /api/products`
Registers a new consumer appliance with duplicate serial number verification.
- **Request Body:**
  ```json
  {
    "customerId": "cust-1",
    "category": "Television",
    "brand": "Samsung",
    "modelName": "Samsung Crystal 4K UHD Smart TV 55\"",
    "serialNumber": "SN-SAM-TV-98214",
    "purchaseDate": "2025-01-20",
    "seller": "Croma Electronics - Indiranagar",
    "invoiceNumber": "INV-CRM-2025-4412"
  }
  ```
- **Response `201 Created`:** Returns registered product and automatically generates 1-year standard warranty policy.

---

## 3. Warranty Endpoints

### 3.1 `GET /api/warranties/:id/validate`
Evaluates policy validity for an arbitrary target date.
- **Query Parameters:** `?targetDate=2026-11-24`
- **Response `200 OK`:**
  ```json
  {
    "status": "Active", // "Active" | "Expiring Soon" | "Expired" | "Not Yet Active"
    "daysRemaining": 56,
    "totalDurationDays": 365,
    "percentElapsed": 85,
    "isEligibleForFreeService": true
  }
  ```

---

## 4. Service Requests (Tickets) Endpoints

### 4.1 `GET /api/requests`
Returns filtered service tickets.
- **Query Parameters:** `?status=In Progress&centerId=center-blr-1`

### 4.2 `POST /api/requests`
Submits a new repair ticket.
- **Request Body:**
  ```json
  {
    "customerId": "cust-1",
    "productId": "prod-1",
    "issueCategory": "Display / Screen",
    "severity": "High",
    "description": "Colored vertical lines during 4K streaming.",
    "preferredDate": "2026-11-26",
    "preferredTimeSlot": "10:00 AM - 01:00 PM"
  }
  ```
- **Response `201 Created`:** Returns ticket object with generated `ticketNumber: "SR-2026-1043"`, logs audit event, and alerts service center.

### 4.3 `PATCH /api/requests/:id/status`
Updates operational ticket status subject to the transition state machine.
- **Request Body:**
  ```json
  {
    "status": "Quality Check",
    "notes": "Replaced logic board; thermal stability verified under 4hr burn-in."
  }
  ```

### 4.4 `POST /api/requests/:id/assign`
Assigns a center-specific technician.
- **Request Body:**
  ```json
  {
    "technicianId": "tech-1",
    "centerId": "center-blr-1"
  }
  ```

---

## 5. Appointments & Estimates Endpoints

### 5.1 `POST /api/appointments`
Schedules an appointment with conflict verification.
- **Request Body:**
  ```json
  {
    "serviceRequestId": "req-1",
    "scheduledDate": "2026-11-25",
    "timeSlot": "10:00 AM - 12:00 PM",
    "notes": "Call 15 minutes before arrival"
  }
  ```

### 5.2 `POST /api/estimates`
Generates itemized repair estimate.
- **Request Body:**
  ```json
  {
    "serviceRequestId": "req-2",
    "lines": [
      { "description": "Outdoor Inverter PCB", "type": "Part", "quantity": 1, "unitPriceInr": 3200, "amountInr": 3200 },
      { "description": "Dismantling Labor", "type": "Labor", "quantity": 1, "unitPriceInr": 1100, "amountInr": 1100 }
    ],
    "notes": "Component damaged by power surge"
  }
  ```

### 5.3 `POST /api/estimates/:id/decision`
Customer decision endpoint.
- **Request Body:**
  ```json
  {
    "decision": "Approved" // or "Rejected"
  }
  ```

---

## 6. Feedback & Reviews Endpoints

### 6.1 `POST /api/feedback`
Submits 1-5 star review after repair completion.
- **Request Body:**
  ```json
  {
    "serviceRequestId": "req-3",
    "rating": 5,
    "resolutionSatisfaction": 5,
    "timelyArrivalSatisfaction": 5,
    "comment": "Prompt service and courteous technician."
  }
  ```
