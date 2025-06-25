import { Request, Response } from 'express';
import { TypesService } from '../services/types.service';
import { NewType } from '../types/types.schema';

export class TypesController {
  private typesService: TypesService;

  constructor() {
    this.typesService = new TypesService();
  }

  // POST /api/types
  async create(req: Request, res: Response): Promise<void> {
    try {
      const typeData: NewType = req.body;
      
      // Validaciones básicas
      if (!typeData.name) {
        res.status(400).json({ 
          success: false, 
          message: 'El nombre del tipo es requerido' 
        });
        return;
      }

      // Verificar si el tipo ya existe
      const existingType = await this.typesService.findByName(typeData.name);
      if (existingType) {
        res.status(409).json({ 
          success: false, 
          message: 'El tipo ya existe' 
        });
        return;
      }

      const newType = await this.typesService.create(typeData);
      
      res.status(201).json({
        success: true,
        data: newType,
        message: 'Tipo creado exitosamente'
      });
    } catch (error) {
      console.error('Error al crear tipo:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // GET /api/types
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;

      const result = await this.typesService.findAll(page, limit, search);
      
      res.status(200).json({
        success: true,
        data: result.types,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      console.error('Error al obtener tipos:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // GET /api/types/active
  async findActive(req: Request, res: Response): Promise<void> {
    try {
      const types = await this.typesService.findActive();
      
      res.status(200).json({
        success: true,
        data: types
      });
    } catch (error) {
      console.error('Error al obtener tipos activos:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // GET /api/types/:id
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

      const type = await this.typesService.findById(id);
      
      if (!type) {
        res.status(404).json({
          success: false,
          message: 'Tipo no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: type
      });
    } catch (error) {
      console.error('Error al obtener tipo:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // PUT /api/types/:id
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

      // Verificar si el tipo existe
      const existingType = await this.typesService.findById(id);
      if (!existingType) {
        res.status(404).json({
          success: false,
          message: 'Tipo no encontrado'
        });
        return;
      }

      // Verificar nombre único si se está actualizando
      if (updateData.name && updateData.name !== existingType.name) {
        const nameExists = await this.typesService.findByName(updateData.name);
        if (nameExists) {
          res.status(409).json({
            success: false,
            message: 'El nombre del tipo ya está en uso'
          });
          return;
        }
      }

      const updatedType = await this.typesService.update(id, updateData);
      
      res.status(200).json({
        success: true,
        data: updatedType,
        message: 'Tipo actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error al actualizar tipo:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // DELETE /api/types/:id
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

      const success = await this.typesService.delete(id);
      
      if (!success) {
        res.status(404).json({
          success: false,
          message: 'Tipo no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Tipo eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar tipo:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // POST /api/types/:id/activate
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

      const success = await this.typesService.activate(id);
      
      if (!success) {
        res.status(404).json({
          success: false,
          message: 'Tipo no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Tipo activado exitosamente'
      });
    } catch (error) {
      console.error('Error al activar tipo:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // GET /api/types/stats
  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.typesService.getStats();
      
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