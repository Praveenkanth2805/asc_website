import { prisma } from '@/lib/prisma'

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL!
  const services = await prisma.service.findMany()
  const blogs = await prisma.blog.findMany({ where: { published: true } })

  const serviceUrls = services.map(s => ({
    url: `${base}/services/${s.slug}`,
    lastModified: s.updatedAt,
  }))
  const blogUrls = blogs.map(b => ({
    url: `${base}/blog/${b.slug}`,
    lastModified: b.updatedAt,
  }))

  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/services`, lastModified: new Date() },
    { url: `${base}/portfolio`, lastModified: new Date() },
    { url: `${base}/blog`, lastModified: new Date() },
    { url: `${base}/contact`, lastModified: new Date() },
    ...serviceUrls,
    ...blogUrls,
  ]
}