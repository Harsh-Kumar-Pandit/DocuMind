import prisma from './src/config/db.js';

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true }
  });
  console.log('Users in DB:', users);

  const docs = await prisma.document.findMany({
    select: { id: true, originalName: true, status: true, ownerId: true },
    orderBy: { createdAt: 'desc' }
  });
  console.log('Documents in DB:', docs);

  const convs = await prisma.conversation.findMany({
    select: { id: true, title: true, documentId: true, _count: { select: { messages: true } } },
    orderBy: { updatedAt: 'desc' }
  });
  console.log('Conversations in DB:', convs);
}

main().catch(console.error).finally(() => prisma.$disconnect());
