import { db } from '../db';
import { users, type User, type NewUser } from '../types/users.schema';
import { eq, and, like, desc } from 'drizzle-orm';

export class UsersService {
  // Crear un nuevo usuario
  async create(userData: NewUser): Promise<User> {
    await db.insert(users).values(userData);
    const [newUser] = await db.select().from(users)
      .where(eq(users.username, userData.username))
      .limit(1);
    return newUser;
  }

  // Obtener todos los usuarios con paginación
  async findAll(page: number = 1, limit: number = 10, search?: string): Promise<{ users: User[], total: number }> {
    const offset = (page - 1) * limit;
    
    let whereClause = undefined;
    if (search) {
      whereClause = and(
        like(users.username, `%${search}%`),
        eq(users.is_active, true)
      );
    } else {
      whereClause = eq(users.is_active, true);
    }

    const [usersList, totalCount] = await Promise.all([
      db.select().from(users)
        .where(whereClause)
        .orderBy(desc(users.created_at))
        .limit(limit)
        .offset(offset),
      db.select({ count: users.id }).from(users).where(whereClause)
    ]);

    return {
      users: usersList,
      total: totalCount.length
    };
  }

  // Obtener usuario por ID
  async findById(id: number): Promise<User | null> {
    const [user] = await db.select().from(users)
      .where(eq(users.id, id))
      .limit(1);
    return user || null;
  }

  // Obtener usuario por username
  async findByUsername(username: string): Promise<User | null> {
    const [user] = await db.select().from(users)
      .where(eq(users.username, username))
      .limit(1);
    return user || null;
  }

  // Obtener usuario por email
  async findByEmail(email: string): Promise<User | null> {
    const [user] = await db.select().from(users)
      .where(eq(users.email, email))
      .limit(1);
    return user || null;
  }

  // Actualizar usuario
  async update(id: number, userData: Partial<NewUser>): Promise<User | null> {
    await db.update(users)
      .set({ ...userData, updated_at: new Date() })
      .where(eq(users.id, id));
    
    return this.findById(id);
  }

  // Eliminar usuario (soft delete)
  async delete(id: number): Promise<boolean> {
    await db.update(users)
      .set({ is_active: false, updated_at: new Date() })
      .where(eq(users.id, id));
    return true;
  }

  // Eliminar usuario permanentemente
  async hardDelete(id: number): Promise<boolean> {
    await db.delete(users)
      .where(eq(users.id, id));
    return true;
  }

  // Activar usuario
  async activate(id: number): Promise<boolean> {
    await db.update(users)
      .set({ is_active: true, updated_at: new Date() })
      .where(eq(users.id, id));
    return true;
  }

  // Obtener estadísticas de usuarios
  async getStats(): Promise<{ total: number, active: number, inactive: number }> {
    const [total, active] = await Promise.all([
      db.select({ count: users.id }).from(users),
      db.select({ count: users.id }).from(users).where(eq(users.is_active, true))
    ]);

    return {
      total: total.length,
      active: active.length,
      inactive: total.length - active.length
    };
  }

  // Crear usuario (alias para create - usado en registro)
  async createUser(userData: NewUser): Promise<User> {
    return this.create(userData);
  }

  // Buscar usuario por Google ID
  async findByGoogleId(googleId: string): Promise<User | null> {
    const [user] = await db.select().from(users)
      .where(eq(users.google_id, googleId))
      .limit(1);
    return user || null;
  }
} 