"use client";

import { useState,useEffect, Suspense } from "react";
import axios from "axios";
import { useLang } from "@/contexts/LanguageContext";
import GlassCard from "@/components/GlassCard";
import toast from "react-hot-toast";
import { useSearchParams } from 'next/navigation'
import { motion } from "framer-motion";
import { FiSend } from "react-icons/fi"; 


function ContactForm() {
  const { t } = useLang();
  const searchParams = useSearchParams();
  const prefilledService = searchParams.get('service') || '';
  const prefilledMessage = searchParams.get('message') || ''

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: prefilledService,
    message: prefilledMessage,
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
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const [countdown, setCountdown] = useState(10);

useEffect(() => {
  if (!sent) return;

  const timer = setInterval(() => {
    setCountdown((prev) => {
      if (prev <= 1) {
        clearInterval(timer);
        window.location.href = "/";   // redirect
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [sent]);

if (sent) {
  return (
    <div className="max-w-xl mx-auto py-12 px-4 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        <GlassCard className="py-12">
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-20 h-20 flex items-center justify-center rounded-full bg-gold-500/20"
            >
              <FiSend size={40} className="text-gold-400" />
            </motion.div>
          </div>
          <h2 className="text-3xl text-gold-400 mb-2">{t("thank_you")}</h2>
          <p className="text-gray-400 mb-4">We will get back to you within 24 hours.</p>
          <p className="text-sm text-gray-500">
            Redirecting to home in{" "}
            <span className="text-gold-400 font-bold">{countdown}</span> seconds...
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="mt-6 text-gold-400 underline text-sm"
          >
            Go to home now
          </button>
        </GlassCard>
      </motion.div>
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

        {/* Service (optional, auto-filled) */}
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

// Wrap in Suspense as required by useSearchParams
export default function Contact() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-gray-400">Loading...</div>}>
      <ContactForm />
    </Suspense>
  );
}