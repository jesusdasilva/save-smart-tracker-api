import { db } from '../db';
import { deficits, type Deficit, type NewDeficit } from '../types/deficits.schema';
import { eq, and, like, desc, gte, lte, between, or } from 'drizzle-orm';

export class DeficitsService {
  // Crear un nuevo déficit
  async create(deficitData: NewDeficit): Promise<Deficit> {
    await db.insert(deficits).values(deficitData);
    const [newDeficit] = await db.select().from(deficits)
      .where(eq(deficits.user_id, deficitData.user_id))
      .orderBy(desc(deficits.created_at))
      .limit(1);
    return newDeficit;
  }

  // Obtener todos los déficits con paginación y filtros
  async findAll(
    page: number = 1, 
    limit: number = 10, 
    filters?: {
      userId?: number;
      startDate?: Date;
      endDate?: Date;
      search?: string;
    }
  ): Promise<{ deficits: Deficit[], total: number }> {
    const offset = (page - 1) * limit;
    
    let whereConditions = [];
    
    if (filters?.userId) {
      whereConditions.push(eq(deficits.user_id, filters.userId));
    }
    if (filters?.startDate) {
      whereConditions.push(gte(deficits.start_date, filters.startDate));
    }
    if (filters?.endDate) {
      whereConditions.push(lte(deficits.end_date, filters.endDate));
    }
    if (filters?.search) {
      whereConditions.push(like(deficits.name, `%${filters.search}%`));
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    let deficitsList: Deficit[];
    let totalCount: { count: number }[];

    if (whereClause) {
      [deficitsList, totalCount] = await Promise.all([
        db.select().from(deficits)
          .where(whereClause)
          .orderBy(desc(deficits.created_at))
          .limit(limit)
          .offset(offset),
        db.select({ count: deficits.id }).from(deficits).where(whereClause)
      ]);
    } else {
      [deficitsList, totalCount] = await Promise.all([
        db.select().from(deficits)
          .orderBy(desc(deficits.created_at))
          .limit(limit)
          .offset(offset),
        db.select({ count: deficits.id }).from(deficits)
      ]);
    }

    return {
      deficits: deficitsList,
      total: totalCount.length
    };
  }

  // Obtener déficit por ID
  async findById(id: number): Promise<Deficit | null> {
    const [deficit] = await db.select().from(deficits)
      .where(eq(deficits.id, id))
      .limit(1);
    return deficit || null;
  }

  // Obtener déficits por usuario
  async findByUserId(userId: number, page: number = 1, limit: number = 10): Promise<{ deficits: Deficit[], total: number }> {
    const offset = (page - 1) * limit;

    const [deficitsList, totalCount] = await Promise.all([
      db.select().from(deficits)
        .where(eq(deficits.user_id, userId))
        .orderBy(desc(deficits.created_at))
        .limit(limit)
        .offset(offset),
      db.select({ count: deficits.id }).from(deficits)
        .where(eq(deficits.user_id, userId))
    ]);

    return {
      deficits: deficitsList,
      total: totalCount.length
    };
  }

  // Obtener déficits activos por usuario (dentro del rango de fechas)
  async findActiveByUserId(userId: number, date: Date = new Date()): Promise<Deficit[]> {
    return db.select().from(deficits)
      .where(
        and(
          eq(deficits.user_id, userId),
          lte(deficits.start_date, date),
          gte(deficits.end_date, date)
        )
      )
      .orderBy(deficits.start_date);
  }

  // Actualizar déficit
  async update(id: number, deficitData: Partial<NewDeficit>): Promise<Deficit | null> {
    await db.update(deficits)
      .set({ ...deficitData, updated_at: new Date() })
      .where(eq(deficits.id, id));
    
    return this.findById(id);
  }

  // Eliminar déficit
  async delete(id: number): Promise<boolean> {
    await db.delete(deficits)
      .where(eq(deficits.id, id));
    return true;
  }

  // Obtener estadísticas de déficits por usuario
  async getUserStats(userId: number): Promise<{
    totalDeficits: number;
    totalAmount: number;
    averageAmount: number;
    activeDeficits: number;
  }> {
    const [stats, activeCount] = await Promise.all([
      db.select({
        totalDeficits: deficits.id,
        totalAmount: deficits.amount,
        averageAmount: deficits.amount,
      })
      .from(deficits)
      .where(eq(deficits.user_id, userId)),
      db.select({ count: deficits.id })
      .from(deficits)
      .where(
        and(
          eq(deficits.user_id, userId),
          lte(deficits.start_date, new Date()),
          gte(deficits.end_date, new Date())
        )
      )
    ]);

    const totalAmount = stats.reduce((sum, item) => sum + Number(item.totalAmount), 0);
    const averageAmount = stats.length > 0 ? totalAmount / stats.length : 0;

    return {
      totalDeficits: stats.length,
      totalAmount,
      averageAmount,
      activeDeficits: activeCount.length,
    };
  }

  // Obtener déficits por rango de fechas
  async findByDateRange(userId: number, startDate: Date, endDate: Date): Promise<Deficit[]> {
    return db.select().from(deficits)
      .where(
        and(
          eq(deficits.user_id, userId),
          or(
            between(deficits.start_date, startDate, endDate),
            between(deficits.end_date, startDate, endDate),
            and(
              lte(deficits.start_date, startDate),
              gte(deficits.end_date, endDate)
            )
          )
        )
      )
      .orderBy(deficits.start_date);
  }
} 