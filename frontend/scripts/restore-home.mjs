// Restore the local `home` page dump into the CURRENT database (production when
// run on the EasyPanel server). Run from the deployed frontend/:
//   node scripts/restore-home.mjs
// Requires home_dump.json (committed) + DATABASE_URL pointing at prod.
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";

const url = (process.env.DATABASE_URL || "").replace(/^postgres:\/\//, "postgresql://");
if (!url) {
  console.error("DATABASE_URL not set (must point at production DB).");
  process.exit(1);
}
const dump = JSON.parse(readFileSync(new URL("./home_dump.json", import.meta.url), "utf8"));
const prisma = new PrismaClient({ datasources: { db: { url } } });

const existing = await prisma.pageContent.findUnique({ where: { slug: "home" } });

const data = {
  type: dump.type,
  title: dump.title,
  status: dump.status || "published",
  indexable: dump.indexable ?? true,
  content: dump.content,
  publishedContent: dump.publishedContent,
  publishedAt: new Date(),
  seoTitle: dump.seo.seoTitle,
  seoDescription: dump.seo.seoDescription,
  canonical: dump.seo.canonical,
  ogTitle: dump.seo.ogTitle,
  ogDescription: dump.seo.ogDescription,
  ogImage: dump.seo.ogImage,
};

let pageId: string;
if (existing) {
  await prisma.pageContent.update({ where: { slug: "home" }, data });
  pageId = existing.id;
  console.log("Updated existing home row.");
} else {
  const created = await prisma.pageContent.create({ data: { slug: "home", ...data } });
  pageId = created.id;
  console.log("Created home row.");
}

const maxVersion = existing
  ? (await prisma.pageVersion.aggregate({ where: { pageId }, _max: { version: true } }))._max.version ?? 0
  : 0;
const nextVersion = maxVersion + 1;
await prisma.pageVersion.create({
  data: {
    pageId,
    version: nextVersion,
    status: "published",
    content: dump.publishedContent,
    seoJson: JSON.stringify(dump.seo),
    label: `v${nextVersion}-restored-local`,
  },
});
console.log(`Created restore version v${nextVersion}. Homepage restored.`);
await prisma.$disconnect();
