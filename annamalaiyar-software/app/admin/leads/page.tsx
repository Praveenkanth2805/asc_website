"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import GlassCard from "@/components/GlassCard";

const statusOptions = [
  "NEW", "CONTACTED", "IN_DISCUSSION", "QUOTE_SENT", "ACCEPTED", "REJECTED",
  "PROJECT_STARTED", "WAITING_CLIENT", "IN_PROGRESS", "COMPLETED", "DELIVERED"
];

export default function LeadsAdmin() {
  const [leads, setLeads] = useState<any[]>([]);
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

  const fetchLeads = async () => {
    const { data } = await axios.get("/api/admin/leads", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setLeads(data);
  };

  useEffect(() => { fetchLeads(); }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    await axios.put(`/api/admin/leads/${id}`, { status: newStatus }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchLeads();
  };

  return (
    <div>
      <h1 className="text-3xl text-gold-400 mb-6">Leads</h1>
      <div className="space-y-4">
        {leads.map((lead) => (
          <GlassCard key={lead.id} className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <p className="font-semibold">{lead.name} ({lead.email})</p>
              <p className="text-sm text-gray-400">{lead.phone} — {lead.service || "General"}</p>
              <p className="text-sm mt-1">{lead.message}</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={lead.status}
                onChange={(e) => updateStatus(lead.id, e.target.value)}
                className="bg-white/10 rounded p-2 text-sm"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s.replace("_", " ")}</option>
                ))}
              </select>
              <a
                href={`/admin/leads/${lead.id}`}
                className="text-gold-400 underline text-sm whitespace-nowrap"
              >
                View / Quote
              </a>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}