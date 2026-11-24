export type TourRole = 'all' | 'customer' | 'center' | 'technician' | 'admin';

export interface TourStep {
  id: string;
  stepNumber: number;
  totalSteps: number;
  title: string;
  role: TourRole;
  targetRoute: string;
  targetElementSelector?: string;
  voiceScript: string;
  summaryBullets: string[];
}

export const COMPLETE_VOICE_TOUR: TourStep[] = [
  {
    id: 'tour-intro',
    stepNumber: 1,
    totalSteps: 9,
    title: 'Welcome to ServiceFlow by Jeevix Technologies',
    role: 'all',
    targetRoute: '/',
    voiceScript:
      'Welcome to ServiceFlow, the smart warranty and after-sales service management system developed by Kishore R for Jeevix Technologies. ServiceFlow unifies the entire after-sales lifecycle across four enterprise personas: customers, service centers, field technicians, and executive administrators. I will now guide you automatically across each operational module.',
    summaryBullets: [
      'Built with Next.js 14 App Router, TypeScript, and Tailwind CSS',
      'Realistic fictional Indian service data formatted in Asia/Kolkata timezone and INR currency',
      'Unified 4-role architecture with one-click perspective switching',
    ],
  },
  {
    id: 'tour-cust-dash',
    stepNumber: 2,
    totalSteps: 9,
    title: 'Customer Self-Service Hub',
    role: 'customer',
    targetRoute: '/customer/dashboard',
    voiceScript:
      'We have now entered the Customer Portal from the perspective of Priya Sharma in Bengaluru. Notice the top welcome banner, key performance metrics, and the warning alert indicating warranties nearing expiry. Customers can track their home appliances, view live repair tickets, and schedule certified doorstep service appointments.',
    summaryBullets: [
      'Real-time KPI metrics for appliances, active warranties, and open repairs',
      'Proactive warning banners for policies expiring within 30 days',
      'Quick action shortcuts to register appliances and book doorstep repairs',
    ],
  },
  {
    id: 'tour-cust-products',
    stepNumber: 3,
    totalSteps: 9,
    title: 'Appliance Registry & Digital Warranty Cards',
    role: 'customer',
    targetRoute: '/customer/products',
    voiceScript:
      'Here in the Registered Products directory, each customer appliance is tracked with its unique serial number, authorized seller, and purchase date. Notice the Warranty Card action button. Clicking it generates an official digital warranty certificate with barcode verification and printable layout, complete with terms and claim liability limits.',
    summaryBullets: [
      'Duplicate serial number rejection prevents fraud',
      'Simulated invoice attachment with size and MIME type validation',
      'Printable Digital Warranty Certificates with barcode verification',
    ],
  },
  {
    id: 'tour-cust-requests',
    stepNumber: 4,
    totalSteps: 9,
    title: 'Doorstep Repair Ticketing & Estimate Gate',
    role: 'customer',
    targetRoute: '/customer/requests',
    voiceScript:
      'When an appliance experiences a fault, customers book a repair specifying symptom category, severity, and preferred time windows. Each ticket gets a unique identifier like SR-2026-1002. Furthermore, if a repair requires customer payment, the ticket halts at Awaiting Approval until the customer reviews and authorizes the itemized estimate.',
    summaryBullets: [
      'Comprehensive 11-stage workflow state machine',
      'Tamper-evident chronological audit event timeline',
      'Customer estimate approval gate protecting against unauthorized charges',
    ],
  },
  {
    id: 'tour-center-dash',
    stepNumber: 5,
    totalSteps: 9,
    title: 'Service Center Operations & Triage Queue',
    role: 'center',
    targetRoute: '/center/dashboard',
    voiceScript:
      'Switching to the Bengaluru Central Service Hub, managed by Rajesh Nair. The center dashboard monitors live intake queues, active repair bays, and on-duty technician workloads. Managers can triage incoming tickets, monitor spare parts thresholds, and dispatch certified specialists.',
    summaryBullets: [
      'Triage queue partitioned by priority and severity',
      'Low-stock spare parts threshold warning alerts',
      'Live technician availability and task capacity tracking',
    ],
  },
  {
    id: 'tour-center-dispatch',
    stepNumber: 6,
    totalSteps: 9,
    title: 'Conflict-Free Dispatch & Itemized Estimates',
    role: 'center',
    targetRoute: '/center/requests/req-2',
    voiceScript:
      'On this ticket detail screen, the service center coordinates technician assignment with certified skill matching. The scheduling calendar includes an automated collision detection engine that prevents double-booking technicians. Centers can also generate itemized estimates including parts, labor, and 18 percent GST.',
    summaryBullets: [
      'Technician assignment matched to device skill categories',
      'Clash detection engine strictly prevents technician double-booking',
      'Itemized repair quote generator with automated 18% GST calculation',
    ],
  },
  {
    id: 'tour-tech-dash',
    stepNumber: 7,
    totalSteps: 9,
    title: 'Field Technician Daily Run Sheet',
    role: 'technician',
    targetRoute: '/technician/dashboard',
    voiceScript:
      'Now viewing Senior Specialist Vikram Verma’s daily run sheet. Technicians access a chronological list of confirmed doorstep visits with customer addresses and phone numbers. Workmanship rules require technicians to document root-cause diagnostic findings before advancing a job to Quality Check.',
    summaryBullets: [
      'Chronological daily visit schedule with turn-by-turn customer details',
      'Mandatory diagnostic and root cause logging before state progression',
      'Quality Check submission and personal CSAT performance scorecards',
    ],
  },
  {
    id: 'tour-admin-dash',
    stepNumber: 8,
    totalSteps: 9,
    title: 'Executive Admin Command Center',
    role: 'admin',
    targetRoute: '/admin/dashboard',
    voiceScript:
      'We have now arrived at the Executive Admin Portal, overseen by Operations VP Arun Kumar. Interactive Recharts graphs visualize ticket distributions across all eleven lifecycle states alongside 6-month repair volume trends across our Bengaluru, Chennai, Hyderabad, and Mumbai hubs.',
    summaryBullets: [
      'Pan-India operational KPIs aggregated across 4 tier-1 service hubs',
      'Interactive Recharts status distribution bar and volume trend charts',
      'Regional service hub turnaround time and customer CSAT benchmarks',
    ],
  },
  {
    id: 'tour-admin-reports',
    stepNumber: 9,
    totalSteps: 9,
    title: 'Audit Reports, CSV Exports & Tour Conclusion',
    role: 'admin',
    targetRoute: '/admin/reports',
    voiceScript:
      'In the Executive Reports section, administrators can print operational audit summaries and export complete datasets to CSV. This concludes our automated guided voice tour of ServiceFlow. You may replay any section, explore freely, or use the Reset Demo Data button in the header at any time.',
    summaryBullets: [
      'RFC 4180 compliant CSV export for offline analysis',
      'Print-optimized executive audit summaries with zero UI distractions',
      'Confirmed Reset Demo Data feature to restore clean deterministic seeds',
    ],
  },
];
