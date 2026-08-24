import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL, { max: 1 });

const products = [
  { sku: 'velvastretch', nameFr: 'VelvaStretch™', nameAr: 'فيلفا ستراتش™', slug: 'velvastretch', price: 27900, originalPrice: 39900, badge: 'Best-seller' },
  { sku: 'silkstop', nameFr: 'SilkStop™', nameAr: 'سيلك ستوب™', slug: 'silkstop', price: 22900, originalPrice: 32900, badge: 'Anti-repousse' },
  { sku: 'collaglow', nameFr: 'CollaGlow™', nameAr: 'كولا غلو™', slug: 'collaglow', price: 31900, originalPrice: 44900, badge: 'Gummies' },
  { sku: 'bundle-bck', nameFr: 'Body Confidence Kit', nameAr: 'باقة الثقة بالجسم', slug: 'bundle-body-confidence', price: 65000, originalPrice: 82800, badge: 'Kit' },
];

for (const p of products) {
  await sql`
    INSERT INTO products (sku, name_fr, name_ar, slug, price, original_price, stock, badge)
    VALUES (${p.sku}, ${p.nameFr}, ${p.nameAr}, ${p.slug}, ${p.price}, ${p.originalPrice}, 50, ${p.badge})
    ON CONFLICT (sku) DO UPDATE SET
      name_fr = EXCLUDED.name_fr,
      name_ar = EXCLUDED.name_ar,
      slug = EXCLUDED.slug,
      price = EXCLUDED.price,
      original_price = EXCLUDED.original_price,
      badge = EXCLUDED.badge;
  `;
  console.log('seeded', p.sku);
}

await sql.end();
console.log('Done.');
