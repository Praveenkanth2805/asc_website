"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";

export default function NewService() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    startingPrice: 0,
    category: "",
    image: "",
    whatsappMsg: "",
  });
  const [uploading, setUploading] = useState(false);
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

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
    await axios.post("/api/admin/services", form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    router.push("/admin/services");
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl text-gold-400 mb-4">New Service</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input placeholder="Title" required className="w-full p-3 bg-white/10 rounded" onChange={e => setForm({ ...form, title: e.target.value })} />
        <input placeholder="Slug" required className="w-full p-3 bg-white/10 rounded" onChange={e => setForm({ ...form, slug: e.target.value })} />
        <textarea placeholder="Description" required rows={3} className="w-full p-3 bg-white/10 rounded" onChange={e => setForm({ ...form, description: e.target.value })} />
        <input type="number" placeholder="Starting Price" required className="w-full p-3 bg-white/10 rounded" onChange={e => setForm({ ...form, startingPrice: +e.target.value })} />
        <input placeholder="Category" required className="w-full p-3 bg-white/10 rounded" onChange={e => setForm({ ...form, category: e.target.value })} />
        <div>
          <ImageUpload
  currentImage={form.image}
  onUpload={(url) => setForm({ ...form, image: url })}
/>
        </div>
        <input placeholder="WhatsApp Message (optional)" className="w-full p-3 bg-white/10 rounded" onChange={e => setForm({ ...form, whatsappMsg: e.target.value })} />
        <button type="submit" className="bg-gold-500 text-black px-6 py-3 rounded font-semibold">Create Service</button>
      </form>
    </div>
  );
}