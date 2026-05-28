// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useLang } from "@/contexts/LanguageContext";
import LanguageToggle from "./LanguageToggle";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check for admin token on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAdmin(!!localStorage.getItem("admin_token"));
    }
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-luxury-black/90 backdrop-blur-md border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        <Link
          href={isAdmin ? "/admin" : "/"}
          className="text-gold-400 font-bold text-2xl tracking-wider"
        >
          ASC
        </Link>
        {/* ... rest of the navbar is unchanged ... */}
        <div className="hidden md:flex gap-6 text-white font-medium">
          <Link href="/services">{t("services")}</Link>
          <Link href="/portfolio">{t("portfolio")}</Link>
          <Link href="/blog">{t("blog")}</Link>
          <Link href="/contact">{t("contact")}</Link>
          <Link href="/track">{t("track")}</Link>
        </div>
        <div className="flex items-center gap-4">
          <LanguageToggle />
          <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
            {open ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden bg-luxury-dark px-4 pb-4 space-y-3">
          <Link href="/services" className="block text-white">
            {t("services")}
          </Link>
          <Link href="/portfolio" className="block text-white">
            {t("portfolio")}
          </Link>
          <Link href="/blog" className="block text-white">
            {t("blog")}
          </Link>
          <Link href="/contact" className="block text-white">
            {t("contact")}
          </Link>
          <Link href="/track" className="block text-white">
            {t("track")}
          </Link>
        </div>
      )}
    </nav>
  );
}