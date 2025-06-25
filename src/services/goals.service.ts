import { db } from '../db';
import { goals } from '../types/goals.schema';
import { eq } from 'drizzle-orm';

export const createGoal = async (data: Omit<typeof goals.$inferInsert, 'id'>) => {
  const [inserted] = await db.insert(goals).values(data);
  return inserted;
};

export const getAllGoals = async (user_id: number) => {
  return db.select().from(goals).where(eq(goals.user_id, user_id));
};

export const getGoalById = async (id: number) => {
  return db.select().from(goals).where(eq(goals.id, id));
};

export const updateGoal = async (id: number, data: Partial<typeof goals.$inferInsert>) => {
  await db.update(goals).set(data).where(eq(goals.id, id));
  return db.select().from(goals).where(eq(goals.id, id));
};

export const deleteGoal = async (id: number) => {
  await db.delete(goals).where(eq(goals.id, id));
};
