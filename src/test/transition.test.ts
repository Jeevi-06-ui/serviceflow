import { describe, it, expect } from 'vitest';
import { isValidTransition, isRoleAllowedTransition } from '../lib/workflow/transition-rules';

describe('Ticket Status Machine & Workflow Transition Rules', () => {
  it('permits valid linear progression (Submitted -> Under Review -> Assigned -> Scheduled -> In Progress)', () => {
    expect(isValidTransition('Submitted', 'Under Review').valid).toBe(true);
    expect(isValidTransition('Under Review', 'Assigned').valid).toBe(true);
    expect(isValidTransition('Assigned', 'Scheduled').valid).toBe(true);
    expect(isValidTransition('Scheduled', 'In Progress').valid).toBe(true);
  });

  it('rejects illegal stage skipping (Submitted directly to Completed)', () => {
    const check = isValidTransition('Submitted', 'Completed');
    expect(check.valid).toBe(false);
    expect(check.reason).toContain('Cannot transition directly');
  });

  it('enforces Estimate Approval Gate: cannot resume In Progress or complete without approved estimate', () => {
    // When estimate is required but not approved:
    const checkResume = isValidTransition('Awaiting Approval', 'In Progress', true, false);
    expect(checkResume.valid).toBe(false);
    expect(checkResume.reason).toContain('estimate approval is required');

    const checkComplete = isValidTransition('In Progress', 'Quality Check', true, false);
    expect(checkComplete.valid).toBe(false);
    expect(checkComplete.reason).toContain('Requires approved customer estimate');

    // When estimate is approved:
    const checkApproved = isValidTransition('Awaiting Approval', 'In Progress', true, true);
    expect(checkApproved.valid).toBe(true);
  });

  it('restricts role permissions properly', () => {
    // Customer cannot move ticket to 'Completed'
    const customerCheck = isRoleAllowedTransition('customer', 'In Progress', 'Completed');
    expect(customerCheck.allowed).toBe(false);

    // Customer CAN cancel early
    const customerCancel = isRoleAllowedTransition('customer', 'Submitted', 'Cancelled');
    expect(customerCancel.allowed).toBe(true);

    // Technician cannot mark ticket 'Closed'
    const techCheck = isRoleAllowedTransition('technician', 'Completed', 'Closed');
    expect(techCheck.allowed).toBe(false);

    // Admin has full override permissions
    const adminCheck = isRoleAllowedTransition('admin', 'Submitted', 'Closed');
    expect(adminCheck.allowed).toBe(true);
  });
});
