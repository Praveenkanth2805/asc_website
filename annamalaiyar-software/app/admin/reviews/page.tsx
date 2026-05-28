"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import GlassCard from "@/components/GlassCard";

export default function ReviewsAdmin() {
  const [reviews, setReviews] = useState<any[]>([]);
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

  const fetchReviews = async () => {
    const { data } = await axios.get("/api/admin/reviews", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setReviews(data);
  };

  useEffect(() => { fetchReviews(); }, []);

  const approve = async (id: string) => {
    await axios.put(`/api/admin/reviews/${id}`, { approved: true }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchReviews();
  };

  const deleteReview = async (id: string) => {
    if (confirm("Delete?")) {
      await axios.delete(`/api/admin/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchReviews();
    }
  };

  return (
    <div>
      <h1 className="text-3xl text-gold-400 mb-6">Reviews</h1>
      <div className="space-y-4">
        {reviews.map((r) => (
          <GlassCard key={r.id} className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{r.name} – {"★".repeat(r.rating)}</p>
              <p className="text-sm">{r.message}</p>
              <p className="text-xs text-gray-400">Approved: {r.approved ? "Yes" : "No"}</p>
            </div>
            <div className="flex gap-2">
              {!r.approved && (
                <button onClick={() => approve(r.id)} className="bg-green-600 px-3 py-1 rounded text-sm">Approve</button>
              )}
              <button onClick={() => deleteReview(r.id)} className="bg-red-600 px-3 py-1 rounded text-sm">Delete</button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}