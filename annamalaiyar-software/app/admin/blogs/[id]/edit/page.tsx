"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";

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
  const [loading, setLoading] = useState(true);
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(`/api/admin/blogs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm(data);
      } catch (error: any) {
        if (error.response?.status === 404) {
          toast.error("Blog not found");
          router.push("/admin/blogs");
        } else {
          toast.error("Failed to load blog");
        }
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBlog();
  }, [id, token, router]);

  const [saving, setSaving] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    setSaving(true);

    await axios.put(`/api/admin/blogs/${id}`, form, {
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success("Blog updated");
    router.push("/admin/blogs");
  } catch (error: any) {
    toast.error(error.response?.data?.error || "Update failed");
  } finally {
    setSaving(false);
  }
};

  if (loading) return <Loader />;

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
        <ImageUpload
          currentImage={form.image}
          onUpload={(url) => setForm({ ...form, image: url })}
        />
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
        <div className="flex gap-4">
          <button
  type="submit"
  disabled={saving}
  className={`px-6 py-3 rounded font-semibold flex items-center justify-center gap-2 ${
    saving
      ? "bg-gold-500/70 cursor-not-allowed"
      : "bg-gold-500 cursor-pointer"
  } text-black`}
>
  {saving ? (
    <>
      <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
      Updating...
    </>
  ) : (
    "Update"
  )}
</button>
          <button
            type="button"
            onClick={() => router.push("/admin/blogs")}
            className="bg-white/10 text-white px-6 py-3 rounded font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}