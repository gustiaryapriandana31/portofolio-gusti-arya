const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const techs = await prisma.technology.findMany();
  console.log("Registered Technologies in Database:");
  console.log(JSON.stringify(techs, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
