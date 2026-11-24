import React from 'react';
import Link from 'next/link';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-xl text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
          <FileQuestion className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">404 — Page Not Found</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          The requested service route does not exist or has been archived in this demo build.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Safety
        </Link>
      </div>
    </div>
  );
}
