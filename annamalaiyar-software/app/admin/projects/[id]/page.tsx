"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";

export default function EditProject() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState({
    status: "",
    progressNote: "",
    expectedDelivery: "",
  });
  const [loading, setLoading] = useState(true);
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await axios.get(`/api/admin/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm({
          status: data.status || "",
          progressNote: data.progressNote || "",
          expectedDelivery: data.expectedDelivery?.slice(0, 10) || "",
        });
      } catch (error: any) {
        if (error.response?.status === 404) {
          toast.error("Project not found");
          router.push("/admin/projects");
        } else {
          toast.error("Failed to load project");
        }
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProject();
  }, [id, token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`/api/admin/projects/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Project updated");
      router.push("/admin/projects");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Update failed");
    }
  };

  if (loading) return <p className="text-gray-400 p-6">Loading...</p>;

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl text-gold-400 mb-4">Edit Project</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gold-400 mb-1">Status</label>
          <input
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full p-3 bg-white/10 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gold-400 mb-1">Progress Note</label>
          <textarea
            rows={3}
            value={form.progressNote}
            onChange={(e) => setForm({ ...form, progressNote: e.target.value })}
            className="w-full p-3 bg-white/10 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gold-400 mb-1">Expected Delivery</label>
          <input
            type="date"
            value={form.expectedDelivery}
            onChange={(e) => setForm({ ...form, expectedDelivery: e.target.value })}
            className="w-full p-3 bg-white/10 rounded"
          />
        </div>
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="bg-gold-500 text-black px-6 py-3 rounded font-semibold hover:bg-gold-400 transition"
          >
            Update Project
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/projects")}
            className="bg-white/10 text-white px-6 py-3 rounded font-semibold hover:bg-white/20 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}