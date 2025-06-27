import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning existing data...');

  await prisma.harvestSeason.deleteMany();
  await prisma.farm.deleteMany();
  await prisma.farmer.deleteMany();

  console.log('✅ Data cleaned');

  const hashedPassword = await bcrypt.hash('admin', 10);

  await prisma.farmer.upsert({
    where: { email: 'admin@admin.com' },
    update: {
      password: hashedPassword,
      role: 'admin'
    },
    create: {
      name: 'Admin',
      document: "000.000.000-00",
      email: 'admin@admin.com',
      password: hashedPassword,
      role: 'admin'
    },
  });

  console.log('✅ Admin user created');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
