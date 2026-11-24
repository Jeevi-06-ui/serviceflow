import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';

export const metadata: Metadata = {
  title: 'ServiceFlow — Smart Warranty & After-Sales Service Management System',
  description:
    'Centralized after-sales service management platform for electronics dealers, service centers, technicians and customers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased font-sans text-slate-900 bg-slate-50">
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
