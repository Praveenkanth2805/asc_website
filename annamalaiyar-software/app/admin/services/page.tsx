'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'

export default function ServicesAdmin() {
  const [services, setServices] = useState<any[]>([])
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : ''

  const fetchServices = async () => {
    const { data } = await axios.get('/api/admin/services', {
      headers: { Authorization: `Bearer ${token}` }
    })
    setServices(data)
  }

  useEffect(() => { fetchServices() }, [])

  const deleteService = async (id: string) => {
    if (confirm('Delete?')) {
      await axios.delete(`/api/admin/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchServices()
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl text-gold-400">Services</h1>
        <Link href="/admin/services/new" className="bg-gold-500 text-black px-4 py-2 rounded flex items-center gap-2">
          <FiPlus /> Add New
        </Link>
      </div>
      <div className="grid gap-4">
        {services.map(s => (
          <div key={s.id} className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
            <div>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="text-sm text-gray-400">{s.category}</p>
            </div>
            <div className="flex gap-4">
              <Link href={`/admin/services/${s.id}/edit`} className="text-blue-400"><FiEdit2 /></Link>
              <button onClick={() => deleteService(s.id)} className="text-red-400"><FiTrash2 /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}