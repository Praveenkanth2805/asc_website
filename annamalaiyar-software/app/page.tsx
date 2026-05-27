import GlassCard from '@/components/GlassCard'
import Link from 'next/link'

export default function Home() {
  return (
    <section className="py-20 text-center px-4">
      <h1 className="text-5xl md:text-7xl font-bold text-gold-400">Annamalaiyar Software Centre</h1>
      <p className="mt-4 text-xl text-gray-300">Websites &bull; Logos &bull; Software &bull; Printing</p>
      <div className="mt-10 grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Link href="/services">
          <GlassCard className="hover:border-gold transition text-center text-lg font-semibold">Our Services</GlassCard>
        </Link>
        <Link href="/contact">
          <GlassCard className="hover:border-gold transition text-center text-lg font-semibold">Get Free Quote</GlassCard>
        </Link>
      </div>
    </section>
  )
}