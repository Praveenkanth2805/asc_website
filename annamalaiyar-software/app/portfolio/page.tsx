import { prisma } from '@/lib/prisma'
import GlassCard from '@/components/GlassCard'
import Image from 'next/image'

export default async function Portfolio() {
  const items = await prisma.portfolio.findMany()
  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-4xl text-gold-400 mb-8">Our Work</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {items.map(item => (
          <GlassCard key={item.id} className="h-full">
            <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden">
              <Image src={item.image} alt={item.title} fill className="object-cover" />
            </div>
            <h3 className="text-xl font-semibold">{item.title}</h3>
            <p className="text-sm text-gold-400">{item.category}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}