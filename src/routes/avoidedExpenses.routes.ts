import { Router } from 'express';
import { AvoidedExpensesController } from '../controllers/avoidedExpenses.controller';

const router = Router();
const avoidedExpensesController = new AvoidedExpensesController();

// POST /api/avoided-expenses - Crear gasto evitado
router.post('/', (req, res) => avoidedExpensesController.create(req, res));

// GET /api/avoided-expenses - Obtener todos los gastos evitados (con filtros y paginación)
router.get('/', (req, res) => avoidedExpensesController.findAll(req, res));

// GET /api/avoided-expenses/:id - Obtener gasto evitado por ID
router.get('/:id', (req, res) => avoidedExpensesController.findById(req, res));

// GET /api/avoided-expenses/:id/with-relations - Obtener gasto evitado con información de relaciones
router.get('/:id/with-relations', (req, res) => avoidedExpensesController.findWithRelations(req, res));

// GET /api/avoided-expenses/user/:userId - Obtener gastos evitados por usuario
router.get('/user/:userId', (req, res) => avoidedExpensesController.findByUserId(req, res));

// PUT /api/avoided-expenses/:id - Actualizar gasto evitado
router.put('/:id', (req, res) => avoidedExpensesController.update(req, res));

// DELETE /api/avoided-expenses/:id - Eliminar gasto evitado
router.delete('/:id', (req, res) => avoidedExpensesController.delete(req, res));

// GET /api/avoided-expenses/user/:userId/stats - Obtener estadísticas de ahorros del usuario
router.get('/user/:userId/stats', (req, res) => avoidedExpensesController.getUserStats(req, res));

// GET /api/avoided-expenses/user/:userId/monthly-savings - Obtener ahorros mensuales del usuario
router.get('/user/:userId/monthly-savings', (req, res) => avoidedExpensesController.getMonthlySavings(req, res));

// GET /api/avoided-expenses/user/:userId/savings-by-category - Obtener ahorros por categoría
router.get('/user/:userId/savings-by-category', (req, res) => avoidedExpensesController.getSavingsByCategory(req, res));

// GET /api/avoided-expenses/user/:userId/savings-by-type - Obtener ahorros por tipo
router.get('/user/:userId/savings-by-type', (req, res) => avoidedExpensesController.getSavingsByType(req, res));

export default router; 