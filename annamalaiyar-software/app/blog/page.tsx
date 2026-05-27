import { prisma } from '@/lib/prisma'
import GlassCard from '@/components/GlassCard'
import Link from 'next/link'
import Image from 'next/image'

export default async function Blog() {
  const posts = await prisma.blog.findMany({ where: { published: true } })
  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-4xl text-gold-400 mb-8">Blog</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map(post => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <GlassCard className="h-full flex flex-col">
              {post.image && (
                <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden">
                  <Image src={post.image} alt={post.title} fill className="object-cover" />
                </div>
              )}
              <h3 className="text-xl font-semibold">{post.title}</h3>
              <p className="text-sm text-gold-400 mt-2">{post.category}</p>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  )
}