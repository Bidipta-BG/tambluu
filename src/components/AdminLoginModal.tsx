"use client";

import { useState } from "react";
import { ADMIN_CREDENTIALS } from "@/lib/admin-credentials";

interface AdminLoginModalProps {
  onLogin: () => void;
}

export default function AdminLoginModal({ onLogin }: AdminLoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const isValid = ADMIN_CREDENTIALS.some(
      (cred) => cred.username === username && cred.password === password
    );

    if (isValid) {
      onLogin();
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#063940] border border-white/10 rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="bg-black py-4 border-b border-white/10">
          <h2 className="text-white text-center font-bold text-lg uppercase tracking-wider">
            Admin Login
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-white text-sm font-bold mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-accent font-medium"
              placeholder="Enter admin username"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-white text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-accent font-medium"
              placeholder="Enter admin password"
            />
          </div>

          {error && <p className="text-red-400 text-sm font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded transition-colors text-lg"
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
}
