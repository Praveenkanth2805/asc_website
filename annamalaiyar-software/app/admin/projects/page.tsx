"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import GlassCard from "@/components/GlassCard";

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<any[]>([]);
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

  const fetchProjects = async () => {
    const { data } = await axios.get("/api/admin/projects", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProjects(data);
  };

  useEffect(() => { fetchProjects(); }, []);

  return (
    <div>
      <h1 className="text-3xl text-gold-400 mb-6">Projects</h1>
      <div className="space-y-4">
        {projects.map((p) => (
          <GlassCard key={p.id} className="flex justify-between items-center">
            <div>
              <p className="font-semibold">Lead: {p.lead?.name}</p>
              <p className="text-sm text-gray-400">Status: {p.status}</p>
              <p className="text-sm">{p.progressNote}</p>
            </div>
            <Link href={`/admin/projects/${p.id}`} className="text-gold-400 underline">Edit</Link>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}