import { Router } from 'express';
import { CategoriesController } from '../controllers/categories.controller';

const router = Router();
const categoriesController = new CategoriesController();

// POST /api/categories - Crear categoría
router.post('/', (req, res) => categoriesController.create(req, res));

// GET /api/categories - Obtener todas las categorías (con paginación)
router.get('/', (req, res) => categoriesController.findAll(req, res));

// GET /api/categories/active - Obtener categorías activas
router.get('/active', (req, res) => categoriesController.findActive(req, res));

// GET /api/categories/stats - Obtener estadísticas de categorías
router.get('/stats', (req, res) => categoriesController.getStats(req, res));

// GET /api/categories/:id - Obtener categoría por ID
router.get('/:id', (req, res) => categoriesController.findById(req, res));

// PUT /api/categories/:id - Actualizar categoría
router.put('/:id', (req, res) => categoriesController.update(req, res));

// DELETE /api/categories/:id - Eliminar categoría (soft delete)
router.delete('/:id', (req, res) => categoriesController.delete(req, res));

// POST /api/categories/:id/activate - Activar categoría
router.post('/:id/activate', (req, res) => categoriesController.activate(req, res));

export default router; 