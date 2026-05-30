"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";

export default function EditQuote() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState({
    leadId: "",
    serviceName: "",
    price: 0,
    description: "",
    deliveryTime: "",
    status: "",
  });
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

  useEffect(() => {
    if (id) {
      axios
        .get(`/api/admin/quotes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setForm(res.data))
        .catch(console.error);
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.put(`/api/admin/quotes/${id}`, form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    router.push("/admin/quotes");
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl text-gold-400 mb-4">Edit Quote</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="hidden"
          value={form.leadId}
          onChange={() => {}}
        />
        <input
          placeholder="Service Name"
          required
          value={form.serviceName}
          className="w-full p-3 bg-white/10 rounded"
          onChange={(e) => setForm({ ...form, serviceName: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          required
          value={form.price}
          className="w-full p-3 bg-white/10 rounded"
          onChange={(e) => setForm({ ...form, price: +e.target.value })}
        />
        <textarea
          placeholder="Description"
          required
          rows={3}
          value={form.description}
          className="w-full p-3 bg-white/10 rounded"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          placeholder="Delivery Time"
          required
          value={form.deliveryTime}
          className="w-full p-3 bg-white/10 rounded"
          onChange={(e) => setForm({ ...form, deliveryTime: e.target.value })}
        />
        <input
          type="hidden"
          value={form.status}
          onChange={() => {}}
        />
        <div className="flex gap-4 pt-4">
  <button
    type="submit"
    className="bg-gold-500 text-black px-6 py-3 rounded font-semibold hover:bg-gold-400 transition"
  >
    Update Service
  </button>
  <button
    type="button"
    onClick={() => router.push("/admin/quotes")}
    className="bg-white/10 text-white px-6 py-3 rounded font-semibold hover:bg-white/20 transition"
  >
    Cancel
  </button>
</div>
      </form>
    </div>
  );
}