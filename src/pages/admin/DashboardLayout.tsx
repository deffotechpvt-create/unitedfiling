// src/pages/admin/DashboardLayout.tsx
import React, { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
