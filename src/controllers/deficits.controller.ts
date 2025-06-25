import { Request, Response } from 'express';
import { DeficitsService } from '../services/deficits.service';
import { NewDeficit } from '../types/deficits.schema';

export class DeficitsController {
  private deficitsService: DeficitsService;

  constructor() {
    this.deficitsService = new DeficitsService();
  }

  // POST /api/deficits
  async create(req: Request, res: Response): Promise<void> {
    try {
      const deficitData: NewDeficit = req.body;
      
      // Validaciones básicas
      if (!deficitData.user_id || !deficitData.name || !deficitData.amount || !deficitData.start_date || !deficitData.end_date) {
        res.status(400).json({ 
          success: false, 
          message: 'user_id, name, amount, start_date y end_date son requeridos' 
        });
        return;
      }

      // Validar que el monto sea positivo
      if (Number(deficitData.amount) <= 0) {
        res.status(400).json({ 
          success: false, 
          message: 'El monto debe ser mayor a 0' 
        });
        return;
      }

      // Validar que start_date <= end_date
      const startDate = new Date(deficitData.start_date);
      const endDate = new Date(deficitData.end_date);
      if (startDate > endDate) {
        res.status(400).json({ 
          success: false, 
          message: 'La fecha de inicio debe ser menor o igual a la fecha de fin' 
        });
        return;
      }

      const newDeficit = await this.deficitsService.create(deficitData);
      
      res.status(201).json({
        success: true,
        data: newDeficit,
        message: 'Déficit creado exitosamente'
      });
    } catch (error) {
      console.error('Error al crear déficit:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // GET /api/deficits
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      // Filtros opcionales
      const filters = {
        userId: req.query.userId ? parseInt(req.query.userId as string) : undefined,
        startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
        search: req.query.search as string
      };

      const result = await this.deficitsService.findAll(page, limit, filters);
      
      res.status(200).json({
        success: true,
        data: result.deficits,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      console.error('Error al obtener déficits:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // GET /api/deficits/:id
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

      const deficit = await this.deficitsService.findById(id);
      
      if (!deficit) {
        res.status(404).json({
          success: false,
          message: 'Déficit no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: deficit
      });
    } catch (error) {
      console.error('Error al obtener déficit:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // GET /api/deficits/user/:userId
  async findByUserId(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: 'ID de usuario inválido'
        });
        return;
      }

      const result = await this.deficitsService.findByUserId(userId, page, limit);
      
      res.status(200).json({
        success: true,
        data: result.deficits,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      console.error('Error al obtener déficits por usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // GET /api/deficits/user/:userId/active
  async findActiveByUserId(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      const date = req.query.date ? new Date(req.query.date as string) : new Date();
      
      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: 'ID de usuario inválido'
        });
        return;
      }

      const deficits = await this.deficitsService.findActiveByUserId(userId, date);
      
      res.status(200).json({
        success: true,
        data: deficits
      });
    } catch (error) {
      console.error('Error al obtener déficits activos:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // PUT /api/deficits/:id
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

      // Verificar si el déficit existe
      const existingDeficit = await this.deficitsService.findById(id);
      if (!existingDeficit) {
        res.status(404).json({
          success: false,
          message: 'Déficit no encontrado'
        });
        return;
      }

      // Validar monto si se está actualizando
      if (updateData.amount && Number(updateData.amount) <= 0) {
        res.status(400).json({
          success: false,
          message: 'El monto debe ser mayor a 0'
        });
        return;
      }

      // Validar fechas si se están actualizando
      if (updateData.start_date && updateData.end_date) {
        const startDate = new Date(updateData.start_date);
        const endDate = new Date(updateData.end_date);
        if (startDate > endDate) {
          res.status(400).json({
            success: false,
            message: 'La fecha de inicio debe ser menor o igual a la fecha de fin'
          });
          return;
        }
      }

      const updatedDeficit = await this.deficitsService.update(id, updateData);
      
      res.status(200).json({
        success: true,
        data: updatedDeficit,
        message: 'Déficit actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error al actualizar déficit:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // DELETE /api/deficits/:id
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

      const success = await this.deficitsService.delete(id);
      
      if (!success) {
        res.status(404).json({
          success: false,
          message: 'Déficit no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Déficit eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar déficit:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // GET /api/deficits/user/:userId/stats
  async getUserStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: 'ID de usuario inválido'
        });
        return;
      }

      const stats = await this.deficitsService.getUserStats(userId);
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error al obtener estadísticas del usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // GET /api/deficits/user/:userId/by-date-range
  async findByDateRange(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      const startDate = new Date(req.query.startDate as string);
      const endDate = new Date(req.query.endDate as string);
      
      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: 'ID de usuario inválido'
        });
        return;
      }

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        res.status(400).json({
          success: false,
          message: 'Fechas inválidas'
        });
        return;
      }

      if (startDate > endDate) {
        res.status(400).json({
          success: false,
          message: 'La fecha de inicio debe ser menor o igual a la fecha de fin'
        });
        return;
      }

      const deficits = await this.deficitsService.findByDateRange(userId, startDate, endDate);
      
      res.status(200).json({
        success: true,
        data: deficits
      });
    } catch (error) {
      console.error('Error al obtener déficits por rango de fechas:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
} 