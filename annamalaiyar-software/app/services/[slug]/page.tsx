import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = await prisma.service.findUnique({ where: { slug } })
  return {
    title: `${service?.title || 'Service'} | Annamalaiyar Software Centre`,
    description: service?.description || '',
  }
}

export default async function ServiceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = await prisma.service.findUnique({ where: { slug } })

  if (!service) notFound()

  // Default WhatsApp message if none set
  const whatsappMsg = service.whatsappMsg || `Hi, I'm interested in your "${service.title}" service.`
  const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMsg)}`

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="relative w-full h-64 md:h-96 mb-8 rounded-2xl overflow-hidden">
        <Image
          src={service.image}
          alt={service.title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
          className="object-cover"
        />
      </div>
      <h1 className="text-4xl text-gold-400">{service.title}</h1>
      <p className="mt-4 text-lg text-gray-300">{service.description}</p>
      <p className="mt-4 text-2xl text-gold-400">Starting at ₹{service.startingPrice}</p>

      <div className="mt-6 flex flex-wrap gap-4">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition"
        >
          Enquire on WhatsApp
        </a>

        <Link
          href={`/contact?service=${encodeURIComponent(service.title)}&message=${encodeURIComponent(whatsappMsg)}`}
          className="inline-block bg-gold-500 text-black px-6 py-3 rounded-full font-semibold hover:bg-gold-400 transition"
        >
          Contact Us
        </Link>
      </div>
    </div>
  )
}