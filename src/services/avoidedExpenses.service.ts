import { db } from '../db';
import { avoidedExpenses } from '../types/avoidedExpenses.schema';
import { eq } from 'drizzle-orm';

export const createAvoidedExpense = async (data: Omit<typeof avoidedExpenses.$inferInsert, 'id'>) => {
  const [inserted] = await db.insert(avoidedExpenses).values(data);
  return inserted;
};

export const getAllAvoidedExpenses = async (user_id: number) => {
  return db.select().from(avoidedExpenses).where(eq(avoidedExpenses.user_id, user_id));
};

export const updateAvoidedExpense = async (id: number, data: Partial<typeof avoidedExpenses.$inferInsert>) => {
  await db.update(avoidedExpenses).set(data).where(eq(avoidedExpenses.id, id));
  return db.select().from(avoidedExpenses).where(eq(avoidedExpenses.id, id));
};

export const deleteAvoidedExpense = async (id: number) => {
  await db.delete(avoidedExpenses).where(eq(avoidedExpenses.id, id));
};

export const exportAvoidedExpenses = async (user_id: number) => {
  return db.select().from(avoidedExpenses).where(eq(avoidedExpenses.user_id, user_id));
};
