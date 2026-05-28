"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import GlassCard from "@/components/GlassCard";

export default function LeadDetail() {
  const { id } = useParams();
  const [lead, setLead] = useState<any>(null);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [quoteForm, setQuoteForm] = useState({
    serviceName: "",
    price: 0,
    description: "",
    deliveryTime: "",
  });
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

  const fetchLead = async () => {
    const { data } = await axios.get(`/api/admin/leads/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setLead(data.lead);
    setQuotes(data.quotes);
  };

  useEffect(() => {
    if (id) fetchLead();
  }, [id]);

  const createQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post("/api/admin/quotes", { ...quoteForm, leadId: id }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setQuoteForm({ serviceName: "", price: 0, description: "", deliveryTime: "" });
    fetchLead();
  };

  if (!lead) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl text-gold-400">Lead: {lead.name}</h1>
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
                onClick={async () => {
                  await axios.put(`/api/admin/quotes/${q.id}`, { status: "ACCEPTED" }, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  fetchLead();
                }}
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