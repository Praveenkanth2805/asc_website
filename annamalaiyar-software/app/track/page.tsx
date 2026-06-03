"use client";

import { useState } from "react";
import axios from "axios";
import GlassCard from "@/components/GlassCard";
import { useLang } from "@/contexts/LanguageContext";

export default function Track() {
  const { t } = useLang();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"email" | "quoteId">("email");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await axios.get("/api/projects/track", {
        params: { [type]: query.trim() },
      });
      setResult(res.data);   // { project, quote }
    } catch (e: any) {
      if (e.response?.status === 404) {
        setError("No project found. Please check your email or Quote ID and try again.");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-3xl text-gold-400 mb-6">{t("track")}</h1>
      <p className="mb-6 text-gray-300">{t("track_info")}</p>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setType("email")}
          className={`px-4 py-2 rounded font-medium ${
            type === "email" ? "bg-gold-500 text-black" : "bg-white/10 text-white"
          }`}
        >
          Email
        </button>
        <button
          onClick={() => setType("quoteId")}
          className={`px-4 py-2 rounded font-medium ${
            type === "quoteId" ? "bg-gold-500 text-black" : "bg-white/10 text-white"
          }`}
        >
          Quote ID
        </button>
      </div>

      <div className="flex gap-3">
        <input
          placeholder={type === "email" ? "Your email address" : "Quote ID"}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 p-3 bg-white/10 text-white rounded border border-transparent focus:outline-none focus:border-gold-400"
        />
        <button
          onClick={handleTrack}
          disabled={loading || !query.trim()}
          className="bg-gold-500 text-black px-5 py-3 rounded font-semibold hover:bg-gold-400 transition disabled:opacity-50"
        >
          {loading ? "Searching..." : t("track_btn")}
        </button>
      </div>

      {error && (
        <GlassCard className="mt-6 text-center text-gray-300">
          <p>{error}</p>
        </GlassCard>
      )}

      {/* Show project if exists */}
      {result?.project && (
        <GlassCard className="mt-6">
          <h3 className="text-xl text-gold-400 mb-2">
            Project Status: {result.project.status.replace(/_/g, " ")}
          </h3>
          <p className="text-gray-300">
            {result.project.progressNote || "No progress note yet."}
          </p>
          {result.project.expectedDelivery && (
            <p className="text-sm text-gray-400 mt-2">
              Expected delivery: {new Date(result.project.expectedDelivery).toLocaleDateString()}
            </p>
          )}
        </GlassCard>
      )}

      {/* If no project but a quote exists, show quote status */}
      {!result?.project && result?.quote && (
        <GlassCard className="mt-6">
          <h3 className="text-xl text-gold-400 mb-2">Quote Status: {result.quote.status}</h3>
          <p className="text-gray-300">
            <strong>{result.quote.serviceName}</strong> – ₹{result.quote.price}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Once accepted, your project will start and tracking details will appear here.
          </p>
        </GlassCard>
      )}
    </div>
  );
}