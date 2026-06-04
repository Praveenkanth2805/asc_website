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
  const [loading, setLoading] = useState(false);
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
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitted(true);

  if (
    !form.title ||
    !form.slug ||
    !form.description ||
    !form.startingPrice ||
    !form.category ||
    !form.image
  ) {
    return;
  }

   try {
    setLoading(true);

    await axios.post("/api/admin/services", form, {
      headers: { Authorization: `Bearer ${token}` },
    });

    router.push("/admin/services");
  } finally {
    setLoading(false);
  }
  router.push("/admin/services");
};

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl text-gold-400 mb-4">New Service</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input placeholder="Title"  className="w-full p-3 bg-white/10 rounded" onChange={e => setForm({ ...form, title: e.target.value })} />
        {submitted && !form.title && (
  <p className="text-red-500 text-sm mt-1">
    Title is required
  </p>
)}
        <input placeholder="Slug"  className="w-full p-3 bg-white/10 rounded" onChange={e => setForm({ ...form, slug: e.target.value })} />
        {submitted && !form.slug && (
  <p className="text-red-500 text-sm mt-1">
    Slug is required
  </p>
)}
        <textarea placeholder="Description"  rows={3} className="w-full p-3 bg-white/10 rounded" onChange={e => setForm({ ...form, description: e.target.value })} />
        {submitted && !form.description && (
  <p className="text-red-500 text-sm mt-1">
    Description is required
  </p>
)}
        <input type="number" placeholder="Starting Price"  className="w-full p-3 bg-white/10 rounded" onChange={e => setForm({ ...form, startingPrice: +e.target.value })} />
        {submitted && !form.startingPrice && (
  <p className="text-red-500 text-sm mt-1">
    Starting price is required
  </p>
)}
        <input placeholder="Category"  className="w-full p-3 bg-white/10 rounded" onChange={e => setForm({ ...form, category: e.target.value })} />
        {submitted && !form.category && (
  <p className="text-red-500 text-sm mt-1">
    Category is required
  </p>
)}
        <div>
          <ImageUpload
  currentImage={form.image}
  onUpload={(url) => setForm({ ...form, image: url })}
/>
{submitted && !form.image && (
    <p className="text-red-500 text-sm mt-2">
      Service image is required
    </p>
  )}
        </div>
        <input placeholder="WhatsApp Message (optional)" className="w-full p-3 bg-white/10 rounded" onChange={e => setForm({ ...form, whatsappMsg: e.target.value })} />
        <button
  type="submit"
  disabled={loading}
  className="bg-gold-500 text-black px-6 py-3 rounded font-semibold disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
>
  {loading ? (
    <>
      <div className="h-4 w-4 border-2 cursor-pointer border-black border-t-transparent rounded-full animate-spin" />
      Creating...
    </>
  ) : (
    "Create Service"
  )}
</button>

</form>
    </div>
  );
}