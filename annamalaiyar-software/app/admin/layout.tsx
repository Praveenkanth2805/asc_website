'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiHome, FiBriefcase, FiImage, FiUsers, FiFileText, FiSettings, FiCheckSquare, FiBookOpen } from 'react-icons/fi'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) router.push('/admin/login')
    else setAuthed(true)
  }, [router])

  if (!authed) return null

  return (
    <div className="flex h-screen bg-luxury-dark text-white">
      <aside className="w-64 bg-luxury-black border-r border-gold/20 p-4 space-y-6">
        <h2 className="text-2xl font-bold text-gold-400">Admin</h2>
        <nav className="space-y-2">
          <Link href="/admin" className="flex items-center gap-2 hover:text-gold-400"><FiHome /> Dashboard</Link>
          <Link href="/admin/services" className="flex items-center gap-2 hover:text-gold-400"><FiBriefcase /> Services</Link>
          <Link href="/admin/portfolio" className="flex items-center gap-2 hover:text-gold-400"><FiImage /> Portfolio</Link>
          <Link href="/admin/leads" className="flex items-center gap-2 hover:text-gold-400"><FiUsers /> Leads</Link>
          <Link href="/admin/quotes" className="flex items-center gap-2 hover:text-gold-400"><FiFileText /> Quotes</Link>
          <Link href="/admin/projects" className="flex items-center gap-2 hover:text-gold-400"><FiCheckSquare /> Projects</Link>
          <Link href="/admin/blogs" className="flex items-center gap-2 hover:text-gold-400"><FiBookOpen /> Blogs</Link>
          <Link href="/admin/reviews" className="flex items-center gap-2 hover:text-gold-400"><FiCheckSquare /> Reviews</Link>
          <Link href="/admin/settings" className="flex items-center gap-2 hover:text-gold-400"><FiSettings /> Settings</Link>
        </nav>
      </aside>
      <div className="flex-1 overflow-auto p-6">{children}</div>
    </div>
  )
}