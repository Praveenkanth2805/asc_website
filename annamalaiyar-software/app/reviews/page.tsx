import { prisma } from '@/lib/prisma'
import GlassCard from '@/components/GlassCard'

export default async function Reviews() {
  const reviews = await prisma.review.findMany({ where: { approved: true } })
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl text-gold-400 mb-8">Client Reviews</h1>
      <div className="space-y-4">
        {reviews.map(r => (
          <GlassCard key={r.id}>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
              <span className="font-semibold">{r.name}</span>
            </div>
            <p className="mt-2">{r.message}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}