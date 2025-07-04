import { Request, Response } from 'express';
import { AvoidedExpensesService } from '../services/avoidedExpenses.service';
import { NewAvoidedExpense } from '../types/avoidedExpenses.schema';

export class AvoidedExpensesController {
  private avoidedExpensesService: AvoidedExpensesService;

  constructor() {
    this.avoidedExpensesService = new AvoidedExpensesService();
  }

  // POST /api/avoided-expenses
  async create(req: Request, res: Response): Promise<void> {
    try {
      const expenseData: NewAvoidedExpense = req.body;
      
      // Validaciones básicas
      if (!expenseData.user_id || !expenseData.name || !expenseData.amount || !expenseData.expense_date) {
        res.status(400).json({ 
          success: false, 
          message: 'user_id, name, amount y expense_date son requeridos' 
        });
        return;
      }

      // Validar que el monto sea positivo
      if (Number(expenseData.amount) <= 0) {
        res.status(400).json({ 
          success: false, 
          message: 'El monto debe ser mayor a 0' 
        });
        return;
      }

      const newExpense = await this.avoidedExpensesService.create(expenseData);
      
      res.status(201).json({
        success: true,
        data: newExpense,
        message: 'Gasto evitado creado exitosamente'
      });
    } catch (error) {
      console.error('Error al crear gasto evitado:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // GET /api/avoided-expenses
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      // Filtros opcionales
      const filters = {
        userId: req.query.userId ? parseInt(req.query.userId as string) : undefined,
        categoryId: req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined,
        typeId: req.query.typeId ? parseInt(req.query.typeId as string) : undefined,
        startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
        search: req.query.search as string
      };

      const result = await this.avoidedExpensesService.findAll(page, limit, filters);
      
      res.status(200).json({
        success: true,
        data: result.expenses,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      console.error('Error al obtener gastos evitados:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // GET /api/avoided-expenses/:id
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

      const expense = await this.avoidedExpensesService.findById(id);
      
      if (!expense) {
        res.status(404).json({
          success: false,
          message: 'Gasto evitado no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: expense
      });
    } catch (error) {
      console.error('Error al obtener gasto evitado:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // GET /api/avoided-expenses/:id/with-relations
  async findWithRelations(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID inválido'
        });
        return;
      }

      const expense = await this.avoidedExpensesService.findWithRelations(id);
      
      if (!expense) {
        res.status(404).json({
          success: false,
          message: 'Gasto evitado no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: expense
      });
    } catch (error) {
      console.error('Error al obtener gasto evitado con relaciones:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // GET /api/avoided-expenses/user/:userId
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

      const result = await this.avoidedExpensesService.findByUserId(userId, page, limit);
      
      res.status(200).json({
        success: true,
        data: result.expenses,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      console.error('Error al obtener gastos evitados por usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // PUT /api/avoided-expenses/:id
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

      // Verificar si el gasto evitado existe
      const existingExpense = await this.avoidedExpensesService.findById(id);
      if (!existingExpense) {
        res.status(404).json({
          success: false,
          message: 'Gasto evitado no encontrado'
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

      const updatedExpense = await this.avoidedExpensesService.update(id, updateData);
      
      res.status(200).json({
        success: true,
        data: updatedExpense,
        message: 'Gasto evitado actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error al actualizar gasto evitado:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // DELETE /api/avoided-expenses/:id
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

      const success = await this.avoidedExpensesService.delete(id);
      
      if (!success) {
        res.status(404).json({
          success: false,
          message: 'Gasto evitado no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Gasto evitado eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar gasto evitado:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // GET /api/avoided-expenses/user/:userId/stats
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

      const stats = await this.avoidedExpensesService.getUserStats(userId);
      
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

  // GET /api/avoided-expenses/user/:userId/monthly-savings
  async getMonthlySavings(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      const year = parseInt(req.query.year as string) || new Date().getFullYear();
      const month = req.query.month ? parseInt(req.query.month as string) : undefined;
      
      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: 'ID de usuario inválido'
        });
        return;
      }

      const savings = await this.avoidedExpensesService.getMonthlySavings(userId, year, month);
      
      res.status(200).json({
        success: true,
        data: savings
      });
    } catch (error) {
      console.error('Error al obtener ahorros mensuales:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // GET /api/avoided-expenses/user/:userId/savings-by-category
  async getSavingsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: 'ID de usuario inválido'
        });
        return;
      }

      const savings = await this.avoidedExpensesService.getSavingsByCategory(userId);
      
      res.status(200).json({
        success: true,
        data: savings
      });
    } catch (error) {
      console.error('Error al obtener ahorros por categoría:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // GET /api/avoided-expenses/user/:userId/savings-by-type
  async getSavingsByType(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: 'ID de usuario inválido'
        });
        return;
      }

      const savings = await this.avoidedExpensesService.getSavingsByType(userId);
      
      res.status(200).json({
        success: true,
        data: savings
      });
    } catch (error) {
      console.error('Error al obtener ahorros por tipo:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}
