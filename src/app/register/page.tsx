'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Repository } from '@/lib/api/repository';

export default function RegisterPage() {
  const router = useRouter();
  const { switchRole } = useAuth();
  const toast = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [city, setCity] = useState('Bengaluru');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      Repository.customers.create({
        userId: `usr-demo-${Date.now()}`,
        name,
        email,
        phone,
        address: {
          street: 'Sample Demo Address, 5th Cross',
          city,
          state: city === 'Bengaluru' ? 'Karnataka' : city === 'Chennai' ? 'Tamil Nadu' : 'Telangana',
          postalCode: '560001',
        },
      });

      toast.success('Registration successful! Switched to Customer portal.');
      switchRole('customer');
    } catch {
      toast.error('Failed to create account.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex w-10 h-10 rounded-xl bg-teal-600 text-white items-center justify-center font-black text-base shadow-md mb-3">
          SF
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Create Demo Customer Account</h2>
        <p className="mt-1 text-xs text-slate-500">Register as a customer to manage your home electronics & warranties</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-card rounded-2xl border border-slate-200 sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="rahul.sharma@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number (India)</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
              >
                <option value="Bengaluru">Bengaluru</option>
                <option value="Chennai">Chennai</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Mumbai">Mumbai</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors mt-2"
            >
              Register & Sign In
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="text-teal-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
