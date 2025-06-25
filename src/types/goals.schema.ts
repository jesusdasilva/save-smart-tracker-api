import { mysqlTable, int, varchar, decimal, date, text, timestamp, index } from 'drizzle-orm/mysql-core';
import { users } from './users.schema';

export const goals = mysqlTable('goals', {
  id: int('id').primaryKey().autoincrement(),
  user_id: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  target_amount: decimal('target_amount', { precision: 10, scale: 2 }).notNull(),
  start_date: date('start_date').notNull(),
  end_date: date('end_date').notNull(),
  description: text('description'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
},
  (table) => ({
    idx_goals_user_id: index('idx_goals_user_id').on(table.user_id),
    idx_goals_start_date: index('idx_goals_start_date').on(table.start_date),
    idx_goals_end_date: index('idx_goals_end_date').on(table.end_date),
    idx_goals_date_range: index('idx_goals_date_range').on(table.start_date, table.end_date),
  })
);
