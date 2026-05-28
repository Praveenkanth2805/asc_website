"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";

export default function EditBlog() {
  const router = useRouter();
  const { id } = useParams();
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

  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        const { data } = await axios.get(`/api/admin/blogs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm(data);
      };
      fetchBlog();
    }
  }, [id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await axios.post("/api/admin/upload", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    setForm({ ...form, image: data.url });
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.put(`/api/admin/blogs/${id}`, form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    router.push("/admin/blogs");
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl text-gold-400 mb-4">Edit Blog Post</h1>
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
          placeholder="Content (HTML)"
          required
          rows={6}
          value={form.content}
          className="w-full p-3 bg-white/10 rounded"
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
        <div>
          <ImageUpload
  currentImage={form.image}
  onUpload={(url) => setForm({ ...form, image: url })}
/>
        </div>
        <input
          placeholder="Category"
          required
          value={form.category}
          className="w-full p-3 bg-white/10 rounded"
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <input
          placeholder="SEO Title (optional)"
          value={form.seoTitle}
          className="w-full p-3 bg-white/10 rounded"
          onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
        />
        <input
          placeholder="SEO Description (optional)"
          value={form.seoDesc}
          className="w-full p-3 bg-white/10 rounded"
          onChange={(e) => setForm({ ...form, seoDesc: e.target.value })}
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
          />
          Published
        </label>
        <button type="submit" className="bg-gold-500 text-black px-6 py-3 rounded font-semibold">
          Update Post
        </button>
      </form>
    </div>
  );
}