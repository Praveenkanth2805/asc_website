"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function NewQuote() {
  const router = useRouter();
  const [leads, setLeads] = useState<any[]>([]);
  const [form, setForm] = useState({
    leadId: "",
    serviceName: "",
    price: 0,
    description: "",
    deliveryTime: "",
  });
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

  useEffect(() => {
    // Fetch leads to populate dropdown
    axios
      .get("/api/admin/leads", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setLeads(res.data))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post("/api/admin/quotes", form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    router.push("/admin/quotes");
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl text-gold-400 mb-4">New Quote</h1>
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
          placeholder="Service Name"
          required
          className="w-full p-3 bg-white/10 rounded"
          onChange={(e) => setForm({ ...form, serviceName: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          required
          className="w-full p-3 bg-white/10 rounded"
          onChange={(e) => setForm({ ...form, price: +e.target.value })}
        />
        <textarea
          placeholder="Description"
          required
          rows={3}
          className="w-full p-3 bg-white/10 rounded"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          placeholder="Delivery Time (e.g., 7 days)"
          required
          className="w-full p-3 bg-white/10 rounded"
          onChange={(e) => setForm({ ...form, deliveryTime: e.target.value })}
        />
        <button
          type="submit"
          className="bg-gold-500 text-black px-6 py-3 rounded font-semibold"
        >
          Create Quote
        </button>
      </form>
    </div>
  );
}