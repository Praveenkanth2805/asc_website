'use client'
import { createContext, useContext, useState, ReactNode } from 'react'
import en from '@/messages/en.json'
import ta from '@/messages/ta.json'

type Lang = 'en' | 'ta'
const messages = { en, ta }

const LanguageContext = createContext<{
  lang: Lang
  t: (key: string) => string
  setLang: (l: Lang) => void
} | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  const t = (key: string) => (messages[lang] as any)[key] || key
  return (
    <LanguageContext.Provider value={{ lang, t, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('Missing LanguageProvider')
  return ctx
}