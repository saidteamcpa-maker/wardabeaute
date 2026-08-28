import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  boolean,
  jsonb,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const orderStatus = pgEnum('order_status', [
  'new',
  'pending',
  'pending_confirmation',
  'confirmed',
  'preparing',
  'shipped',
  'out_for_delivery',
  'delivered',
  'paid',
  'canceled',
  'cancelled',
  'returned',
]);

export type OrderStatus = (typeof orderStatus.enumValues)[number];

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderNumber: text('order_number').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  customerName: text('customer_name').notNull(),
  phone: text('phone').notNull(),
  city: text('city').notNull(),
  address: text('address').notNull(),
  postalCode: text('postal_code'),
  products: jsonb('products').notNull(),
  total: integer('total').notNull(),
  status: orderStatus('status').notNull().default('pending'),
  source: text('source').notNull().default('web'),
  notes: text('notes'),
  confirmedAt: timestamp('confirmed_at', { withTimezone: true }),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

export const products = pgTable('products', {
  sku: text('sku').primaryKey(),
  nameFr: text('name_fr').notNull(),
  nameAr: text('name_ar').notNull(),
  slug: text('slug').notNull().unique(),
  price: integer('price').notNull(),
  originalPrice: integer('original_price'),
  stock: integer('stock').notNull().default(0),
  active: boolean('active').notNull().default(true),
  descriptionFr: text('description_fr'),
  descriptionAr: text('description_ar'),
  heroImage: text('hero_image'),
  gallery: jsonb('gallery'),
  badge: text('badge'),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export const adminSettings = pgTable('admin_settings', {
  key: text('key').primaryKey(),
  value: text('value'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type AdminSetting = typeof adminSettings.$inferSelect;
