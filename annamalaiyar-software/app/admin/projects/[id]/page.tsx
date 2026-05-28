"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

export default function EditProject() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [status, setStatus] = useState("");
  const [progressNote, setProgressNote] = useState("");
  const [expectedDelivery, setExpectedDelivery] = useState("");
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

  useEffect(() => {
    const fetchProject = async () => {
      const { data } = await axios.get(`/api/admin/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProject(data);
      setStatus(data.status);
      setProgressNote(data.progressNote || "");
      setExpectedDelivery(data.expectedDelivery?.slice(0, 10) || "");
    };
    fetchProject();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.put(`/api/admin/projects/${id}`, {
      status,
      progressNote,
      expectedDelivery,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    router.push("/admin/projects");
  };

  if (!project) return <p>Loading...</p>;

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl text-gold-400 mb-4">Edit Project</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block mb-1">Status</label>
          <input value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-3 bg-white/10 rounded" />
        </div>
        <div>
          <label className="block mb-1">Progress Note</label>
          <textarea value={progressNote} onChange={(e) => setProgressNote(e.target.value)} rows={3} className="w-full p-3 bg-white/10 rounded" />
        </div>
        <div>
          <label className="block mb-1">Expected Delivery</label>
          <input type="date" value={expectedDelivery} onChange={(e) => setExpectedDelivery(e.target.value)} className="w-full p-3 bg-white/10 rounded" />
        </div>
        <button type="submit" className="bg-gold-500 text-black px-6 py-3 rounded font-semibold">Update Project</button>
      </form>
    </div>
  );
}