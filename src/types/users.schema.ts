import { mysqlTable, int, varchar, boolean, timestamp, index } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }),
  email: varchar('email', { length: 255 }).unique(),
  google_id: varchar('google_id', { length: 255 }).unique(),
  avatar_url: varchar('avatar_url', { length: 500 }),
  provider: varchar('provider', { length: 50 }).default('local'),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
  idx_users_username: index('idx_users_username').on(table.username),
  idx_users_email: index('idx_users_email').on(table.email),
  idx_users_google_id: index('idx_users_google_id').on(table.google_id),
  idx_users_active: index('idx_users_active').on(table.is_active),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;