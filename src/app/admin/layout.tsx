'use client';

import { ThemeProvider } from '@/contexts/ThemeContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </div>
  );
}
