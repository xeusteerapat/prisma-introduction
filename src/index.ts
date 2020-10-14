import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type MostRecentPost = {
  'most-recent-post': String;
};

async function main() {
  // create post
  const newPost = await prisma.post.create({
    data: {
      title: 'Hello, Prisma',
    },
  });

  // create user
  const user = await prisma.user.create({
    data: {
      name: 'Teerapat',
      email: 'teerapat@test.com',
    },
  });

  // update post according to user
  const authorWithPost = await prisma.post.update({
    where: { id: 1 },
    data: {
      author: {
        connect: { email: 'teerapat@test.com' },
      },
    },
  });

  // retrieve one single query
  const post = await prisma.post.findOne({
    where: { id: 1 },
  });

  // query relational data
  const postWithAuthor = await prisma.post.findOne({
    where: { id: 1 },
    include: {
      author: true,
    },
  });

  // Write a nested write query to create a new User record
  // with new Post and Profile records
  const userProfile = await prisma.user.create({
    data: {
      name: 'Thomas',
      email: 'thomas@test.com',
      profile: {
        create: {
          bio: 'Backend Developer at Vonder',
        },
      },
      posts: {
        create: {
          title: 'I Love Prisma',
        },
      },
    },
    include: {
      posts: true,
      profile: true,
    },
  });

  // Raw SQL
  const sql = `
    SELECT MAX ("createdAt") AS "most-recent-post" 
    FROM "public"."Post";
  `;

  const users: [MostRecentPost] = await prisma.$queryRaw(sql);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
