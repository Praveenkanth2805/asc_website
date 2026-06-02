"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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
  const [loading, setLoading] = useState(false);
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const { data } = await axios.get("/api/admin/leads", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeads(data);
      } catch (error) {
        toast.error("Failed to load leads");
      }
    };
    fetchLeads();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/admin/quotes", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Quote created");
      router.push("/admin/quotes");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to create quote");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl text-gold-400 mb-4">New Quote</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Lead Dropdown – fixed styling */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Lead</label>
          <select
            required
            value={form.leadId}
            onChange={(e) => setForm({ ...form, leadId: e.target.value })}
            className="w-full p-3 bg-white/10 text-white rounded border border-transparent focus:outline-none focus:border-gold-400"
          >
            <option value="" className="bg-luxury-dark text-white">
              Select Lead
            </option>
            {leads.map((lead) => (
              <option
                key={lead.id}
                value={lead.id}
                className="bg-luxury-dark text-white"
              >
                {lead.name} ({lead.email})
              </option>
            ))}
          </select>
        </div>

        <input
          placeholder="Service Name"
          required
          value={form.serviceName}
          onChange={(e) => setForm({ ...form, serviceName: e.target.value })}
          className="w-full p-3 bg-white/10 rounded border border-transparent focus:outline-none focus:border-gold-400"
        />
        <input
          type="number"
          placeholder="Price"
          required
          value={form.price}
          onChange={(e) => setForm({ ...form, price: +e.target.value })}
          className="w-full p-3 bg-white/10 rounded border border-transparent focus:outline-none focus:border-gold-400"
        />
        <textarea
          placeholder="Description"
          required
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-3 bg-white/10 rounded border border-transparent focus:outline-none focus:border-gold-400"
        />
        <input
          placeholder="Delivery Time (e.g., 7 days)"
          required
          value={form.deliveryTime}
          onChange={(e) => setForm({ ...form, deliveryTime: e.target.value })}
          className="w-full p-3 bg-white/10 rounded border border-transparent focus:outline-none focus:border-gold-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gold-500 text-black py-3 rounded font-semibold hover:bg-gold-400 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Quote"}
        </button>
      </form>
    </div>
  );
}