const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const techData = [
  { name: "Laravel", logo: "devicon-laravel-original colored", category: "framework" },
  { name: "Laravel 12", logo: "devicon-laravel-original colored", category: "framework" },
  { name: "Livewire", logo: "devicon-laravel-plain colored", category: "library" },
  { name: "TailwindCSS", logo: "devicon-tailwindcss-plain colored", category: "framework" },
  { name: "Alpine.js", logo: "devicon-alpinejs-plain colored", category: "library" },
  { name: "MySQL", logo: "devicon-mysql-original colored", category: "tool" },
  { name: "Elasticsearch", logo: "devicon-elasticsearch-plain colored", category: "tool" },
  { name: "DataTable", logo: "devicon-jquery-plain colored", category: "library" },
  { name: "AI Tools (Antigravity)", logo: "devicon-google-plain colored", category: "ai" }
];

async function main() {
  console.log("Seeding technologies...");
  
  const createdTechs = [];
  for (const t of techData) {
    let existing = await prisma.technology.findFirst({
      where: { name: { equals: t.name, mode: 'insensitive' } }
    });
    if (!existing) {
      existing = await prisma.technology.create({ data: t });
      console.log(`Created technology: ${t.name}`);
    } else {
      console.log(`Technology already exists: ${t.name}`);
    }
    createdTechs.push(existing);
  }
  
  console.log("Linking projects...");
  const projects = await prisma.project.findMany();
  for (const proj of projects) {
    const matchedIds = [];
    for (const techName of proj.technologies) {
      const found = createdTechs.find(t => t.name.toLowerCase().trim() === techName.toLowerCase().trim());
      if (found) {
        matchedIds.push(found.id);
      }
    }
    
    await prisma.project.update({
      where: { id: proj.id },
      data: { techIds: matchedIds }
    });
    console.log(`Updated project "${proj.name}" with techIds:`, matchedIds);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
