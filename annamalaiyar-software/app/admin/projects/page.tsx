"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import GlassCard from "@/components/GlassCard";
import { FiPlus, FiEdit } from "react-icons/fi";

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<any[]>([]);
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

  const fetchProjects = async () => {
    const { data } = await axios.get("/api/admin/projects", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProjects(data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl text-gold-400">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="bg-gold-500 text-black px-4 py-2 rounded flex items-center gap-2"
        >
          <FiPlus /> New Project
        </Link>
      </div>
      <div className="space-y-4">
        {projects.map((p) => (
          <GlassCard key={p.id} className="flex justify-between items-center">
            <div>
              <p className="font-semibold">Lead: {p.lead?.name}</p>
              <p className="text-sm text-gray-400">Status: {p.status}</p>
              <p className="text-sm">{p.progressNote}</p>
            </div>
            <Link
              href={`/admin/projects/${p.id}`}
              className="text-blue-400 flex items-center gap-1"
            >
              <FiEdit /> Edit
            </Link>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}