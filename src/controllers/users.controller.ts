import { Request, Response } from 'express';
import { UsersService } from '../services/users.service';
import { NewUser } from '../types/users.schema';

export class UsersController {
  private usersService: UsersService;

  constructor() {
    this.usersService = new UsersService();
  }

  // POST /api/users
  async create(req: Request, res: Response): Promise<void> {
    try {
      const userData: NewUser = req.body;
      
      // Validaciones básicas
      if (!userData.username || !userData.password) {
        res.status(400).json({ 
          success: false, 
          message: 'Username y password son requeridos' 
        });
        return;
      }

      // Verificar si el usuario ya existe
      const existingUser = await this.usersService.findByUsername(userData.username);
      if (existingUser) {
        res.status(409).json({ 
          success: false, 
          message: 'El username ya está en uso' 
        });
        return;
      }

      // Verificar email si se proporciona
      if (userData.email) {
        const existingEmail = await this.usersService.findByEmail(userData.email);
        if (existingEmail) {
          res.status(409).json({ 
            success: false, 
            message: 'El email ya está en uso' 
          });
          return;
        }
      }

      const newUser = await this.usersService.create(userData);
      
      res.status(201).json({
        success: true,
        data: newUser,
        message: 'Usuario creado exitosamente'
      });
    } catch (error) {
      console.error('Error al crear usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // GET /api/users
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;

      const result = await this.usersService.findAll(page, limit, search);
      
      res.status(200).json({
        success: true,
        data: result.users,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // GET /api/users/:id
  async findById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID inválido'
        });
        return;
      }

      const user = await this.usersService.findById(id);
      
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // PUT /api/users/:id
  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID inválido'
        });
        return;
      }

      // Verificar si el usuario existe
      const existingUser = await this.usersService.findById(id);
      if (!existingUser) {
        res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
        return;
      }

      // Verificar username único si se está actualizando
      if (updateData.username && updateData.username !== existingUser.username) {
        const usernameExists = await this.usersService.findByUsername(updateData.username);
        if (usernameExists) {
          res.status(409).json({
            success: false,
            message: 'El username ya está en uso'
          });
          return;
        }
      }

      // Verificar email único si se está actualizando
      if (updateData.email && updateData.email !== existingUser.email) {
        const emailExists = await this.usersService.findByEmail(updateData.email);
        if (emailExists) {
          res.status(409).json({
            success: false,
            message: 'El email ya está en uso'
          });
          return;
        }
      }

      const updatedUser = await this.usersService.update(id, updateData);
      
      res.status(200).json({
        success: true,
        data: updatedUser,
        message: 'Usuario actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // DELETE /api/users/:id
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID inválido'
        });
        return;
      }

      const success = await this.usersService.delete(id);
      
      if (!success) {
        res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Usuario eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // POST /api/users/:id/activate
  async activate(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID inválido'
        });
        return;
      }

      const success = await this.usersService.activate(id);
      
      if (!success) {
        res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Usuario activado exitosamente'
      });
    } catch (error) {
      console.error('Error al activar usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // GET /api/users/stats
  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.usersService.getStats();
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
} 