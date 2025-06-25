import { Router } from 'express';
import { TypesController } from '../controllers/types.controller';

const router = Router();
const typesController = new TypesController();

// POST /api/types - Crear tipo
router.post('/', (req, res) => typesController.create(req, res));

// GET /api/types - Obtener todos los tipos (con paginación)
router.get('/', (req, res) => typesController.findAll(req, res));

// GET /api/types/active - Obtener tipos activos
router.get('/active', (req, res) => typesController.findActive(req, res));

// GET /api/types/stats - Obtener estadísticas de tipos
router.get('/stats', (req, res) => typesController.getStats(req, res));

// GET /api/types/:id - Obtener tipo por ID
router.get('/:id', (req, res) => typesController.findById(req, res));

// PUT /api/types/:id - Actualizar tipo
router.put('/:id', (req, res) => typesController.update(req, res));

// DELETE /api/types/:id - Eliminar tipo (soft delete)
router.delete('/:id', (req, res) => typesController.delete(req, res));

// POST /api/types/:id/activate - Activar tipo
router.post('/:id/activate', (req, res) => typesController.activate(req, res));

export default router; 