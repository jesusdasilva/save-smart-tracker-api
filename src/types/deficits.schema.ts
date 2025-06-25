import { mysqlTable, int, varchar, decimal, date, text, timestamp, index, foreignKey } from 'drizzle-orm/mysql-core';
import { users } from './users.schema';

export const deficits = mysqlTable('deficits', {
  id: int('id').primaryKey().autoincrement(),
  user_id: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  start_date: date('start_date').notNull(),
  end_date: date('end_date').notNull(),
  description: text('description'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
  idx_deficits_user_id: index('idx_deficits_user_id').on(table.user_id),
  idx_deficits_start_date: index('idx_deficits_start_date').on(table.start_date),
  idx_deficits_end_date: index('idx_deficits_end_date').on(table.end_date),
  idx_deficits_date_range: index('idx_deficits_date_range').on(table.start_date, table.end_date),
}));

export type Deficit = typeof deficits.$inferSelect;
export type NewDeficit = typeof deficits.$inferInsert; 