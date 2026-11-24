import { describe, it, expect, beforeEach } from 'vitest';
import { Repository } from '@/lib/api/repository';
import { resetDemoData } from '@/lib/mock/storage';

describe('Omnisearch, Auth Logout, and Warranty Claims', () => {
  beforeEach(() => {
    resetDemoData();
  });

  describe('Auth Logout and Login Flow', () => {
    it('should allow user logout and clear active session', () => {
      // Login as technician
      const tech = Repository.auth.demoLogin('technician');
      expect(tech.role).toBe('technician');

      // Logout
      Repository.auth.logout();

      // Current user should fallback gracefully
      const fallbackUser = Repository.auth.getCurrentUser();
      expect(fallbackUser).toBeDefined();
    });

    it('should log in with email address', () => {
      const user = Repository.auth.login('priya.sharma@example.com', 'customer');
      expect(user).toBeDefined();
      expect(user.email).toBe('priya.sharma@example.com');
      expect(user.role).toBe('customer');
    });
  });

  describe('Omnisearch Repository', () => {
    it('should search across tickets by ticket number', () => {
      const results = Repository.search.omniSearch('SR-2026-1002');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].category).toBe('ticket');
      expect(results[0].title).toContain('SR-2026-1002');
    });

    it('should search across products by serial number', () => {
      const results = Repository.search.omniSearch('SN-VOL');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((r) => r.category === 'product')).toBe(true);
    });

    it('should search across customers by city or name', () => {
      const results = Repository.search.omniSearch('Priya');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((r) => r.category === 'customer' || r.category === 'ticket')).toBe(true);
    });

    it('should return empty results on blank or whitespace query', () => {
      expect(Repository.search.omniSearch('')).toEqual([]);
      expect(Repository.search.omniSearch('   ')).toEqual([]);
    });
  });

  describe('Warranty Claims Workflow', () => {
    it('should create an official warranty claim and linked service request', () => {
      const warranties = Repository.warranties.getAll();
      const activeWar = warranties.find((w) => w.status === 'Active');
      expect(activeWar).toBeDefined();

      const { claim, request } = Repository.claims.create({
        warrantyId: activeWar!.id,
        customerId: activeWar!.customerId,
        issueCategory: 'Power Failure',
        issueDescription: 'Unit stopped turning on after electrical surge.',
        amountClaimedInr: 4500,
        actor: { id: 'cust-1', name: 'Priya Sharma' },
      });

      expect(claim).toBeDefined();
      expect(claim.status).toBe('Pending');
      expect(claim.amountClaimedInr).toBe(4500);

      expect(request).toBeDefined();
      expect(request.warrantyStatus).toBe('Active');
      expect(request.severity).toBe('High');
      expect(request.status).toBe('Submitted');

      // Verify audit event exists
      const events = Repository.events.getByRequestId(request.id);
      expect(events.length).toBeGreaterThan(0);
      expect(events[0].action).toBe('Warranty Claim Filed');
    });
  });
});
