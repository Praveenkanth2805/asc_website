'use client'
import { FaWhatsapp } from 'react-icons/fa'
import { usePathname } from 'next/navigation'

export default function WhatsAppFloat() {
  const path = usePathname()
  const msg = encodeURIComponent(`Hi, I'm interested in your services. (Page: ${path})`)
  return (
    <a
      href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${msg}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:scale-110 transition z-50"
    >
      <FaWhatsapp size={24} />
    </a>
  )
}