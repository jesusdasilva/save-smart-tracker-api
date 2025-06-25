import { Router } from 'express';
import { DeficitsController } from '../controllers/deficits.controller';

const router = Router();
const deficitsController = new DeficitsController();

// POST /api/deficits - Crear déficit
router.post('/', (req, res) => deficitsController.create(req, res));

// GET /api/deficits - Obtener todos los déficits (con filtros y paginación)
router.get('/', (req, res) => deficitsController.findAll(req, res));

// GET /api/deficits/:id - Obtener déficit por ID
router.get('/:id', (req, res) => deficitsController.findById(req, res));

// GET /api/deficits/user/:userId - Obtener déficits por usuario
router.get('/user/:userId', (req, res) => deficitsController.findByUserId(req, res));

// GET /api/deficits/user/:userId/active - Obtener déficits activos del usuario
router.get('/user/:userId/active', (req, res) => deficitsController.findActiveByUserId(req, res));

// PUT /api/deficits/:id - Actualizar déficit
router.put('/:id', (req, res) => deficitsController.update(req, res));

// DELETE /api/deficits/:id - Eliminar déficit
router.delete('/:id', (req, res) => deficitsController.delete(req, res));

// GET /api/deficits/user/:userId/stats - Obtener estadísticas de déficits del usuario
router.get('/user/:userId/stats', (req, res) => deficitsController.getUserStats(req, res));

// GET /api/deficits/user/:userId/by-date-range - Obtener déficits por rango de fechas
router.get('/user/:userId/by-date-range', (req, res) => deficitsController.findByDateRange(req, res));

export default router; 