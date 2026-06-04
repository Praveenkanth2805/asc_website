'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import Loader from '@/components/Loader'
import toast from "react-hot-toast";
import ConfirmDialog from "@/components/ConfirmDialog";


export default function ServicesAdmin() {
  const [services, setServices] = useState<any[]>([])
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : ''
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  
  const fetchServices = async () => {
  try {
    setLoading(true)

    const { data } = await axios.get('/api/admin/services', {
      headers: { Authorization: `Bearer ${token}` }
    })

    setServices(data)
  } finally {
    setLoading(false)
  }
}

  useEffect(() => { fetchServices() }, [])

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await axios.delete(`/api/admin/services/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Service deleted");
      fetchServices();
    } catch (error) {
      toast.error("Failed to delete");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  if (loading) {
  return <Loader />
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
              <button onClick={() => setDeleteId(s.id)} className="text-red-400"><FiTrash2 /></button>
            </div>
          </div>
        ))}
      </div>
      <ConfirmDialog
        isOpen={deleteId !== null}
        message="Are you sure you want to delete this service?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  )
}