"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function NewProject() {
  const router = useRouter();
  const [leads, setLeads] = useState<any[]>([]);
  const [form, setForm] = useState({
    leadId: "",
    quoteId: "",
    status: "PROJECT_STARTED",
    progressNote: "",
    expectedDelivery: "",
    updates: "[]",
  });
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

  useEffect(() => {
    axios
      .get("/api/admin/leads", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setLeads(res.data))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post("/api/admin/projects", form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    router.push("/admin/projects");
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl text-gold-400 mb-4">New Project</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          required
          value={form.leadId}
          onChange={(e) => setForm({ ...form, leadId: e.target.value })}
          className="w-full p-3 bg-white/10 rounded"
        >
          <option value="">Select Lead</option>
          {leads.map((lead) => (
            <option key={lead.id} value={lead.id}>
              {lead.name} ({lead.email})
            </option>
          ))}
        </select>
        <input
          placeholder="Quote ID (optional)"
          className="w-full p-3 bg-white/10 rounded"
          value={form.quoteId}
          onChange={(e) => setForm({ ...form, quoteId: e.target.value })}
        />
        <input
          placeholder="Status"
          required
          className="w-full p-3 bg-white/10 rounded"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        />
        <textarea
          placeholder="Progress Note"
          rows={2}
          className="w-full p-3 bg-white/10 rounded"
          value={form.progressNote}
          onChange={(e) => setForm({ ...form, progressNote: e.target.value })}
        />
        <input
          type="date"
          placeholder="Expected Delivery"
          className="w-full p-3 bg-white/10 rounded"
          value={form.expectedDelivery}
          onChange={(e) => setForm({ ...form, expectedDelivery: e.target.value })}
        />
        <input
          type="hidden"
          value={form.updates}
          onChange={() => {}}
        />
        <button
          type="submit"
          className="bg-gold-500 text-black px-6 py-3 rounded font-semibold"
        >
          Create Project
        </button>
      </form>
    </div>
  );
}