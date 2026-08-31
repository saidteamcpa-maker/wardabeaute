import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PRICES = { velvastretch: 279, collaglow: 319, silkstop: 229, "kit-collagene": 549 };
const PRODUCT_NAMES = {
  velvastretch: "VelvaStretch™",
  collaglow: "CollaGlow™",
  silkstop: "SilkStop™",
  "kit-collagene": "Kit Collagène Inside & Outside",
};
const NAMES = ["Fatima Zahra", "Yasmine", "Khadija", "Salma", "Imane", "Nour", "Maryam", "Lina", "Sara", "Aya"];
const CITIES = ["Casablanca", "Rabat", "Marrakech", "Fès", "Agadir", "Tanger", "Oujda", "Meknès"];
const SOURCES = ["facebook", "instagram", "tiktok", "google", "direct", "snapchat", "youtube", "other"];
const STATUSES = ["new", "pending", "pending_confirmation", "confirmed", "preparing", "shipped", "out_for_delivery", "delivered", "paid", "canceled", "cancelled", "returned"];
const SLUGS = Object.keys(PRICES);
const DEVICES = ["mobile", "mobile", "mobile", "desktop", "tablet"];
const BROWSERS = ["chrome", "safari", "firefox", "samsung"];
const REFERERS = ["https://facebook.com", "https://instagram.com", "https://google.com", "https://tiktok.com", null];
const UTMS = ["facebook", "instagram", "tiktok", "google", "direct", "snapchat", "youtube", "other"];
const CAMPAIGNS = ["summer_sale", "ramadan", "launch", "retarget", null];
const CATALOG = [
  { slug: "velvastretch", name: "VelvaStretch™", price: 279, oldPrice: 399, image: "/images/velvastretch.png", isBundle: false, offers: [{ qty: 1, price: 279 }, { qty: 2, price: 499, save: 59 }, { qty: 3, price: 699, save: 138 }] },
  { slug: "silkstop", name: "SilkStop™", price: 229, oldPrice: 329, image: "/images/silkstop.png", isBundle: false, offers: [{ qty: 1, price: 229 }, { qty: 2, price: 419, save: 39 }, { qty: 3, price: 599, save: 90 }] },
  { slug: "collaglow", name: "CollaGlow™", price: 319, oldPrice: 449, image: "/images/collaglow.png", isBundle: false, offers: [{ qty: 1, price: 319 }, { qty: 2, price: 569, save: 69 }, { qty: 3, price: 799, save: 158 }] },
  { slug: "kit-collagene", name: "Kit Collagène Inside & Outside", price: 549, oldPrice: 848, image: "/kit-collagene-hero.png", isBundle: true, sku: "pack-le-duo-collagène-7928", offers: [{ qty: 1, price: 549, save: 299 }, { qty: 2, price: 999, save: 99 }] },
];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }

async function insertEvents(rows) {
  try {
    await prisma.analyticsEvent.createMany({ data: rows });
  } catch {
    for (const r of rows) await prisma.analyticsEvent.create({ data: r });
  }
}

async function seedOrders() {
  const count = 40;
  for (let i = 0; i < count; i++) {
    const daysAgo = randInt(0, 29);
    const createdAt = new Date(Date.now() - daysAgo * 86400000 - randInt(0, 86399) * 1000);
    const nItems = randInt(1, 3);
    const items = [];
    const used = new Set();
    for (let j = 0; j < nItems; j++) {
      let slug = rand(SLUGS);
      while (used.has(slug)) slug = rand(SLUGS);
      used.add(slug);
      const qty = randInt(1, 2);
      items.push({ slug, name: PRODUCT_NAMES[slug], qty, unitPrice: PRICES[slug] });
    }
    const total = items.reduce((s, it) => s + it.unitPrice * it.qty, 0);
    const status = rand(STATUSES);
    const ref = `WB-${(1000 + i).toString(36).toUpperCase()}${(Date.now() % 1000).toString(36).toUpperCase()}`;
    await prisma.order.create({
      data: {
        reference: ref,
        createdAt,
        updatedAt: createdAt,
        customerName: rand(NAMES),
        phone: `0${randInt(5, 8)}${String(randInt(10000000, 99999999))}`,
        city: rand(CITIES),
        address: "123 rue " + rand(["Mohammed", "Hassan", "Zagora", "Atlas"]),
        status,
        paymentStatus: status === "delivered" || status === "paid" ? "paid" : "unpaid",
        confirmationStatus: ["confirmed", "preparing", "shipped", "out_for_delivery", "delivered", "paid"].includes(status) ? "confirmed" : status === "canceled" || status === "cancelled" ? "cancelled" : status === "pending" || status === "pending_confirmation" ? "pending_confirmation" : null,
        deliveryStatus: ["shipped", "out_for_delivery", "delivered", "paid"].includes(status) ? status : null,
        source: rand(SOURCES),
        utmCampaign: Math.random() > 0.5 ? rand(CAMPAIGNS) : null,
        utmMedium: rand(["cpc", "social", "email", null]),
        referrer: rand(REFERERS),
        device: rand(DEVICES),
        browser: rand(BROWSERS),
        country: "MA",
        total,
        items: { create: items },
        activities: {
          create: [
            { type: "order_created", message: "Commande créée", adminUser: null, createdAt },
            ...(status !== "new"
              ? [{ type: "status_change", message: `Statut: new → ${status}`, adminUser: "admin", createdAt: new Date(createdAt.getTime() + 3600000) }]
              : []),
          ],
        },
      },
    });
  }
  console.log(`Seeded 40 orders`);
}

async function seedProducts() {
  for (const p of CATALOG) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: { ...p, offers: JSON.stringify(p.offers) },
    });
  }
  console.log(`Seeded products`);
}

async function seedAnalytics() {
  const DAYS = 75;
  const rows = [];
  for (let d = DAYS; d >= 0; d--) {
    const base = Date.now() - d * 86400000;
    const pvs = randInt(45, 110);
    const atcs = Math.round(pvs * (0.18 + Math.random() * 0.12));
    const bcs = Math.round(atcs * (0.25 + Math.random() * 0.15));
    const dayEvents = [
      ...Array.from({ length: pvs }, () => mk("page_view", base)),
      ...Array.from({ length: atcs }, () => mk("add_to_cart", base)),
      ...Array.from({ length: bcs }, () => mk("begin_checkout", base)),
    ];
    rows.push(...dayEvents);
    if (rows.length >= 400) {
      await insertEvents(rows.splice(0, rows.length));
    }
  }
  if (rows.length) await insertEvents(rows);
  console.log(`Seeded analytics events`);
}

function mk(eventType, base) {
  return {
    eventType,
    timestamp: new Date(base + randInt(0, 86399) * 1000),
    device: rand(DEVICES),
    browser: rand(BROWSERS),
    referrer: rand(REFERERS),
    utmSource: rand(UTMS),
    utmCampaign: rand(CAMPAIGNS),
    utmMedium: rand(["cpc", "social", "email", null]),
    country: "MA",
    sessionId: "seed-" + randInt(1, 99999),
    visitorId: "seed-" + randInt(1, 99999),
  };
}

async function main() {
  await prisma.analyticsEvent.deleteMany();
  await prisma.order.deleteMany();
  await seedProducts();
  await seedOrders();
  await seedAnalytics();
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
