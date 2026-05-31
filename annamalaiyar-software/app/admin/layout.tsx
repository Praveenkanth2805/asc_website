"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  FiHome, FiBriefcase, FiImage, FiUsers, FiFileText,
  FiSettings, FiCheckSquare, FiBookOpen, FiLogOut,
  FiMenu, FiX
} from "react-icons/fi";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token && pathname !== "/admin/login") {
      router.replace("/admin/login");
    } else {
      setAuthed(true);
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.replace("/admin/login");
  };

  // On the login page, show only the children (no admin shell)
  if (pathname === "/admin/login") {
    return (
      <div className="min-h-screen bg-luxury-black relative z-[9999]">
        {children}
      </div>
    );
  }

  if (!authed) return null;

  return (
    <div className="flex h-screen bg-luxury-dark text-white">
      {/* Mobile top bar (hamburger + logo) */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-luxury-black border-b border-gold/20 px-4 h-14 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" width={40} height={40} />
          <span className="text-gold-400 font-bold">Admin</span>
        </Link>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white p-2">
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar (fixed on mobile, static on desktop) */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40 w-64 bg-luxury-black border-r border-gold/20 p-4 pt-16 md:pt-4
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
      >
        {/* Logo and admin title (visible on desktop and mobile when sidebar is open) */}
        <Link href="/admin" className="hidden md:flex items-center gap-3 mb-6">
    <img src="/logo.png" alt="Logo" width={50} height={50} className="h-10 w-auto" />
    <h2 className="text-2xl font-bold text-gold-400">Admin</h2>
  </Link>

        <nav className="space-y-2">
          <Link href="/admin" className="flex items-center gap-2 hover:text-gold-400" onClick={() => setSidebarOpen(false)}><FiHome /> Dashboard</Link>
          <Link href="/admin/services" className="flex items-center gap-2 hover:text-gold-400" onClick={() => setSidebarOpen(false)}><FiBriefcase /> Services</Link>
          <Link href="/admin/portfolio" className="flex items-center gap-2 hover:text-gold-400" onClick={() => setSidebarOpen(false)}><FiImage /> Portfolio</Link>
          <Link href="/admin/leads" className="flex items-center gap-2 hover:text-gold-400" onClick={() => setSidebarOpen(false)}><FiUsers /> Leads</Link>
          <Link href="/admin/quotes" className="flex items-center gap-2 hover:text-gold-400" onClick={() => setSidebarOpen(false)}><FiFileText /> Quotes</Link>
          <Link href="/admin/projects" className="flex items-center gap-2 hover:text-gold-400" onClick={() => setSidebarOpen(false)}><FiCheckSquare /> Projects</Link>
          <Link href="/admin/blogs" className="flex items-center gap-2 hover:text-gold-400" onClick={() => setSidebarOpen(false)}><FiBookOpen /> Blogs</Link>
          <Link href="/admin/reviews" className="flex items-center gap-2 hover:text-gold-400" onClick={() => setSidebarOpen(false)}><FiCheckSquare /> Reviews</Link>
          <Link href="/admin/settings" className="flex items-center gap-2 hover:text-gold-400" onClick={() => setSidebarOpen(false)}><FiSettings /> Settings</Link>
        </nav>

        <button onClick={handleLogout} className="flex items-center gap-2 mt-6 text-red-400 hover:text-red-300 transition">
          <FiLogOut /> Logout
        </button>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content area */}
      <main className="flex-1 overflow-auto p-4 md:p-6 mt-14 md:mt-0">
        {children}
      </main>
    </div>
  );
}