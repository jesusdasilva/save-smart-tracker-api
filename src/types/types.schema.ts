import { mysqlTable, int, varchar, text, boolean, timestamp, index } from 'drizzle-orm/mysql-core';

export const types = mysqlTable('types', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  image_link: varchar('image_link', { length: 255 }),
  description: text('description'),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
  idx_types_name: index('idx_types_name').on(table.name),
  idx_types_active: index('idx_types_active').on(table.is_active),
}));

export type Type = typeof types.$inferSelect;
export type NewType = typeof types.$inferInsert; 