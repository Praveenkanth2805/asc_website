"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import GlassCard from "@/components/GlassCard";
import toast from "react-hot-toast";

export default function Reviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    rating: 5,
    message: "",
    service: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get("/api/reviews");
      setReviews(data);
    } catch (error) {
      toast.error("Failed to load reviews");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post("/api/reviews", form);
      toast.success("Review submitted for approval – thank you!");
      setForm({ name: "", rating: 5, message: "", service: "" });
      fetchReviews();
    } catch (error) {
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl text-gold-400 mb-8">Client Reviews</h1>

      {/* Existing approved reviews */}
      <div className="space-y-4 mb-12">
        {reviews.length === 0 ? (
          <p className="text-gray-400">No reviews yet. Be the first to share your experience!</p>
        ) : (
          reviews.map((r) => (
            <GlassCard key={r.id}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-400">
                  {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                </span>
                <span className="font-semibold">{r.name}</span>
              </div>
              <p className="text-gray-300">{r.message}</p>
            </GlassCard>
          ))
        )}
      </div>

      {/* New review form */}
      <h2 className="text-2xl text-gold-400 mb-4">Leave a Review</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <input
          type="text"
          placeholder="Your Name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-3 bg-white/10 rounded border border-transparent focus:outline-none focus:border-gold-400"
        />
        <select
          value={form.rating}
          onChange={(e) => setForm({ ...form, rating: +e.target.value })}
          className="w-full p-3 bg-white/10 text-white rounded border border-transparent focus:outline-none focus:border-gold-400 appearance-none"
        >
          {[5, 4, 3, 2, 1].map((star) => (
            <option key={star} value={star} className="bg-luxury-dark text-white">
              {star} Star{star !== 1 && "s"}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Service (optional)"
          value={form.service}
          onChange={(e) => setForm({ ...form, service: e.target.value })}
          className="w-full p-3 bg-white/10 rounded border border-transparent focus:outline-none focus:border-gold-400"
        />
        <textarea
          placeholder="Your Message"
          required
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full p-3 bg-white/10 rounded border border-transparent focus:outline-none focus:border-gold-400"
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-gold-500 text-black px-6 py-3 rounded font-semibold hover:bg-gold-400 transition disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
} 