"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import GlassCard from "@/components/GlassCard";
import toast from "react-hot-toast";

export default function LeadDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<any>(null);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quoteForm, setQuoteForm] = useState({
    serviceName: "",
    price: 0,
    description: "",
    deliveryTime: "",
  });
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

  const fetchLead = async () => {
    try {
      const { data } = await axios.get(`/api/admin/leads/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLead(data.lead);
      setQuotes(data.quotes);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to load lead");
      if (error.response?.status === 404) {
        router.push("/admin/leads");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchLead();
  }, [id]);

  const createQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/admin/quotes", { ...quoteForm, leadId: id }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Quote created");
      setQuoteForm({ serviceName: "", price: 0, description: "", deliveryTime: "" });
      fetchLead();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to create quote");
    }
  };

  const markAccepted = async (quoteId: string) => {
    try {
      await axios.put(`/api/admin/quotes/${quoteId}`, { status: "ACCEPTED" }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Quote accepted");
      fetchLead();
    } catch (error: any) {
      toast.error("Failed to update quote");
    }
  };

  if (loading) return <p className="text-gray-400 p-6">Loading...</p>;
  if (!lead) return <p className="text-red-400 p-6">Lead not found</p>;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl text-gold-400">Lead: {lead.name}</h1>
        <button
          type="button"
          onClick={() => router.push("/admin/leads")}
          className="bg-white/10 text-white px-4 py-2 rounded hover:bg-white/20 transition"
        >
          Back to Leads
        </button>
      </div>

      <GlassCard>
        <p><strong>Email:</strong> {lead.email}</p>
        <p><strong>Phone:</strong> {lead.phone}</p>
        <p><strong>Service:</strong> {lead.service}</p>
        <p><strong>Status:</strong> {lead.status}</p>
        <p><strong>Message:</strong> {lead.message}</p>
      </GlassCard>

      <h2 className="text-2xl text-gold-400 mt-6">Quotes</h2>
      <div className="space-y-4">
        {quotes.map((q) => (
          <GlassCard key={q.id}>
            <p><strong>{q.serviceName}</strong> — ₹{q.price}</p>
            <p>{q.description}</p>
            <p>Delivery: {q.deliveryTime}</p>
            <p className="text-sm text-gray-400">Status: {q.status}</p>
            {q.status === "SENT" && (
              <button
                onClick={() => markAccepted(q.id)}
                className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
              >
                Mark Accepted
              </button>
            )}
          </GlassCard>
        ))}
      </div>

      <h2 className="text-2xl text-gold-400 mt-6">Create Quote</h2>
      <form onSubmit={createQuote} className="space-y-3">
        <input
          placeholder="Service Name"
          required
          className="w-full p-3 bg-white/10 rounded"
          value={quoteForm.serviceName}
          onChange={(e) => setQuoteForm({ ...quoteForm, serviceName: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          required
          className="w-full p-3 bg-white/10 rounded"
          value={quoteForm.price}
          onChange={(e) => setQuoteForm({ ...quoteForm, price: +e.target.value })}
        />
        <textarea
          placeholder="Description"
          required
          rows={2}
          className="w-full p-3 bg-white/10 rounded"
          value={quoteForm.description}
          onChange={(e) => setQuoteForm({ ...quoteForm, description: e.target.value })}
        />
        <input
          placeholder="Delivery Time"
          required
          className="w-full p-3 bg-white/10 rounded"
          value={quoteForm.deliveryTime}
          onChange={(e) => setQuoteForm({ ...quoteForm, deliveryTime: e.target.value })}
        />
        <button type="submit" className="bg-gold-500 text-black px-6 py-3 rounded font-semibold">
          Send Quote
        </button>
      </form>
    </div>
  );
}