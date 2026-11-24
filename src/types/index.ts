// ServiceFlow Core Domain Models and Type Definitions

export type UserRole = 'customer' | 'center' | 'technician' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  customerId?: string;
  centerId?: string;
  technicianId?: string;
}

export interface Customer {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
  registeredAt: string;
  isArchived?: boolean;
}

export type ProductCategory =
  | 'Smartphone'
  | 'Laptop'
  | 'Television'
  | 'Air Conditioner'
  | 'Refrigerator'
  | 'Washing Machine'
  | 'Microwave Oven'
  | 'Audio System';

export interface Product {
  id: string;
  customerId: string;
  customerName?: string;
  serialNumber: string;
  modelName: string;
  category: ProductCategory;
  brand: string;
  purchaseDate: string; // ISO date YYYY-MM-DD
  seller: string;
  invoiceNumber: string;
  simulatedInvoiceUrl?: string;
  createdAt: string;
}

export type WarrantyCoverage = 'Comprehensive' | 'Standard' | 'Extended' | 'Limited';

export type WarrantyStatus = 'Active' | 'Expiring Soon' | 'Expired' | 'Void' | 'Not Yet Active';

export interface Warranty {
  id: string;
  productId: string;
  customerId: string;
  policyNumber: string;
  coverageType: WarrantyCoverage;
  startDate: string; // ISO date YYYY-MM-DD
  endDate: string; // ISO date YYYY-MM-DD
  status: WarrantyStatus;
  claimLimitInr: number;
  termsUrl?: string;
  termsSummary?: string;
}

export interface WarrantyClaim {
  id: string;
  warrantyId: string;
  serviceRequestId: string;
  customerId: string;
  claimDate: string;
  amountClaimedInr: number;
  status: 'Approved' | 'Pending' | 'Rejected';
  reason?: string;
  processedAt?: string;
}

export type CenterCity = 'Bengaluru' | 'Chennai' | 'Hyderabad' | 'Mumbai';

export interface ServiceCenter {
  id: string;
  name: string;
  code: string;
  city: CenterCity;
  address: string;
  phone: string;
  email: string;
  operatingHours: string;
  activeTechniciansCount: number;
  capacityPerDay: number;
  isArchived?: boolean;
}

export type TechnicianStatus = 'Available' | 'On Job' | 'Off Duty';

export interface Technician {
  id: string;
  userId: string;
  centerId: string;
  centerName?: string;
  name: string;
  email: string;
  phone: string;
  skills: ProductCategory[];
  activeTasksCount: number;
  completedTasksCount: number;
  rating: number; // e.g. 4.8
  status: TechnicianStatus;
  isArchived?: boolean;
}

export type TicketStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Assigned'
  | 'Scheduled'
  | 'In Progress'
  | 'Awaiting Parts'
  | 'Awaiting Approval'
  | 'Quality Check'
  | 'Completed'
  | 'Closed'
  | 'Cancelled';

export type IssueCategory =
  | 'Power Failure'
  | 'Display / Screen'
  | 'Cooling Issue'
  | 'Mechanical Noise'
  | 'Water Leakage'
  | 'Software Glitch'
  | 'Hardware Damage'
  | 'Periodic Maintenance';

export type TicketSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export interface ServiceRequest {
  id: string;
  ticketNumber: string; // e.g. "SR-2026-1001"
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  productId: string;
  productName?: string;
  productCategory?: ProductCategory;
  serialNumber?: string;
  warrantyId?: string;
  warrantyStatus?: WarrantyStatus;
  centerId?: string;
  centerName?: string;
  technicianId?: string;
  technicianName?: string;
  issueCategory: IssueCategory;
  description: string;
  severity: TicketSeverity;
  status: TicketStatus;
  preferredDate: string; // YYYY-MM-DD
  preferredTimeSlot: string; // e.g. "10:00 AM - 01:00 PM"
  scheduledDate?: string;
  scheduledTimeSlot?: string;
  estimatedCompletionDate?: string;
  requiresEstimate: boolean;
  estimateId?: string;
  diagnosticNotes?: string;
  cancellationReason?: string;
  resolutionNotes?: string;
  simulatedAttachmentUrl?: string;
  hasFeedback?: boolean;
  feedbackRating?: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Appointment {
  id: string;
  serviceRequestId: string;
  ticketNumber: string;
  centerId: string;
  technicianId: string;
  technicianName: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  scheduledDate: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:00 AM - 12:00 PM"
  status: 'Scheduled' | 'Rescheduled' | 'Completed' | 'Cancelled';
  notes?: string;
}

export type EstimateLineType = 'Part' | 'Labor' | 'Inspection';

export interface EstimateLine {
  id: string;
  description: string;
  type: EstimateLineType;
  quantity: number;
  unitPriceInr: number;
  amountInr: number;
}

export interface Estimate {
  id: string;
  serviceRequestId: string;
  ticketNumber: string;
  centerId: string;
  customerId: string;
  customerName?: string;
  lines: EstimateLine[];
  subtotalInr: number;
  gstRatePercent: number; // default 18
  gstAmountInr: number;
  totalInr: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  notes?: string;
  rejectionReason?: string;
  createdAt: string;
  decidedAt?: string;
}

export interface SparePart {
  id: string;
  centerId: string;
  partNumber: string; // e.g. "SPR-AC-782"
  name: string;
  category: ProductCategory;
  compatibleModels: string[];
  quantityInStock: number;
  minThreshold: number;
  unitCostInr: number;
  location?: string;
}

export interface ServiceEvent {
  id: string;
  serviceRequestId: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  fromStatus?: TicketStatus;
  toStatus?: TicketStatus;
  action: string;
  notes?: string;
}

export interface Notification {
  id: string;
  recipientRole: UserRole;
  recipientId?: string; // customerId, centerId, technicianId, or user id
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
  type: 'info' | 'warning' | 'success' | 'alert';
}

export interface Feedback {
  id: string;
  serviceRequestId: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  technicianId?: string;
  technicianName?: string;
  centerId?: string;
  centerName?: string;
  rating: number; // 1 to 5
  comment: string;
  resolutionSatisfaction: number; // 1 to 5
  timelyArrivalSatisfaction: number; // 1 to 5
  ratingDate: string;
}

export type ComplaintCategory =
  | 'Delayed Service'
  | 'Unprofessional Behavior'
  | 'Fault Recurring'
  | 'Pricing Dispute'
  | 'Spare Unavailable';

export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Escalated';

export interface Complaint {
  id: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  serviceRequestId?: string;
  centerId?: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  status: 'Open' | 'Investigating' | 'Resolved' | 'Closed';
  description: string;
  resolutionNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface SystemMetrics {
  totalCustomers: number;
  totalProducts: number;
  totalWarranties: number;
  activeWarranties: number;
  expiringWarranties: number;
  totalRequests: number;
  activeRequests: number;
  completedRequests: number;
  cancelledRequests: number;
  avgResolutionTimeHours: number;
  csatAverage: number;
  totalCenters: number;
  totalTechnicians: number;
  activeAppointmentsToday: number;
  pendingEstimatesCount: number;
}
