import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import WhatsAppButton from '@/components/WhatsAppFloat'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const service = await prisma.service.findUnique({ where: { slug: params.slug } })
  return {
    title: `${service?.title} | Annamalaiyar Software Centre`,
    description: service?.description,
  }
}

export default async function ServiceDetail({ params }: { params: { slug: string } }) {
  const service = await prisma.service.findUnique({ where: { slug: params.slug } })
  if (!service) notFound()

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="relative h-64 md:h-96 mb-8 rounded-2xl overflow-hidden">
        <Image src={service.image} alt={service.title} fill className="object-cover" />
      </div>
      <h1 className="text-4xl text-gold-400">{service.title}</h1>
      <p className="mt-4 text-lg text-gray-300">{service.description}</p>
      <p className="mt-4 text-2xl text-gold-400">Starting at ₹{service.startingPrice}</p>
      <a
        href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(
          service.whatsappMsg || `I'm interested in ${service.title}`
        )}`}
        target="_blank"
        className="mt-6 inline-block bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition"
      >
        Enquire on WhatsApp
      </a>
    </div>
  )
}