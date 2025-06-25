import { mysqlTable, int, varchar, decimal, date, text, timestamp, index, primaryKey, foreignKey } from 'drizzle-orm/mysql-core';
import { users } from './users.schema';
import { categories } from './categories.schema';
import { types } from './types.schema';

export const avoidedExpenses = mysqlTable('avoided_expenses', {
  id: int('id').primaryKey().autoincrement(),
  user_id: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  category_id: int('category_id').references(() => categories.id, { onDelete: 'set null' }),
  type_id: int('type_id').references(() => types.id, { onDelete: 'set null' }),
  expense_date: date('expense_date').notNull(),
  description: text('description'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
  idx_expenses_user_id: index('idx_expenses_user_id').on(table.user_id),
  idx_expenses_date: index('idx_expenses_date').on(table.expense_date),
  idx_expenses_category_id: index('idx_expenses_category_id').on(table.category_id),
  idx_expenses_type_id: index('idx_expenses_type_id').on(table.type_id),
  idx_expenses_user_date: index('idx_expenses_user_date').on(table.user_id, table.expense_date),
  idx_expenses_user_category: index('idx_expenses_user_category').on(table.user_id, table.category_id),
  idx_expenses_user_type: index('idx_expenses_user_type').on(table.user_id, table.type_id),
  idx_expenses_date_amount: index('idx_expenses_date_amount').on(table.expense_date, table.amount),
}));

export type AvoidedExpense = typeof avoidedExpenses.$inferSelect;
export type NewAvoidedExpense = typeof avoidedExpenses.$inferInsert;
