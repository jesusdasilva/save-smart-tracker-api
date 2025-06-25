import { mysqlTable, int, varchar, text, boolean, timestamp, index } from 'drizzle-orm/mysql-core';

export const categories = mysqlTable('categories', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  image_link: varchar('image_link', { length: 255 }),
  description: text('description'),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
  idx_categories_name: index('idx_categories_name').on(table.name),
  idx_categories_active: index('idx_categories_active').on(table.is_active),
}));

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert; 