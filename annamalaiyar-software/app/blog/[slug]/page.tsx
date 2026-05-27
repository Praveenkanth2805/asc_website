import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await prisma.blog.findUnique({ where: { slug: params.slug } })
  return {
    title: post?.seoTitle || post?.title,
    description: post?.seoDesc || '',
  }
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await prisma.blog.findUnique({ where: { slug: params.slug, published: true } })
  if (!post) notFound()
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl text-gold-400">{post.title}</h1>
      <div className="mt-4 text-gray-300 prose prose-invert" dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  )
}