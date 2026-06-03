"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";

export default function EditQuote() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState({
    leadId: "",
    serviceName: "",
    price: 0,
    description: "",
    deliveryTime: "",
  });
  const [loading, setLoading] = useState(true);
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const { data } = await axios.get(`/api/admin/quotes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Ensure every value is defined
        setForm({
          leadId: data.leadId || "",
          serviceName: data.serviceName || "",
          price: data.price ?? 0,
          description: data.description || "",
          deliveryTime: data.deliveryTime || "",
        });
      } catch (error: any) {
        if (error.response?.status === 404) {
          toast.error("Quote not found");
          router.push("/admin/quotes");
        } else {
          toast.error("Failed to load quote");
        }
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchQuote();
  }, [id, token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`/api/admin/quotes/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Quote updated");
      router.push("/admin/quotes");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Update failed");
    }
  };

  if (loading) return <p className="text-gray-400 p-6">Loading...</p>;

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl text-gold-400 mb-4">Edit Quote</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="hidden" value={form.leadId} readOnly />
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
          rows={2}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-3 bg-white/10 rounded border border-transparent focus:outline-none focus:border-gold-400"
        />
        <input
          placeholder="Delivery Time"
          required
          value={form.deliveryTime}
          onChange={(e) => setForm({ ...form, deliveryTime: e.target.value })}
          className="w-full p-3 bg-white/10 rounded border border-transparent focus:outline-none focus:border-gold-400"
        />
        <div className="flex gap-4 pt-4">
          <button type="submit" className="bg-gold-500 text-black px-6 py-3 rounded font-semibold">
            Update
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/quotes")}
            className="bg-white/10 text-white px-6 py-3 rounded font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}