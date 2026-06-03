import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  service: z.string().optional(),
  message: z.string().min(10),
})

export const serviceSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  startingPrice: z.number().positive(),
  category: z.string().min(1),
  image: z.string().url(),
  whatsappMsg: z.string().optional(),
})

export const portfolioSchema = z.object({
  title: z.string().min(1),
  category: z.string().min(1),
  image: z.string().url(),
  link: z.string().url().optional().or(z.literal('')),
  description: z.string().optional(),
})

export const blogSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.string().min(1),
  image: z.string().url().optional().or(z.literal('')),
  category: z.string().min(1),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
  published: z.boolean().optional(),
})

export const quoteSchema = z.object({
  leadId: z.string().min(1),
  serviceName: z.string().min(1),
  price: z.number().positive(),
  description: z.string().min(1),
  deliveryTime: z.string().min(1),
})

export const projectSchema = z.object({
  leadId: z.string().min(1),
  quoteId: z.string().optional(),
  status: z.string().min(1),
  progressNote: z.string().optional(),
  expectedDelivery: z.coerce.date().optional(), // ISO date
  updates: z.string().optional(), // JSON string
})

export const reviewSchema = z.object({
  name: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  message: z.string().min(1),
  service: z.string().optional(),
})