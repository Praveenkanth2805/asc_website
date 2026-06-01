import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await prisma.portfolio.findUnique({ where: { id } })
  return {
    title: `${item?.title || 'Portfolio'} | Annamalaiyar Software Centre`,
    description: item?.description || '',
  }
}

export default async function PortfolioDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await prisma.portfolio.findUnique({ where: { id } })

  if (!item) notFound()

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="relative w-full h-64 md:h-96 mb-8 rounded-2xl overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
          className="object-cover"
        />
      </div>
      <h1 className="text-4xl text-gold-400">{item.title}</h1>
      <p className="mt-2 text-sm text-gold-400 uppercase tracking-wide">{item.category}</p>
      {item.description && (
        <p className="mt-4 text-lg text-gray-300">{item.description}</p>
      )}
      {item.link && (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block bg-gold-500 text-black px-6 py-3 rounded font-semibold hover:bg-gold-400 transition"
        >
          Visit Project
        </a>
      )}
    </div>
  )
}