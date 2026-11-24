import { TicketStatus, UserRole } from '@/types';

/**
 * Strict transition map for ServiceFlow tickets.
 * Defines permitted target states from any given state, and role permissions.
 */
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

/**
 * Validates whether a status transition is allowed.
 */
export function isValidTransition(
  fromStatus: TicketStatus,
  toStatus: TicketStatus,
  requiresEstimate = false,
  estimateApproved = false
): { valid: boolean; reason?: string } {
  if (fromStatus === toStatus) {
    return { valid: true };
  }

  const allowedTargets = PERMITTED_STATUS_TRANSITIONS[fromStatus] || [];
  if (!allowedTargets.includes(toStatus)) {
    return {
      valid: false,
      reason: `Cannot transition directly from "${fromStatus}" to "${toStatus}". Permitted transitions: ${allowedTargets.join(', ') || 'None (Terminal state)'}.`,
    };
  }

  // Business Rule: Cannot progress past 'Awaiting Approval' or complete repair without estimate approval
  if (requiresEstimate && !estimateApproved) {
    if (fromStatus === 'Awaiting Approval' && toStatus === 'In Progress') {
      return {
        valid: false,
        reason: 'Cannot resume repair: Customer estimate approval is required before moving back to In Progress.',
      };
    }
    if (toStatus === 'Quality Check' || toStatus === 'Completed') {
      return {
        valid: false,
        reason: 'Cannot mark repair ready for QA or completion: Requires approved customer estimate.',
      };
    }
  }

  return { valid: true };
}

/**
 * Checks role permissions for specific status updates.
 */
export function isRoleAllowedTransition(
  role: UserRole,
  fromStatus: TicketStatus,
  toStatus: TicketStatus
): { allowed: boolean; reason?: string } {
  // Admin has full override permissions
  if (role === 'admin') {
    return { allowed: true };
  }

  // Customer can cancel only during early stages
  if (role === 'customer') {
    if (toStatus === 'Cancelled') {
      if (['Submitted', 'Under Review', 'Assigned', 'Scheduled', 'Awaiting Approval'].includes(fromStatus)) {
        return { allowed: true };
      }
      return {
        allowed: false,
        reason: 'Customer can only cancel requests before technician diagnosis begins, or upon rejecting an estimate.',
      };
    }
    return {
      allowed: false,
      reason: 'Customers cannot change ticket operational status directly.',
    };
  }

  // Technician can update progress stages
  if (role === 'technician') {
    const technicianAllowedTargets: Partial<Record<TicketStatus, TicketStatus[]>> = {
      Assigned: ['In Progress'],
      Scheduled: ['In Progress'],
      'In Progress': ['Awaiting Parts', 'Awaiting Approval', 'Quality Check'],
      'Awaiting Parts': ['In Progress'],
    };

    const allowed = technicianAllowedTargets[fromStatus]?.includes(toStatus) ?? false;
    if (!allowed) {
      return {
        allowed: false,
        reason: `Technicians are not authorized to transition from "${fromStatus}" to "${toStatus}". This step requires Service Center or Admin approval.`,
      };
    }
    return { allowed: true };
  }

  // Service Center can manage triage, assignment, scheduling, approval & completion
  if (role === 'center') {
    if (toStatus === 'Closed') {
      return { allowed: true };
    }
    return { allowed: true };
  }

  return { allowed: true };
}
