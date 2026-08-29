// Dump the local `home` page row (content + publishedContent + newest version)
// so it can be restored to production. Run from frontend/:
//   node scripts/dump-home.mjs
// Writes scripts/home_dump.json (committed and deployed so it can be applied
// on the production server via restore-home.mjs).
import { PrismaClient } from "@prisma/client";
import { writeFileSync } from "fs";

const url = (process.env.DATABASE_URL || "").replace(/^postgres:\/\//, "postgresql://");
if (!url) {
  console.error("DATABASE_URL not set (use .env.local for local).");
  process.exit(1);
}
const prisma = new PrismaClient({ datasources: { db: { url } } });

const row = await prisma.pageContent.findUnique({
  where: { slug: "home" },
  include: { versions: { orderBy: { version: "desc" } } },
});

if (!row) {
  console.error("No 'home' page row found locally.");
  process.exit(1);
}

const out = {
  slug: "home",
  type: row.type,
  title: row.title,
  status: row.status,
  indexable: row.indexable,
  content: row.content,
  publishedContent: row.publishedContent,
  seo: {
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    canonical: row.canonical,
    ogTitle: row.ogTitle,
    ogDescription: row.ogDescription,
    ogImage: row.ogImage,
  },
  newestVersionContent: row.versions[0]?.content ?? null,
};

writeFileSync(new URL("./home_dump.json", import.meta.url), JSON.stringify(out, null, 2));
console.log("Dumped home page. publishedContent present:", !!row.publishedContent);
console.log("content keys:", Object.keys(JSON.parse(row.content || "{}")?.fr || {}).length);
await prisma.$disconnect();
