"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";

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
  const [uploading, setUploading] = useState(false);
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

  useEffect(() => {
    const fetchItem = async () => {
      const { data } = await axios.get(`/api/admin/portfolio/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm(data);
    };
    fetchItem();
  }, [id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await axios.post("/api/admin/upload", formData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    });
    setForm({ ...form, image: data.url });
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.put(`/api/admin/portfolio/${id}`, form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    router.push("/admin/portfolio");
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl text-gold-400 mb-4">Edit Portfolio Item</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input placeholder="Title" required value={form.title} className="w-full p-3 bg-white/10 rounded" onChange={e => setForm({ ...form, title: e.target.value })} />
        <input placeholder="Category" required value={form.category} className="w-full p-3 bg-white/10 rounded" onChange={e => setForm({ ...form, category: e.target.value })} />
        <div>
          <label className="block mb-1">Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-2" />
          {uploading && <p className="text-sm">Uploading...</p>}
          {form.image && <img src={form.image} alt="preview" className="h-20 rounded" />}
        </div>
        <input placeholder="Link (optional)" value={form.link} className="w-full p-3 bg-white/10 rounded" onChange={e => setForm({ ...form, link: e.target.value })} />
        <textarea placeholder="Description (optional)" rows={3} value={form.description} className="w-full p-3 bg-white/10 rounded" onChange={e => setForm({ ...form, description: e.target.value })} />
        <button type="submit" className="bg-gold-500 text-black px-6 py-3 rounded font-semibold">Update</button>
      </form>
    </div>
  );
}