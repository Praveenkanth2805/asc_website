'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import GlassCard from '@/components/GlassCard'

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  useEffect(() => {
    axios.get('/api/admin/dashboard', {
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
    }).then(res => setStats(res.data)).catch(console.error)
  }, [])

  if (!stats) return <p>Loading...</p>
  return (
    <div>
      <h1 className="text-3xl text-gold-400 mb-6">Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <GlassCard><h3 className="text-lg">Total Leads</h3><p className="text-2xl">{stats.totalLeads}</p></GlassCard>
        <GlassCard><h3 className="text-lg">Active Projects</h3><p className="text-2xl">{stats.activeProjects}</p></GlassCard>
        <GlassCard><h3 className="text-lg">Completed</h3><p className="text-2xl">{stats.completedProjects}</p></GlassCard>
      </div>
    </div>
  )
}