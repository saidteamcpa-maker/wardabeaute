import { prisma } from "./db";
import { getAdminSessionFromCookies } from "./auth";
import { KNOWN_PAGES, PAGE_TYPES, pageTypeOf, schemaFor, type BlockDef, type SiteContentData } from "./page-schema";
import type { Lang } from "./i18n-shared";

export type LangContent = Record<string, string>;
export interface PageContentData {
  fr: LangContent;
  ar: LangContent;
  _meta?: { order?: string[]; disabled?: string[] };
}

export interface PageSeo {
  seoTitle?: string;
  seoDescription?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  indexable?: boolean;
}

function parseJSON<T>(s: string | null | undefined, fallback: T | null = null): T | null {
  if (!s) return fallback;
  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
}

function emptyData(): PageContentData {
  return { fr: {}, ar: {}, _meta: {} };
}

export function defaultContentFor(slug: string): PageContentData {
  const sc = schemaFor(slug);
  const fr: LangContent = {};
  const ar: LangContent = {};
  const order = sc.blocks.map((bl) => bl.key);
  for (const bl of sc.blocks) {
    fr[bl.key] = "";
    ar[bl.key] = "";
  }
  return { fr, ar, _meta: { order, disabled: [] } };
}

export async function getPagesMeta() {
  const rows = await prisma.pageContent.findMany();
  const bySlug = new Map(rows.map((r) => [r.slug, r]));
  const customRows = rows.filter((r) => r.type === "custom" && !KNOWN_PAGES.some((k) => k.slug === r.slug));
  const customPages = customRows.map((r) => ({
    slug: r.slug,
    name: r.title,
    type: "custom" as const,
    route: `/p/${r.slug}`,
    status: r.status,
    publishedAt: r.publishedAt,
    updatedAt: r.updatedAt,
    hasDraft: JSON.stringify(parseJSON(r.content, null)) !== JSON.stringify(parseJSON(r.publishedContent, null)),
    languages: { fr: { filled: 0, required: 0 }, ar: { filled: 0, required: 0 } },
  }));
  return [
    ...KNOWN_PAGES.map((kp) => {
    const row = bySlug.get(kp.slug);
    const content = parseJSON<PageContentData>(row?.content, null);
    const published = parseJSON<PageContentData>(row?.publishedContent, null);
    const hasDraft = !!row && JSON.stringify(content) !== JSON.stringify(published);
    return {
      slug: kp.slug,
      name: kp.name,
      type: kp.type,
      route: kp.route,
      status: row?.status ?? "published",
      publishedAt: row?.publishedAt ?? null,
      updatedAt: row?.updatedAt ?? null,
      hasDraft,
      languages: {
        fr: completeness(kp.slug, content?.fr),
        ar: completeness(kp.slug, content?.ar),
      },
    };
  }),
    ...customPages,
  ];
}

function completeness(slug: string, lang?: LangContent): { filled: number; required: number } {
  const sc = schemaFor(slug);
  const required = sc.blocks.filter((b) => b.required);
  const filled = required.filter((b) => (lang?.[b.key] ?? "").trim().length > 0).length;
  return { filled, required: required.length };
}

export async function getPage(slug: string) {
  let row = await prisma.pageContent.findUnique({ where: { slug } });
  if (!row) {
    const known = KNOWN_PAGES.find((p) => p.slug === slug);
    row = await prisma.pageContent.create({
      data: {
        slug,
        type: known?.type ?? "custom",
        title: known?.name ?? slug,
        content: JSON.stringify(defaultContentFor(known?.type ?? "custom")),
      },
    });
  }
  const content = parseJSON<PageContentData>(row.content, defaultContentFor(row.type));
  const versions = await prisma.pageVersion.findMany({
    where: { pageId: row.id },
    orderBy: { version: "desc" },
    take: 25,
  });
  return {
    slug: row.slug,
    type: row.type,
    title: row.title,
    status: row.status,
    indexable: row.indexable,
    seo: {
      seoTitle: row.seoTitle,
      seoDescription: row.seoDescription,
      canonical: row.canonical,
      ogTitle: row.ogTitle,
      ogDescription: row.ogDescription,
      ogImage: row.ogImage,
    } as PageSeo,
    content,
    versions: versions.map((v) => ({
      id: v.id,
      version: v.version,
      status: v.status,
      label: v.label,
      createdAt: v.createdAt,
    })),
  };
}

export async function saveDraft(slug: string, data: PageContentData, seo: PageSeo, title?: string) {
  const row = await prisma.pageContent.findUnique({ where: { slug } });
  const known = KNOWN_PAGES.find((p) => p.slug === slug);
  const type = known?.type ?? row?.type ?? "custom";
  const payload = {
    type,
    title: title ?? row?.title ?? known?.name ?? slug,
    content: JSON.stringify(data),
    seoTitle: seo.seoTitle,
    seoDescription: seo.seoDescription,
    canonical: seo.canonical,
    ogTitle: seo.ogTitle,
    ogDescription: seo.ogDescription,
    ogImage: seo.ogImage,
    indexable: seo.indexable ?? true,
  };
  if (!row) {
    await prisma.pageContent.create({ data: { slug, ...payload } });
  } else {
    await prisma.pageContent.update({ where: { slug }, data: payload });
  }
  return getPage(slug);
}

