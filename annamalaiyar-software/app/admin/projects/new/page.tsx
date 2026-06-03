"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

const projectStatuses = [
  "PROJECT_STARTED",
  "WAITING_CLIENT",
  "IN_PROGRESS",
  "COMPLETED",
  "DELIVERED",
];

export default function NewProject() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledQuoteId = searchParams.get("quoteId") || "";

  const [leads, setLeads] = useState<any[]>([]);
  const [form, setForm] = useState({
    leadId: "",
    quoteId: prefilledQuoteId,
    status: "PROJECT_STARTED",
    progressNote: "",
    expectedDelivery: "",
  });
  const [loading, setLoading] = useState(false);
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

  // Fetch leads for dropdown
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
      await axios.post("/api/admin/projects", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Project created");
      router.push("/admin/projects");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl text-gold-400 mb-4">New Project</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Lead Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Lead</label>
          <select
            required
            value={form.leadId}
            onChange={(e) => setForm({ ...form, leadId: e.target.value })}
            className="w-full p-3 bg-white/10 text-white rounded border border-transparent focus:outline-none focus:border-gold-400 appearance-none"
          >
            <option value="" className="bg-luxury-dark text-white">
              Select Lead
            </option>
            {leads.map((lead) => (
              <option key={lead.id} value={lead.id} className="bg-luxury-dark text-white">
                {lead.name} ({lead.email})
              </option>
            ))}
          </select>
        </div>

        {/* Quote ID (auto‑filled if provided) */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Quote ID (optional)</label>
          <input
            value={form.quoteId}
            onChange={(e) => setForm({ ...form, quoteId: e.target.value })}
            className="w-full p-3 bg-white/10 text-white rounded border border-transparent focus:outline-none focus:border-gold-400"
            placeholder="Auto‑filled if coming from a quote"
          />
        </div>

        {/* Status Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
          <select
            required
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full p-3 bg-white/10 text-white rounded border border-transparent focus:outline-none focus:border-gold-400 appearance-none"
          >
            {projectStatuses.map((s) => (
              <option key={s} value={s} className="bg-luxury-dark text-white">
                {s.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        {/* Progress Note */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Progress Note</label>
          <textarea
            rows={2}
            value={form.progressNote}
            onChange={(e) => setForm({ ...form, progressNote: e.target.value })}
            className="w-full p-3 bg-white/10 text-white rounded border border-transparent focus:outline-none focus:border-gold-400"
          />
        </div>

        {/* Expected Delivery Date */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Expected Delivery</label>
          <input
            type="date"
            value={form.expectedDelivery}
            onChange={(e) => setForm({ ...form, expectedDelivery: e.target.value })}
            className="w-full p-3 bg-white/10 text-white rounded border border-transparent focus:outline-none focus:border-gold-400 [color-scheme:dark]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gold-500 text-black py-3 rounded font-semibold hover:bg-gold-400 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Project"}
        </button>
      </form>
    </div>
  );
}