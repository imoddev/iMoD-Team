"use client";

import Sidebar from "@/components/Sidebar";
import { AuthProvider } from "@/lib/auth";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-950">
          <Sidebar />
          <main className="ml-64 p-6">{children}</main>
        </div>
      </ProtectedRoute>
    </AuthProvider>
  );
}
