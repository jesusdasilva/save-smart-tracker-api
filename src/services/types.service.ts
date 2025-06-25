import { db } from '../db';
import { types, type Type, type NewType } from '../types/types.schema';
import { eq, and, like, desc } from 'drizzle-orm';

export class TypesService {
  // Crear un nuevo tipo
  async create(typeData: NewType): Promise<Type> {
    await db.insert(types).values(typeData);
    const [newType] = await db.select().from(types)
      .where(eq(types.name, typeData.name))
      .limit(1);
    return newType;
  }

  // Obtener todos los tipos con paginación
  async findAll(page: number = 1, limit: number = 10, search?: string): Promise<{ types: Type[], total: number }> {
    const offset = (page - 1) * limit;
    
    let whereClause = undefined;
    if (search) {
      whereClause = and(
        like(types.name, `%${search}%`),
        eq(types.is_active, true)
      );
    } else {
      whereClause = eq(types.is_active, true);
    }

    const [typesList, totalCount] = await Promise.all([
      db.select().from(types)
        .where(whereClause)
        .orderBy(desc(types.created_at))
        .limit(limit)
        .offset(offset),
      db.select({ count: types.id }).from(types).where(whereClause)
    ]);

    return {
      types: typesList,
      total: totalCount.length
    };
  }

  // Obtener tipo por ID
  async findById(id: number): Promise<Type | null> {
    const [type] = await db.select().from(types)
      .where(eq(types.id, id))
      .limit(1);
    return type || null;
  }

  // Obtener tipo por nombre
  async findByName(name: string): Promise<Type | null> {
    const [type] = await db.select().from(types)
      .where(eq(types.name, name))
      .limit(1);
    return type || null;
  }

  // Actualizar tipo
  async update(id: number, typeData: Partial<NewType>): Promise<Type | null> {
    await db.update(types)
      .set({ ...typeData, updated_at: new Date() })
      .where(eq(types.id, id));
    
    return this.findById(id);
  }

  // Eliminar tipo (soft delete)
  async delete(id: number): Promise<boolean> {
    await db.update(types)
      .set({ is_active: false, updated_at: new Date() })
      .where(eq(types.id, id));
    return true;
  }

  // Eliminar tipo permanentemente
  async hardDelete(id: number): Promise<boolean> {
    await db.delete(types)
      .where(eq(types.id, id));
    return true;
  }

  // Activar tipo
  async activate(id: number): Promise<boolean> {
    await db.update(types)
      .set({ is_active: true, updated_at: new Date() })
      .where(eq(types.id, id));
    return true;
  }

  // Obtener tipos activos
  async findActive(): Promise<Type[]> {
    return db.select().from(types)
      .where(eq(types.is_active, true))
      .orderBy(types.name);
  }

  // Obtener estadísticas de tipos
  async getStats(): Promise<{ total: number, active: number, inactive: number }> {
    const [total, active] = await Promise.all([
      db.select({ count: types.id }).from(types),
      db.select({ count: types.id }).from(types).where(eq(types.is_active, true))
    ]);

    return {
      total: total.length,
      active: active.length,
      inactive: total.length - active.length
    };
  }
} 