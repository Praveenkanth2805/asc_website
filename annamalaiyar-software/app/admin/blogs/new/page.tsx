"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";

export default function NewBlog() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    image: "",
    category: "",
    seoTitle: "",
    seoDesc: "",
    published: false,
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
    await axios.post("/api/admin/blogs", form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    router.push("/admin/blogs");
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl text-gold-400 mb-4">New Blog Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input placeholder="Title" required className="w-full p-3 bg-white/10 rounded" onChange={e => setForm({ ...form, title: e.target.value })} />
        <input placeholder="Slug" required className="w-full p-3 bg-white/10 rounded" onChange={e => setForm({ ...form, slug: e.target.value })} />
        <textarea placeholder="Content (HTML)" required rows={6} className="w-full p-3 bg-white/10 rounded" onChange={e => setForm({ ...form, content: e.target.value })} />
        <div>
          <ImageUpload
  currentImage={form.image}
  onUpload={(url) => setForm({ ...form, image: url })}
/>
        </div>
        <input placeholder="Category" required className="w-full p-3 bg-white/10 rounded" onChange={e => setForm({ ...form, category: e.target.value })} />
        <input placeholder="SEO Title (optional)" className="w-full p-3 bg-white/10 rounded" onChange={e => setForm({ ...form, seoTitle: e.target.value })} />
        <input placeholder="SEO Description (optional)" className="w-full p-3 bg-white/10 rounded" onChange={e => setForm({ ...form, seoDesc: e.target.value })} />
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} />
          Published
        </label>
        <button type="submit" className="bg-gold-500 text-black px-6 py-3 rounded font-semibold">Create Post</button>
      </form>
    </div>
  );
}