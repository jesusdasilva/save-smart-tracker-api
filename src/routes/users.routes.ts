import { Router } from 'express';
import { UsersController } from '../controllers/users.controller';

const router = Router();
const usersController = new UsersController();

// POST /api/users - Crear usuario
router.post('/', (req, res) => usersController.create(req, res));

// GET /api/users - Obtener todos los usuarios (con paginación)
router.get('/', (req, res) => usersController.findAll(req, res));

// GET /api/users/stats - Obtener estadísticas de usuarios
router.get('/stats', (req, res) => usersController.getStats(req, res));

// GET /api/users/:id - Obtener usuario por ID
router.get('/:id', (req, res) => usersController.findById(req, res));

// PUT /api/users/:id - Actualizar usuario
router.put('/:id', (req, res) => usersController.update(req, res));

// DELETE /api/users/:id - Eliminar usuario (soft delete)
router.delete('/:id', (req, res) => usersController.delete(req, res));

// POST /api/users/:id/activate - Activar usuario
router.post('/:id/activate', (req, res) => usersController.activate(req, res));

export default router; 