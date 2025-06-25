import { Request, Response } from 'express';
import { CategoriesService } from '../services/categories.service';
import { NewCategory } from '../types/categories.schema';

export class CategoriesController {
  private categoriesService: CategoriesService;

  constructor() {
    this.categoriesService = new CategoriesService();
  }

  // POST /api/categories
  async create(req: Request, res: Response): Promise<void> {
    try {
      const categoryData: NewCategory = req.body;
      
      // Validaciones básicas
      if (!categoryData.name) {
        res.status(400).json({ 
          success: false, 
          message: 'El nombre de la categoría es requerido' 
        });
        return;
      }

      // Verificar si la categoría ya existe
      const existingCategory = await this.categoriesService.findByName(categoryData.name);
      if (existingCategory) {
        res.status(409).json({ 
          success: false, 
          message: 'La categoría ya existe' 
        });
        return;
      }

      const newCategory = await this.categoriesService.create(categoryData);
      
      res.status(201).json({
        success: true,
        data: newCategory,
        message: 'Categoría creada exitosamente'
      });
    } catch (error) {
      console.error('Error al crear categoría:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // GET /api/categories
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;

      const result = await this.categoriesService.findAll(page, limit, search);
      
      res.status(200).json({
        success: true,
        data: result.categories,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // GET /api/categories/active
  async findActive(req: Request, res: Response): Promise<void> {
    try {
      const categories = await this.categoriesService.findActive();
      
      res.status(200).json({
        success: true,
        data: categories
      });
    } catch (error) {
      console.error('Error al obtener categorías activas:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // GET /api/categories/:id
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

      const category = await this.categoriesService.findById(id);
      
      if (!category) {
        res.status(404).json({
          success: false,
          message: 'Categoría no encontrada'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: category
      });
    } catch (error) {
      console.error('Error al obtener categoría:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // PUT /api/categories/:id
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

      // Verificar si la categoría existe
      const existingCategory = await this.categoriesService.findById(id);
      if (!existingCategory) {
        res.status(404).json({
          success: false,
          message: 'Categoría no encontrada'
        });
        return;
      }

      // Verificar nombre único si se está actualizando
      if (updateData.name && updateData.name !== existingCategory.name) {
        const nameExists = await this.categoriesService.findByName(updateData.name);
        if (nameExists) {
          res.status(409).json({
            success: false,
            message: 'El nombre de la categoría ya está en uso'
          });
          return;
        }
      }

      const updatedCategory = await this.categoriesService.update(id, updateData);
      
      res.status(200).json({
        success: true,
        data: updatedCategory,
        message: 'Categoría actualizada exitosamente'
      });
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // DELETE /api/categories/:id
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

      const success = await this.categoriesService.delete(id);
      
      if (!success) {
        res.status(404).json({
          success: false,
          message: 'Categoría no encontrada'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Categoría eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // POST /api/categories/:id/activate
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

      const success = await this.categoriesService.activate(id);
      
      if (!success) {
        res.status(404).json({
          success: false,
          message: 'Categoría no encontrada'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Categoría activada exitosamente'
      });
    } catch (error) {
      console.error('Error al activar categoría:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // GET /api/categories/stats
  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.categoriesService.getStats();
      
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