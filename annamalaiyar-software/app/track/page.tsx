'use client'
import { useState } from 'react'
import axios from 'axios'
import GlassCard from '@/components/GlassCard'
import { useLang } from '@/contexts/LanguageContext'

export default function Track() {
  const { t } = useLang()
  const [query, setQuery] = useState('')
  const [type, setType] = useState<'email' | 'quoteId'>('email')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleTrack = async () => {
    try {
      const res = await axios.get('/api/projects/track', { params: { [type]: query } })
      setResult(res.data)
      setError('')
    } catch (e) {
      setError('No project found')
      setResult(null)
    }
  }

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-3xl text-gold-400 mb-6">{t('track')}</h1>
      <p className="mb-4 text-gray-300">{t('track_info')}</p>
      <div className="flex gap-4 mb-4">
        <button onClick={() => setType('email')} className={`px-4 py-2 rounded ${type === 'email' ? 'bg-gold-500 text-black' : 'bg-white/10'}`}>Email</button>
        <button onClick={() => setType('quoteId')} className={`px-4 py-2 rounded ${type === 'quoteId' ? 'bg-gold-500 text-black' : 'bg-white/10'}`}>Quote ID</button>
      </div>
      <input
        placeholder={type === 'email' ? 'Your email' : 'Quote ID'}
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="w-full p-3 bg-white/10 rounded mb-4"
      />
      <button onClick={handleTrack} className="w-full bg-gold-500 text-black py-3 rounded font-semibold">{t('track_btn')}</button>
      {error && <p className="mt-4 text-red-400">{error}</p>}
      {result && (
        <GlassCard className="mt-6">
          <h3 className="text-xl">{result.project.status}</h3>
          <p>{result.project.progressNote}</p>
          {result.project.updates && (
            <div className="mt-2">
              <strong>Updates:</strong>
              <ul className="list-disc ml-4">
                {JSON.parse(result.project.updates).map((u: string, i: number) => <li key={i}>{u}</li>)}
              </ul>
            </div>
          )}
        </GlassCard>
      )}
    </div>
  )
}