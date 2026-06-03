"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";

const projectStatuses = [
  "PROJECT_STARTED",
  "WAITING_CLIENT",
  "IN_PROGRESS",
  "COMPLETED",
  "DELIVERED",
];

export default function EditProject() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState({
    status: "PROJECT_STARTED",
    progressNote: "",
    expectedDelivery: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await axios.get(`/api/admin/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm({
          status: data.status || "PROJECT_STARTED",
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
    setSaving(true);
    try {
      await axios.put(`/api/admin/projects/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Project updated");
      router.push("/admin/projects");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-gray-400 p-6">Loading...</p>;

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl text-gold-400 mb-4">Edit Project</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Status Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full p-3 bg-white/10 text-white rounded border border-transparent focus:outline-none focus:border-gold-400 appearance-none"
          >
            {projectStatuses.map((s) => (
              <option key={s} value={s} className="bg-luxury-dark text-white">
                {s.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        {/* Progress Note */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Progress Note</label>
          <textarea
            rows={3}
            value={form.progressNote}
            onChange={(e) => setForm({ ...form, progressNote: e.target.value })}
            className="w-full p-3 bg-white/10 text-white rounded border border-transparent focus:outline-none focus:border-gold-400"
          />
        </div>

        {/* Expected Delivery */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Expected Delivery</label>
          <input
            type="date"
            value={form.expectedDelivery}
            onChange={(e) => setForm({ ...form, expectedDelivery: e.target.value })}
            className="w-full p-3 bg-white/10 text-white rounded border border-transparent focus:outline-none focus:border-gold-400 [color-scheme:dark]"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-gold-500 text-black px-6 py-3 rounded font-semibold hover:bg-gold-400 transition disabled:opacity-50"
          >
            {saving ? "Updating..." : "Update Project"}
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