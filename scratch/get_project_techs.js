const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const projects = await prisma.project.findMany();
  const techNames = new Set();
  projects.forEach(p => {
    p.technologies.forEach(t => techNames.add(t));
  });
  console.log("Unique Technologies used in Projects:");
  console.log(Array.from(techNames));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
