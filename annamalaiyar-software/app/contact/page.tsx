"use client";

import { useState } from "react";
import axios from "axios";
import { useLang } from "@/contexts/LanguageContext";
import GlassCard from "@/components/GlassCard";
import toast from "react-hot-toast";

export default function Contact() {
  const { t } = useLang();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9+\-\s]{10,}$/.test(form.phone.trim())) {
      newErrors.phone = "Enter a valid phone number (min 10 digits)";
    }

    if (!form.message.trim()) {
      newErrors.message = "Message is required";
    } else if (form.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setSending(true);
    try {
      await axios.post("/api/leads", form);
      setSent(true);
      toast.success(t("thank_you"));
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  if (sent) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center">
        <GlassCard className="py-12">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-3xl text-gold-400 mb-2">{t("thank_you")}</h2>
          <p className="text-gray-400">We will get back to you within 24 hours.</p>
          <button
            onClick={() => setSent(false)}
            className="mt-6 text-gold-400 underline"
          >
            Send another message
          </button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-4xl text-gold-400 mb-6">{t("contact")}</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{t("name")}</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={`w-full p-3 bg-white/10 rounded border ${errors.name ? "border-red-500" : "border-transparent"} focus:outline-none focus:border-gold-400 transition`}
          />
          {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{t("email")}</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className={`w-full p-3 bg-white/10 rounded border ${errors.email ? "border-red-500" : "border-transparent"} focus:outline-none focus:border-gold-400 transition`}
          />
          {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{t("phone")}</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className={`w-full p-3 bg-white/10 rounded border ${errors.phone ? "border-red-500" : "border-transparent"} focus:outline-none focus:border-gold-400 transition`}
          />
          {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
        </div>

        {/* Service (optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Service (optional)</label>
          <input
            type="text"
            value={form.service}
            onChange={(e) => handleChange("service", e.target.value)}
            className="w-full p-3 bg-white/10 rounded border border-transparent focus:outline-none focus:border-gold-400 transition"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{t("message")}</label>
          <textarea
            rows={4}
            value={form.message}
            onChange={(e) => handleChange("message", e.target.value)}
            className={`w-full p-3 bg-white/10 rounded border ${errors.message ? "border-red-500" : "border-transparent"} focus:outline-none focus:border-gold-400 transition`}
          />
          {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message}</p>}
        </div>

        <button
          type="submit"
          disabled={sending}
          className="w-full bg-gold-500 text-black py-3 rounded font-semibold hover:bg-gold-400 transition disabled:opacity-50"
        >
          {sending ? "Sending..." : t("send")}
        </button>
      </form>
    </div>
  );
}