'use client'
import { useState } from 'react'
import axios from 'axios'
import { useLang } from '@/contexts/LanguageContext'
import GlassCard from '@/components/GlassCard'

export default function Contact() {
  const { t } = useLang()
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await axios.post('/api/leads', form)
    setSent(true)
  }

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-3xl text-gold-400 mb-6">{t('contact')}</h1>
      {sent ? (
        <GlassCard className="text-center text-green-400">{t('thank_you')}</GlassCard>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required placeholder={t('name')} className="w-full p-3 bg-white/10 rounded" onChange={e => setForm({ ...form, name: e.target.value })} />
          <input required type="email" placeholder={t('email')} className="w-full p-3 bg-white/10 rounded" onChange={e => setForm({ ...form, email: e.target.value })} />
          <input required placeholder={t('phone')} className="w-full p-3 bg-white/10 rounded" onChange={e => setForm({ ...form, phone: e.target.value })} />
          <input placeholder="Service (optional)" className="w-full p-3 bg-white/10 rounded" onChange={e => setForm({ ...form, service: e.target.value })} />
          <textarea required rows={4} placeholder={t('message')} className="w-full p-3 bg-white/10 rounded" onChange={e => setForm({ ...form, message: e.target.value })} />
          <button className="w-full bg-gold-500 text-black py-3 rounded font-semibold hover:bg-gold-400 transition">{t('send')}</button>
        </form>
      )}
    </div>
  )
}