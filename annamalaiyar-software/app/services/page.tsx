import { prisma } from '@/lib/prisma'
import GlassCard from '@/components/GlassCard'
import Link from 'next/link'
import Image from 'next/image'

export default async function Services() {
  const services = await prisma.service.findMany()
  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-4xl text-gold-400 mb-8">Our Services</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {services.map(s => (
          <Link key={s.id} href={`/services/${s.slug}`}>
            <GlassCard className="h-full flex flex-col">
              <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden">
                <Image src={s.image} alt={s.title} fill className="object-cover" />
              </div>
              <h3 className="text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-gold-400">From ₹{s.startingPrice}</p>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  )
}