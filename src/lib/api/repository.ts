import {
  User,
  UserRole,
  Customer,
  Product,
  Warranty,
  ServiceCenter,
  Technician,
  ServiceRequest,
  Appointment,
  Estimate,
  SparePart,
  ServiceEvent,
  Notification,
  Feedback,
  Complaint,
  SystemMetrics,
  TicketStatus,
} from '@/types';
import { getStore, saveStorage, initializeStorage } from '../mock/storage';
import { isValidTransition, isRoleAllowedTransition } from '../workflow/transition-rules';
import { calculateWarrantyStatus } from '../utils/warranty';

// Ensure storage is initialized
if (typeof window !== 'undefined') {
  initializeStorage();
}

export const Repository = {
  // ==========================================
  // AUTH & SESSIONS
  // ==========================================
  auth: {
    getCurrentUser(): User {
      const store = getStore();
      const user = store.users.find((u) => u.id === store.activeUserId);
      return user || store.users[3]; // Fallback to Customer Priya Sharma
    },

    setCurrentUser(userId: string): User {
      const store = getStore();
      const user = store.users.find((u) => u.id === userId);
      if (!user) throw new Error(`User with ID ${userId} not found`);
      store.activeUserId = user.id;
      saveStorage(store);
      return user;
    },

    demoLogin(role: UserRole): User {
      const store = getStore();
      const targetUser = store.users.find((u) => u.role === role);
      if (!targetUser) throw new Error(`Demo user for role ${role} not found`);
      store.activeUserId = targetUser.id;
      saveStorage(store);
      return targetUser;
    },

    getAllDemoUsers(): User[] {
      return getStore().users;
    },
  },

  // ==========================================
  // CUSTOMERS
  // ==========================================
  customers: {
    getAll(): Customer[] {
      return getStore().customers.filter((c) => !c.isArchived);
    },

    getById(id: string): Customer | undefined {
      return getStore().customers.find((c) => c.id === id);
    },

    create(customerData: Omit<Customer, 'id' | 'registeredAt'>): Customer {
      const store = getStore();
      const newCustomer: Customer = {
        ...customerData,
        id: `cust-${Date.now()}`,
        registeredAt: new Date().toISOString(),
      };
      store.customers.unshift(newCustomer);
      saveStorage(store);
      return newCustomer;
    },

    update(id: string, updates: Partial<Customer>): Customer {
      const store = getStore();
      const idx = store.customers.findIndex((c) => c.id === id);
      if (idx === -1) throw new Error(`Customer ${id} not found`);
      store.customers[idx] = { ...store.customers[idx], ...updates };
      saveStorage(store);
      return store.customers[idx];
    },

    archive(id: string): void {
      const store = getStore();
      const customer = store.customers.find((c) => c.id === id);
      if (customer) {
        customer.isArchived = true;
        saveStorage(store);
      }
    },
  },

  // ==========================================
  // PRODUCTS
  // ==========================================
  products: {
    getAll(customerId?: string): Product[] {
      const store = getStore();
      if (customerId) {
        return store.products.filter((p) => p.customerId === customerId);
      }
      return store.products;
    },

    getById(id: string): Product | undefined {
      return getStore().products.find((p) => p.id === id);
    },

    checkDuplicateSerial(serialNumber: string, excludeProductId?: string): boolean {
      const store = getStore();
      return store.products.some(
        (p) => p.serialNumber.trim().toLowerCase() === serialNumber.trim().toLowerCase() && p.id !== excludeProductId
      );
    },

    create(productData: Omit<Product, 'id' | 'createdAt'>): Product {
      const store = getStore();
      if (this.checkDuplicateSerial(productData.serialNumber)) {
        throw new Error(`A product with serial number "${productData.serialNumber}" is already registered.`);
      }

      const newProduct: Product = {
        ...productData,
        id: `prod-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      // Generate associated warranty automatically (1 year standard or 2 year comprehensive)
      const purchaseDate = new Date(productData.purchaseDate);
      const endDate = new Date(purchaseDate);
      endDate.setFullYear(endDate.getFullYear() + 1); // 1 year warranty

      const statusCalc = calculateWarrantyStatus(
        productData.purchaseDate,
        endDate.toISOString().slice(0, 10),
        new Date()
      );

      const newWarranty: Warranty = {
        id: `war-${Date.now()}`,
        productId: newProduct.id,
        customerId: newProduct.customerId,
        policyNumber: `WR-${newProduct.brand.slice(0, 3).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(
          1000 + Math.random() * 9000
        )}`,
        coverageType: 'Standard',
        startDate: productData.purchaseDate,
        endDate: endDate.toISOString().slice(0, 10),
        status: statusCalc.status,
        claimLimitInr: 50000,
        termsSummary: 'Standard 1-year manufacturer warranty against hardware defects.',
      };

      store.products.unshift(newProduct);
      store.warranties.unshift(newWarranty);
      saveStorage(store);
      return newProduct;
    },
  },

  // ==========================================
  // WARRANTIES
  // ==========================================
  warranties: {
    getAll(customerId?: string): Warranty[] {
      const store = getStore();
      if (customerId) {
        return store.warranties.filter((w) => w.customerId === customerId);
      }
      return store.warranties;
    },

    getById(id: string): Warranty | undefined {
      return getStore().warranties.find((w) => w.id === id);
    },

    getByProductId(productId: string): Warranty | undefined {
      return getStore().warranties.find((w) => w.productId === productId);
    },

    validateOnDate(warrantyId: string, targetDate: Date) {
      const warranty = this.getById(warrantyId);
      if (!warranty) throw new Error('Warranty not found');
      return calculateWarrantyStatus(warranty.startDate, warranty.endDate, targetDate);
    },
  },

  // ==========================================
  // SERVICE REQUESTS (TICKETS)
  // ==========================================
  requests: {
    getAll(options?: {
      customerId?: string;
      centerId?: string;
      technicianId?: string;
      status?: TicketStatus;
      search?: string;
    }): ServiceRequest[] {
      const store = getStore();
      let list = [...store.requests];

      if (options?.customerId) {
        list = list.filter((r) => r.customerId === options.customerId);
      }
      if (options?.centerId) {
        list = list.filter((r) => r.centerId === options.centerId);
      }
      if (options?.technicianId) {
        list = list.filter((r) => r.technicianId === options.technicianId);
      }
      if (options?.status) {
        list = list.filter((r) => r.status === options.status);
      }
      if (options?.search) {
        const q = options.search.toLowerCase();
        list = list.filter(
          (r) =>
            r.ticketNumber.toLowerCase().includes(q) ||
            r.productName?.toLowerCase().includes(q) ||
            r.customerName?.toLowerCase().includes(q) ||
            r.issueCategory.toLowerCase().includes(q) ||
            r.serialNumber?.toLowerCase().includes(q)
        );
      }

      return list;
    },

    getById(id: string): ServiceRequest | undefined {
      return getStore().requests.find((r) => r.id === id);
    },

    create(data: {
      customerId: string;
      productId: string;
      issueCategory: ServiceRequest['issueCategory'];
      description: string;
      severity: ServiceRequest['severity'];
      preferredDate: string;
      preferredTimeSlot: string;
      simulatedAttachmentUrl?: string;
    }): ServiceRequest {
      const store = getStore();
      const customer = store.customers.find((c) => c.id === data.customerId);
      const product = store.products.find((p) => p.id === data.productId);
      const warranty = store.warranties.find((w) => w.productId === data.productId);

      if (!customer || !product) {
        throw new Error('Customer or product not found');
      }

      const warrantyCalc = warranty
        ? calculateWarrantyStatus(warranty.startDate, warranty.endDate, new Date())
        : null;

      const requiresEstimate = warrantyCalc ? !warrantyCalc.isEligibleForFreeService : true;

      // Assign to nearest center by default (or Bengaluru)
      const defaultCenter = store.centers[0];

      const ticketNumber = `SR-2026-${1000 + store.requests.length + 1}`;
      const newRequest: ServiceRequest = {
        id: `req-${Date.now()}`,
        ticketNumber,
        customerId: customer.id,
        customerName: customer.name,
        customerPhone: customer.phone,
        productId: product.id,
        productName: product.modelName,
        productCategory: product.category,
        serialNumber: product.serialNumber,
        warrantyId: warranty?.id,
        warrantyStatus: warrantyCalc ? warrantyCalc.status : 'Expired',
        centerId: defaultCenter.id,
        centerName: defaultCenter.name,
        issueCategory: data.issueCategory,
        description: data.description,
        severity: data.severity,
        status: 'Submitted',
        preferredDate: data.preferredDate,
        preferredTimeSlot: data.preferredTimeSlot,
        requiresEstimate,
        simulatedAttachmentUrl: data.simulatedAttachmentUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const auditEvent: ServiceEvent = {
        id: `evt-${Date.now()}`,
        serviceRequestId: newRequest.id,
        timestamp: new Date().toISOString(),
        actorId: customer.userId,
        actorName: customer.name,
        actorRole: 'customer',
        toStatus: 'Submitted',
        action: 'Service Request Submitted',
        notes: `Created new repair ticket for ${product.modelName}. Preferred date: ${data.preferredDate}.`,
      };

      const centerNotif: Notification = {
        id: `notif-${Date.now()}`,
        recipientRole: 'center',
        recipientId: defaultCenter.id,
        title: `New Ticket: ${ticketNumber}`,
        message: `${customer.name} reported ${data.issueCategory} on ${product.modelName} (${data.severity} priority).`,
        timestamp: new Date().toISOString(),
        isRead: false,
        link: `/center/requests/${newRequest.id}`,
        type: data.severity === 'Critical' ? 'alert' : 'info',
      };

      store.requests.unshift(newRequest);
      store.events.unshift(auditEvent);
      store.notifications.unshift(centerNotif);
      saveStorage(store);

      return newRequest;
    },

    updateStatus(
      id: string,
      targetStatus: TicketStatus,
      actor: { id: string; name: string; role: UserRole },
      notes?: string,
      cancellationReason?: string
    ): ServiceRequest {
      const store = getStore();
      const request = store.requests.find((r) => r.id === id);
      if (!request) throw new Error(`Ticket ${id} not found`);

      // Check estimate approval status if relevant
      let estimateApproved = false;
      if (request.estimateId) {
        const est = store.estimates.find((e) => e.id === request.estimateId);
        estimateApproved = est?.status === 'Approved';
      }

      // Check transition validity
      const transitionCheck = isValidTransition(
        request.status,
        targetStatus,
        request.requiresEstimate,
        estimateApproved
      );
      if (!transitionCheck.valid) {
        throw new Error(transitionCheck.reason || 'Invalid transition');
      }

      // Check role permissions
      const roleCheck = isRoleAllowedTransition(actor.role, request.status, targetStatus);
      if (!roleCheck.allowed) {
        throw new Error(roleCheck.reason || 'Role not permitted to perform this transition');
      }

      const previousStatus = request.status;
      request.status = targetStatus;
      request.updatedAt = new Date().toISOString();

      if (cancellationReason) {
        request.cancellationReason = cancellationReason;
      }
      if (notes) {
        if (targetStatus === 'Quality Check' || targetStatus === 'In Progress') {
          request.diagnosticNotes = notes;
        } else if (targetStatus === 'Completed' || targetStatus === 'Closed') {
          request.resolutionNotes = notes;
          request.completedAt = new Date().toISOString();
        }
      }

      // Audit Log
      const event: ServiceEvent = {
        id: `evt-${Date.now()}`,
        serviceRequestId: request.id,
        timestamp: new Date().toISOString(),
        actorId: actor.id,
        actorName: actor.name,
        actorRole: actor.role,
        fromStatus: previousStatus,
        toStatus: targetStatus,
        action: `Status changed to ${targetStatus}`,
        notes: notes || cancellationReason || undefined,
      };
      store.events.unshift(event);

      // Notify customer of status change
      const custNotif: Notification = {
        id: `notif-${Date.now()}`,
        recipientRole: 'customer',
        recipientId: request.customerId,
        title: `Ticket ${request.ticketNumber} Update`,
        message: `Your service request is now: ${targetStatus}.`,
        timestamp: new Date().toISOString(),
        isRead: false,
        link: `/customer/requests/${request.id}`,
        type: targetStatus === 'Completed' ? 'success' : targetStatus === 'Cancelled' ? 'alert' : 'info',
      };
      store.notifications.unshift(custNotif);

      saveStorage(store);
      return request;
    },

    assignTechnician(
      id: string,
      technicianId: string,
      centerId: string,
      actor: { id: string; name: string; role: UserRole }
    ): ServiceRequest {
      const store = getStore();
      const request = store.requests.find((r) => r.id === id);
      if (!request) throw new Error('Ticket not found');

      const technician = store.technicians.find((t) => t.id === technicianId);
      if (!technician) throw new Error('Technician not found');

      // Verify technician belongs to this center
      if (technician.centerId !== centerId) {
        throw new Error('Selected technician does not belong to this service center.');
      }

      request.technicianId = technician.id;
      request.technicianName = technician.name;
      request.centerId = centerId;
      const center = store.centers.find((c) => c.id === centerId);
      if (center) request.centerName = center.name;

      if (request.status === 'Submitted' || request.status === 'Under Review') {
        request.status = 'Assigned';
      }
      request.updatedAt = new Date().toISOString();

      technician.activeTasksCount += 1;

      const event: ServiceEvent = {
        id: `evt-${Date.now()}`,
        serviceRequestId: request.id,
        timestamp: new Date().toISOString(),
        actorId: actor.id,
        actorName: actor.name,
        actorRole: actor.role,
        toStatus: request.status,
        action: `Assigned to Technician`,
        notes: `Assigned to ${technician.name} at ${request.centerName}.`,
      };
      store.events.unshift(event);

      // Notify technician
      store.notifications.unshift({
        id: `notif-${Date.now()}`,
        recipientRole: 'technician',
        recipientId: technician.id,
        title: `Job Assigned: ${request.ticketNumber}`,
        message: `You have been assigned to ${request.productName} for ${request.customerName}.`,
        timestamp: new Date().toISOString(),
        isRead: false,
        link: `/technician/tasks/${request.id}`,
        type: 'info',
      });

      saveStorage(store);
      return request;
    },

    scheduleAppointment(
      id: string,
      scheduledDate: string,
      timeSlot: string,
      actor: { id: string; name: string; role: UserRole },
      notes?: string
    ): Appointment {
      const store = getStore();
      const request = store.requests.find((r) => r.id === id);
      if (!request) throw new Error('Ticket not found');
      if (!request.technicianId) throw new Error('Please assign a technician before scheduling an appointment.');

      // Check conflict
      const hasConflict = Repository.appointments.checkConflict(
        request.technicianId,
        scheduledDate,
        timeSlot,
        request.id
      );
      if (hasConflict) {
        throw new Error(
          `Technician ${request.technicianName} already has an appointment scheduled on ${scheduledDate} during ${timeSlot}.`
        );
      }

      request.scheduledDate = scheduledDate;
      request.scheduledTimeSlot = timeSlot;
      if (request.status === 'Assigned') {
        request.status = 'Scheduled';
      }
      request.updatedAt = new Date().toISOString();

      let appointment = store.appointments.find((a) => a.serviceRequestId === id);
      if (appointment) {
        appointment.scheduledDate = scheduledDate;
        appointment.timeSlot = timeSlot;
        appointment.status = 'Rescheduled';
        if (notes) appointment.notes = notes;
      } else {
        appointment = {
          id: `apt-${Date.now()}`,
          serviceRequestId: request.id,
          ticketNumber: request.ticketNumber,
          centerId: request.centerId || store.centers[0].id,
          technicianId: request.technicianId,
          technicianName: request.technicianName || 'Technician',
          customerId: request.customerId,
          customerName: request.customerName || 'Customer',
          customerPhone: request.customerPhone || '',
          customerAddress: `${request.customerName}'s Address`,
          scheduledDate,
          timeSlot,
          status: 'Scheduled',
          notes,
        };
        store.appointments.unshift(appointment);
      }

      store.events.unshift({
        id: `evt-${Date.now()}`,
        serviceRequestId: request.id,
        timestamp: new Date().toISOString(),
        actorId: actor.id,
        actorName: actor.name,
        actorRole: actor.role,
        toStatus: request.status,
        action: `Appointment Scheduled`,
        notes: `Date: ${scheduledDate}, Slot: ${timeSlot}.`,
      });

      // Notify customer
      store.notifications.unshift({
        id: `notif-${Date.now()}`,
        recipientRole: 'customer',
        recipientId: request.customerId,
        title: `Appointment Confirmed: ${scheduledDate}`,
        message: `Technician ${request.technicianName} is scheduled for ${scheduledDate} between ${timeSlot}.`,
        timestamp: new Date().toISOString(),
        isRead: false,
        link: `/customer/requests/${request.id}`,
        type: 'info',
      });

      saveStorage(store);
      return appointment;
    },
  },

  // ==========================================
  // APPOINTMENTS
  // ==========================================
  appointments: {
    getAll(options?: { technicianId?: string; centerId?: string; customerId?: string }): Appointment[] {
      const store = getStore();
      let list = [...store.appointments];
      if (options?.technicianId) list = list.filter((a) => a.technicianId === options.technicianId);
      if (options?.centerId) list = list.filter((a) => a.centerId === options.centerId);
      if (options?.customerId) list = list.filter((a) => a.customerId === options.customerId);
      return list;
    },

    checkConflict(
      technicianId: string,
      date: string,
      timeSlot: string,
      excludeServiceRequestId?: string
    ): boolean {
      const store = getStore();
      return store.appointments.some(
        (a) =>
          a.technicianId === technicianId &&
          a.scheduledDate === date &&
          a.timeSlot === timeSlot &&
          a.status !== 'Cancelled' &&
          a.serviceRequestId !== excludeServiceRequestId
      );
    },
  },

  // ==========================================
  // ESTIMATES
  // ==========================================
  estimates: {
    getAll(centerId?: string): Estimate[] {
      const store = getStore();
      if (centerId) return store.estimates.filter((e) => e.centerId === centerId);
      return store.estimates;
    },

    getById(id: string): Estimate | undefined {
      return getStore().estimates.find((e) => e.id === id);
    },

    getByServiceRequestId(serviceRequestId: string): Estimate | undefined {
      return getStore().estimates.find((e) => e.serviceRequestId === serviceRequestId);
    },

    create(
      serviceRequestId: string,
      lines: Estimate['lines'],
      notes?: string,
      actor?: { id: string; name: string; role: UserRole }
    ): Estimate {
      const store = getStore();
      const request = store.requests.find((r) => r.id === serviceRequestId);
      if (!request) throw new Error('Ticket not found');

      const subtotalInr = lines.reduce((acc, l) => acc + l.amountInr, 0);
      const gstRatePercent = 18;
      const gstAmountInr = Math.round((subtotalInr * gstRatePercent) / 100);
      const totalInr = subtotalInr + gstAmountInr;

      const newEstimate: Estimate = {
        id: `est-${Date.now()}`,
        serviceRequestId: request.id,
        ticketNumber: request.ticketNumber,
        centerId: request.centerId || store.centers[0].id,
        customerId: request.customerId,
        customerName: request.customerName,
        lines,
        subtotalInr,
        gstRatePercent,
        gstAmountInr,
        totalInr,
        status: 'Pending',
        notes,
        createdAt: new Date().toISOString(),
      };

      request.estimateId = newEstimate.id;
      request.requiresEstimate = true;
      request.status = 'Awaiting Approval';
      request.updatedAt = new Date().toISOString();

      store.estimates.unshift(newEstimate);

      store.events.unshift({
        id: `evt-${Date.now()}`,
        serviceRequestId: request.id,
        timestamp: new Date().toISOString(),
        actorId: actor?.id || 'sys',
        actorName: actor?.name || 'Service Center',
        actorRole: actor?.role || 'center',
        toStatus: 'Awaiting Approval',
        action: 'Repair Estimate Created',
        notes: `Total estimated cost: ₹${totalInr.toLocaleString('en-IN')} (incl. 18% GST).`,
      });

      store.notifications.unshift({
        id: `notif-${Date.now()}`,
        recipientRole: 'customer',
        recipientId: request.customerId,
        title: `Estimate Ready for ${request.ticketNumber}`,
        message: `An estimate of ₹${totalInr.toLocaleString(
          'en-IN'
        )} requires your approval before repair begins.`,
        timestamp: new Date().toISOString(),
        isRead: false,
        link: `/customer/requests/${request.id}`,
        type: 'warning',
      });

      saveStorage(store);
      return newEstimate;
    },

    recordDecision(
      estimateId: string,
      decision: 'Approved' | 'Rejected',
      reason?: string,
      actor?: { id: string; name: string; role: UserRole }
    ): Estimate {
      const store = getStore();
      const estimate = store.estimates.find((e) => e.id === estimateId);
      if (!estimate) throw new Error('Estimate not found');

      const request = store.requests.find((r) => r.id === estimate.serviceRequestId);
      if (!request) throw new Error('Associated ticket not found');

      estimate.status = decision;
      estimate.decidedAt = new Date().toISOString();
      if (reason) estimate.rejectionReason = reason;

      if (decision === 'Approved') {
        request.status = 'In Progress';
        request.updatedAt = new Date().toISOString();

        store.events.unshift({
          id: `evt-${Date.now()}`,
          serviceRequestId: request.id,
          timestamp: new Date().toISOString(),
          actorId: actor?.id || request.customerId,
          actorName: actor?.name || request.customerName || 'Customer',
          actorRole: 'customer',
          fromStatus: 'Awaiting Approval',
          toStatus: 'In Progress',
          action: 'Estimate Approved by Customer',
          notes: 'Customer approved repair estimate. Repair operations authorized to proceed.',
        });

        store.notifications.unshift({
          id: `notif-${Date.now()}`,
          recipientRole: 'center',
          recipientId: request.centerId,
          title: `Estimate Approved: ${request.ticketNumber}`,
          message: `${request.customerName} approved the estimate of ₹${estimate.totalInr.toLocaleString(
            'en-IN'
          )}. Repair resumed.`,
          timestamp: new Date().toISOString(),
          isRead: false,
          link: `/center/requests/${request.id}`,
          type: 'success',
        });
      } else {
        request.status = 'Cancelled';
        request.cancellationReason = `Estimate rejected by customer: ${reason || 'Cost declined'}`;
        request.updatedAt = new Date().toISOString();

        store.events.unshift({
          id: `evt-${Date.now()}`,
          serviceRequestId: request.id,
          timestamp: new Date().toISOString(),
          actorId: actor?.id || request.customerId,
          actorName: actor?.name || request.customerName || 'Customer',
          actorRole: 'customer',
          fromStatus: 'Awaiting Approval',
          toStatus: 'Cancelled',
          action: 'Estimate Rejected by Customer',
          notes: request.cancellationReason,
        });
      }

      saveStorage(store);
      return estimate;
    },
  },

  // ==========================================
  // SPARE PARTS
  // ==========================================
  spares: {
    getAll(centerId?: string): SparePart[] {
      const store = getStore();
      if (centerId) return store.spares.filter((s) => s.centerId === centerId);
      return store.spares;
    },

    adjustQuantity(id: string, adjustment: number): SparePart {
      const store = getStore();
      const spare = store.spares.find((s) => s.id === id);
      if (!spare) throw new Error('Spare part not found');

      const nextQuantity = spare.quantityInStock + adjustment;
      if (nextQuantity < 0) {
        throw new Error(
          `Cannot reduce stock below zero. Current stock: ${spare.quantityInStock}, Requested decrement: ${Math.abs(
            adjustment
          )}`
        );
      }

      spare.quantityInStock = nextQuantity;

      // Low stock notification
      if (spare.quantityInStock <= spare.minThreshold) {
        store.notifications.unshift({
          id: `notif-${Date.now()}`,
          recipientRole: 'center',
          recipientId: spare.centerId,
          title: `Low Stock: ${spare.partNumber}`,
          message: `${spare.name} stock reached ${spare.quantityInStock} units (Threshold: ${spare.minThreshold}).`,
          timestamp: new Date().toISOString(),
          isRead: false,
          link: '/center/spares',
          type: 'alert',
        });
      }

      saveStorage(store);
      return spare;
    },
  },

  // ==========================================
  // FEEDBACK
  // ==========================================
  feedback: {
    getAll(centerId?: string): Feedback[] {
      const store = getStore();
      if (centerId) return store.feedback.filter((f) => f.centerId === centerId);
      return store.feedback;
    },

    create(data: {
      serviceRequestId: string;
      rating: number;
      comment: string;
      resolutionSatisfaction: number;
      timelyArrivalSatisfaction: number;
      actor: { id: string; name: string };
    }): Feedback {
      const store = getStore();
      const request = store.requests.find((r) => r.id === data.serviceRequestId);
      if (!request) throw new Error('Ticket not found');

      if (request.status !== 'Completed' && request.status !== 'Closed') {
        throw new Error('Feedback can only be submitted after repair work is completed.');
      }

      if (data.rating < 1 || data.rating > 5) {
        throw new Error('Rating must be between 1 and 5 stars.');
      }

      const newFeedback: Feedback = {
        id: `fb-${Date.now()}`,
        serviceRequestId: request.id,
        ticketNumber: request.ticketNumber,
        customerId: request.customerId,
        customerName: request.customerName || data.actor.name,
        technicianId: request.technicianId,
        technicianName: request.technicianName,
        centerId: request.centerId,
        centerName: request.centerName,
        rating: data.rating,
        comment: data.comment,
        resolutionSatisfaction: data.resolutionSatisfaction,
        timelyArrivalSatisfaction: data.timelyArrivalSatisfaction,
        ratingDate: new Date().toISOString(),
      };

      request.hasFeedback = true;
      request.feedbackRating = data.rating;
      request.status = 'Closed'; // Feedback closes ticket
      request.updatedAt = new Date().toISOString();

      store.feedback.unshift(newFeedback);

      // Recalculate technician rating
      if (request.technicianId) {
        const tech = store.technicians.find((t) => t.id === request.technicianId);
        if (tech) {
          const techFeedbacks = store.feedback.filter((f) => f.technicianId === tech.id);
          const totalStars = techFeedbacks.reduce((acc, f) => acc + f.rating, 0);
          tech.rating = Math.round((totalStars / techFeedbacks.length) * 10) / 10;
          tech.completedTasksCount += 1;
          tech.activeTasksCount = Math.max(0, tech.activeTasksCount - 1);
        }
      }

      store.events.unshift({
        id: `evt-${Date.now()}`,
        serviceRequestId: request.id,
        timestamp: new Date().toISOString(),
        actorId: data.actor.id,
        actorName: data.actor.name,
        actorRole: 'customer',
        fromStatus: 'Completed',
        toStatus: 'Closed',
        action: 'Customer Feedback Submitted',
        notes: `Rated ${data.rating}/5 stars. "${data.comment}"`,
      });

      saveStorage(store);
      return newFeedback;
    },
  },

  // ==========================================
  // SERVICE EVENTS (AUDIT TIMELINE)
  // ==========================================
  events: {
    getByRequestId(serviceRequestId: string): ServiceEvent[] {
      return getStore().events.filter((e) => e.serviceRequestId === serviceRequestId);
    },
  },

  // ==========================================
  // NOTIFICATIONS
  // ==========================================
  notifications: {
    getAll(role: UserRole, recipientId?: string): Notification[] {
      const store = getStore();
      return store.notifications.filter((n) => {
        if (n.recipientRole !== role) return false;
        if (recipientId && n.recipientId && n.recipientId !== recipientId) return false;
        return true;
      });
    },

    markAsRead(id: string): void {
      const store = getStore();
      const notif = store.notifications.find((n) => n.id === id);
      if (notif) {
        notif.isRead = true;
        saveStorage(store);
      }
    },
  },

  // ==========================================
  // SERVICE CENTERS & TECHNICIANS
  // ==========================================
  centers: {
    getAll(): ServiceCenter[] {
      return getStore().centers.filter((c) => !c.isArchived);
    },

    getById(id: string): ServiceCenter | undefined {
      return getStore().centers.find((c) => c.id === id);
    },
  },

  technicians: {
    getAll(centerId?: string): Technician[] {
      const store = getStore();
      if (centerId) return store.technicians.filter((t) => t.centerId === centerId && !t.isArchived);
      return store.technicians.filter((t) => !t.isArchived);
    },

    getById(id: string): Technician | undefined {
      return getStore().technicians.find((t) => t.id === id);
    },
  },

  // ==========================================
  // COMPLAINTS
  // ==========================================
  complaints: {
    getAll(): Complaint[] {
      return getStore().complaints;
    },

    resolve(id: string, resolutionNotes: string): Complaint {
      const store = getStore();
      const complaint = store.complaints.find((c) => c.id === id);
      if (!complaint) throw new Error('Complaint not found');
      complaint.status = 'Resolved';
      complaint.resolutionNotes = resolutionNotes;
      complaint.resolvedAt = new Date().toISOString();
      saveStorage(store);
      return complaint;
    },
  },

  // ==========================================
  // METRICS & REPORTING
  // ==========================================
  reports: {
    getSummaryMetrics(): SystemMetrics {
      const store = getStore();
      const totalCustomers = store.customers.length;
      const totalProducts = store.products.length;
      const totalWarranties = store.warranties.length;
      const activeWarranties = store.warranties.filter((w) => w.status === 'Active').length;
      const expiringWarranties = store.warranties.filter((w) => w.status === 'Expiring Soon').length;

      const totalRequests = store.requests.length;
      const activeRequests = store.requests.filter(
        (r) => !['Completed', 'Closed', 'Cancelled'].includes(r.status)
      ).length;
      const completedRequests = store.requests.filter((r) => r.status === 'Completed' || r.status === 'Closed').length;
      const cancelledRequests = store.requests.filter((r) => r.status === 'Cancelled').length;

      const feedbackScores = store.feedback.map((f) => f.rating);
      const csatAverage =
        feedbackScores.length > 0
          ? Math.round((feedbackScores.reduce((a, b) => a + b, 0) / feedbackScores.length) * 10) / 10
          : 0;

      const activeAppointmentsToday = store.appointments.filter(
        (a) => a.scheduledDate === '2026-11-25' && a.status === 'Scheduled'
      ).length;

      const pendingEstimatesCount = store.estimates.filter((e) => e.status === 'Pending').length;

      return {
        totalCustomers,
        totalProducts,
        totalWarranties,
        activeWarranties,
        expiringWarranties,
        totalRequests,
        activeRequests,
        completedRequests,
        cancelledRequests,
        avgResolutionTimeHours: 18.5,
        csatAverage,
        totalCenters: store.centers.length,
        totalTechnicians: store.technicians.length,
        activeAppointmentsToday,
        pendingEstimatesCount,
      };
    },

    getStatusDistribution(): { status: TicketStatus; count: number }[] {
      const store = getStore();
      const counts: Record<string, number> = {};
      store.requests.forEach((r) => {
        counts[r.status] = (counts[r.status] || 0) + 1;
      });

      const allStatuses: TicketStatus[] = [
        'Submitted',
        'Under Review',
        'Assigned',
        'Scheduled',
        'In Progress',
        'Awaiting Parts',
        'Awaiting Approval',
        'Quality Check',
        'Completed',
        'Closed',
        'Cancelled',
      ];

      return allStatuses.map((s) => ({ status: s, count: counts[s] || 0 }));
    },
  },
};