export async function publishPage(slug: string, data: PageContentData, seo: PageSeo, title?: string) {
  const row = await prisma.pageContent.findUnique({ where: { slug } });
  const nextVersion = row
    ? (await prisma.pageVersion.count({ where: { pageId: row.id } })) + 1
    : 1;
  const snapshot = JSON.stringify(data);
  const update = {
    type: row?.type ?? pageTypeOf(slug),
    title: title ?? row?.title ?? slug,
    content: snapshot,
    publishedContent: snapshot,
    status: "published",
    publishedAt: new Date(),
    seoTitle: seo.seoTitle,
    seoDescription: seo.seoDescription,
    canonical: seo.canonical,
    ogTitle: seo.ogTitle,
    ogDescription: seo.ogDescription,
    ogImage: seo.ogImage,
    indexable: seo.indexable ?? true,
  };
  if (!row) {
    await prisma.pageContent.create({ data: { slug, ...update } });
  } else {
    await prisma.pageContent.update({ where: { slug }, data: update });
    await prisma.pageVersion.create({
      data: {
        pageId: row.id,
        version: nextVersion,
        status: "published",
        content: snapshot,
        seoJson: JSON.stringify(seo),
        label: `v${nextVersion}`,
      },
    });
  }
  return getPage(slug);
}

export async function setStatus(slug: string, status: string) {
  await prisma.pageContent.upsert({
    where: { slug },
    create: { slug, type: pageTypeOf(slug), title: slug, status },
    update: { status },
  });
  return getPage(slug);
}

export async function restoreVersion(slug: string, versionId: string) {
  const row = await prisma.pageContent.findUnique({ where: { slug } });
  if (!row) throw new Error("Page introuvable");
  const v = await prisma.pageVersion.findUnique({ where: { id: versionId } });
  if (!v || v.pageId !== row.id) throw new Error("Version introuvable");
  const data = parseJSON<PageContentData>(v.content, defaultContentFor(row.type)) ?? defaultContentFor(row.type);
  const seo = parseJSON<PageSeo>(v.seoJson, {}) ?? {};
  return publishPage(slug, data, seo, row.title);
}

export async function getPageOverride(
  slug: string,
  lang: Lang,
  preview: boolean
): Promise<LangContent | null> {
  const row = await prisma.pageContent.findUnique({ where: { slug } });
  if (!row) return null;

  if (preview) {
    const session = await getAdminSessionFromCookies();
    if (session) {
      const data = parseJSON<PageContentData>(row.content, null);
      return data ? data[lang] ?? {} : null;
    }
  }

  if (row.status === "disabled") return null;
  const published = parseJSON<PageContentData>(row.publishedContent, null);
  if (published && Object.keys(published).length) {
    return published[lang] ?? {};
  }
  // jamais publié : brouillon visible uniquement en preview (géré ci-dessus)
  return null;
}

export async function createCustomPage(slug: string, title: string) {
  const existing = await prisma.pageContent.findUnique({ where: { slug } });
  if (existing) throw new Error("Cette page existe déjà");
  const data = defaultContentFor("custom");
  data.fr["custom.title"] = title;
  data.ar["custom.title"] = title;
  await prisma.pageContent.create({
    data: {
      slug,
      type: "custom",
      title,
      content: JSON.stringify(data),
    },
  });
  return getPage(slug);
}

/* ---------------- Site content (header / footer / announcement) ---------------- */

export function defaultSiteContent(): SiteContentData {
  return { header: {}, footer: {}, announcement: {} };
}

export async function getSiteContent(): Promise<SiteContentData> {
  const row = await prisma.siteContent.findUnique({ where: { id: 1 } });
  if (!row) return defaultSiteContent();
  return {
    header: parseJSON(row.header, {}) ?? {},
    footer: parseJSON(row.footer, {}) ?? {},
    announcement: parseJSON(row.announcement, {}) ?? {},
  };
}

export async function saveSiteContent(partial: Partial<SiteContentData>) {
  const current = await getSiteContent();
  const merged: SiteContentData = {
    header: { ...(current.header || {}), ...(partial.header || {}) },
    footer: { ...(current.footer || {}), ...(partial.footer || {}) },
    announcement: { ...(current.announcement || {}), ...(partial.announcement || {}) },
  };
  await prisma.siteContent.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      header: JSON.stringify(merged.header),
      footer: JSON.stringify(merged.footer),
      announcement: JSON.stringify(merged.announcement),
    },
    update: {
      header: JSON.stringify(merged.header),
      footer: JSON.stringify(merged.footer),
      announcement: JSON.stringify(merged.announcement),
    },
  });
  return merged;
}

export { PAGE_TYPES, KNOWN_PAGES, schemaFor };
export type { BlockDef, SiteContentData };
