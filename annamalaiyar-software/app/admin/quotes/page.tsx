"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import GlassCard from "@/components/GlassCard";

export default function QuotesAdmin() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

  const fetchQuotes = async () => {
    const { data } = await axios.get("/api/admin/quotes", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setQuotes(data);
  };

  useEffect(() => { fetchQuotes(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await axios.put(`/api/admin/quotes/${id}`, { status }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchQuotes();
  };

  return (
    <div>
      <h1 className="text-3xl text-gold-400 mb-6">All Quotes</h1>
      <div className="space-y-4">
        {quotes.map((q) => (
          <GlassCard key={q.id} className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{q.serviceName} – ₹{q.price}</p>
              <p className="text-sm text-gray-400">Lead: {q.lead?.name || "Unknown"}</p>
              <p className="text-sm">Status: {q.status}</p>
            </div>
            <div className="flex gap-2">
              {q.status === "SENT" && (
                <>
                  <button onClick={() => updateStatus(q.id, "ACCEPTED")} className="bg-green-600 px-3 py-1 rounded text-sm">Accept</button>
                  <button onClick={() => updateStatus(q.id, "REJECTED")} className="bg-red-600 px-3 py-1 rounded text-sm">Reject</button>
                </>
              )}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}