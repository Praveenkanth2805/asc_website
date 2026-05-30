"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import toast from "react-hot-toast";

export default function EditService() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    startingPrice: 0,
    category: "",
    image: "",
    whatsappMsg: "",
  });
  const [loading, setLoading] = useState(true);
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data } = await axios.get(`/api/admin/services/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm(data);
      } catch (error: any) {
        toast.error("Failed to load service");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchService();
  }, [id, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`/api/admin/services/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Service updated");
      router.push("/admin/services");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Update failed");
    }
  };

  if (loading) return <p className="text-gray-400">Loading...</p>;

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl text-gold-400 mb-4">Edit Service</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Title"
          required
          value={form.title}
          className="w-full p-3 bg-white/10 rounded"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          placeholder="Slug"
          required
          value={form.slug}
          className="w-full p-3 bg-white/10 rounded"
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
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
          type="number"
          placeholder="Starting Price"
          required
          value={form.startingPrice}
          className="w-full p-3 bg-white/10 rounded"
          onChange={(e) => setForm({ ...form, startingPrice: +e.target.value })}
        />
        <input
          placeholder="Category"
          required
          value={form.category}
          className="w-full p-3 bg-white/10 rounded"
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <ImageUpload
          currentImage={form.image}
          onUpload={(url) => setForm({ ...form, image: url })}
        />
        <input
          placeholder="WhatsApp Message (optional)"
          value={form.whatsappMsg}
          className="w-full p-3 bg-white/10 rounded"
          onChange={(e) => setForm({ ...form, whatsappMsg: e.target.value })}
        />
        <button
          type="submit"
          className="bg-gold-500 text-black px-6 py-3 rounded font-semibold"
        >
          Update Service
        </button>
      </form>
    </div>
  );
}