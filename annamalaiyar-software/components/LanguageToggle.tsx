'use client'
import { useLang } from '@/contexts/LanguageContext'

export default function LanguageToggle() {
  const { lang, setLang } = useLang()
  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
      className="text-gold-400 font-medium uppercase text-sm"
    >
      {lang === 'en' ? 'தமிழ்' : 'EN'}
    </button>
  )
}