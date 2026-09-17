"use client";

import { useState } from "react";
import AdminLoginModal from "@/components/AdminLoginModal";
import AdminDashboard from "@/components/AdminDashboard";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <main className="min-h-screen bg-dark-bg text-white relative">
      {/* 
        Simple client-side state for auth.
        If the user refreshes the page, this state is lost and they must log in again,
        fulfilling the requirement to avoid session storage.
      */}
      {!isAuthenticated ? (
        <AdminLoginModal onLogin={() => setIsAuthenticated(true)} />
      ) : (
        <AdminDashboard onLogout={() => setIsAuthenticated(false)} />
      )}
    </main>
  );
}
