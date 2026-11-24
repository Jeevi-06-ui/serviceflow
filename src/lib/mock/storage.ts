import {
  User,
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
} from '@/types';

import {
  SEED_USERS,
  SEED_CUSTOMERS,
  SEED_PRODUCTS,
  SEED_WARRANTIES,
  SEED_CENTERS,
  SEED_TECHNICIANS,
  SEED_REQUESTS,
  SEED_APPOINTMENTS,
  SEED_ESTIMATES,
  SEED_SPARES,
  SEED_SERVICE_EVENTS,
  SEED_NOTIFICATIONS,
  SEED_FEEDBACK,
  SEED_COMPLAINTS,
} from './seed-data';

const STORAGE_VERSION = 'v1.4';
const STORAGE_PREFIX = `serviceflow_${STORAGE_VERSION}_`;

export interface StorageDataStore {
  users: User[];
  customers: Customer[];
  products: Product[];
  warranties: Warranty[];
  centers: ServiceCenter[];
  technicians: Technician[];
  requests: ServiceRequest[];
  appointments: Appointment[];
  estimates: Estimate[];
  spares: SparePart[];
  events: ServiceEvent[];
  notifications: Notification[];
  feedback: Feedback[];
  complaints: Complaint[];
  activeUserId: string;
}

// In-memory store for SSR environments
let memoryStore: StorageDataStore = {
  users: [...SEED_USERS],
  customers: [...SEED_CUSTOMERS],
  products: [...SEED_PRODUCTS],
  warranties: [...SEED_WARRANTIES],
  centers: [...SEED_CENTERS],
  technicians: [...SEED_TECHNICIANS],
  requests: [...SEED_REQUESTS],
  appointments: [...SEED_APPOINTMENTS],
  estimates: [...SEED_ESTIMATES],
  spares: [...SEED_SPARES],
  events: [...SEED_SERVICE_EVENTS],
  notifications: [...SEED_NOTIFICATIONS],
  feedback: [...SEED_FEEDBACK],
  complaints: [...SEED_COMPLAINTS],
  activeUserId: SEED_USERS[3].id, // Default to Customer (Priya Sharma)
};

function isClient(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

/**
 * Initializes localStorage with versioned deterministic seed data if not already populated.
 */
export function initializeStorage(): StorageDataStore {
  if (!isClient()) {
    return memoryStore;
  }

  const key = `${STORAGE_PREFIX}store`;
  const existing = window.localStorage.getItem(key);

  if (existing) {
    try {
      const parsed = JSON.parse(existing) as StorageDataStore;
      memoryStore = parsed;
      return parsed;
    } catch {
      console.warn('Failed to parse existing ServiceFlow localStorage. Re-seeding database.');
    }
  }

  const initialStore: StorageDataStore = {
    users: [...SEED_USERS],
    customers: [...SEED_CUSTOMERS],
    products: [...SEED_PRODUCTS],
    warranties: [...SEED_WARRANTIES],
    centers: [...SEED_CENTERS],
    technicians: [...SEED_TECHNICIANS],
    requests: [...SEED_REQUESTS],
    appointments: [...SEED_APPOINTMENTS],
    estimates: [...SEED_ESTIMATES],
    spares: [...SEED_SPARES],
    events: [...SEED_SERVICE_EVENTS],
    notifications: [...SEED_NOTIFICATIONS],
    feedback: [...SEED_FEEDBACK],
    complaints: [...SEED_COMPLAINTS],
    activeUserId: SEED_USERS[3].id,
  };

  saveStorage(initialStore);
  return initialStore;
}

/**
 * Persists the entire store to localStorage and updates in-memory cache.
 */
export function saveStorage(store: StorageDataStore): void {
  memoryStore = store;
  if (isClient()) {
    try {
      window.localStorage.setItem(`${STORAGE_PREFIX}store`, JSON.stringify(store));
      // Dispatch custom event for cross-component sync
      window.dispatchEvent(new Event('serviceflow-storage-updated'));
    } catch (e) {
      console.error('Error saving ServiceFlow storage to localStorage:', e);
    }
  }
}

/**
 * Completely resets browser demo data back to clean deterministic seeds.
 */
export function resetDemoData(): StorageDataStore {
  const freshStore: StorageDataStore = {
    users: [...SEED_USERS],
    customers: [...SEED_CUSTOMERS],
    products: [...SEED_PRODUCTS],
    warranties: [...SEED_WARRANTIES],
    centers: [...SEED_CENTERS],
    technicians: [...SEED_TECHNICIANS],
    requests: [...SEED_REQUESTS],
    appointments: [...SEED_APPOINTMENTS],
    estimates: [...SEED_ESTIMATES],
    spares: [...SEED_SPARES],
    events: [...SEED_SERVICE_EVENTS],
    notifications: [...SEED_NOTIFICATIONS],
    feedback: [...SEED_FEEDBACK],
    complaints: [...SEED_COMPLAINTS],
    activeUserId: SEED_USERS[3].id,
  };

  saveStorage(freshStore);
  return freshStore;
}

/**
 * Gets current store state.
 */
export function getStore(): StorageDataStore {
  if (isClient()) {
    const key = `${STORAGE_PREFIX}store`;
    const data = window.localStorage.getItem(key);
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        // fallback
      }
    }
  }
  return memoryStore;
}
