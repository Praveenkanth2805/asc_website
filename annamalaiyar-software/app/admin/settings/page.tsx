"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import GlassCard from "@/components/GlassCard";

export default function SettingsAdmin() {
  const [settings, setSettings] = useState<{ key: string; value: string }[]>([]);
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

  const fetchSettings = async () => {
    const { data } = await axios.get("/api/admin/settings", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSettings(data);
  };

  useEffect(() => { fetchSettings(); }, []);

  const updateSetting = async (key: string, value: string) => {
    await axios.put("/api/admin/settings", { key, value }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchSettings();
  };

  return (
    <div>
      <h1 className="text-3xl text-gold-400 mb-6">Settings</h1>
      <div className="space-y-4">
        {settings.map((s) => (
          <GlassCard key={s.key} className="flex items-center gap-4">
            <span className="font-semibold w-32">{s.key}</span>
            <input
              defaultValue={s.value}
              onBlur={(e) => updateSetting(s.key, e.target.value)}
              className="flex-1 bg-white/10 p-2 rounded"
            />
          </GlassCard>
        ))}
        <button
          onClick={() => {
            const key = prompt("Setting key");
            const value = prompt("Value");
            if (key && value) updateSetting(key, value);
          }}
          className="bg-gold-500 text-black px-4 py-2 rounded"
        >
          Add Setting
        </button>
      </div>
    </div>
  );
}