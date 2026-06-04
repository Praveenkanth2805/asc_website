"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useLang } from "@/contexts/LanguageContext";
import LanguageToggle from "./LanguageToggle";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAdmin(!!localStorage.getItem("admin_token"));
    }
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-luxury-black/90 backdrop-blur-md border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16 relative">
        {/* Logo – left side */}
        <Link
          href={isAdmin ? "/admin" : "/"}
          className="flex items-center flex-shrink-0"
        >
          <Image
            src="/logo.png"
            alt="Annamalaiyar Software Centre"
            width={50}
            height={50}
            className="h-10 w-auto"
            priority
          />
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex gap-6 text-white font-medium">
          <Link href="/services">{t("services")}</Link>
          <Link href="/portfolio">{t("portfolio")}</Link>
          <Link href="/blog">{t("blog")}</Link>
          <Link href="/contact">{t("contact")}</Link>
          <Link href="/track">{t("track")}</Link>
          <Link href="/reviews">{t("reviews")}</Link>

        </div>

        {/* Right-side group (language toggle + hamburger) */}
        <div className="flex items-center gap-2">
          <LanguageToggle />
          {/* Mobile menu button – always visible on small screens */}
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => {
              console.log("Hamburger clicked");
              setOpen(prev => !prev);
            }}
            className="md:hidden text-white p-3 -mr-2 touch-manipulation"
            style={{ touchAction: "manipulation" }}
          >
            {open ? <HiX size={28} /> : <HiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-luxury-dark px-4 pb-4 space-y-3">
          <Link href="/services" className="block text-white" onClick={() => setOpen(false)}>
            {t("services")}
          </Link>
          <Link href="/portfolio" className="block text-white" onClick={() => setOpen(false)}>
            {t("portfolio")}
          </Link>
          <Link href="/blog" className="block text-white" onClick={() => setOpen(false)}>
            {t("blog")}
          </Link>
          <Link href="/contact" className="block text-white" onClick={() => setOpen(false)}>
            {t("contact")}
          </Link>
          <Link href="/track" className="block text-white" onClick={() => setOpen(false)}>
            {t("track")}
          </Link>
          <Link href="/reviews" className="block text-white" onClick={() => setOpen(false)}>
            {t("reviews")}
          </Link>
        </div>
      )}
    </nav>
  );
}