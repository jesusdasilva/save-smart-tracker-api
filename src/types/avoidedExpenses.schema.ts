import { mysqlTable, int, varchar, decimal, date, text, timestamp, index, primaryKey, foreignKey } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const avoidedExpenses = mysqlTable('avoided_expenses', {
  id: int('id').primaryKey().autoincrement(),
  user_id: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  date: date('date').notNull(),
  description: text('description'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
},
  (table) => ({
    idx_user_id: index('idx_user_id').on(table.user_id),
    idx_date: index('idx_date').on(table.date),
    idx_category: index('idx_category').on(table.category),
    idx_user_date: index('idx_user_date').on(table.user_id, table.date),
    idx_avoided_expenses_user_category: index('idx_avoided_expenses_user_category').on(table.user_id, table.category),
    idx_avoided_expenses_user_date_range: index('idx_avoided_expenses_user_date_range').on(table.user_id, table.date, table.amount),
  })
);
