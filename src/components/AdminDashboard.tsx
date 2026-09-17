"use client";

import { useEffect, useState } from "react";
import { getAllAdminTenants, adminUpdateTenant } from "@/lib/api";

interface AdminDashboardProps {
  onLogout: () => void;
}

// Helper to format ISO string to local YYYY-MM-DDThh:mm for datetime-local inputs
const toLocalInputFormat = (isoString: string) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit Modal State
  const [editingTenant, setEditingTenant] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    status: "",
    organizer_whatsapp_number: "",
    start_date: "",
    expiry_date: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllAdminTenants();
      setTenants(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (tenant: any) => {
    const sub = tenant.subscriptions?.[0] || {};
    setEditingTenant(tenant);
    setEditForm({
      status: sub.status || tenant.status || "",
      organizer_whatsapp_number: tenant.organizer_whatsapp_number || "",
      start_date: sub.start_date || "",
      expiry_date: sub.expiry_date || "",
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTenant) return;

    try {
      setSaving(true);
      // Remove empty strings so we don't accidentally update fields we didn't intend to
      const payload: any = {};
      if (editForm.status) payload.status = editForm.status;
      if (editForm.organizer_whatsapp_number) payload.organizer_whatsapp_number = editForm.organizer_whatsapp_number;
      if (editForm.start_date) payload.start_date = editForm.start_date;
      if (editForm.expiry_date) payload.expiry_date = editForm.expiry_date;

      await adminUpdateTenant(editingTenant.id, payload);
      
      // Close modal and refresh data
      setEditingTenant(null);
      await fetchData();
    } catch (err: any) {
      alert("Failed to update: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-white">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-400">
        <p>Error: {error}</p>
        <button onClick={fetchData} className="mt-4 px-4 py-2 bg-red-600 rounded">Retry</button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Tambola Admin Dashboard</h1>
        <button 
          onClick={onLogout}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded transition"
        >
          Logout
        </button>
      </div>

      <div className="bg-[#063940]/50 border border-white/10 rounded-xl overflow-x-auto shadow-xl">
        <table className="w-full text-left text-sm text-gray-200">
          <thead className="text-xs uppercase bg-black/40 text-gray-300">
            <tr>
              <th className="px-4 py-3">Business / Domain</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Password</th>
              <th className="px-4 py-3">WhatsApp</th>
              <th className="px-4 py-3">Tenant Status</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Sub Status</th>
              <th className="px-4 py-3">Sub Start / Expiry</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {tenants.map((tenant) => {
              const sub = tenant.subscriptions?.[0] || {};
              return (
                <tr key={tenant.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-bold text-white">{tenant.business_name}</div>
                    <div className="text-xs text-gray-400">{tenant.domain}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div>{tenant.owner_name}</div>
                    <div className="text-xs text-gray-400">{tenant.owner_email}</div>
                    <div className="text-xs text-gray-400">{tenant.owner_phone}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-accent">
                    {tenant.owner_password || "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    {tenant.organizer_whatsapp_number || "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      tenant.status === 'active' ? 'bg-green-500/20 text-green-300' :
                      tenant.status === 'suspended' ? 'bg-red-500/20 text-red-300' :
                      'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {tenant.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 capitalize">{sub.plan || "N/A"}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1 items-start">
                      {sub.is_paid ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500 text-white uppercase tracking-wider">Paid</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-500 text-white uppercase tracking-wider">Unpaid</span>
                      )}
                      
                      {sub.status ? (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          sub.status === 'active' ? 'bg-green-500/20 text-green-300' :
                          sub.status === 'expired' ? 'bg-red-500/20 text-red-300' :
                          'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {sub.status}
                        </span>
                      ) : <span className="text-xs">N/A</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap">
                    <div>Start: {sub.start_date ? new Date(sub.start_date).toLocaleDateString() : "N/A"}</div>
                    <div>Exp: {sub.expiry_date ? new Date(sub.expiry_date).toLocaleDateString() : "N/A"}</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEditModal(tenant)}
                      className="px-3 py-1.5 bg-accent hover:bg-accent/80 text-black font-medium rounded text-xs transition"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}
            
            {tenants.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                  No tenants found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#063940] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
            <div className="bg-black py-4 px-6 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-white font-bold uppercase">Edit Tenant</h3>
              <button onClick={() => setEditingTenant(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-white text-xs font-bold mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                  className="w-full px-3 py-2 rounded bg-white text-black text-sm"
                >
                  <option value="">Keep current</option>
                  <option value="pending_activation">Pending Activation</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired (Suspends Tenant)</option>
                </select>
              </div>

              <div>
                <label className="block text-white text-xs font-bold mb-1">WhatsApp Number</label>
                <input
                  type="text"
                  value={editForm.organizer_whatsapp_number}
                  onChange={(e) => setEditForm({...editForm, organizer_whatsapp_number: e.target.value})}
                  className="w-full px-3 py-2 rounded bg-white text-black text-sm"
                  placeholder="+91..."
                />
              </div>

              <div>
                <label className="block text-white text-xs font-bold mb-1">Start Date</label>
                <input
                  type="datetime-local"
                  value={toLocalInputFormat(editForm.start_date)}
                  onChange={(e) => {
                    if (!e.target.value) {
                      setEditForm({ ...editForm, start_date: "" });
                      return;
                    }
                    const dateObj = new Date(e.target.value);
                    setEditForm({ ...editForm, start_date: isNaN(dateObj.getTime()) ? "" : dateObj.toISOString() });
                  }}
                  className="w-full px-3 py-2 rounded bg-white text-black text-sm"
                />
              </div>

              <div>
                <label className="block text-white text-xs font-bold mb-1">Expiry Date</label>
                <input
                  type="datetime-local"
                  value={toLocalInputFormat(editForm.expiry_date)}
                  onChange={(e) => {
                    if (!e.target.value) {
                      setEditForm({ ...editForm, expiry_date: "" });
                      return;
                    }
                    const dateObj = new Date(e.target.value);
                    setEditForm({ ...editForm, expiry_date: isNaN(dateObj.getTime()) ? "" : dateObj.toISOString() });
                  }}
                  className="w-full px-3 py-2 rounded bg-white text-black text-sm"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingTenant(null)}
                  className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded font-medium text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium text-sm transition disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
