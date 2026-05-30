"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import toast from "react-hot-toast";

export default function EditPortfolio() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState({
    title: "",
    category: "",
    image: "",
    link: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await axios.get(`/api/admin/portfolio/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm(data);
      } catch (error: any) {
        if (error.response?.status === 404) {
          toast.error("Portfolio item not found");
          router.push("/admin/portfolio");
        } else {
          toast.error("Failed to load portfolio item");
        }
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchItem();
  }, [id, token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`/api/admin/portfolio/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Portfolio updated");
      router.push("/admin/portfolio");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Update failed");
    }
  };

  if (loading) return <p className="text-gray-400 p-6">Loading...</p>;

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl text-gold-400 mb-4">Edit Portfolio Item</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Title"
          required
          value={form.title}
          className="w-full p-3 bg-white/10 rounded"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
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
          placeholder="Link (optional)"
          value={form.link}
          className="w-full p-3 bg-white/10 rounded"
          onChange={(e) => setForm({ ...form, link: e.target.value })}
        />
        <textarea
          placeholder="Description (optional)"
          rows={3}
          value={form.description}
          className="w-full p-3 bg-white/10 rounded"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="bg-gold-500 text-black px-6 py-3 rounded font-semibold hover:bg-gold-400 transition"
          >
            Update
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/portfolio")}
            className="bg-white/10 text-white px-6 py-3 rounded font-semibold hover:bg-white/20 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}