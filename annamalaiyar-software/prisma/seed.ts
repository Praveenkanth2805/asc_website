import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL!
  const existing = await prisma.admin.findUnique({ where: { email: adminEmail } })
  if (!existing) {
    const hashed = await bcrypt.hash('admin123', 12)
    await prisma.admin.create({
      data: {
        email: adminEmail,
        password: hashed,
      },
    })
    console.log('✅ Admin user created')
  }

  // Optional: seed default settings
  await prisma.setting.upsert({
    where: { key: 'site_title' },
    update: {},
    create: { key: 'site_title', value: 'Annamalaiyar Software Centre' },
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())