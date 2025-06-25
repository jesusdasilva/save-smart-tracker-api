import { db } from '../db';
import { categories, type Category, type NewCategory } from '../types/categories.schema';
import { eq, and, like, desc } from 'drizzle-orm';

export class CategoriesService {
  // Crear una nueva categoría
  async create(categoryData: NewCategory): Promise<Category> {
    await db.insert(categories).values(categoryData);
    const [newCategory] = await db.select().from(categories)
      .where(eq(categories.name, categoryData.name))
      .limit(1);
    return newCategory;
  }

  // Obtener todas las categorías con paginación
  async findAll(page: number = 1, limit: number = 10, search?: string): Promise<{ categories: Category[], total: number }> {
    const offset = (page - 1) * limit;
    
    let whereClause = undefined;
    if (search) {
      whereClause = and(
        like(categories.name, `%${search}%`),
        eq(categories.is_active, true)
      );
    } else {
      whereClause = eq(categories.is_active, true);
    }

    const [categoriesList, totalCount] = await Promise.all([
      db.select().from(categories)
        .where(whereClause)
        .orderBy(desc(categories.created_at))
        .limit(limit)
        .offset(offset),
      db.select({ count: categories.id }).from(categories).where(whereClause)
    ]);

    return {
      categories: categoriesList,
      total: totalCount.length
    };
  }

  // Obtener categoría por ID
  async findById(id: number): Promise<Category | null> {
    const [category] = await db.select().from(categories)
      .where(eq(categories.id, id))
      .limit(1);
    return category || null;
  }

  // Obtener categoría por nombre
  async findByName(name: string): Promise<Category | null> {
    const [category] = await db.select().from(categories)
      .where(eq(categories.name, name))
      .limit(1);
    return category || null;
  }

  // Actualizar categoría
  async update(id: number, categoryData: Partial<NewCategory>): Promise<Category | null> {
    await db.update(categories)
      .set({ ...categoryData, updated_at: new Date() })
      .where(eq(categories.id, id));
    
    return this.findById(id);
  }

  // Eliminar categoría (soft delete)
  async delete(id: number): Promise<boolean> {
    await db.update(categories)
      .set({ is_active: false, updated_at: new Date() })
      .where(eq(categories.id, id));
    return true;
  }

  // Eliminar categoría permanentemente
  async hardDelete(id: number): Promise<boolean> {
    await db.delete(categories)
      .where(eq(categories.id, id));
    return true;
  }

  // Activar categoría
  async activate(id: number): Promise<boolean> {
    await db.update(categories)
      .set({ is_active: true, updated_at: new Date() })
      .where(eq(categories.id, id));
    return true;
  }

  // Obtener categorías activas
  async findActive(): Promise<Category[]> {
    return db.select().from(categories)
      .where(eq(categories.is_active, true))
      .orderBy(categories.name);
  }

  // Obtener estadísticas de categorías
  async getStats(): Promise<{ total: number, active: number, inactive: number }> {
    const [total, active] = await Promise.all([
      db.select({ count: categories.id }).from(categories),
      db.select({ count: categories.id }).from(categories).where(eq(categories.is_active, true))
    ]);

    return {
      total: total.length,
      active: active.length,
      inactive: total.length - active.length
    };
  }
} 