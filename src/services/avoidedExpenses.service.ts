import { db } from '../db';
import { avoidedExpenses, type AvoidedExpense, type NewAvoidedExpense } from '../types/avoidedExpenses.schema';
import { users } from '../types/users.schema';
import { categories } from '../types/categories.schema';
import { types } from '../types/types.schema';
import { eq, and, like, desc, gte, lte, between, sum, count, avg } from 'drizzle-orm';

export class AvoidedExpensesService {
  // Crear un nuevo gasto evitado
  async create(expenseData: NewAvoidedExpense): Promise<AvoidedExpense> {
    await db.insert(avoidedExpenses).values(expenseData);
    const [newExpense] = await db.select().from(avoidedExpenses)
      .where(eq(avoidedExpenses.user_id, expenseData.user_id))
      .orderBy(desc(avoidedExpenses.created_at))
      .limit(1);
    return newExpense;
  }

  // Obtener todos los gastos evitados con paginación y filtros
  async findAll(
    page: number = 1, 
    limit: number = 10, 
    filters?: {
      userId?: number;
      categoryId?: number;
      typeId?: number;
      startDate?: Date;
      endDate?: Date;
      search?: string;
    }
  ): Promise<{ expenses: AvoidedExpense[], total: number }> {
    const offset = (page - 1) * limit;
    
    let whereConditions = [];
    
    if (filters?.userId) {
      whereConditions.push(eq(avoidedExpenses.user_id, filters.userId));
    }
    if (filters?.categoryId) {
      whereConditions.push(eq(avoidedExpenses.category_id, filters.categoryId));
    }
    if (filters?.typeId) {
      whereConditions.push(eq(avoidedExpenses.type_id, filters.typeId));
    }
    if (filters?.startDate) {
      whereConditions.push(gte(avoidedExpenses.expense_date, filters.startDate));
    }
    if (filters?.endDate) {
      whereConditions.push(lte(avoidedExpenses.expense_date, filters.endDate));
    }
    if (filters?.search) {
      whereConditions.push(like(avoidedExpenses.name, `%${filters.search}%`));
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    let expensesList: AvoidedExpense[];
    let totalCount: { count: number }[];

    if (whereClause) {
      [expensesList, totalCount] = await Promise.all([
        db.select().from(avoidedExpenses)
          .where(whereClause)
          .orderBy(desc(avoidedExpenses.expense_date))
          .limit(limit)
          .offset(offset),
        db.select({ count: avoidedExpenses.id }).from(avoidedExpenses).where(whereClause)
      ]);
    } else {
      [expensesList, totalCount] = await Promise.all([
        db.select().from(avoidedExpenses)
          .orderBy(desc(avoidedExpenses.expense_date))
          .limit(limit)
          .offset(offset),
        db.select({ count: avoidedExpenses.id }).from(avoidedExpenses)
      ]);
    }

    return {
      expenses: expensesList,
      total: totalCount.length
    };
  }

  // Obtener gasto evitado por ID
  async findById(id: number): Promise<AvoidedExpense | null> {
    const [expense] = await db.select().from(avoidedExpenses)
      .where(eq(avoidedExpenses.id, id))
      .limit(1);
    return expense || null;
  }

  // Obtener gastos evitados por usuario
  async findByUserId(userId: number, page: number = 1, limit: number = 10): Promise<{ expenses: AvoidedExpense[], total: number }> {
    const offset = (page - 1) * limit;

    const [expensesList, totalCount] = await Promise.all([
      db.select().from(avoidedExpenses)
        .where(eq(avoidedExpenses.user_id, userId))
        .orderBy(desc(avoidedExpenses.expense_date))
        .limit(limit)
        .offset(offset),
      db.select({ count: avoidedExpenses.id }).from(avoidedExpenses)
        .where(eq(avoidedExpenses.user_id, userId))
    ]);

    return {
      expenses: expensesList,
      total: totalCount.length
    };
  }

  // Actualizar gasto evitado
  async update(id: number, expenseData: Partial<NewAvoidedExpense>): Promise<AvoidedExpense | null> {
    await db.update(avoidedExpenses)
      .set({ ...expenseData, updated_at: new Date() })
      .where(eq(avoidedExpenses.id, id));
    
    return this.findById(id);
  }

  // Eliminar gasto evitado
  async delete(id: number): Promise<boolean> {
    await db.delete(avoidedExpenses)
      .where(eq(avoidedExpenses.id, id));
    return true;
  }

  // Obtener estadísticas de ahorros por usuario
  async getUserStats(userId: number): Promise<{
    totalSavings: number;
    totalExpenses: number;
    averageAmount: number;
    firstExpense: Date | null;
    lastExpense: Date | null;
  }> {
    const [stats] = await db.select({
      totalSavings: sum(avoidedExpenses.amount),
      totalExpenses: count(avoidedExpenses.id),
      averageAmount: avg(avoidedExpenses.amount),
      firstExpense: avoidedExpenses.expense_date,
      lastExpense: avoidedExpenses.expense_date,
    })
    .from(avoidedExpenses)
    .where(eq(avoidedExpenses.user_id, userId));

    return {
      totalSavings: Number(stats.totalSavings) || 0,
      totalExpenses: Number(stats.totalExpenses) || 0,
      averageAmount: Number(stats.averageAmount) || 0,
      firstExpense: stats.firstExpense,
      lastExpense: stats.lastExpense,
    };
  }

  // Obtener ahorros mensuales por usuario
  async getMonthlySavings(userId: number, year: number, month?: number): Promise<any[]> {
    let whereCondition;
    
    if (month) {
      whereCondition = and(
        eq(avoidedExpenses.user_id, userId),
        gte(avoidedExpenses.expense_date, new Date(year, month - 1, 1)),
        lte(avoidedExpenses.expense_date, new Date(year, month, 0))
      );
    } else {
      whereCondition = and(
        eq(avoidedExpenses.user_id, userId),
        gte(avoidedExpenses.expense_date, new Date(year, 0, 1)),
        lte(avoidedExpenses.expense_date, new Date(year, 11, 31))
      );
    }

    return db.select({
      month: avoidedExpenses.expense_date,
      totalSavings: sum(avoidedExpenses.amount),
      expenseCount: count(avoidedExpenses.id),
    })
    .from(avoidedExpenses)
    .where(whereCondition)
    .groupBy(avoidedExpenses.expense_date);
  }

  // Obtener ahorros por categoría
  async getSavingsByCategory(userId: number): Promise<any[]> {
    return db.select({
      categoryId: avoidedExpenses.category_id,
      totalSavings: sum(avoidedExpenses.amount),
      expenseCount: count(avoidedExpenses.id),
      averageAmount: avg(avoidedExpenses.amount),
    })
    .from(avoidedExpenses)
    .where(eq(avoidedExpenses.user_id, userId))
    .groupBy(avoidedExpenses.category_id);
  }

  // Obtener ahorros por tipo
  async getSavingsByType(userId: number): Promise<any[]> {
    return db.select({
      typeId: avoidedExpenses.type_id,
      totalSavings: sum(avoidedExpenses.amount),
      expenseCount: count(avoidedExpenses.id),
      averageAmount: avg(avoidedExpenses.amount),
    })
    .from(avoidedExpenses)
    .where(eq(avoidedExpenses.user_id, userId))
    .groupBy(avoidedExpenses.type_id);
  }

  // Obtener gastos evitados con información de relaciones
  async findWithRelations(id: number): Promise<any> {
    const [expense] = await db.select({
      id: avoidedExpenses.id,
      name: avoidedExpenses.name,
      amount: avoidedExpenses.amount,
      expense_date: avoidedExpenses.expense_date,
      description: avoidedExpenses.description,
      created_at: avoidedExpenses.created_at,
      updated_at: avoidedExpenses.updated_at,
      user: {
        id: users.id,
        username: users.username,
        email: users.email,
      },
      category: {
        id: categories.id,
        name: categories.name,
        description: categories.description,
      },
      type: {
        id: types.id,
        name: types.name,
        description: types.description,
      },
    })
    .from(avoidedExpenses)
    .leftJoin(users, eq(avoidedExpenses.user_id, users.id))
    .leftJoin(categories, eq(avoidedExpenses.category_id, categories.id))
    .leftJoin(types, eq(avoidedExpenses.type_id, types.id))
    .where(eq(avoidedExpenses.id, id))
    .limit(1);

    return expense || null;
  }
}
