"use client"

import { useLang } from '@/contexts/LanguageContext'

export default function Footer() {
  const { t } = useLang()
  return (
    <footer className="bg-luxury-dark border-t border-gold/20 py-8 text-center text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 space-y-2">
        <p>&copy; {new Date().getFullYear()} Annamalaiyar Software Centre. All rights reserved.</p>
        <div className="flex justify-center gap-4">
          <a href="/privacy" className="hover:text-gold-400">{t('privacy')}</a>
          <a href="/terms" className="hover:text-gold-400">{t('terms')}</a>
        </div>
      </div>
    </footer>
  )
}