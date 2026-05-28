"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import GlassCard from "@/components/GlassCard";
import { FiPlus, FiEdit } from "react-icons/fi";

export default function QuotesAdmin() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

  const fetchQuotes = async () => {
    const { data } = await axios.get("/api/admin/quotes", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setQuotes(data);
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await axios.put(`/api/admin/quotes/${id}`, { status }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchQuotes();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl text-gold-400">Quotes</h1>
        <Link
          href="/admin/quotes/new"
          className="bg-gold-500 text-black px-4 py-2 rounded flex items-center gap-2"
        >
          <FiPlus /> New Quote
        </Link>
      </div>
      <div className="space-y-4">
        {quotes.map((q) => (
          <GlassCard key={q.id} className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <p className="font-semibold">{q.serviceName} – ₹{q.price}</p>
              <p className="text-sm text-gray-400">Lead: {q.lead?.name || "Unknown"}</p>
              <p className="text-sm">Status: {q.status}</p>
              <p className="text-xs text-gray-500">{q.description}</p>
            </div>
            <div className="flex items-center gap-2">
              {q.status === "SENT" && (
                <>
                  <button
                    onClick={() => updateStatus(q.id, "ACCEPTED")}
                    className="bg-green-600 px-3 py-1 rounded text-sm"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => updateStatus(q.id, "REJECTED")}
                    className="bg-red-600 px-3 py-1 rounded text-sm"
                  >
                    Reject
                  </button>
                </>
              )}
              <Link
                href={`/admin/quotes/${q.id}/edit`}
                className="text-blue-400 flex items-center gap-1"
              >
                <FiEdit /> Edit
              </Link>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}